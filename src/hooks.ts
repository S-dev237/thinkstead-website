/**
 * View-layer hooks the page needs in more than one place. Each one is inert
 * until the browser proves it can do the job: no observer support, no
 * behaviour, and the page stays exactly as rendered.
 */
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { Locale } from "./data/content";

/** Storage can throw (private mode, blocked site data): every access is guarded. */
export const store = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* The choice just won't be remembered. */
    }
  },
};

export function usePrefersReducedMotion(): boolean {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Whether the page has scrolled past `offset`: the nav earns its shadow only then. */
export function useScrolled(offset = 12): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const read = () => setScrolled(window.scrollY > offset);
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, [offset]);
  return scrolled;
}

const NAV_LINE = 140;

/**
 * The section currently under the nav, so the matching link can say so.
 * Measured against one line rather than by intersection ratio, which is not
 * comparable between sections of different heights.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current: string | null = null;
      for (const section of sections) {
        const { top, bottom } = section.getBoundingClientRect();
        if (top <= NAV_LINE && bottom > NAV_LINE) current = section.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);
  return active;
}

/**
 * Plays a muted loop only while it is on screen, unless the visitor paused it
 * or asked for reduced motion. Returns the playing state and a toggle, so every
 * moving clip has a pause button (WCAG 2.2.2).
 */
export function useClipPlayback(ref: RefObject<HTMLVideoElement | null>): { playing: boolean; toggle: () => void } {
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  const visible = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting && !userPaused.current && !reduced) {
          if (video.preload === "none") video.preload = "auto";
          void video.play().catch(() => {}); // Autoplay refused: the poster stays.
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [ref, reduced]);

  const toggle = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      if (video.preload === "none") video.preload = "auto";
      void video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  }, [ref]);

  return { playing, toggle };
}

/**
 * Reveals `[data-reveal]` blocks as they arrive. The hidden state is put on the
 * document by this hook, never by the stylesheet alone, so a browser without
 * IntersectionObserver or with JS off renders a plain visible page.
 */
export function useReveal(): void {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced || typeof IntersectionObserver === "undefined") return;
    const root = document.documentElement;
    root.classList.add("js-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove("js-reveal");
    };
  }, [reduced]);
}

export type ThemeChoice = "system" | "light" | "dark";

/** System by default; an explicit choice is remembered and written to <html data-theme>. */
export function useTheme(): [ThemeChoice, (t: ThemeChoice) => void] {
  const [theme, setTheme] = useState<ThemeChoice>(() => {
    const saved = store.get("thinkstead.theme");
    return saved === "light" || saved === "dark" ? saved : "system";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    store.set("thinkstead.theme", theme);
  }, [theme]);
  return [theme, setTheme];
}

/** `?lang=` wins, then the remembered choice, then the browser's language. */
export function initialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "fr" || param === "en") return param;
  const saved = store.get("thinkstead.lang");
  if (saved === "fr" || saved === "en") return saved;
  return navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

/** Copy to the clipboard and say so for a moment. The key tells which button was used. */
export function useCopy(): [string | null, (key: string, text: string) => void] {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number>(0);
  const copyText = useCallback((key: string, text: string) => {
    const done = () => {
      setCopied(key);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 1800);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => {});
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } finally {
        area.remove();
      }
    }
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [copied, copyText];
}

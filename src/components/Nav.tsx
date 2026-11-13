import { useCallback, useEffect, useRef, useState } from "react";
import { Laptop, Menu, Moon, Sun, X } from "lucide-react";
import type { copy, Locale } from "../data/content";
import { useActiveSection, useScrolled, type ThemeChoice } from "../hooks";
import { Brand } from "./Brand";

type T = (typeof copy)[Locale];

export const NAV_SECTIONS = ["how", "demo", "features", "uses", "faq"] as const;

const NEXT_THEME: Record<ThemeChoice, ThemeChoice> = { system: "light", light: "dark", dark: "system" };
const THEME_ICON = { system: Laptop, light: Sun, dark: Moon };

/**
 * The bar on top: transparent over the hero, glass once there is content under
 * it. On narrow screens the links fold into a menu that closes on Escape, on a
 * link and on a click outside, and gives focus back to its button.
 */
export function SiteNav({
  t,
  onToggleLocale,
  theme,
  onTheme,
}: {
  t: T;
  onToggleLocale: () => void;
  theme: ThemeChoice;
  onTheme: (t: ThemeChoice) => void;
}) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection(NAV_SECTIONS);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      toggleRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  const links = [
    { id: "how", label: t.nav.how },
    { id: "demo", label: t.nav.demo },
    { id: "features", label: t.nav.features },
    { id: "uses", label: t.nav.uses },
    { id: "faq", label: t.nav.faq },
  ];
  const ThemeIcon = THEME_ICON[theme];
  const themeLabel = `${t.nav.theme}: ${t.nav.themes[theme]}`;

  return (
    <header className={`topbar${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <nav className="nav container" aria-label={t.nav.primary} ref={navRef}>
        <a className="brand" href="#top" aria-label={t.nav.home} onClick={close}>
          <Brand size={34} />
        </a>
        <div className="nav-links" id="nav-links">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={close} aria-current={active === link.id ? "true" : undefined}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="icon-button" type="button" onClick={() => onTheme(NEXT_THEME[theme])} aria-label={themeLabel} title={themeLabel}>
            <ThemeIcon size={17} aria-hidden="true" />
          </button>
          <button className="lang-button" type="button" onClick={onToggleLocale} aria-label={t.nav.langLabel} lang={t.nav.lang === "FR" ? "fr" : "en"}>
            {t.nav.lang}
          </button>
          <a className="button button-primary button-small nav-download" href="#download" onClick={close}>
            {t.nav.download}
          </a>
          <button
            className="icon-button nav-toggle"
            type="button"
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="nav-links"
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  );
}

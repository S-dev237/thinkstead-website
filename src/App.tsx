import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Code,
  Eye,
  FileText,
  Globe,
  HardDrive,
  Hand,
  Languages,
  Maximize2,
  Mic,
  Play,
  Puzzle,
  Search,
  ShieldCheck,
  Smartphone,
  Wifi,
  X,
} from "lucide-react";
import { providerMarks } from "./data/brandMarks";
import { copy, type Chapter, type Locale, type Os } from "./data/content";
import { ACCESS_EMAIL, resolveRelease } from "./data/downloads";
import { initialLocale, store, useReveal, useTheme } from "./hooks";
import { Brand, BrandMark } from "./components/Brand";
import { Clip, MEDIA } from "./components/Clip";
import { Demo } from "./components/Demo";
import { DownloadCta, DownloadSection, PLATFORMS, RequestDialog, type ReleaseState } from "./components/Download";
import { SiteNav } from "./components/Nav";
import { UseCases } from "./components/UseCases";

/** The film ships in /media once rendered; until then its section and button stay out. */
const FILM = {
  available: false, // re-enabled once the film ending is re-rendered
  src: `${MEDIA}/thinkstead-film-en.mp4`,
  poster: `${MEDIA}/film-poster.jpg`,
  captions: { en: `${MEDIA}/thinkstead-film-en.vtt`, fr: `${MEDIA}/thinkstead-film-fr.vtt` },
  length: "1:02",
};

const AGENTS = ["Claude Code", "Codex", "Gemini CLI", "Copilot", "Cursor", "Kimi", "Amp", "Auggie"];
const CAP_ICONS: Record<string, typeof FileText> = {
  file: FileText, globe: Globe, search: Search, mic: Mic, puzzle: Puzzle, phone: Smartphone, code: Code, languages: Languages,
};
const CONTROL_ICONS = [Hand, Eye, HardDrive, Wifi];
/** Step cards show a readable crop; the lightbox opens the whole window. */
const STEP_THUMB: Record<string, string> = { home: "step-think", newtask: "step-assign", reports: "step-done" };

type T = (typeof copy)[Locale];

function ChapterBlock({ chapter, index, t, extra }: { chapter: Chapter; index: number; t: T; extra?: ReactNode }) {
  return (
    <section className={`chapter${index % 2 ? " chapter-flip" : ""}`} id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
      <div className="chapter-copy" data-reveal>
        <p className="kicker">{chapter.kicker}</p>
        <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
        <p className="lede">{chapter.copy}</p>
        <ul className="points">
          {chapter.points.map((point) => (
            <li key={point}>
              <Check size={16} aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="chapter-media" data-reveal>
        <Clip name={chapter.clip} label={chapter.title} pauseLabel={t.pause} playLabel={t.play} />
        {extra}
      </div>
    </section>
  );
}

/** A screenshot, larger, in a native dialog: Escape and the backdrop close it, focus comes back by itself. */
function Lightbox({ shot, onClose, closeLabel }: { shot: { src: string; alt: string } | null; onClose: () => void; closeLabel: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (shot && !d.open) d.showModal();
    if (!shot && d.open) d.close();
  }, [shot]);
  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={shot?.alt}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <button className="icon-button lightbox-close" type="button" onClick={() => ref.current?.close()} aria-label={closeLabel}>
        <X size={20} aria-hidden="true" />
      </button>
      {shot && <img src={shot.src} alt={shot.alt} width={1920} height={1080} />}
    </dialog>
  );
}

function FilmDialog({ open, onClose, t, locale }: { open: boolean; onClose: () => void; t: T; locale: Locale }) {
  const ref = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      void video.current?.play().catch(() => {});
    }
    if (!open && d.open) d.close();
  }, [open]);
  if (!FILM.available) return null;
  return (
    <dialog
      ref={ref}
      className="film-dialog"
      aria-label={t.film.title}
      onClose={() => {
        video.current?.pause();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <button className="icon-button lightbox-close" type="button" onClick={() => ref.current?.close()} aria-label={t.film.close}>
        <X size={20} aria-hidden="true" />
      </button>
      <video ref={video} src={FILM.src} poster={FILM.poster} controls playsInline preload="none">
        <track kind="captions" src={FILM.captions.en} srcLang="en" label="English" default={locale === "en"} />
        <track kind="subtitles" src={FILM.captions.fr} srcLang="fr" label="Français" default={locale === "fr"} />
      </video>
    </dialog>
  );
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [theme, setTheme] = useTheme();
  const [releases, setReleases] = useState<ReleaseState>({ Windows: undefined, Linux: undefined, Mac: undefined });
  const [requestOs, setRequestOs] = useState<Os | null>(null);
  const [shot, setShot] = useState<{ src: string; alt: string } | null>(null);
  const [filmOpen, setFilmOpen] = useState(false);
  const t = copy[locale];
  useReveal();

  useEffect(() => {
    for (const { os } of PLATFORMS) {
      void resolveRelease(os).then((release) => setReleases((prev) => ({ ...prev, [os]: release })));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
    store.set("thinkstead.lang", locale);
  }, [locale, t]);

  const version = releases.Windows?.version ?? releases.Linux?.version;
  const [agentsCh, tasksCh, workspacesCh, sharingCh, respondCh] = t.chapters;
  const [title1, title2, title3] = t.hero.title;

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <SiteNav t={t} theme={theme} onTheme={setTheme} onToggleLocale={() => setLocale(locale === "en" ? "fr" : "en")} />

      <main id="main" tabIndex={-1}>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="badge">
                <span className="badge-dot" aria-hidden="true" />
                {version ? t.hero.badge.replace("{v}", version) : t.hero.badgeFallback}
              </p>
              <h1 id="hero-title">
                <span>{title1}</span> <span>{title2}</span> <span className="accent">{title3}</span>
              </h1>
              <p className="hero-lede">{t.hero.copy}</p>
              <DownloadCta t={t} locale={locale} releases={releases} onRequest={setRequestOs}>
                {FILM.available ? (
                  <button className="button button-light button-large" type="button" onClick={() => setFilmOpen(true)}>
                    <Play size={15} aria-hidden="true" />
                    {t.hero.film}
                    <span className="button-meta">{FILM.length}</span>
                  </button>
                ) : (
                  <a className="button button-light button-large" href="#demo">
                    <Play size={15} aria-hidden="true" />
                    {t.hero.demo}
                  </a>
                )}
              </DownloadCta>
              {FILM.available && (
                <p className="hero-try">
                  <a href="#demo">
                    {t.hero.demo}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </p>
              )}
              <p className="hero-note">
                <ShieldCheck size={15} aria-hidden="true" />
                {t.hero.note}
              </p>
            </div>
            <div className="hero-stage" data-reveal>
              <Clip name="hero" label={t.hero.windowLabel} pauseLabel={t.pause} playLabel={t.play} className="window-hero" eager />
              <div className="float-card float-file" aria-hidden="true">
                <span className="float-icon">
                  <FileText size={16} />
                </span>
                <span>
                  <strong>{t.hero.cardFile}</strong>
                  <small>{t.hero.cardFileMeta}</small>
                </span>
                <Check size={16} className="float-check" />
              </div>
              <div className="float-card float-task" aria-hidden="true">
                <span className="float-icon is-mint">
                  <CalendarClock size={16} />
                </span>
                <span>
                  <strong>{t.hero.cardTask}</strong>
                  <small>{t.hero.cardTaskMeta}</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="strip" aria-labelledby="strip-title">
          <div className="container strip-inner">
            <p className="strip-title" id="strip-title">
              {t.agents.title}
            </p>
            <ul className="agent-chips">
              {AGENTS.map((name) => (
                <li key={name} translate="no">
                  {name}
                </li>
              ))}
              <li className="is-more">{t.agents.more}</li>
            </ul>
            <p className="strip-title strip-sub">{t.agents.models}</p>
            <ul className="provider-marks">
              {providerMarks.map((mark) => (
                <li key={mark.name} title={mark.name}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d={mark.path} fill="currentColor" />
                  </svg>
                  <span translate="no">{mark.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section how" id="how" aria-labelledby="how-title">
          <div className="container">
            <header className="section-head" data-reveal>
              <p className="kicker">{t.how.kicker}</p>
              <h2 id="how-title">{t.how.title}</h2>
              <p className="lede">{t.how.lead}</p>
            </header>
            <ol className="steps">
              {t.how.steps.map((step) => (
                <li key={step.n} className="step" data-reveal>
                  <button
                    className="step-shot"
                    type="button"
                    onClick={() => setShot({ src: `${MEDIA}/shots/${step.shot}.webp`, alt: step.alt })}
                    aria-haspopup="dialog"
                    aria-label={`${t.how.enlarge}: ${step.alt}`}
                  >
                    <img src={`${MEDIA}/shots/${STEP_THUMB[step.shot] ?? step.shot}.webp`} alt="" loading="lazy" width={1200} height={750} />
                    <span className="step-zoom" aria-hidden="true">
                      <Maximize2 size={15} />
                    </span>
                  </button>
                  <p className="step-label">
                    <span>{step.n}</span>
                    {step.label}
                  </p>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Demo t={t} locale={locale} />

        <div id="features">
          <ChapterBlock chapter={agentsCh} index={0} t={t} />
          <ChapterBlock
            chapter={tasksCh}
            index={1}
            t={t}
            extra={
              <ul className="task-stack" aria-hidden="true">
                {t.tasks.map((task) => (
                  <li key={task.label}>
                    <CalendarClock size={14} />
                    <span>{task.label}</span>
                    <code>{task.schedule}</code>
                  </li>
                ))}
              </ul>
            }
          />
          <ChapterBlock chapter={workspacesCh} index={2} t={t} />
          <div className="container bento" data-reveal>
            <article className="bento-tile">
              <Clip name="agenda" label={t.bento.agenda} pauseLabel={t.pause} playLabel={t.play} />
              <h3>{t.bento.agenda}</h3>
              <p>{t.bento.agendaCopy}</p>
            </article>
            <article className="bento-tile">
              <Clip name="reports" label={t.bento.reports} pauseLabel={t.pause} playLabel={t.play} />
              <h3>{t.bento.reports}</h3>
              <p>{t.bento.reportsCopy}</p>
            </article>
          </div>
          <ChapterBlock chapter={sharingCh} index={3} t={t} />
          <ChapterBlock chapter={respondCh} index={4} t={t} />

          <section className="section caps" aria-labelledby="caps-title">
            <div className="container">
              <header className="section-head" data-reveal>
                <p className="kicker">{t.caps.kicker}</p>
                <h2 id="caps-title">{t.caps.title}</h2>
              </header>
              <ul className="caps-grid" data-reveal>
                {t.caps.items.map((item) => {
                  const Icon = CAP_ICONS[item.icon] ?? FileText;
                  return (
                    <li key={item.title}>
                      <span className="cap-icon" aria-hidden="true">
                        <Icon size={20} />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>

        <section className="section control" id="control" aria-labelledby="control-title">
          <div className="container control-layout">
            <header className="control-head" data-reveal>
              <p className="kicker">{t.control.kicker}</p>
              <h2 id="control-title">{t.control.title}</h2>
              <p className="lede">{t.control.lead}</p>
              <figure className="modes" aria-labelledby="modes-label">
                <figcaption id="modes-label">{t.control.modesLabel}</figcaption>
                <ul>
                  {t.control.modes.map((mode, i) => (
                    <li key={mode.name} className={i === 0 ? "is-current" : undefined}>
                      <strong translate="no">{mode.name}</strong>
                      <span>{mode.copy}</span>
                    </li>
                  ))}
                </ul>
              </figure>
            </header>
            <ul className="control-points" data-reveal>
              {t.control.points.map((point, i) => {
                const Icon = CONTROL_ICONS[i] ?? Check;
                return (
                  <li key={point.title}>
                    <Icon size={20} aria-hidden="true" />
                    <h3>{point.title}</h3>
                    <p>{point.copy}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <UseCases t={t} locale={locale} />

        {FILM.available && (
          <section className="section film" aria-labelledby="film-title">
            <div className="container film-layout">
              <button className="film-poster" type="button" onClick={() => setFilmOpen(true)} aria-label={`${t.film.play} · ${FILM.length}`}>
                <img src={FILM.poster} alt="" loading="lazy" width={1920} height={1080} />
                <span className="film-play" aria-hidden="true">
                  <Play size={18} />
                  {t.film.play} · {FILM.length}
                </span>
              </button>
              <div className="film-copy" data-reveal>
                <p className="kicker">{t.film.kicker}</p>
                <h2 id="film-title">{t.film.title}</h2>
                <p className="lede">{t.film.copy}</p>
                <p className="film-note">{t.film.note}</p>
              </div>
            </div>
          </section>
        )}

        <DownloadSection t={t} locale={locale} releases={releases} onRequest={setRequestOs} />

        <section className="section faq" id="faq" aria-labelledby="faq-title">
          <div className="container faq-layout">
            <header className="faq-head" data-reveal>
              <p className="kicker">{t.faq.kicker}</p>
              <h2 id="faq-title">{t.faq.title}</h2>
              <p className="lede">{t.faq.lead}</p>
            </header>
            <div className="faq-list" data-reveal>
              {t.faq.items.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="closer" aria-labelledby="closer-title">
          <div className="container">
            <div className="closer-inner">
              <BrandMark size={56} />
              <h2 id="closer-title">{t.closer.title}</h2>
              <p className="lede">{t.closer.copy}</p>
              <div className="closer-actions">
                {PLATFORMS.map(({ os, icon: Icon }) =>
                  releases[os] === null ? (
                    <a key={os} className="button button-light is-unavailable" href="#download">
                      <Icon size={17} aria-hidden="true" />
                      {t.platforms[os].label}
                      <span className="button-meta">{t.dl.soon}</span>
                    </a>
                  ) : (
                    <button key={os} className="button button-primary" type="button" onClick={() => setRequestOs(os)} aria-haspopup="dialog">
                      <Icon size={17} aria-hidden="true" />
                      {t.dl.for} {t.platforms[os].label}
                    </button>
                  ),
                )}
              </div>
              <p className="closer-note">{t.closer.note}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <a className="brand" href="#top" aria-label={t.nav.home}>
              <Brand size={28} />
            </a>
            <p>{t.footer.tagline}</p>
          </div>
          <nav className="footer-nav" aria-label={t.footer.product}>
            <a href="#how">{t.nav.how}</a>
            <a href="#demo">{t.nav.demo}</a>
            <a href="#features">{t.nav.features}</a>
            <a href="#faq">{t.nav.faq}</a>
            <a href={`mailto:${ACCESS_EMAIL}`}>{t.footer.releases}</a>
            <a href="#top">{t.footer.top}</a>
          </nav>
          <p className="footer-legal">
            © {new Date().getFullYear()} Thinkstead. {t.footer.rights} {t.footer.credit}
          </p>
        </div>
      </footer>

      <RequestDialog t={t} os={requestOs} releases={releases} onClose={() => setRequestOs(null)} />
      <Lightbox shot={shot} onClose={() => setShot(null)} closeLabel={t.dl.close} />
      <FilmDialog open={filmOpen} onClose={() => setFilmOpen(false)} t={t} locale={locale} />
    </>
  );
}

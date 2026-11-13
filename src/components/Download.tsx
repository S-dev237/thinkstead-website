import { useEffect, useRef, useState, type ReactNode } from "react";
import { Apple, ArrowRight, Check, Copy, Download, Monitor, Terminal, X } from "lucide-react";
import type { copy, Locale, Os } from "../data/content";
import { checksumCommand, detectOs, formatBytes, formatDate, RELEASES_INDEX, type Release } from "../data/downloads";
import { useCopy } from "../hooks";
import { Tabs } from "./Tabs";

type T = (typeof copy)[Locale];
/** Loading is `undefined`, "nothing published" is `null`. They must never look alike. */
export type ReleaseState = Record<Os, Release | null | undefined>;

export const PLATFORMS: { os: Os; icon: typeof Monitor }[] = [
  { os: "Windows", icon: Monitor },
  { os: "Linux", icon: Terminal },
  { os: "Mac", icon: Apple },
];

const fill = (text: string, vars: Record<string, string>) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

/** "Version 2.4.1 · 545 MB · Windows 10 or 11, 64-bit", or what is known so far. */
function metaLine(t: T, locale: Locale, os: Os, release: Release | null | undefined): string {
  if (release === undefined) return t.dl.checking;
  if (release === null) return t.platforms[os].req;
  const parts = [`${t.dl.version} ${release.version}`];
  if (release.size) parts.push(formatBytes(release.size, locale));
  parts.push(t.platforms[os].req);
  return parts.join(" · ");
}

/** Hero call to action: one button for the system you are on, the others right underneath. */
export function DownloadCta({
  t,
  locale,
  releases,
  onStart,
  children,
}: {
  t: T;
  locale: Locale;
  releases: ReleaseState;
  onStart: (os: Os) => void;
  /** A secondary action shown beside the download button. */
  children?: ReactNode;
}) {
  const [primaryOs, setPrimaryOs] = useState<Os>("Windows");
  useEffect(() => setPrimaryOs(detectOs()), []);
  const primary = PLATFORMS.find((p) => p.os === primaryOs) ?? PLATFORMS[0];
  const others = PLATFORMS.filter((p) => p.os !== primary.os);
  const release = releases[primary.os];
  const Icon = primary.icon;
  const unavailable = release === null;

  return (
    <div className="download-cta">
      <div className="download-row">
        <a
          className={`button button-primary button-large${unavailable ? " is-unavailable" : ""}`}
          href={release?.url ?? "#download"}
          onClick={() => release && onStart(primary.os)}
          aria-describedby="hero-download-meta"
        >
          <Icon size={18} aria-hidden="true" />
          {unavailable ? `${t.platforms[primary.os].label} · ${t.dl.soon}` : `${t.dl.for} ${t.platforms[primary.os].label}`}
          {unavailable ? <ArrowRight size={16} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
        </a>
        {children}
      </div>
      <p className="download-meta" id="hero-download-meta">
        <span aria-live="polite">{metaLine(t, locale, primary.os, release)}</span>
        <span>
          {t.dl.others}{" "}
          {others.map((p, i) => {
            const r = releases[p.os];
            return (
              <span key={p.os}>
                <a href={r?.url ?? "#download"} onClick={() => r && onStart(p.os)}>
                  {t.platforms[p.os].label}
                  {r === null && ` (${t.dl.soon})`}
                </a>
                {i < others.length - 1 && " · "}
              </span>
            );
          })}
        </span>
      </p>
    </div>
  );
}

/** Steps, checksum and command for one platform: shared by the section and the dialog. */
function InstallDetails({ t, locale, os, release }: { t: T; locale: Locale; os: Os; release: Release | null | undefined }) {
  const [copied, copyText] = useCopy();
  const file = release?.file ?? "";
  const steps = t.platforms[os].steps.map((s) => fill(s, { file }));
  const command = release ? checksumCommand(os, release.file) : "";
  return (
    <div className="install">
      <h3 className="install-title">{t.dl.next}</h3>
      <ol className="install-steps">
        {steps.map((step) => {
          const cmd = step.match(/sudo apt install \S+/)?.[0];
          return (
            <li key={step}>
              {cmd ? (
                <>
                  {step.slice(0, step.indexOf(cmd))}
                  <CopyCode value={cmd} label={t.dl.copy} copiedLabel={t.dl.copied} copied={copied === "apt"} onCopy={() => copyText("apt", cmd)} />
                </>
              ) : (
                step
              )}
            </li>
          );
        })}
      </ol>
      {release?.sha512 && (
        <details className="install-verify">
          <summary>{t.dl.verify}</summary>
          <p>{t.dl.verifyHint}</p>
          <CopyCode value={release.sha512} label={t.dl.copy} copiedLabel={t.dl.copied} copied={copied === "sha"} onCopy={() => copyText("sha", release.sha512!)} wrap />
          <CopyCode value={command} label={t.dl.copy} copiedLabel={t.dl.copied} copied={copied === "cmd"} onCopy={() => copyText("cmd", command)} />
        </details>
      )}
      {release?.date && <p className="install-date">{fill(t.dl.released, { d: formatDate(release.date, locale === "fr" ? "fr-FR" : "en-GB") })}</p>}
      <p className="visually-hidden" role="status" aria-live="polite">
        {copied ? t.dl.copied : ""}
      </p>
    </div>
  );
}

function CopyCode({
  value,
  label,
  copiedLabel,
  copied,
  onCopy,
  wrap = false,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  copied: boolean;
  onCopy: () => void;
  wrap?: boolean;
}) {
  return (
    <span className={`copy-code${wrap ? " is-wrap" : ""}`}>
      <code>{value}</code>
      <button type="button" className="copy-button" onClick={onCopy} aria-label={`${copied ? copiedLabel : label}: ${value.length > 40 ? value.slice(0, 16) + "…" : value}`}>
        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        <span aria-hidden="true">{copied ? copiedLabel : label}</span>
      </button>
    </span>
  );
}

/** The #download section: one tab per system, the detected one first selected. */
export function DownloadSection({
  t,
  locale,
  releases,
  onStart,
  children,
}: {
  t: T;
  locale: Locale;
  releases: ReleaseState;
  onStart: (os: Os) => void;
  children?: ReactNode;
}) {
  const [os, setOs] = useState<Os>("Windows");
  useEffect(() => setOs(detectOs()), []);
  const release = releases[os];
  const p = PLATFORMS.find((x) => x.os === os)!;
  const Icon = p.icon;

  return (
    <section className="section get" id="download" aria-labelledby="get-title">
      <div className="container get-layout">
        <header className="get-head" data-reveal>
          <p className="kicker">{t.get.kicker}</p>
          <h2 id="get-title">{t.get.title}</h2>
          <p className="lede">{t.get.lead}</p>
          {children}
        </header>
        <div className="get-card" data-reveal>
          <Tabs
            label={t.get.pick}
            idPrefix="os"
            className="os-tabs"
            value={os}
            onChange={setOs}
            items={PLATFORMS.map(({ os: key, icon: I }) => ({
              key,
              label: (
                <>
                  <I size={16} aria-hidden="true" />
                  {t.platforms[key].label}
                  {releases[key] === null && <span className="tab-note">{t.dl.soon}</span>}
                </>
              ),
            }))}
          />
          <div className="os-panel" role="tabpanel" id="os-panel" aria-labelledby={`os-tab-${os}`}>
            {release === null ? (
              <div className="os-soon">
                <p className="os-soon-title">
                  <Icon size={18} aria-hidden="true" />
                  {t.platforms[os].label} · {t.dl.notYet}
                </p>
                <p>{os === "Mac" ? t.platforms[os].steps[0] : t.dl.notYetHint}</p>
                {os !== "Mac" && (
                  <a className="button button-light button-small" href={RELEASES_INDEX}>
                    {t.footer.releases}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            ) : (
              <>
                <a
                  className="button button-primary button-large os-button"
                  href={release?.url ?? RELEASES_INDEX}
                  onClick={(event) => {
                    if (!release) {
                      event.preventDefault(); // Still resolving: nothing to download yet.
                      return;
                    }
                    onStart(os);
                  }}
                  aria-disabled={release === undefined ? "true" : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  {t.dl.for} {t.platforms[os].label}
                  <Download size={16} aria-hidden="true" />
                </a>
                <p className="download-meta" aria-live="polite">
                  {metaLine(t, locale, os, release)}
                </p>
                <InstallDetails t={t} locale={locale} os={os} release={release} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Shown as the download starts: what to do with the file, without leaving the page. */
export function NextStepsDialog({
  t,
  locale,
  os,
  releases,
  onClose,
}: {
  t: T;
  locale: Locale;
  os: Os | null;
  releases: ReleaseState;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (os && !dialog.open) dialog.showModal();
    if (!os && dialog.open) dialog.close();
  }, [os]);
  const release = os ? releases[os] : undefined;

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="next-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
    >
      {os && (
        <div className="sheet-body">
          <button className="icon-button sheet-close" type="button" onClick={() => ref.current?.close()} aria-label={t.dl.close}>
            <X size={18} aria-hidden="true" />
          </button>
          <p className="sheet-kicker">
            <Check size={16} aria-hidden="true" />
            {t.dl.started}
          </p>
          <h2 id="next-title">{fill(t.dl.startedFor, { v: release?.version ?? "", os: t.platforms[os].label })}</h2>
          <InstallDetails t={t} locale={locale} os={os} release={release} />
        </div>
      )}
    </dialog>
  );
}

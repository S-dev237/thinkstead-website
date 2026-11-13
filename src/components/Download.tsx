import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Apple, ArrowRight, Check, Copy, Mail, Monitor, Terminal, X } from "lucide-react";
import type { copy, Locale, Os } from "../data/content";
import { ACCESS_EMAIL, checksumCommand, detectOs, formatBytes, formatDate, type Release } from "../data/downloads";
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

/**
 * Hero call to action: one "Request access" button for the system you are on,
 * the others right underneath. Downloads are approved by email, so the button
 * opens the request form rather than a file.
 */
export function DownloadCta({
  t,
  locale,
  releases,
  onRequest,
  children,
}: {
  t: T;
  locale: Locale;
  releases: ReleaseState;
  onRequest: (os: Os) => void;
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
        {unavailable ? (
          <a className="button button-primary button-large is-unavailable" href="#download" aria-describedby="hero-download-meta">
            <Icon size={18} aria-hidden="true" />
            {t.platforms[primary.os].label} · {t.dl.soon}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        ) : (
          <button
            className="button button-primary button-large"
            type="button"
            onClick={() => onRequest(primary.os)}
            aria-haspopup="dialog"
            aria-describedby="hero-download-meta"
          >
            <Icon size={18} aria-hidden="true" />
            {t.dl.for} {t.platforms[primary.os].label}
            <Mail size={16} aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
      <p className="download-meta" id="hero-download-meta">
        <span aria-live="polite">{metaLine(t, locale, primary.os, release)}</span>
        <span>
          {t.dl.others}{" "}
          {others.map((p, i) => (
            <span key={p.os}>
              {releases[p.os] === null ? (
                <span>
                  {t.platforms[p.os].label} ({t.dl.soon})
                </span>
              ) : (
                <button className="link-button" type="button" onClick={() => onRequest(p.os)} aria-haspopup="dialog">
                  {t.platforms[p.os].label}
                </button>
              )}
              {i < others.length - 1 && " · "}
            </span>
          ))}
        </span>
      </p>
    </div>
  );
}

/** What to do with the file once the personal link has been used. */
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
  onRequest,
}: {
  t: T;
  locale: Locale;
  releases: ReleaseState;
  onRequest: (os: Os) => void;
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
          <h3 className="how-title">{t.dl.how}</h3>
          <ol className="how-steps">
            {t.dl.howSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
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
              </div>
            ) : (
              <>
                <button className="button button-primary button-large os-button" type="button" onClick={() => onRequest(os)} aria-haspopup="dialog">
                  <Icon size={18} aria-hidden="true" />
                  {t.dl.for} {t.platforms[os].label}
                  <Mail size={16} aria-hidden="true" />
                </button>
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

/**
 * The access request: a short form that prepares the email. The message is
 * written for the visitor, sent from their own mailbox (so the reply with the
 * personal link reaches them), and can be copied when no mail app is set up.
 */
export function RequestDialog({
  t,
  os,
  releases,
  onClose,
}: {
  t: T;
  os: Os | null;
  releases: ReleaseState;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [system, setSystem] = useState<Os>("Windows");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [use, setUse] = useState("");
  const [opened, setOpened] = useState(false);
  const [copied, copyText] = useCopy();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (os && !dialog.open) {
      setSystem(os);
      setOpened(false);
      dialog.showModal();
      // showModal focuses the first control (the close button); the form starts with the name.
      nameRef.current?.focus();
    }
    if (!os && dialog.open) dialog.close();
  }, [os]);

  const available = PLATFORMS.filter((p) => releases[p.os] !== null);
  const label = t.platforms[system].label;
  const subject = fill(t.dl.subject, { os: label });
  const body = fill(t.dl.body, { os: label, name: name.trim() || "—", org: org.trim() || "—", use: use.trim() || "—" });
  const mailto = `mailto:${ACCESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const optional = <span className="field-optional">({t.dl.optional})</span>;

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-lead`}
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
            <Mail size={16} aria-hidden="true" />
            {ACCESS_EMAIL}
          </p>
          <h2 id={`${id}-title`}>{t.dl.reqTitle}</h2>
          <p className="sheet-lead" id={`${id}-lead`}>
            {t.dl.reqLead}
          </p>

          <form className="request-form" onSubmit={(event) => event.preventDefault()}>
            <label className="field">
              <span>{t.dl.name}</span>
              <input ref={nameRef} type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="field">
              <span>
                {t.dl.org} {optional}
              </span>
              <input type="text" value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" />
            </label>
            <label className="field">
              <span>{t.dl.system}</span>
              <select value={system} onChange={(e) => setSystem(e.target.value as Os)}>
                {available.map((p) => (
                  <option key={p.os} value={p.os}>
                    {t.platforms[p.os].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>
                {t.dl.use} {optional}
              </span>
              <textarea value={use} onChange={(e) => setUse(e.target.value)} rows={3} />
            </label>

            <a className="button button-primary button-large request-send" href={mailto} onClick={() => setOpened(true)}>
              <Mail size={17} aria-hidden="true" />
              {t.dl.send}
            </a>
            <p className="request-hint" aria-live="polite">
              {opened ? t.dl.sentNote : t.dl.sendHint}
            </p>
          </form>

          <div className="request-fallback">
            <p>{t.dl.noMail}</p>
            <div className="request-copy">
              <button type="button" className="copy-button" onClick={() => copyText("address", ACCESS_EMAIL)}>
                {copied === "address" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                {copied === "address" ? t.dl.copied : t.dl.copyAddress}
              </button>
              <button type="button" className="copy-button" onClick={() => copyText("message", `${subject}\n\n${body}`)}>
                {copied === "message" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                {copied === "message" ? t.dl.copied : t.dl.copyMessage}
              </button>
            </div>
          </div>
          <p className="visually-hidden" role="status" aria-live="polite">
            {copied ? t.dl.copied : ""}
          </p>
        </div>
      )}
    </dialog>
  );
}

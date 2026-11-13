/**
 * Real download links, resolved from the release feed rather than hardcoded,
 * so a new version shows up here the moment its files are published.
 *
 * The feed lives on the Thinkstead VPS, in electron-updater's generic layout:
 *   <base>/latest.yml          Windows channel  { version, files: [{ url, sha512, size? }], releaseDate }
 *   <base>/latest-linux.yml    Linux channel
 *   <base>/latest-mac.yml      macOS channel (absent until a Mac build ships)
 *   <base>/<version>/<file>    the installers themselves
 *
 * The VPS answers the channel files with `Access-Control-Allow-Origin: *`, so
 * this page (served from GitHub Pages) can read them cross-origin.
 */
import type { Os } from "./content";

export const RELEASES_BASE = "https://vps-4b2ef8f0.vps.ovh.ca/thinkstead-releases";
/** Browsable listing of every published file. */
export const RELEASES_INDEX = `${RELEASES_BASE}/`;

const CHANNEL_FILE: Record<Os, string> = {
  Windows: "latest.yml",
  Linux: "latest-linux.yml",
  Mac: "latest-mac.yml",
};

export type Release = {
  version: string;
  url: string;
  file: string;
  /** Hex, ready to compare with `sha512sum` / `Get-FileHash`. */
  sha512?: string;
  size?: number;
  date?: string;
};

type Manifest = { version: string; file: string; sha512?: string; size?: number; date?: string };

/** The small YAML subset electron-updater's channel files use. */
const parseChannel = (text: string): Manifest | null => {
  const version = text.match(/^version:\s*(\S+)\s*$/m)?.[1];
  const file = text.match(/^\s*-\s*url:\s*(\S+)\s*$/m)?.[1];
  if (!version || !file) return null;
  const sha512 = text.match(/^\s+sha512:\s*(\S+)\s*$/m)?.[1];
  const size = text.match(/^\s+size:\s*(\d+)\s*$/m)?.[1];
  const date = text.match(/^releaseDate:\s*'?([^'\s]+)'?\s*$/m)?.[1];
  return { version, file, sha512, size: size ? Number(size) : undefined, date };
};

const base64ToHex = (b64: string): string | undefined => {
  try {
    return Array.from(atob(b64), (c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  } catch {
    return undefined;
  }
};

/** The size from the server when the channel file doesn't carry it (Windows builds omit it). */
const headSize = async (url: string): Promise<number | undefined> => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const length = Number(res.headers.get("content-length"));
    return res.ok && length > 0 ? length : undefined;
  } catch {
    return undefined;
  }
};

const cache = new Map<Os, Promise<Release | null>>();

/**
 * The latest published build for one platform, or null when that platform has
 * none yet. A 404 on its channel file means exactly that, not an error.
 */
export const resolveRelease = (os: Os): Promise<Release | null> => {
  let pending = cache.get(os);
  if (!pending) {
    pending = fetch(`${RELEASES_BASE}/${CHANNEL_FILE[os]}`, { cache: "no-cache" })
      .then((res) => (res.ok ? res.text() : null))
      .then(async (text) => {
        const manifest = text ? parseChannel(text) : null;
        if (!manifest) return null;
        const url = `${RELEASES_BASE}/${manifest.version}/${manifest.file}`;
        return {
          version: manifest.version,
          url,
          file: manifest.file,
          sha512: manifest.sha512 ? base64ToHex(manifest.sha512) : undefined,
          size: manifest.size ?? (await headSize(url)),
          date: manifest.date,
        };
      })
      .catch(() => null);
    cache.set(os, pending);
  }
  return pending;
};

/**
 * The platform this visitor is most likely on, so the page leads with one
 * button instead of three. A wrong guess costs nothing: the others stay one
 * click away. Order matters: an iPad reports "macintosh", Android "linux".
 */
export const detectOs = (): Os => {
  if (typeof navigator === "undefined") return "Windows";
  const hinted = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform;
  const source = `${hinted ?? ""} ${navigator.userAgent} ${navigator.platform ?? ""}`.toLowerCase();
  if (/mac|iphone|ipad|ipod/.test(source)) return "Mac";
  if (/win/.test(source)) return "Windows";
  if (/linux|x11|cros/.test(source)) return "Linux";
  return "Windows";
};

export const formatBytes = (bytes: number, locale: string): string => {
  const mb = bytes / 1_000_000;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(mb)} ${locale.startsWith("fr") ? "Mo" : "MB"}`;
};

export const formatDate = (iso: string, locale: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(d);
};

/** The command that prints the same hash on each system. */
export const checksumCommand = (os: Os, file: string): string =>
  os === "Windows" ? `Get-FileHash .\\${file} -Algorithm SHA512` : `sha512sum ${file}`;

<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="">
</p>

<h1 align="center">Thinkstead website</h1>

<p align="center">
  <strong>Think it. Assign it. Done.</strong><br>
  The website of Thinkstead, the desktop workspace where AI agents carry out what you describe.
</p>

<p align="center">
  <a href="https://s-dev237.github.io/thinkstead-website/">Website</a> ·
  <a href="https://vps-4b2ef8f0.vps.ovh.ca/thinkstead-releases/">Downloads</a>
</p>

---

## What's on the page

- **Real product footage.** Every clip and screenshot comes from the Thinkstead app itself, captured with a
  fictional demo company ("Kola Roasters") in a throwaway profile.
- **An interactive simulation.** Pick an instruction and watch it become a plan, an approval and a result.
  It runs entirely in the browser and sends nothing anywhere.
- **Live downloads.** The buttons read the release feed on the Thinkstead VPS, so a new version appears here
  as soon as its installer is published. The visitor's system is detected; the others stay one click away.
- **English and French**, light and dark themes, keyboard and screen-reader friendly, and every moving clip
  can be paused.

## Run it locally

Requires Node.js 22.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # type-check, then build into dist/
npm run preview    # serve dist/
npm run deploy     # build and publish to GitHub Pages (pushes dist/ to the gh-pages branch)
```

GitHub Pages serves the `gh-pages` branch. Every push to `main` also publishes it automatically through
`.github/workflows/deploy.yml`, whenever GitHub Actions is available on the account.

## Where things live

| Path                         | What it is                                                                  |
| ---------------------------- | --------------------------------------------------------------------------- |
| `src/data/content.ts`        | All page copy, English and French side by side                              |
| `src/data/demo.ts`           | The scenarios of the in-page simulation                                     |
| `src/data/useCases.ts`       | The use-case tabs                                                           |
| `src/data/downloads.ts`      | Reads the release feed (`latest.yml`, `latest-linux.yml`, `latest-mac.yml`) |
| `src/components/`            | Nav, demo, download section and dialog, tabs, clips                         |
| `public/media/`              | Product clips (`.mp4` + `.webp` poster) and full-size stills in `shots/`     |
| `.github/workflows/deploy.yml` | Builds and publishes to the `gh-pages` branch on every push to `main`     |
| `scripts/deploy-gh-pages.sh` | The same publishing step, run by hand (`npm run deploy`)                    |

## Publishing a new version of the app

The site needs no change. Upload the installers and the channel files to the VPS feed:

```
/var/www/thinkstead/thinkstead-releases/
├── latest.yml                 # Windows channel
├── latest-linux.yml           # Linux channel
├── latest-mac.yml             # macOS channel, once a Mac build exists
└── <version>/
    ├── Thinkstead-<version>-win-x64.exe
    └── Thinkstead-<version>-linux-amd64.deb
```

The channel files are the `latest*.yml` that electron-builder writes next to the installers. The download
buttons, the version badge, the size and the SHA-512 shown to visitors all come from them.

## Credits

Thinkstead is built on the open-source [AionUi](https://github.com/iOfficeAI/AionUi) project (Apache-2.0).
Provider marks in the agents strip come from [Simple Icons](https://simpleicons.org) (CC0).

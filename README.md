<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="">
</p>

<h1 align="center">Thinkstead website</h1>

<p align="center">
  <strong>Think it. Assign it. Done.</strong><br>
  The website of Thinkstead, the desktop workspace where AI agents carry out what you describe.
</p>

<p align="center">
  <a href="https://vps-4b2ef8f0.vps.ovh.ca/">Website</a> ·
  <a href="mailto:emmanuelayuk60@gmail.com?subject=Thinkstead%20access%20request">Request access</a>
</p>

---

## What's on the page

- **Real product footage.** Every clip and screenshot comes from the Thinkstead app itself, captured with a
  fictional demo company ("Kola Roasters") in a throwaway profile.
- **An interactive simulation.** Pick an instruction and watch it become a plan, an approval and a result.
  It runs entirely in the browser and sends nothing anywhere.
- **Downloads on request.** Thinkstead is free, and each download is approved by the team. The "Request access"
  buttons open a short form that prepares an email to emmanuelayuk60@gmail.com; once approved, the visitor
  receives a personal download link that expires after 7 days. The installers cannot be downloaded without
  such a link.
- **English and French**, light and dark themes, keyboard and screen-reader friendly, and every moving clip
  can be paused.

## Run it locally

Requires Node.js 22.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # type-check, then build into dist/
npm run preview    # serve dist/
npm run deploy     # build and copy dist/ to the server (destination in deploy.local, not committed)
```

`deploy.local` holds one line, `TARGET=user@host:/path/to/site`.

## Where things live

| Path                     | What it is                                                                  |
| ------------------------ | --------------------------------------------------------------------------- |
| `src/data/content.ts`    | All page copy, English and French side by side                              |
| `src/data/demo.ts`       | The scenarios of the in-page simulation                                     |
| `src/data/useCases.ts`   | The use-case tabs                                                           |
| `src/data/downloads.ts`  | Reads the release feed (version, size, checksum) and the access email       |
| `src/components/`        | Nav, demo, download section and access request form, tabs, clips            |
| `public/media/`          | Product clips (`.mp4` + `.webp` poster), the film and its captions, stills  |
| `scripts/deploy-vps.sh`  | Builds and publishes the site (`npm run deploy`)                            |

## Publishing a new version of the app

The site needs no change. Upload the installers, then the channel files, to the release feed on the server:

```
/var/www/thinkstead/thinkstead-releases/
├── latest.yml                 # Windows channel
├── latest-linux.yml           # Linux channel
├── latest-mac.yml             # macOS channel, once a Mac build exists
└── <version>/
    ├── Thinkstead-<version>-win-x64.exe
    └── Thinkstead-<version>-linux-amd64.deb
```

The channel files are the `latest*.yml` that electron-builder writes next to the installers. They stay public:
the version, size and SHA-512 shown on the page come from them. The installers themselves are only served
through personal links generated on the server for approved requests.

## Credits

Thinkstead is built on the open-source [AionUi](https://github.com/iOfficeAI/AionUi) project (Apache-2.0).
Provider marks in the agents strip come from [Simple Icons](https://simpleicons.org) (CC0).

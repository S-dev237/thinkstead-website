/**
 * Page copy, English and French side by side so a change to one is never
 * forgotten in the other. Every claim describes what Thinkstead 2.4 does
 * today: the chapters were written from the real screens shown in their clips.
 */

export type Locale = "en" | "fr";

export type Step = { n: string; label: string; title: string; copy: string; shot: string; alt: string };
export type Chapter = {
  id: string;
  /** Clip in /media (mp4 + webp poster of the same name). */
  clip: string;
  kicker: string;
  title: string;
  copy: string;
  points: string[];
};
export type Point = { title: string; copy: string };
export type Capability = { icon: string; title: string; copy: string };
export type Faq = { q: string; a: string };
export type Os = "Windows" | "Linux" | "Mac";

type Copy = {
  meta: { title: string; description: string };
  skip: string;
  nav: {
    how: string; demo: string; features: string; uses: string; faq: string; download: string;
    menu: string; close: string; primary: string; home: string; lang: string; langLabel: string;
    theme: string; themes: Record<"system" | "light" | "dark", string>;
  };
  hero: { badge: string; badgeFallback: string; title: [string, string, string]; copy: string; demo: string; film: string; note: string; cardFile: string; cardFileMeta: string; cardTask: string; cardTaskMeta: string; windowLabel: string };
  dl: {
    for: string; soon: string; checking: string; version: string; others: string; size: string;
    notYet: string; close: string; next: string;
    verify: string; verifyHint: string; copy: string; copied: string; requirements: string; released: string;
    otherOs: string;
    notYetHint: string;
    how: string; howSteps: string[];
    reqTitle: string; reqLead: string; name: string; org: string; use: string; system: string; optional: string;
    send: string; sendHint: string; noMail: string; copyAddress: string; copyMessage: string;
    subject: string; body: string; sentNote: string;
  };
  platforms: Record<Os, { label: string; req: string; steps: string[] }>;
  agents: { title: string; more: string; models: string };
  how: { kicker: string; title: string; lead: string; steps: Step[]; enlarge: string };
  demo: {
    kicker: string; title: string; lead: string; note: string; choose: string; request: string; agent: string;
    plan: string; run: string; again: string; running: string; ready: string; waiting: string;
    approve: string; decline: string; declined: string; doneLabel: string; restart: string; sim: string;
  };
  chapters: Chapter[];
  bento: { agenda: string; agendaCopy: string; reports: string; reportsCopy: string };
  tasks: { label: string; schedule: string }[];
  pause: string; play: string;
  caps: { kicker: string; title: string; items: Capability[] };
  uses: { kicker: string; title: string; lead: string; youType: string; youGet: string; copy: string; copied: string };
  control: { kicker: string; title: string; lead: string; modes: { name: string; copy: string }[]; modesLabel: string; points: Point[] };
  film: { kicker: string; title: string; copy: string; play: string; close: string; note: string };
  get: { kicker: string; title: string; lead: string; pick: string };
  faq: { kicker: string; title: string; lead: string; items: Faq[] };
  closer: { title: string; copy: string; note: string };
  footer: { tagline: string; product: string; releases: string; credit: string; rights: string; top: string };
};

export const copy: Record<Locale, Copy> = {
  en: {
    meta: {
      title: "Thinkstead · Think it. Assign it. Done.",
      description:
        "Thinkstead is the desktop workspace where AI agents carry out what you describe: documents, research, schedules and replies. For Windows and Linux.",
    },
    skip: "Skip to content",
    nav: {
      how: "How it works", demo: "Try it", features: "Features", uses: "Use cases", faq: "FAQ", download: "Download",
      menu: "Open menu", close: "Close menu", primary: "Primary navigation", home: "Thinkstead home",
      lang: "FR", langLabel: "Passer en français",
      theme: "Colour theme", themes: { system: "System", light: "Light", dark: "Dark" },
    },
    hero: {
      badge: "New · Thinkstead {v} for Windows and Linux",
      badgeFallback: "New · Thinkstead for Windows and Linux",
      title: ["Think it.", "Assign it.", "Done."],
      copy:
        "Thinkstead is the desktop workspace where AI agents carry out what you describe: files, research, schedules and replies. And they stop to ask you before anything that matters.",
      demo: "Try it in your browser",
      film: "Watch the film",
      note: "Free · Downloads on request · Windows 10+ and Debian/Ubuntu · macOS soon",
      cardFile: "Q3-review.pptx",
      cardFileMeta: "6 slides · ready for review",
      cardTask: "Morning brief",
      cardTaskMeta: "Weekdays at 09:00",
      windowLabel: "Thinkstead, home screen: an instruction typed in, ready to send",
    },
    dl: {
      for: "Request access for", soon: "coming soon", checking: "Finding the latest version…", version: "Version",
      others: "Also for", size: "{s}", notYet: "Not available yet",
      close: "Close", next: "Once you have the file",
      verify: "Check the file (optional)", verifyHint: "Compare this SHA-512 with the output of the command below.",
      copy: "Copy", copied: "Copied", requirements: "Requirements", released: "Released {d}",
      otherOs: "Other systems",
      notYetHint: "The installer for this system is being published. It will appear here on its own, nothing to refresh later.",
      how: "How to get it",
      howSteps: [
        "Send us a short request by email, to emmanuelayuk60@gmail.com.",
        "We review it and reply to you.",
        "You receive a personal download link, valid for 7 days.",
      ],
      reqTitle: "Request access to Thinkstead",
      reqLead: "Thinkstead is free, and each download is approved by our team. Tell us who you are: once your request is approved, we reply with your personal download link, valid for 7 days.",
      name: "Your name", org: "Organisation", use: "What will you use it for?", system: "System", optional: "optional",
      send: "Write the email", sendHint: "Your email app opens with the message ready to send to emmanuelayuk60@gmail.com.",
      noMail: "No email app on this device? Copy the address and the message, and send them from your webmail.",
      copyAddress: "Copy address", copyMessage: "Copy message",
      subject: "Thinkstead access request ({os})",
      body: "Hello,\n\nI would like to download Thinkstead for {os}.\n\nName: {name}\nOrganisation: {org}\nWhat I will use it for: {use}\n\nThank you.",
      sentNote: "Your link will arrive at the address you write from. No answer after two working days? Write to us again.",
    },
    platforms: {
      Windows: {
        label: "Windows",
        req: "Windows 10 or 11, 64-bit",
        steps: [
          "Open {file} from your Downloads folder.",
          "If Windows SmartScreen appears, choose More info, then Run anyway.",
          "Start Thinkstead from the Start menu and sign in.",
        ],
      },
      Linux: {
        label: "Linux",
        req: "Debian, Ubuntu and derivatives, 64-bit (.deb)",
        steps: [
          "Open a terminal in your Downloads folder.",
          "Install it: sudo apt install ./{file}",
          "Start Thinkstead from your applications menu and sign in.",
        ],
      },
      Mac: {
        label: "macOS",
        req: "Apple Silicon and Intel",
        steps: ["The macOS version is on its way. Use Windows or Linux in the meantime."],
      },
    },
    agents: {
      title: "Works with the agents you already use",
      more: "+ 30 more",
      models: "and the leading models",
    },
    how: {
      kicker: "How it works",
      title: "From a sentence to finished work.",
      lead: "No workflow to draw first. Say what you want, choose who does it and when, and get the real result back.",
      enlarge: "Enlarge screenshot",
      steps: [
        {
          n: "01", label: "Think it", title: "Say what you need, in plain words.",
          copy: "Describe the result, not the steps: “Turn Q3-sales.xlsx into a six-slide deck for Monday.” Add files, or point it at a folder.",
          shot: "home", alt: "Thinkstead home screen with an instruction typed into the message box",
        },
        {
          n: "02", label: "Assign it", title: "Choose who does it, and when.",
          copy: "Hand it to the built-in agent, or to Claude Code, Codex and 40 others. Run it now, every weekday at 9, or whenever a message arrives.",
          shot: "newtask", alt: "The Create Scheduled Task form: name, assistant Claude Code, prompt and a weekdays-at-9 schedule",
        },
        {
          n: "03", label: "Done", title: "Get the real result, checked.",
          copy: "Real .xlsx, .pptx and .docx files on your disk, a conversation you can read back, and reports that say what moved and what's stuck.",
          shot: "reports", alt: "A workspace report with the advisor's evaluation: partly on track, and what could have been done differently",
        },
      ],
    },
    demo: {
      kicker: "Try it here",
      title: "Watch an instruction become finished work.",
      lead: "Pick an instruction. Thinkstead plans it, works through it, and pauses for your approval before it changes anything.",
      note: "A simulation that runs in your browser: no account, no files, nothing sent anywhere.",
      choose: "Choose an instruction",
      request: "Your instruction",
      agent: "Assigned to",
      plan: "Plan",
      run: "Run it",
      again: "Run again",
      running: "Working…",
      ready: "Ready. Press Run it to start.",
      waiting: "Waiting for your approval",
      approve: "Approve",
      decline: "Not now",
      declined: "Stopped. Nothing was written. Change the instruction and run it again whenever you like.",
      doneLabel: "Done",
      restart: "Start over",
      sim: "Simulation",
    },
    chapters: [
      {
        id: "agents", clip: "agents", kicker: "Agents",
        title: "Every agent you use, in one window.",
        copy: "Thinkstead ships with its own agent, ready as soon as you sign in. Claude Code, Codex, Gemini CLI, Copilot, Kimi and more are detected the moment they're installed. Pick one per conversation.",
        points: ["Built-in agent, nothing to set up", "41 agents supported", "Interface in 13 languages"],
      },
      {
        id: "tasks", clip: "assign", kicker: "Scheduled tasks",
        title: "Hand it off. It runs on time.",
        copy: "Give a task a name, an agent and an instruction, then choose when: hourly, daily, on weekdays, weekly or on your own schedule. Every run lands in a conversation you can read back.",
        points: ["Hourly, daily, weekdays, weekly or custom", "Queue protection: runs never pile up", "Or just ask for one in any conversation"],
      },
      {
        id: "workspaces", clip: "roadmap", kicker: "Workspaces",
        title: "Your project, as a living roadmap.",
        copy: "Steps, people, resources and reports in one place. Choose an agent as the workspace's advisor: it proposes what comes next, drawn dashed, and nothing changes until you accept.",
        points: ["Suggestions you accept or reject", "Progress and workload per person", "Reports checked against your goals"],
      },
      {
        id: "sharing", clip: "share", kicker: "Local sharing",
        title: "Share a workspace with everyone in the room.",
        copy: "Turn sharing on and colleagues on the same network join with a six-digit PIN, from Thinkstead or from a plain browser. It never leaves your network. When you stop, they keep a read-only copy.",
        points: ["Join with a PIN or a QR code", "No app needed: a browser is enough", "A read-only copy once sharing ends"],
      },
      {
        id: "respond", clip: "respond", kicker: "Auto Respond",
        title: "Answers your customers, in your voice.",
        copy: "Give an agent a personality and goals, connect where messages come from and where replies go. Each customer gets their own thread and memory, and tool calls wait for you unless you allow them.",
        points: ["Webhook or polling in, any endpoint out", "One thread and memory per customer", "Tool calls approved by you"],
      },
    ],
    bento: {
      agenda: "Agenda",
      agendaCopy: "Work sessions planned inside your active hours, with the advisor's proposals shown dashed until you accept them.",
      reports: "Evaluated reports",
      reportsCopy: "Every report is checked against the goals: what moved, what's stuck, and what to do differently.",
    },
    tasks: [
      { label: "Morning brief", schedule: "Weekdays 09:00" },
      { label: "Invoice inbox", schedule: "Every day 09:00" },
      { label: "Weekly team update", schedule: "Mondays 09:00" },
    ],
    pause: "Pause video", play: "Play video",
    caps: {
      kicker: "And more",
      title: "Everything else it already knows how to do.",
      items: [
        { icon: "file", title: "Real Office files", copy: "Writes .docx, .xlsx and .pptx you can open and edit, reads and compares PDFs. “Open with Thinkstead” from your file manager." },
        { icon: "globe", title: "Its own browser", copy: "Agents research, fill in forms and download files in background pages, never in the window you're using." },
        { icon: "search", title: "Search by meaning", copy: "Point it at a folder of PDFs, notes or code and ask in your own words. The index is built on your computer." },
        { icon: "mic", title: "Voice notes", copy: "Transcribes recordings and interviews, then pulls out the decisions and the to-dos." },
        { icon: "puzzle", title: "27 skills, and yours", copy: "Install a skill once and every assistant can use it. Import your own as a folder or a zip." },
        { icon: "phone", title: "From your phone", copy: "Open your Thinkstead from a browser on another device, at home or over the internet." },
        { icon: "code", title: "For developers", copy: "A code knowledge graph lets agents learn a repository once and reuse it in later sessions." },
        { icon: "languages", title: "13 languages", copy: "English, French, Spanish, German, Portuguese, Japanese, Chinese and more, for the app and the answers." },
      ],
    },
    uses: {
      kicker: "Use cases",
      title: "Find your week in here.",
      lead: "Two things you could type on day one, and what comes back.",
      youType: "You type",
      youGet: "You get",
      copy: "Copy",
      copied: "Copied",
    },
    control: {
      kicker: "You stay in charge",
      title: "Fast when you want it. Careful when it matters.",
      lead: "Thinkstead is built to act, so it's built to ask first. You choose how much freedom each conversation gets.",
      modesLabel: "Permission mode, per conversation",
      modes: [
        { name: "Default", copy: "Asks before it changes anything." },
        { name: "Auto Edit", copy: "Edits files on its own, asks for the rest." },
        { name: "YOLO", copy: "Runs freely. For work you trust it with." },
      ],
      points: [
        { title: "Approvals that wait for you", copy: "A tool call can pause until you approve it, and the conversation is flagged so you don't miss it." },
        { title: "Every action in view", copy: "Commands, file writes and web pages appear as they happen, not in a summary afterwards." },
        { title: "Your files stay yours", copy: "Documents stay on your disk and conversations in the app. You delete them when you decide to." },
        { title: "Local means local", copy: "Workspace sharing runs on your own network. Nothing goes through a server to reach the person next to you." },
      ],
    },
    film: {
      kicker: "The film", title: "Thinkstead in one minute.",
      copy: "Instructions, agents, scheduled tasks, Workspaces, sharing and Auto Respond, in the real app.",
      play: "Play the film", close: "Close the film", note: "Narrated in English, with English and French captions.",
    },
    get: {
      kicker: "Download",
      title: "Get Thinkstead.",
      lead: "Thinkstead is free. Downloads are given on request: send us a short email, and we reply with your personal download link.",
      pick: "Choose your system",
    },
    faq: {
      kicker: "FAQ",
      title: "Questions, answered.",
      lead: "Still wondering about something? These are the questions people ask first.",
      items: [
        { q: "What is Thinkstead, exactly?", a: "A desktop app for Windows and Linux where AI agents do work for you: they write real Office files, research the web, run tasks on a schedule, plan projects with your team and answer messages. You describe the outcome; they carry it out and show every step." },
        { q: "How do I get Thinkstead?", a: "Press Request access and send the email it prepares to emmanuelayuk60@gmail.com. Once your request is approved, we reply with a personal download link, valid for 7 days. If it expires before you use it, reply to that email and we send a new one." },
        { q: "Is it free?", a: "Yes. The app is free; downloads are simply approved one by one. To send messages you sign in to a Thinkstead account; model usage runs on credits you top up in the app, with MTN or Orange Mobile Money. Agents you connect yourself, like Claude Code or Codex, keep using your own subscription with them." },
        { q: "Do I need an API key?", a: "No. Sign in and the built-in agent works straight away. If you prefer, you can add your own provider keys on the Model page." },
        { q: "Which agents and models does it work with?", a: "Thinkstead has its own built-in agent and supports 41 agents, including Claude Code, Codex, Gemini CLI, Copilot, Cursor and Kimi, detected as soon as they're installed. Models from OpenAI, Anthropic, Google, Mistral, OpenRouter, AWS Bedrock, Qwen and local models through Ollama can be configured." },
        { q: "Will it do things without asking me?", a: "Only if you let it. Each conversation has a permission mode: Default asks before changing anything, Auto Edit may edit files on its own, YOLO runs freely. Auto Respond agents can be set to wait for your approval on every tool call." },
        { q: "Where is my data stored?", a: "On your computer. Conversations, workspaces and settings live in Thinkstead's data folder (~/.config/Thinkstead on Linux, %APPDATA%\\Thinkstead on Windows). Your documents stay where they are on your disk." },
        { q: "Windows warns me about the installer. Is that normal?", a: "Windows SmartScreen shows a warning for apps it hasn't seen many times yet. Choose More info, then Run anyway. You can check the file first: the Download section of this page shows its SHA-512 checksum." },
        { q: "Can I use it with my team?", a: "Yes. Share a workspace on your local network: colleagues join with a six-digit PIN from Thinkstead or from a browser, and keep a read-only copy when you stop sharing." },
        { q: "Is there a Mac version?", a: "It's on its way. In the meantime, Thinkstead runs on Windows 10 and 11, and on Debian, Ubuntu and their derivatives." },
        { q: "How do I update?", a: "Ask for the new version the same way, then install it over the old one. Your conversations, workspaces and settings are kept." },
        { q: "Is the demo on this page the real app?", a: "No, it's a simulation that runs in your browser, to show how an instruction becomes a plan, an approval and a result. The clips and screenshots on this page are the real app." },
      ],
    },
    closer: {
      title: "Less talking about work. More work getting done.",
      copy: "Ask for your access today. Your agents handle the rest.",
      note: "Free · Downloads on request · Windows and Linux today, macOS soon.",
    },
    footer: {
      tagline: "The desktop workspace where AI agents do the work.",
      product: "Product",
      releases: "Request access",
      credit: "Built on the open-source AionUi project (Apache-2.0).",
      rights: "All rights reserved.",
      top: "Back to top",
    },
  },

  fr: {
    meta: {
      title: "Thinkstead · Pensez-le. Confiez-le. C'est fait.",
      description:
        "Thinkstead est l'espace de travail de bureau où des agents IA exécutent ce que vous décrivez : documents, recherches, plannings et réponses. Pour Windows et Linux.",
    },
    skip: "Aller au contenu",
    nav: {
      how: "Fonctionnement", demo: "Essayer", features: "Fonctions", uses: "Usages", faq: "FAQ", download: "Télécharger",
      menu: "Ouvrir le menu", close: "Fermer le menu", primary: "Navigation principale", home: "Accueil Thinkstead",
      lang: "EN", langLabel: "Switch to English",
      theme: "Thème", themes: { system: "Système", light: "Clair", dark: "Sombre" },
    },
    hero: {
      badge: "Nouveau · Thinkstead {v} pour Windows et Linux",
      badgeFallback: "Nouveau · Thinkstead pour Windows et Linux",
      title: ["Pensez-le.", "Confiez-le.", "C'est fait."],
      copy:
        "Thinkstead est l'espace de travail de bureau où des agents IA exécutent ce que vous décrivez : fichiers, recherches, plannings et réponses. Et ils vous demandent avant tout ce qui compte.",
      demo: "Essayer dans le navigateur",
      film: "Voir le film",
      note: "Gratuit · Téléchargement sur demande · Windows 10+ et Debian/Ubuntu · macOS bientôt",
      cardFile: "Bilan-T3.pptx",
      cardFileMeta: "6 diapositives · prêt à relire",
      cardTask: "Brief du matin",
      cardTaskMeta: "En semaine à 09:00",
      windowLabel: "Thinkstead, écran d'accueil : une consigne saisie, prête à être envoyée",
    },
    dl: {
      for: "Demander l'accès pour", soon: "bientôt", checking: "Recherche de la dernière version…", version: "Version",
      others: "Aussi pour", size: "{s}", notYet: "Pas encore disponible",
      close: "Fermer", next: "Une fois le fichier reçu",
      verify: "Vérifier le fichier (facultatif)", verifyHint: "Comparez ce SHA-512 avec le résultat de la commande ci-dessous.",
      copy: "Copier", copied: "Copié", requirements: "Configuration", released: "Publiée le {d}",
      otherOs: "Autres systèmes",
      notYetHint: "L'installateur de ce système est en cours de publication. Il apparaîtra ici tout seul.",
      how: "Comment l'obtenir",
      howSteps: [
        "Envoyez-nous une courte demande par e-mail, à emmanuelayuk60@gmail.com.",
        "Nous l'examinons et vous répondons.",
        "Vous recevez un lien de téléchargement personnel, valable 7 jours.",
      ],
      reqTitle: "Demander l'accès à Thinkstead",
      reqLead: "Thinkstead est gratuit, et chaque téléchargement est validé par notre équipe. Dites-nous qui vous êtes : une fois votre demande acceptée, nous vous répondons avec votre lien de téléchargement personnel, valable 7 jours.",
      name: "Votre nom", org: "Organisation", use: "Pour quoi allez-vous l'utiliser ?", system: "Système", optional: "facultatif",
      send: "Rédiger l'e-mail", sendHint: "Votre messagerie s'ouvre avec le message prêt à envoyer à emmanuelayuk60@gmail.com.",
      noMail: "Pas de messagerie sur cet appareil ? Copiez l'adresse et le message, et envoyez-les depuis votre webmail.",
      copyAddress: "Copier l'adresse", copyMessage: "Copier le message",
      subject: "Demande d'accès à Thinkstead ({os})",
      body: "Bonjour,\n\nJe souhaite télécharger Thinkstead pour {os}.\n\nNom : {name}\nOrganisation : {org}\nUtilisation prévue : {use}\n\nMerci.",
      sentNote: "Votre lien arrivera à l'adresse depuis laquelle vous écrivez. Pas de réponse sous deux jours ouvrés ? Écrivez-nous de nouveau.",
    },
    platforms: {
      Windows: {
        label: "Windows",
        req: "Windows 10 ou 11, 64 bits",
        steps: [
          "Ouvrez {file} depuis votre dossier Téléchargements.",
          "Si Windows SmartScreen s'affiche, choisissez Informations complémentaires, puis Exécuter quand même.",
          "Lancez Thinkstead depuis le menu Démarrer et connectez-vous.",
        ],
      },
      Linux: {
        label: "Linux",
        req: "Debian, Ubuntu et dérivées, 64 bits (.deb)",
        steps: [
          "Ouvrez un terminal dans votre dossier Téléchargements.",
          "Installez-le : sudo apt install ./{file}",
          "Lancez Thinkstead depuis le menu des applications et connectez-vous.",
        ],
      },
      Mac: {
        label: "macOS",
        req: "Apple Silicon et Intel",
        steps: ["La version macOS arrive. En attendant, utilisez Windows ou Linux."],
      },
    },
    agents: {
      title: "Fonctionne avec les agents que vous utilisez déjà",
      more: "+ 30 autres",
      models: "et les grands modèles",
    },
    how: {
      kicker: "Fonctionnement",
      title: "D'une phrase à un travail fini.",
      lead: "Aucun schéma à dessiner d'abord. Dites ce que vous voulez, choisissez qui le fait et quand, et récupérez le vrai résultat.",
      enlarge: "Agrandir la capture",
      steps: [
        {
          n: "01", label: "Pensez-le", title: "Dites ce qu'il vous faut, simplement.",
          copy: "Décrivez le résultat, pas les étapes : « Fais une présentation de six diapositives à partir de Q3-sales.xlsx pour lundi. » Ajoutez des fichiers ou indiquez un dossier.",
          shot: "home", alt: "Écran d'accueil de Thinkstead avec une consigne saisie dans la zone de message",
        },
        {
          n: "02", label: "Confiez-le", title: "Choisissez qui le fait, et quand.",
          copy: "Confiez-le à l'agent intégré, ou à Claude Code, Codex et 40 autres. Maintenant, chaque jour de semaine à 9 h, ou dès qu'un message arrive.",
          shot: "newtask", alt: "Le formulaire de création de tâche planifiée : nom, assistant Claude Code, consigne et planning en semaine à 9 h",
        },
        {
          n: "03", label: "C'est fait", title: "Récupérez le vrai résultat, vérifié.",
          copy: "De vrais fichiers .xlsx, .pptx et .docx sur votre disque, une conversation à relire, et des rapports qui disent ce qui avance et ce qui bloque.",
          shot: "reports", alt: "Un rapport de workspace avec l'évaluation du conseiller : en partie sur la bonne voie, et ce qu'il aurait fallu faire",
        },
      ],
    },
    demo: {
      kicker: "Essayez ici",
      title: "Regardez une consigne devenir un travail fini.",
      lead: "Choisissez une consigne. Thinkstead la planifie, l'exécute, et attend votre accord avant de modifier quoi que ce soit.",
      note: "Une simulation qui tourne dans votre navigateur : sans compte, sans fichier, rien n'est envoyé.",
      choose: "Choisissez une consigne",
      request: "Votre consigne",
      agent: "Confiée à",
      plan: "Plan",
      run: "Lancer",
      again: "Relancer",
      running: "En cours…",
      ready: "Prêt. Appuyez sur Lancer pour commencer.",
      waiting: "En attente de votre accord",
      approve: "Approuver",
      decline: "Pas maintenant",
      declined: "Arrêté. Rien n'a été écrit. Modifiez la consigne et relancez quand vous voulez.",
      doneLabel: "Terminé",
      restart: "Recommencer",
      sim: "Simulation",
    },
    chapters: [
      {
        id: "agents", clip: "agents", kicker: "Agents",
        title: "Tous vos agents, dans une seule fenêtre.",
        copy: "Thinkstead a son propre agent, prêt dès la connexion. Claude Code, Codex, Gemini CLI, Copilot, Kimi et bien d'autres sont détectés dès leur installation. Choisissez-en un par conversation.",
        points: ["Agent intégré, rien à configurer", "41 agents compatibles", "Interface en 13 langues"],
      },
      {
        id: "tasks", clip: "assign", kicker: "Tâches planifiées",
        title: "Confiez-le. Il s'exécute à l'heure.",
        copy: "Donnez à une tâche un nom, un agent et une consigne, puis choisissez quand : toutes les heures, chaque jour, en semaine, chaque semaine ou selon votre planning. Chaque exécution arrive dans une conversation à relire.",
        points: ["Horaire, quotidien, semaine, hebdo ou sur mesure", "Protection de file : jamais d'exécutions empilées", "Ou demandez-la simplement dans une conversation"],
      },
      {
        id: "workspaces", clip: "roadmap", kicker: "Workspaces",
        title: "Votre projet, en feuille de route vivante.",
        copy: "Étapes, personnes, ressources et rapports au même endroit. Choisissez un agent comme conseiller : il propose la suite, en pointillés, et rien ne change tant que vous n'acceptez pas.",
        points: ["Suggestions à accepter ou refuser", "Avancement et charge de chacun", "Rapports confrontés à vos objectifs"],
      },
      {
        id: "sharing", clip: "share", kicker: "Partage local",
        title: "Partagez un workspace avec toute la salle.",
        copy: "Activez le partage : vos collègues sur le même réseau rejoignent avec un code à six chiffres, depuis Thinkstead ou un simple navigateur. Rien ne quitte votre réseau. Quand vous arrêtez, ils gardent une copie en lecture seule.",
        points: ["Accès par code ou QR code", "Sans l'application : un navigateur suffit", "Copie en lecture seule à la fin du partage"],
      },
      {
        id: "respond", clip: "respond", kicker: "Réponse auto",
        title: "Répond à vos clients, avec votre ton.",
        copy: "Donnez à un agent une personnalité et des objectifs, branchez l'arrivée des messages et l'envoi des réponses. Chaque client a son fil et sa mémoire, et les appels d'outils attendent votre accord si vous le souhaitez.",
        points: ["Entrée par webhook ou relève, sortie vers n'importe quel endpoint", "Un fil et une mémoire par client", "Appels d'outils approuvés par vous"],
      },
    ],
    bento: {
      agenda: "Agenda",
      agendaCopy: "Des séances de travail planifiées dans vos heures actives, les propositions du conseiller en pointillés jusqu'à votre accord.",
      reports: "Rapports évalués",
      reportsCopy: "Chaque rapport est confronté aux objectifs : ce qui avance, ce qui bloque, et ce qu'il faudrait faire autrement.",
    },
    tasks: [
      { label: "Brief du matin", schedule: "En semaine 09:00" },
      { label: "Factures reçues", schedule: "Chaque jour 09:00" },
      { label: "Point d'équipe", schedule: "Lundis 09:00" },
    ],
    pause: "Mettre la vidéo en pause", play: "Lire la vidéo",
    caps: {
      kicker: "Et aussi",
      title: "Tout ce qu'il sait déjà faire.",
      items: [
        { icon: "file", title: "Vrais fichiers Office", copy: "Écrit des .docx, .xlsx et .pptx que vous ouvrez et modifiez, lit et compare les PDF. « Ouvrir avec Thinkstead » depuis votre gestionnaire de fichiers." },
        { icon: "globe", title: "Son propre navigateur", copy: "Les agents cherchent, remplissent des formulaires et téléchargent dans des pages en arrière-plan, jamais dans la fenêtre que vous utilisez." },
        { icon: "search", title: "Recherche par le sens", copy: "Indiquez un dossier de PDF, de notes ou de code et posez vos questions avec vos mots. L'index est construit sur votre ordinateur." },
        { icon: "mic", title: "Notes vocales", copy: "Transcrit enregistrements et entretiens, puis en sort les décisions et les choses à faire." },
        { icon: "puzzle", title: "27 compétences, et les vôtres", copy: "Installez une compétence une fois, tous les assistants peuvent s'en servir. Importez les vôtres en dossier ou en zip." },
        { icon: "phone", title: "Depuis votre téléphone", copy: "Ouvrez votre Thinkstead depuis le navigateur d'un autre appareil, chez vous ou par internet." },
        { icon: "code", title: "Pour les développeurs", copy: "Un graphe de connaissance du code permet aux agents d'apprendre un dépôt une fois et de le réutiliser ensuite." },
        { icon: "languages", title: "13 langues", copy: "Français, anglais, espagnol, allemand, portugais, japonais, chinois et d'autres, pour l'application et les réponses." },
      ],
    },
    uses: {
      kicker: "Usages",
      title: "Retrouvez votre semaine ici.",
      lead: "Deux choses à taper dès le premier jour, et ce qui revient.",
      youType: "Vous tapez",
      youGet: "Vous obtenez",
      copy: "Copier",
      copied: "Copié",
    },
    control: {
      kicker: "Vous gardez la main",
      title: "Rapide quand vous voulez. Prudent quand ça compte.",
      lead: "Thinkstead est fait pour agir, donc fait pour demander d'abord. Vous choisissez la liberté de chaque conversation.",
      modesLabel: "Mode d'autorisation, par conversation",
      modes: [
        { name: "Default", copy: "Demande avant de modifier quoi que ce soit." },
        { name: "Auto Edit", copy: "Modifie les fichiers seul, demande pour le reste." },
        { name: "YOLO", copy: "Agit librement. Pour le travail que vous lui confiez." },
      ],
      points: [
        { title: "Des validations qui vous attendent", copy: "Un appel d'outil peut attendre votre accord, et la conversation est signalée pour que vous ne le manquiez pas." },
        { title: "Chaque action visible", copy: "Commandes, écritures de fichiers et pages web s'affichent au moment où elles se produisent, pas dans un résumé après coup." },
        { title: "Vos fichiers restent à vous", copy: "Les documents restent sur votre disque, les conversations dans l'application. Vous les supprimez quand vous le décidez." },
        { title: "Local veut dire local", copy: "Le partage de workspace passe par votre propre réseau. Aucun serveur entre vous et la personne à côté." },
      ],
    },
    film: {
      kicker: "Le film", title: "Thinkstead en une minute.",
      copy: "Consignes, agents, tâches planifiées, Workspaces, partage et réponse auto, dans la vraie application.",
      play: "Lire le film", close: "Fermer le film", note: "Narration en anglais, sous-titres en français.",
    },
    get: {
      kicker: "Téléchargement",
      title: "Installez Thinkstead.",
      lead: "Thinkstead est gratuit. Le téléchargement se fait sur demande : envoyez-nous un court e-mail, nous vous répondons avec votre lien personnel.",
      pick: "Choisissez votre système",
    },
    faq: {
      kicker: "FAQ",
      title: "Vos questions, nos réponses.",
      lead: "Une hésitation ? Voici les questions qu'on nous pose en premier.",
      items: [
        { q: "Qu'est-ce que Thinkstead, exactement ?", a: "Une application de bureau pour Windows et Linux où des agents IA travaillent pour vous : ils écrivent de vrais fichiers Office, font des recherches sur le web, exécutent des tâches planifiées, organisent des projets avec votre équipe et répondent aux messages. Vous décrivez le résultat ; ils l'exécutent et montrent chaque étape." },
        { q: "Comment obtenir Thinkstead ?", a: "Appuyez sur Demander l'accès et envoyez l'e-mail préparé à emmanuelayuk60@gmail.com. Une fois votre demande acceptée, nous vous répondons avec un lien de téléchargement personnel, valable 7 jours. S'il expire avant que vous l'utilisiez, répondez à cet e-mail et nous en envoyons un nouveau." },
        { q: "Est-ce gratuit ?", a: "Oui. L'application est gratuite ; les téléchargements sont simplement validés un par un. Pour envoyer des messages, vous vous connectez à un compte Thinkstead ; l'usage des modèles se paie en crédits, rechargés dans l'application par MTN ou Orange Mobile Money. Les agents que vous connectez vous-même, comme Claude Code ou Codex, continuent d'utiliser votre abonnement chez eux." },
        { q: "Faut-il une clé d'API ?", a: "Non. Connectez-vous et l'agent intégré fonctionne tout de suite. Si vous préférez, ajoutez vos propres clés sur la page Modèle." },
        { q: "Avec quels agents et modèles fonctionne-t-il ?", a: "Thinkstead a son propre agent intégré et prend en charge 41 agents, dont Claude Code, Codex, Gemini CLI, Copilot, Cursor et Kimi, détectés dès leur installation. Les modèles d'OpenAI, Anthropic, Google, Mistral, OpenRouter, AWS Bedrock, Qwen et des modèles locaux via Ollama peuvent être configurés." },
        { q: "Va-t-il agir sans me demander ?", a: "Seulement si vous le permettez. Chaque conversation a un mode d'autorisation : Default demande avant toute modification, Auto Edit peut modifier les fichiers seul, YOLO agit librement. Les agents de Réponse auto peuvent attendre votre accord à chaque appel d'outil." },
        { q: "Où sont stockées mes données ?", a: "Sur votre ordinateur. Conversations, workspaces et réglages sont dans le dossier de données de Thinkstead (~/.config/Thinkstead sous Linux, %APPDATA%\\Thinkstead sous Windows). Vos documents restent où ils sont." },
        { q: "Windows m'avertit à propos de l'installateur. Est-ce normal ?", a: "Windows SmartScreen avertit pour les applications qu'il n'a pas encore souvent vues. Choisissez Informations complémentaires, puis Exécuter quand même. Vous pouvez vérifier le fichier avant : la section Téléchargement de cette page affiche son empreinte SHA-512." },
        { q: "Puis-je l'utiliser en équipe ?", a: "Oui. Partagez un workspace sur votre réseau local : vos collègues rejoignent avec un code à six chiffres depuis Thinkstead ou un navigateur, et gardent une copie en lecture seule à la fin du partage." },
        { q: "Existe-t-il une version Mac ?", a: "Elle arrive. En attendant, Thinkstead fonctionne sur Windows 10 et 11, et sur Debian, Ubuntu et leurs dérivées." },
        { q: "Comment mettre à jour ?", a: "Demandez la nouvelle version de la même façon, puis installez-la par-dessus l'ancienne. Vos conversations, workspaces et réglages sont conservés." },
        { q: "La démo de cette page est-elle la vraie application ?", a: "Non, c'est une simulation dans votre navigateur, pour montrer comment une consigne devient un plan, une validation et un résultat. Les extraits vidéo et captures de cette page, eux, sont la vraie application." },
      ],
    },
    closer: {
      title: "Moins parler du travail. Plus de travail fait.",
      copy: "Demandez votre accès dès aujourd'hui. Vos agents s'occupent du reste.",
      note: "Gratuit · Téléchargement sur demande · Windows et Linux aujourd'hui, macOS bientôt.",
    },
    footer: {
      tagline: "L'espace de travail de bureau où les agents IA font le travail.",
      product: "Produit",
      releases: "Demander l'accès",
      credit: "Construit sur le projet open source AionUi (Apache-2.0).",
      rights: "Tous droits réservés.",
      top: "Haut de page",
    },
  },
};

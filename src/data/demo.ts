/**
 * Scenarios for the in-page simulation. Each one mirrors a real Thinkstead
 * flow (documents, scheduled tasks, Auto Respond, Workspaces) and stops at an
 * approval before anything would be written: the point of the demo is that the
 * visitor decides, not that the machine looks fast.
 */
import type { Locale } from "./content";

export type Scenario = {
  id: string;
  label: string;
  prompt: string;
  agent: string;
  steps: string[];
  approval: { action: string; detail: string };
  done: { title: string; lines: string[]; file?: string };
};

export const scenarios: Record<Locale, Scenario[]> = {
  en: [
    {
      id: "deck",
      label: "Make a deck from a spreadsheet",
      prompt: "Turn Q3-sales.xlsx into a 6-slide deck for Monday's meeting, one chart per region, and flag what's falling behind.",
      agent: "Built-in agent",
      steps: [
        "Read Q3-sales.xlsx: 4 sheets, 1,284 rows",
        "Total sales per region and per product",
        "Draw one chart per region",
        "Draft 6 slides with speaker notes",
      ],
      approval: { action: "Write Q3-review.pptx to Documents/Reports", detail: "New file · 6 slides" },
      done: {
        title: "Q3-review.pptx is ready",
        lines: ["6 slides, one chart per region", "Falling behind: Cold brew kit (−18%) and Gift box (−9%)"],
        file: "Q3-review.pptx",
      },
    },
    {
      id: "brief",
      label: "Brief me every weekday at 9",
      prompt: "Every weekday at 9, search the news on specialty coffee and our competitors, and brief me in 5 bullet points with links.",
      agent: "Claude Code",
      steps: [
        "Read the schedule: weekdays at 09:00",
        "Assign it to Claude Code",
        "Write the instruction each run will receive",
        "Turn on queue protection",
      ],
      approval: { action: "Create the scheduled task “Morning brief”", detail: "Weekdays 09:00 · a new conversation each run" },
      done: {
        title: "Morning brief is scheduled",
        lines: ["Next run: Monday at 09:00", "Each brief lands in its own conversation"],
      },
    },
    {
      id: "replies",
      label: "Answer customer messages",
      prompt: "Answer the questions that arrive from the shop's chat: track orders, explain subscriptions, and hand refunds over to a person.",
      agent: "Claude Code",
      steps: [
        "Create a responder: “Shop questions”",
        "Set its personality and goals",
        "Connect the incoming webhook",
        "Send replies back to the shop's chat",
      ],
      approval: { action: "Put the responder live", detail: "Tool calls still wait for your approval" },
      done: {
        title: "The responder is live",
        lines: ["Each customer gets their own thread and memory", "Refund requests are flagged for you"],
      },
    },
    {
      id: "plan",
      label: "Plan a launch with my team",
      prompt: "Plan the online shop launch with Amara, Kwame, Sofia and Daniel, and book our work sessions for next week.",
      agent: "Workspace advisor",
      steps: [
        "Break the launch into 8 steps with owners",
        "Link what depends on what",
        "Spot the blocker: card payments",
        "Plan 9 work sessions inside active hours",
      ],
      approval: { action: "Add 2 suggested steps and 9 sessions", detail: "Cash on delivery fallback · beta feedback dashboard" },
      done: {
        title: "Roadmap and agenda are ready",
        lines: ["38% done, 1 blocked step with a fallback", "Next week's sessions are on the agenda"],
      },
    },
  ],
  fr: [
    {
      id: "deck",
      label: "Une présentation depuis un tableur",
      prompt: "Fais une présentation de 6 diapositives à partir de Q3-sales.xlsx pour la réunion de lundi, un graphique par région, et signale ce qui décroche.",
      agent: "Agent intégré",
      steps: [
        "Lire Q3-sales.xlsx : 4 feuilles, 1 284 lignes",
        "Totaliser les ventes par région et par produit",
        "Tracer un graphique par région",
        "Rédiger 6 diapositives avec notes",
      ],
      approval: { action: "Écrire Bilan-T3.pptx dans Documents/Rapports", detail: "Nouveau fichier · 6 diapositives" },
      done: {
        title: "Bilan-T3.pptx est prêt",
        lines: ["6 diapositives, un graphique par région", "En retard : Kit cold brew (−18 %) et Coffret cadeau (−9 %)"],
        file: "Bilan-T3.pptx",
      },
    },
    {
      id: "brief",
      label: "Un brief chaque matin à 9 h",
      prompt: "Chaque jour de semaine à 9 h, cherche l'actualité du café de spécialité et de nos concurrents, et fais-moi un brief en 5 points avec les liens.",
      agent: "Claude Code",
      steps: [
        "Lire le planning : en semaine à 09:00",
        "Confier la tâche à Claude Code",
        "Rédiger la consigne de chaque exécution",
        "Activer la protection de file",
      ],
      approval: { action: "Créer la tâche planifiée « Brief du matin »", detail: "En semaine 09:00 · une nouvelle conversation à chaque fois" },
      done: {
        title: "Le brief du matin est planifié",
        lines: ["Prochaine exécution : lundi à 09:00", "Chaque brief arrive dans sa propre conversation"],
      },
    },
    {
      id: "replies",
      label: "Répondre aux clients",
      prompt: "Réponds aux questions qui arrivent du chat de la boutique : suivi de commande, abonnements, et passe les remboursements à une personne.",
      agent: "Claude Code",
      steps: [
        "Créer un répondeur : « Questions boutique »",
        "Définir sa personnalité et ses objectifs",
        "Brancher le webhook d'entrée",
        "Renvoyer les réponses vers le chat",
      ],
      approval: { action: "Mettre le répondeur en service", detail: "Les appels d'outils attendent toujours votre accord" },
      done: {
        title: "Le répondeur est en service",
        lines: ["Chaque client a son fil et sa mémoire", "Les demandes de remboursement vous sont signalées"],
      },
    },
    {
      id: "plan",
      label: "Planifier un lancement en équipe",
      prompt: "Planifie le lancement de la boutique en ligne avec Amara, Kwame, Sofia et Daniel, et réserve nos séances de travail de la semaine prochaine.",
      agent: "Conseiller du workspace",
      steps: [
        "Découper le lancement en 8 étapes avec responsables",
        "Relier ce qui dépend de quoi",
        "Repérer le blocage : paiement par carte",
        "Planifier 9 séances dans les heures actives",
      ],
      approval: { action: "Ajouter 2 étapes suggérées et 9 séances", detail: "Paiement à la livraison · tableau des retours bêta" },
      done: {
        title: "Feuille de route et agenda prêts",
        lines: ["38 % fait, 1 étape bloquée avec une solution de secours", "Les séances de la semaine sont à l'agenda"],
      },
    },
  ],
};

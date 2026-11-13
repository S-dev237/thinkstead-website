/**
 * The work a visitor already does, in their words: a promise, two prompts they
 * could paste as they are, and what comes back. One domain on screen at a
 * time, because a grid of all of them is the thing people skim past.
 */
import type { Locale } from "./content";

export type UseCase = { id: string; label: string; headline: string; prompts: [string, string]; outcome: string };

export const useCases: Record<Locale, UseCase[]> = {
  en: [
    {
      id: "business", label: "Small business",
      headline: "Orders, invoices and customer questions get handled while you run the shop.",
      prompts: [
        "Every morning, add yesterday's invoices from my Invoices folder to invoices.xlsx and tell me which are overdue",
        "Answer customer questions about delivery times and subscriptions, and pass refunds to me",
      ],
      outcome: "A workbook that keeps itself up to date, and a thread per customer you can read back.",
    },
    {
      id: "research", label: "Research",
      headline: "The corpus gets read, the sources get checked, the figures get cross-referenced while you do something else.",
      prompts: [
        "Index this folder of PDFs and tell me what recurs in the conclusions",
        "Transcribe these interview recordings and pull out what they agree on",
      ],
      outcome: "Sourced extracts with the file path attached, not a summary you can't check.",
    },
    {
      id: "office", label: "Office & admin",
      headline: "The workbook gets filtered, the summary written, the deck built, in the real formats.",
      prompts: [
        "Filter this workbook to the overdue rows and chart them in a new sheet",
        "Turn this report into a deck, one slide per finding",
      ],
      outcome: "An .xlsx and a .pptx you open and edit, not text to retype.",
    },
    {
      id: "teaching", label: "Students & teachers",
      headline: "Ten years of past papers in one folder become the list of questions that actually come up.",
      prompts: [
        "Count the questions that recur most across the networking papers in this folder",
        "From these past papers, propose the revision plan that covers the most marks",
      ],
      outcome: "A ranking by how many papers contain each question, with the papers listed.",
    },
    {
      id: "content", label: "Content & marketing",
      headline: "The watching happens every morning without you, and you arrive at an angle already framed.",
      prompts: [
        "Every morning at 8, search my field's news and note what deserves a post",
        "Compare these three articles and find the angle nobody took",
      ],
      outcome: "One thread that grows day by day, with the original links kept.",
    },
    {
      id: "legal", label: "Legal & contracts",
      headline: "Two versions of a contract, a hundred pages each: what moved fits on one screen.",
      prompts: [
        "Compare these two contract versions and list what changed, clause by clause",
        "In this folder, find every termination clause and its notice period",
      ],
      outcome: "The exact passages, with file and page: enough to go and check yourself.",
    },
    {
      id: "hiring", label: "Hiring & HR",
      headline: "Two hundred CVs in a folder become a shortlist, with the reason next to each name.",
      prompts: [
        "Sort these CVs against these three criteria and explain every gap",
        "Make a comparison sheet of the shortlist, one row per person",
      ],
      outcome: "A workbook you can re-sort, and the line from the CV behind each call.",
    },
  ],
  fr: [
    {
      id: "business", label: "Commerce",
      headline: "Commandes, factures et questions des clients sont traitées pendant que vous tenez la boutique.",
      prompts: [
        "Chaque matin, ajoute les factures d'hier de mon dossier Factures dans factures.xlsx et dis-moi lesquelles sont en retard",
        "Réponds aux questions des clients sur les délais de livraison et les abonnements, et passe-moi les remboursements",
      ],
      outcome: "Un classeur qui se tient à jour seul, et un fil par client à relire.",
    },
    {
      id: "research", label: "Recherche",
      headline: "Le corpus est lu, les sources vérifiées, les chiffres recoupés, pendant que vous faites autre chose.",
      prompts: [
        "Indexe ce dossier de PDF et dis-moi ce qui revient dans les conclusions",
        "Transcris ces enregistrements d'entretien et sors les points communs",
      ],
      outcome: "Des extraits sourcés avec le chemin du fichier, pas un résumé invérifiable.",
    },
    {
      id: "office", label: "Bureau & administration",
      headline: "Le classeur est filtré, la synthèse écrite, la présentation faite, dans les vrais formats.",
      prompts: [
        "Filtre ce classeur sur les lignes en retard et fais-en un graphique dans un nouvel onglet",
        "Transforme ce rapport en présentation, une diapositive par constat",
      ],
      outcome: "Un .xlsx et un .pptx que vous ouvrez et modifiez, pas du texte à recopier.",
    },
    {
      id: "teaching", label: "Étudiants & enseignants",
      headline: "Dix ans d'annales dans un dossier deviennent la liste des questions qui tombent vraiment.",
      prompts: [
        "Compte les questions qui reviennent le plus dans les sujets de réseaux de ce dossier",
        "À partir de ces annales, propose le plan de révision qui couvre le plus de points",
      ],
      outcome: "Un classement par nombre de sujets concernés, avec la liste des sujets.",
    },
    {
      id: "content", label: "Contenu & marketing",
      headline: "La veille se fait chaque matin sans vous, et vous arrivez sur un sujet déjà cadré.",
      prompts: [
        "Chaque matin à 8 h, cherche l'actualité de mon domaine et note ce qui mérite un post",
        "Compare ces trois articles et trouve l'angle que personne n'a pris",
      ],
      outcome: "Un fil qui s'allonge jour après jour, avec les liens d'origine conservés.",
    },
    {
      id: "legal", label: "Juridique & contrats",
      headline: "Deux versions d'un contrat, cent pages chacune : ce qui a bougé tient en un écran.",
      prompts: [
        "Compare ces deux versions du contrat et liste ce qui a changé, clause par clause",
        "Dans ce dossier, retrouve toutes les clauses de résiliation et leurs délais",
      ],
      outcome: "Les passages exacts, avec le fichier et la page : de quoi vérifier vous-même.",
    },
    {
      id: "hiring", label: "Recrutement & RH",
      headline: "Deux cents CV dans un dossier deviennent une liste courte, avec le motif pour chacun.",
      prompts: [
        "Trie ces CV selon ces trois critères et explique chaque écart",
        "Fais un tableau comparatif des candidats retenus, une ligne par personne",
      ],
      outcome: "Un classeur que vous pouvez retrier, et la phrase du CV derrière chaque choix.",
    },
  ],
};

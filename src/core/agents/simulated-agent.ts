import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyserDemande(description: string, fichiers: string = "") {
  if (!process.env.GEMINI_API_KEY) {
    return [
      { title: "Analyse des besoins (Simulation)", status: "PENDING", agent: "Architecte" },
    ];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
    
    const prompt = `
      Tu es un chef de projet. L'utilisateur veut : "${description}".
      Génère UNE SEULE tâche pour commencer le projet.
      Réponds uniquement par un titre court, sans phrase d'introduction.
      Exemple de réponse : "Concevoir la base de données"
    `;

    const result = await model.generateContent(prompt);
    const titre = result.response.text().trim();
    
    // On crée 3 tâches (une générée par l'IA, deux fixes pour l'instant)
    return [
      { title: titre || "Analyse des besoins", status: "PENDING", agent: "Architecte" },
      { title: "Développer l'interface utilisateur", status: "PENDING", agent: "Designer" },
      { title: "Tester et sécuriser l'application", status: "PENDING", agent: "Testeur" },
    ];

  } catch (error) {
    console.error("Erreur de l'IA :", error);
    return [
      { title: "Analyse des besoins (Erreur IA)", status: "PENDING", agent: "Système" },
    ];
  }
}
import fs from 'fs';
import path from 'path';

// Nouvelle fonction : Générer le code d'une plateforme
export async function genererCodePlateforme(nomProjet: string, description: string) {
  if (!process.env.GEMINI_API_KEY) return "Clé API manquante.";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
    
    const prompt = `
      Tu es un développeur expert. L'utilisateur veut créer : "${description}".
      Génère un schéma Prisma complet pour cette application.
      Réponds UNIQUEMENT avec le code Prisma, sans texte autour, sans balises markdown.
    `;

    const result = await model.generateContent(prompt);
    let code = result.response.text().trim();
    
    // On nettoie les balises markdown si l'IA en a mis
    code = code.replace(/```prisma/g, "").replace(/```/g, "").trim();

    // On sauvegarde le fichier sur le disque dur
    const dossierProjet = path.join(process.cwd(), 'projets-generes', nomProjet.replace(/\s+/g, '-').toLowerCase());
    
    if (!fs.existsSync(dossierProjet)) {
      fs.mkdirSync(dossierProjet, { recursive: true });
    }

    const cheminFichier = path.join(dossierProjet, 'schema.prisma');
    fs.writeFileSync(cheminFichier, code);

    return `Code généré avec succès dans le dossier : projets-generes/${nomProjet.replace(/\s+/g, '-').toLowerCase()}`;

  } catch (error) {
    console.error("Erreur de génération :", error);
    return "Erreur lors de la génération du code.";
  }
}
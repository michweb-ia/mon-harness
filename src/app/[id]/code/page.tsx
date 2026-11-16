import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function VoirCode({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // On cherche le dossier généré pour ce projet
  // Note : Pour faire simple, on cherche le dossier qui contient le nom du projet
  const dossierProjets = path.join(process.cwd(), 'projets-generes');
  
  let codeGenere = "Aucun code généré pour l'instant. Retourne sur la page du projet et clique sur 'Générer le code'.";
  
  try {
    // On liste les dossiers dans projets-generes
    if (fs.existsSync(dossierProjets)) {
      const dossiers = fs.readdirSync(dossierProjets);
      // On prend le premier dossier qui correspond (pour l'instant, on affiche le premier trouvé)
      if (dossiers.length > 0) {
        const cheminFichier = path.join(dossierProjets, dossiers[0], 'schema.prisma');
        if (fs.existsSync(cheminFichier)) {
          codeGenere = fs.readFileSync(cheminFichier, 'utf-8');
        }
      }
    }
  } catch (error) {
    codeGenere = "Erreur lors de la lecture du fichier.";
  }

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px', backgroundColor: '#111827', color: '#ffffff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href={`/${resolvedParams.id}`} style={{ color: '#60a5fa', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
          ← Retour au projet
        </Link>

        <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px', border: '1px solid #374151' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#93c5fd', marginBottom: '20px', marginTop: 0 }}>
            💻 Code généré par l'Agent Architecte
          </h1>
          
          <pre style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', overflowX: 'auto', color: '#e2e8f0', fontSize: '14px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {codeGenere}
          </pre>
        </div>
      </div>
    </main>
  );
}
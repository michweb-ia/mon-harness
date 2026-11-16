import { PrismaClient } from '@prisma/client'
import { toggleTache } from '../actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { genererCodePlateforme } from '@/core/agents/simulated-agent'

const prisma = new PrismaClient()

async function DetailsProjet({ id }: { id: string }) {
  const projet = await prisma.platform.findUnique({
    where: { id },
    include: { tasks: { orderBy: { createdAt: 'asc' } } }
  })

  if (!projet) {
    notFound()
  }

  const totalTaches = projet.tasks.length
  const tachesTerminees = projet.tasks.filter(t => t.status === 'DONE').length
  const pourcentage = totalTaches > 0 ? Math.round((tachesTerminees / totalTaches) * 100) : 0

  return (
    <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '12px', border: '1px solid #374151' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#93c5fd', marginBottom: '8px', marginTop: 0 }}>{projet.name}</h1>
          <p style={{ color: '#9ca3af', margin: 0 }}>{projet.description || "Aucune description"}</p>
        </div>
        <span style={{ fontSize: '12px', backgroundColor: '#1e3a8a', color: '#bfdbfe', padding: '6px 12px', borderRadius: '20px' }}>
          Statut : {projet.status}
        </span>
      </div>

      {/* BARRE DE PROGRESSION */}
      <div style={{ marginBottom: '20px', backgroundColor: '#374151', borderRadius: '8px', padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#d1d5db' }}>
          <span>Avancement du projet</span>
          <span>{pourcentage}% ({tachesTerminees}/{totalTaches} tâches)</span>
        </div>
        <div style={{ width: '100%', backgroundColor: '#111827', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${pourcentage}%`, backgroundColor: '#22c55e', height: '100%', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#4ade80', margin: 0, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>🤖</span> Plan de l'Équipe
          </h2>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <form action={async () => {
              "use server"
              const resultat = await genererCodePlateforme(projet.name, projet.description || "")
              console.log(resultat)
            }}>
              <button type="submit" style={{ backgroundColor: '#9333ea', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                ⚡ Générer le code
              </button>
            </form>

            {/* BOUTON MIS À JOUR */}
            <Link href={`/${projet.id}/code`} style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block' }}>
              👁️ Voir le code généré
            </Link>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {projet.tasks.map(t => (
            <li key={t.id} style={{ display: 'flex', alignItems: 'flex-start', backgroundColor: '#1f2937', padding: '12px', borderRadius: '6px', border: '1px solid #374151' }}>
              <form action={async () => {
                "use server"
                await toggleTache(t.id, t.status)
              }}>
                <button type="submit" style={{ marginRight: '12px', marginTop: '2px', width: '20px', height: '20px', borderRadius: '4px', border: t.status === 'DONE' ? '1px solid #16a34a' : '1px solid #6b7280', backgroundColor: t.status === 'DONE' ? '#16a34a' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  {t.status === 'DONE' && <span style={{ color: '#ffffff', fontSize: '12px' }}>✓</span>}
                </button>
              </form>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ textDecoration: t.status === 'DONE' ? 'line-through' : 'none', color: t.status === 'DONE' ? '#6b7280' : '#e5e7eb' }}>
                  {t.title}
                </span>
                {t.agent && (
                  <span style={{ fontSize: '12px', backgroundColor: '#581c87', color: '#e9d5ff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #7e22ce' }}>
                    {t.agent}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px', backgroundColor: '#111827', color: '#ffffff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
          ← Retour au tableau de bord
        </Link>

        <Suspense fallback={<div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Chargement du projet...</div>}>
          <DetailsProjet id={resolvedParams.id} />
        </Suspense>
      </div>
    </main>
  );
}
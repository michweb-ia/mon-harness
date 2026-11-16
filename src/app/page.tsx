import { PrismaClient } from '@prisma/client'
import { creerPlateforme, supprimerPlateforme } from './actions'
import Link from 'next/link'
import { Suspense } from 'react'

const prisma = new PrismaClient()

async function ListeProjets() {
  const plateformes = await prisma.platform.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tasks: { orderBy: { createdAt: 'asc' } } }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {plateformes.map((p) => (
        <div key={p.id} style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '10px', border: '1px solid #374151', position: 'relative' }}>
          
          <form action={async () => {
            "use server"
            await supprimerPlateforme(p.id)
          }} style={{ position: 'absolute', top: '15px', right: '15px' }}>
            <button type="submit" style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️ Supprimer</button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingRight: '80px' }}>
            <Link href={`/${p.id}`} style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa', textDecoration: 'none' }}>
              {p.name}
            </Link>
            <span style={{ fontSize: '12px', backgroundColor: '#1e3a8a', color: '#bfdbfe', padding: '4px 8px', borderRadius: '12px' }}>Statut : {p.status}</span>
          </div>
          {p.description && <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>{p.description}</p>}

          <div style={{ backgroundColor: '#111827', padding: '15px', borderRadius: '8px', border: '1px solid #374151' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🤖</span> Plan de l'Équipe ({p.tasks.length} tâches)
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {p.tasks.map(t => (
                <li key={t.id} style={{ fontSize: '14px', display: 'flex', alignItems: 'center', color: '#d1d5db', backgroundColor: '#1f2937', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ marginRight: '8px' }}>⏳</span> 
                  <span>{t.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px', backgroundColor: '#111827', color: '#ffffff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#60a5fa', margin: 0 }}>🚀 Harnais Mon</h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '5px' }}>Agentique Intelligent</p>
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '12px', border: '1px solid #374151', marginBottom: '30px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', marginTop: 0 }}>Créer une nouvelle plateforme</h2>
          <form action={creerPlateforme} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#d1d5db' }}>Nom du projet</label>
              <input name="nom" required style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#374151', border: '1px solid #4b5563', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }} placeholder="Ex: Application de livraison" />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#d1d5db' }}>Décrivez votre besoin à l'agent</label>
              <textarea name="description" rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#374151', border: '1px solid #4b5563', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }} placeholder="Ex: Je veux un site pour gérer mes clients..."></textarea>
            </div>

            <div style={{ border: '2px dashed #4b5563', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', marginBottom: '8px' }}>📎</span>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Ajouter des fichiers, ZIP ou code source</span>
                <input type="file" name="fichiers" multiple style={{ display: 'none' }} />
              </label>
            </div>

            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', width: '100%', fontSize: '16px' }}>
              Lancer l'analyse de l'agent
            </button>
          </form>
        </div>

        <Suspense fallback={<div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Chargement des projets...</div>}>
          <ListeProjets />
        </Suspense>
      </div>
    </main>
  );
}
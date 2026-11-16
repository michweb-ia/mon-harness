"use server"

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { analyserDemande } from '@/core/agents/simulated-agent'

const prisma = new PrismaClient()

export async function creerPlateforme(formData: FormData) {
  const nom = formData.get('nom') as string
  const description = formData.get('description') as string
  
  const files = formData.getAll('fichiers') as File[]
  const fileNames = files.map(f => f.name).filter(n => n !== '').join(', ')

  if (!nom) return

  const planBrut = await analyserDemande(description || nom, fileNames)

  const planDeTaches = planBrut.map((t: any) => ({
    title: String(t.title || "Tâche sans nom"),
    status: "PENDING",
    agent: t.agent ? String(t.agent) : "Système"
  }))

  await prisma.platform.create({
    data: {
      name: nom,
      description: description,
      // LA CORRECTION EST ICI : on vérifie que ce n'est ni vide, ni "undefined"
      attachments: (fileNames === '' || fileNames === 'undefined') ? null : fileNames,
      status: "PLANNING",
      tasks: {
        create: planDeTaches
      }
    }
  })

  revalidatePath('/')
}

export async function supprimerPlateforme(id: string) {
  await prisma.platform.delete({
    where: { id }
  })
  revalidatePath('/')
}

export async function toggleTache(id: string, currentStatus: string) {
  const newStatus = currentStatus === "PENDING" ? "DONE" : "PENDING"
  await prisma.task.update({
    where: { id },
    data: { status: newStatus }
  })
  revalidatePath('/')
  revalidatePath(`/${id}`)
}
"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma"; 

// 1. CREATE : Enregistrer un nouveau document
export async function createDocument(name: string, url: string, clientId?: string, isGeneral: boolean = false) {
  try {
    if (!clientId && !isGeneral) {
        throw new Error("Le ID du client est requis pour enregistrer un document privé.");
    }

    const newDoc = await prisma.document.create({
      data: {
        name,
        url,
        clerkId: clientId || "", 
        isGeneral,
      },
    });

    // On rafraîchit les pages concernées pour voir les changements immédiatement
    revalidatePath("/admin/documents"); 
    revalidatePath("/admin/ressources"); 
    revalidatePath(`/admin/clients/${clientId}`); 
    revalidatePath("/tableau-de-bord");       
    
    return { success: true, data: newDoc };
  } catch (error) {
    console.error("Erreur création document:", error);
    return { success: false, error: "Impossible de créer le document" };
  }
}

// 2. GET : Récupérer les documents d'un client spécifique
export async function getDocumentsByClient(clerkId: string, limit?: number, offset?: number) {
  try {
    const documents = await prisma.document.findMany({
      where: { 
        clerkId: clerkId,
        isGeneral: false 
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return { data: documents };
  } catch (error) {
    console.error("Erreur getDocumentsByClient:", error);
    return { data: [], error: "Erreur lors de la récupération" };
  }
}

// 3. UPDATE : Renommer un document
export async function updateDocumentName(id: string, newName: string) {
  try {
    await prisma.document.update({
      where: { id },
      data: { name: newName },
    });
    revalidatePath("/admin/documents");
    revalidatePath("/admin/ressources");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Échec de la mise à jour" };
  }
}

// 4. DELETE : Supprimer un document
export async function deleteDocument(id: string) {
  try {
    await prisma.document.delete({
      where: { id },
    });
    // On rafraîchit partout où le document pourrait apparaître
    revalidatePath("/admin/documents");
    revalidatePath("/admin/ressources");
    revalidatePath("/tableau-de-bord");
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression document:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// 5. GET : Récupérer les documents généraux (Ressources pour tous les clients)
export async function getGeneralDocuments(limit?: number, offset?: number) {
  try {
    const documents = await prisma.document.findMany({
      where: { isGeneral: true },
      take: limit,    // Le nombre d'éléments à prendre
      skip: offset,   // Le nombre d'éléments à sauter
      orderBy: { createdAt: 'desc' },
    });
    return { data: documents };
  } catch (error) {
    console.error("Erreur getGeneralDocuments:", error);
    return { data: [], error: "Erreur lors de la récupération" };
  }
}
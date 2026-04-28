"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma"; 

// 1. CREATE : Ajouter un nouveau document
export async function createDocument(name: string, url: string, clientId: string) {
  try {
    const newDoc = await prisma.document.create({
      data: {
        name,
        url,
        clientId,
      },
    });
    revalidatePath("/admin/documents"); // Rafraîchit la page admin
    revalidatePath("/dashboard");       // Rafraîchit la page client
    return { success: true, data: newDoc };
  } catch (error) {
    console.error("Erreur création document:", error);
    return { success: false, error: "Impossible de créer le document" };
  }
}

// 2. GET : Récupérer les documents d'un client spécifique
export async function getDocumentsByClient(clientId: string) {
  try {
    const documents = await prisma.document.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: "Erreur lors de la récupération" };
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
    revalidatePath("/admin/documents");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur lors de la suppression" };
  }
}
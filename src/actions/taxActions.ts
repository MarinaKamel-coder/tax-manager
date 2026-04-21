"use server";

import prisma from "../lib/prisma";
import { checkRole } from "../lib/role";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { sendAdminNotification } from "../lib/mail";

/**
 * Action pour soumettre une nouvelle demande fiscale
 */
export async function submitTaxRequest(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Vous devez être connecté pour soumettre une demande.");
  }

  const taxYear = parseInt(formData.get("taxYear") as string);
  const submittedEmail = (formData.get("email") as string).toLowerCase().trim(); // Normalisation
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;

  // --- 1. Vérification des doublons de demande ---
  const existingSubmission = await prisma.taxSubmission.findFirst({
    where: {
      userId: userId,
      taxYear: taxYear,
    },
  });

  if (existingSubmission) {
    redirect(`/demande?error=duplicate&year=${taxYear}`);
  }

  // --- 2. Synchronisation sécurisée de l'utilisateur ---
  try {
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        firstName,
        lastName,
        phone,
        email: submittedEmail,
      },
      create: {
        clerkId: userId,
        email: submittedEmail,
        firstName,
        lastName,
        phone,
        role: "CLIENT",
      },
    });
  } catch (error: any) {
    // Si l'erreur concerne l'email déjà utilisé par un autre ClerkID
    if (error.code === 'P2002') {
      console.error("Collision d'email détectée :", submittedEmail);
      // Optionnel : Gérer ici si vous voulez fusionner ou bloquer
    }
    // On continue quand même la création de la soumission si l'utilisateur existe déjà
  }

  // --- 3. Création de la soumission fiscale ---
  await prisma.taxSubmission.create({
    data: {
      userId: userId,
      firstName,
      lastName,
      taxYear: taxYear,
      serviceType: formData.get("serviceType") as string,
      hasSpouse: formData.get("hasSpouse") === "on",
      hasDependents: formData.get("hasDependents") === "on",
      phone,
      email: submittedEmail,
      notes: formData.get("notes") as string,
      status: "En attente",
    },
  });

  // Notification Admin (Optionnel : ajouter un await si vous voulez être sûr du succès)
  sendAdminNotification({
    clientName: `${firstName} ${lastName}`,
    year: taxYear,
    type: formData.get("serviceType") as string,
  });

  revalidatePath("/tableau-de-bord");
  redirect("/tableau-de-bord?success=true");
}

/**
 * Action pour mettre à jour le statut (Admin seulement)
 */
export async function updateSubmissionStatus(submissionId: string, newStatus: string) {
  const role = await checkRole();
  if (role !== "admin") {
    throw new Error("Non autorisé : Accès administrateur requis.");
  }

  try {
    await prisma.taxSubmission.update({
      where: { id: submissionId },
      data: { status: newStatus },
    });

    revalidatePath("/tableau-de-bord");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return { success: false, error: "Impossible de mettre à jour le statut." };
  }
}

export async function deleteTaxRequest(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  const submission = await prisma.taxSubmission.findUnique({ where: { id } });

  // Sécurité : Vérifier que c'est bien la demande de l'utilisateur et qu'elle est en attente
  if (submission?.userId !== userId) throw new Error("Ce dossier ne vous appartient pas");
  if (submission.status !== "En attente") throw new Error("Impossible de supprimer un dossier déjà en cours de traitement");

  await prisma.taxSubmission.delete({ where: { id } });
  revalidatePath("/tableau-de-bord");
}

/**
 * Modifier une demande existante
 */
export async function updateTaxRequest(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  const newYear = parseInt(formData.get("taxYear") as string);

  // 1. Récupérer la demande actuelle
  const currentSubmission = await prisma.taxSubmission.findUnique({ 
    where: { id } 
  });

  if (!currentSubmission || currentSubmission.userId !== userId || currentSubmission.status !== "En attente") {
    throw new Error("Modification non autorisée");
  }

  // 2. Si l'année a changé, vérifier si la nouvelle année n'existe pas déjà ailleurs
  if (newYear !== currentSubmission.taxYear) {
    const duplicate = await prisma.taxSubmission.findFirst({
      where: {
        userId: userId,
        taxYear: newYear,
        NOT: { id: id } // On ignore la demande actuelle elle-même
      }
    });

    if (duplicate) {
      // Rediriger vers la page d'édition avec l'erreur
      redirect(`/demande/edit/${id}?error=duplicate&year=${newYear}`);
    }
  }

  // 3. Procéder à la mise à jour si tout est correct
  await prisma.taxSubmission.update({
    where: { id },
    data: {
      taxYear: newYear,
      serviceType: formData.get("serviceType") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      notes: formData.get("notes") as string,
      hasSpouse: formData.get("hasSpouse") === "on",
      hasDependents: formData.get("hasDependents") === "on",
    },
  });

  revalidatePath("/tableau-de-bord");
  redirect("/tableau-de-bord?success=updated");
}
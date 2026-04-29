"use server";

import prisma from "../lib/prisma";
import { checkRole } from "../lib/role";
import { pusherServer } from "../lib/pusher";
import { auth } from "@clerk/nextjs/server";

// On définit une interface pour les données reçues
interface SendMessageProps {
  text: string;
  clientId: string;
  submissionId?: string | null;
}

export async function sendMessage({ text, clientId, submissionId }: SendMessageProps) {
  const { userId: senderId } = await auth();
  
  if (!senderId) {
    throw new Error("Vous devez être connecté.");
  }

  if (!text || text.trim() === "") return;

  try {
    const newMessage = await prisma.message.create({
      data: {
        text: text.trim(),
        senderId: senderId,
        userId: clientId, 
        submissionId: submissionId || null,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await pusherServer.trigger(`chat-${clientId}`, "new-message", newMessage);
    await pusherServer.trigger("admin-notifications", "new-message", { userId: clientId });

    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Erreur envoi:", error);
    return { success: false };
  }
}

/**
 * Action pour marquer tous les messages d'une conversation comme lus
 * Utile quand l'admin ouvre le dossier client
 */
export async function markMessagesAsRead(clientId: string) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) return;

  try {
    await prisma.message.updateMany({
      where: {
        userId: clientId, // Le fil du client
        senderId: { not: currentUserId }, // Les messages reçus
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteChat(clientId: string) {
  const role = await checkRole();
  if (role !== "admin") throw new Error("Action non autorisée.");

  try {
    // Supprime tous les messages où le userId correspond au client
    await prisma.message.deleteMany({
      where: {
        userId: clientId,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression chat:", error);
    return { success: false, error: "Impossible de supprimer la conversation." };
  }
}
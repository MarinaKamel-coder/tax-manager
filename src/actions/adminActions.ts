"use server";

import prisma from "../lib/prisma";
import { checkRole } from "../lib/role";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Inverser le statut Actif/Inactif
export async function toggleClientStatus(clientId: string, currentStatus: boolean) {
  const role = await checkRole();
  if (role !== "admin") throw new Error("Accès refusé");

  await prisma.user.update({
    where: { id: clientId },
    data: { isActive: !currentStatus }
  });

  revalidatePath("/admin/clients");
}

// 2. Supprimer un client
export async function deleteClient(clientId: string) {
  const role = await checkRole();
  if (role !== "admin") throw new Error("Accès refusé");

  // Note: Attention aux cascades si le client a des TaxSubmissions
  await prisma.user.delete({
    where: { id: clientId }
  });

  revalidatePath("/admin/clients");
}

// 3. Mettre à jour les infos (utilisé par la page d'édition)
export async function updateClientDetails(clientId: string, formData: FormData) {
  const role = await checkRole();
  if (role !== "admin") throw new Error("Accès refusé");

  await prisma.user.update({
    where: { id: clientId },
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      isActive: formData.get("isActive") === "true",
    },
  });

  // On rafraîchit la liste des clients pour l'admin
  revalidatePath("/admin/clients");
  
  // On redirige vers la liste après la modification
  redirect("/admin/clients");
}


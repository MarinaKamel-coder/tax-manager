"use server";

import prisma from "../lib/prisma";
import { checkRole } from "../lib/role";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAnnouncement(formData: FormData) {
  const role = await checkRole();
  if (role !== "admin") throw new Error("Accès interdit");

  await prisma.announcement.create({
    data: {
      title: formData.get("title") as string || "Sans titre",
      content: formData.get("content") as string || "",
      priority: formData.get("priority") as string,
      imageUrl: formData.get("imageUrl") as string, 
    },
  });

  revalidatePath("/admin/annonces");
  revalidatePath("/annonces");
  revalidatePath("/tableau-de-bord");
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const role = await checkRole();
  if (role !== "admin") throw new Error("Non autorisé");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const priority = formData.get("priority") as string;
  const imageUrl = formData.get("imageUrl") as string;


  await prisma.announcement.update({
    where: { id },
    data: {
      title: title || "Sans titre",
      content: content || "",
      priority: priority,
      imageUrl: imageUrl || null, 
    },
  });

  revalidatePath("/admin/annonces");
  revalidatePath("/annonces");
  redirect("/admin/annonces");
}

export async function deleteAnnouncement(id: string) {
  const role = await checkRole();
  if (role !== "admin") throw new Error("Accès interdit");

  await prisma.announcement.delete({ where: { id } });

  revalidatePath("/admin/annonces");
  revalidatePath("/annonces");
  revalidatePath("/tableau-de-bord");
}
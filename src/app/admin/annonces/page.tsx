// app/admin/annonces/page.tsx
import prisma from "../../../lib/prisma";
import { checkRole } from "../../../lib/role";
import { redirect } from "next/navigation";
import AdminAnnoncesPage from "./AdminAnnoncesClient"; 

export default async function Page() {
  // 1. Protection côté serveur
  const role = await checkRole();
  if (role !== "admin") redirect("/");

  // 2. Récupération des données Prisma
  const annonces = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 3. On envoie les données au composant Client
  // On passe un tableau vide [] par défaut pour éviter l'erreur .map()
  return <AdminAnnoncesPage annonces={annonces || []} />;
}
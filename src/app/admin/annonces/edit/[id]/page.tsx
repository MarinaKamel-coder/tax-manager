import prisma from "../../../../../lib/prisma";
import { checkRole } from "../../../../../lib/role";
import { redirect } from "next/navigation";
import EditAnnonceForm from "./EditAnnonceForm";

export default async function EditAnnoncePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Sécurité côté serveur
  const role = await checkRole();
  if (role !== "admin") redirect("/");

  // Récupération des données
  const annonce = await prisma.announcement.findUnique({ 
    where: { id } 
  });

  if (!annonce) redirect("/admin/annonces");

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">Modifier l'annonce</h1>
        
        {/* On passe l'objet annonce complet au formulaire client */}
        <EditAnnonceForm annonce={annonce} />
      </div>
    </div>
  );
}
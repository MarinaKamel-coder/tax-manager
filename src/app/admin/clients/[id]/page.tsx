import prisma from "../../../../lib/prisma";
import { checkRole } from "../../../../lib/role";
import { redirect, notFound } from "next/navigation";
import ImageUploader from "../../../../components/ImageUploader";
import DocumentList from "../../../../components/DocumentList";
import { getDocumentsByClient } from "../../../../actions/documentActions";
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function AdminClientDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const role = await checkRole();
  if (role !== "admin") redirect("/");

  
  const { id } = await params; 

  if (!id || typeof id !== 'string') {
  notFound();
 }
  
  const client = await prisma.user.findUnique({
    where: { clerkId: id }
  });

  if (!client) notFound();

  
  const { data: documents } = await getDocumentsByClient(id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Barre de retour */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <Link href="/admin/clients" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-bold text-sm">
          <ArrowLeftIcon className="h-4 w-4" />
          Retour au répertoire
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : Profil du Client */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm text-center">
              <div className="h-20 w-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <UserCircleIcon className="h-12 w-12" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 uppercase leading-tight">
                {client.lastName} <br />
                <span className="text-blue-600">{client.firstName}</span>
              </h1>
              <p className="text-xs font-black text-slate-400 mt-2 tracking-widest uppercase">
                ID: {client.id.slice(-8)}
              </p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest border-b pb-2">Coordonnées</h3>
              <div className="flex items-center gap-3 text-slate-600">
                <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <PhoneIcon className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium">{client.phone || "Non renseigné"}</span>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Gestion des Documents */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Zone d'Upload */}
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-dashed border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheckIcon className="h-6 w-6 text-emerald-500" />
                  Transmettre un document privé
                </h2>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Le document sera uniquement visible par <strong>{client.firstName}</strong> dans son espace personnel.
              </p>
              
              {/* ImageUploader configuré pour ce client spécifique */}
              <ImageUploader clientId={client.clerkId} isGeneral={false} />
            </div>

            {/* Liste des Documents existants */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6">Fichiers partagés</h2>
              {documents && documents.length > 0 ? (
                <DocumentList documents={documents} isAdmin={true} />
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium italic">Aucun document n'a été partagé avec ce client.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
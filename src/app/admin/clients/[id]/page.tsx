import prisma from "../../../../lib/prisma";
import { checkRole } from "../../../../lib/role";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import ImageUploader from "../../../../components/ImageUploader";
import DocumentList from "../../../../components/DocumentList";
import ChatBox from "../../../../components/ChatBox";
import { getDocumentsByClient } from "../../../../actions/documentActions";
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon,
  FolderOpenIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function AdminClientDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const role = await checkRole();
  const { userId: adminId } = await auth();
  
  if (role !== "admin" || !adminId) redirect("/");

  const { id } = await params; 

  if (!id || typeof id !== 'string') {
    notFound();
  }
  
  // Récupération du client avec son historique de messages
  const client = await prisma.user.findUnique({
    where: { clerkId: id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!client) notFound();

  // Récupération des documents liés à ce client
  const { data: documents } = await getDocumentsByClient(id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLONNE GAUCHE (4/12) : PROFIL & INFOS */}
          <div className="lg:col-span-4 space-y-6">
            {/* Carte Profil */}
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">         
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-slate-200">
                  {client.firstName[0]}{client.lastName[0]}
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                  {client.firstName} <br />
                  <span className="text-blue-600">{client.lastName}</span>
                </h1>
              </div>

              <div className="mt-10 space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                  <div className="overflow-hidden">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email professionnel</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <PhoneIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                    <p className="text-sm font-bold text-slate-700">{client.phone || "Non renseigné"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note de service (Optionnel) */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
              <ChatBubbleLeftRightIcon className="h-8 w-8 mb-4 opacity-50" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">Support Direct</h3>
              <p className="text-xs font-bold opacity-80 leading-relaxed">
                Toutes les communications sur cette page sont chiffrées. Le client reçoit une notification instantanée pour chaque message envoyé.
              </p>
            </div>
          </div>

          {/* COLONNE DROITE (8/12) : MESSAGERIE & DOCUMENTS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SECTION CHAT BOX */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                  Discussion avec le client
                </h2>
              </div>
              <div className="flex-1">
                <ChatBox 
                  clientId={client.clerkId} 
                  currentUserId={adminId} 
                  initialMessages={JSON.parse(JSON.stringify(client.messages))} 
                  isAdmin={true}
                />
              </div>
            </div>

            {/* SECTION DOCUMENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Document */}
              <div className="bg-white rounded-[3rem] p-8 border-2 border-dashed border-blue-100 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <ShieldCheckIcon className="h-6 w-6" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Nouveau Fichier</h2>
                </div>
                <ImageUploader clientId={client.clerkId} isGeneral={false} />
                <p className="mt-4 text-[10px] font-bold text-slate-400 text-center italic">
                  Document privé uniquement visible par ce client.
                </p>
              </div>

              {/* Liste des Documents */}
              <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <FolderOpenIcon className="h-5 w-5" />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Documents Partagees</h2>
                </div>
                <div className="max-h-[300px] overflow-y-auto pr-2">
                  {documents && documents.length > 0 ? (
                    <DocumentList documents={documents} isAdmin={true} />
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Aucun fichier partagé</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
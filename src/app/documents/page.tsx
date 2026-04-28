import prisma from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGeneralDocuments, getDocumentsByClient } from "../../actions/documentActions";
import DocumentList from "../../components/DocumentList";
import { BookOpenIcon, FolderIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";

export default async function ClientDocumentsPage() {
  const { userId } = await auth();
  
  if (!userId) redirect("/sign-in");

  // On récupère les documents généraux (isGeneral: true)
  const { data: generalDocs } = await getGeneralDocuments();
  
  // On récupère les documents personnels en utilisant TOUJOURS le userId de Clerk
  // car c'est celui que l'admin utilise pour uploader (clerkId)
  const { data: personalDocs } = await getDocumentsByClient(userId);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 min-h-screen bg-slate-50/50">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
          Centre de Documents
        </h1>
        <p className="text-slate-500 font-medium">
          Retrouvez ici vos formulaires fiscaux et les guides du cabinet.
        </p>
      </header>

      {/* Section Ressources Générales - Design Clair */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
              </div>
              Guides et Ressources Publiques
            </h2>
            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">
                {generalDocs?.length || 0} Fichiers
            </span>
        </div>
        <DocumentList documents={generalDocs || []} isAdmin={false} />
      </section>

      {/* Section Documents Personnels - Design Dark (Inspiré de ton code) */}
      <section className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
        {/* Effet visuel de fond */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        <div className="relative z-10">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-emerald-400">
              <div className="p-2 bg-emerald-400/10 rounded-xl">
                <FolderIcon className="h-6 w-6" />
              </div>
              Mes Documents Privés
            </h2>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-[2rem] p-4 border border-slate-700/50">
              {personalDocs && personalDocs.length > 0 ? (
                <DocumentList documents={personalDocs} isAdmin={false} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">
                    Aucun document personnel partagé
                  </p>
                  <p className="text-slate-600 text-xs mt-2">
                    Vos documents apparaîtront ici dès qu'ils seront traités par notre cabinet.
                  </p>
                </div>
              )}
            </div>
        </div>
      </section>
    </div>
  );
}
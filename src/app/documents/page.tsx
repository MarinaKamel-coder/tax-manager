import prisma from "../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGeneralDocuments, getDocumentsByClient } from "../../actions/documentActions";
import DocumentList from "../../components/DocumentList";
import { BookOpenIcon, FolderIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import Pagination from "../../components/Pagination";

export default async function ClientDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ pGen?: string; pPriv?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const ITEMS_PER_PAGE = 3;

  // --- 1. GESTION DOCUMENTS GÉNÉRAUX (Guides) ---
  const currentPageGen = Number(params.pGen) || 1;
  const totalGeneralCount = await prisma.document.count({ 
    where: { isGeneral: true } 
  });
  
  const { data: generalDocs } = await getGeneralDocuments(
    ITEMS_PER_PAGE, 
    (currentPageGen - 1) * ITEMS_PER_PAGE
  );
  const totalPagesGen = Math.ceil(totalGeneralCount / ITEMS_PER_PAGE);

  // --- 2. GESTION DOCUMENTS PERSONNELS (Privés) ---
  const currentPagePriv = Number(params.pPriv) || 1;
  const totalPersonalCount = await prisma.document.count({ 
    where: { clerkId: userId, isGeneral: false } 
  });
  
  const { data: personalDocs } = await getDocumentsByClient(
    userId, 
    ITEMS_PER_PAGE, 
    (currentPagePriv - 1) * ITEMS_PER_PAGE
  );
  const totalPagesPriv = Math.ceil(totalPersonalCount / ITEMS_PER_PAGE);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 min-h-screen bg-[#F8FAFC] font-sans antialiased">
      
      {/* HEADER PRINCIPAL */}
      <header className="space-y-3">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
          Centre de Documents
        </h1>
        <div className="h-1 w-20 bg-blue-600 rounded-full" />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] pt-2">
          Gestion sécurisée de vos ressources fiscales
        </p>
      </header>

      {/* --- SECTION 1 : GUIDES PUBLICS (DESIGN CLAIR) --- */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
        <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
              <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                <BookOpenIcon className="h-6 w-6 stroke-[2]" />
              </div>
              Guides Publics
            </h2>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black bg-slate-50 text-slate-400 border border-slate-100 px-4 py-2 rounded-full uppercase tracking-widest">
                    {totalGeneralCount} Ressources
                </span>
            </div>
        </div>
        
        <div className="min-h-[200px]">
          <DocumentList documents={generalDocs || []} isAdmin={false} />
        </div>
        
        {/* Pagination spécifique pour les guides (pGen) */}
        <div className="mt-8 border-t border-slate-50 pt-6">
          <Pagination totalPages={totalPagesGen} paramKey="pGen" />
        </div>
      </section>

      {/* --- SECTION 2 : ESPACE PRIVÉ (DESIGN DARK) --- */}
      <section className="bg-slate-900 p-10 rounded-[4rem] shadow-2xl text-white relative overflow-hidden group">
        {/* Effet lumineux décoratif */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] -mr-40 -mt-40 rounded-full transition-opacity group-hover:opacity-100 opacity-50" />
        
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black flex items-center gap-4 text-emerald-400 uppercase tracking-tight">
                    <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20 border border-emerald-500/20">
                        <FolderIcon className="h-6 w-6" />
                    </div>
                    Espace Privé
                </h2>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full uppercase tracking-[0.2em]">
                        Coffre-fort sécurisé
                    </span>
                </div>
            </div>
            
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5">
              {personalDocs && personalDocs.length > 0 ? (
                <>
                    <DocumentList documents={personalDocs} isAdmin={false} />
                    {/* Pagination spécifique pour le privé (pPriv) */}
                    <div className="mt-10 border-t border-white/5 pt-6">
                        <Pagination totalPages={totalPagesPriv} paramKey="pPriv" />
                    </div>
                </>
              ) : (
                <div className="py-20 text-center">
                  <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <FolderIcon className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] italic mb-3">
                    Aucun document disponible
                  </p>
                  <p className="text-slate-600 text-xs max-w-xs mx-auto leading-relaxed font-medium">
                    Vos factures et documents fiscaux apparaîtront ici après traitement par nos experts.
                  </p>
                </div>
              )}
            </div>
        </div>
      </section>

      {/* FOOTER INFO */}
      <footer className="text-center pb-12">
        <p className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">
            Tous vos documents sont cryptés et protégés &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
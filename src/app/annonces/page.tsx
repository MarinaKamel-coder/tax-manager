import prisma from "../../lib/prisma";
import { checkRole } from "../../lib/role"; 
import Link from "next/link";
import { MegaphoneIcon, BellIcon } from "@heroicons/react/24/outline";
import Pagination from "../../components/Pagination"; 

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const role = await checkRole();

  // --- CONFIGURATION DE LA PAGINATION ---
  const ITEMS_PER_PAGE = 6; 
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // --- RÉCUPÉRATION DES DONNÉES ---
  const [totalAnnonces, annonces] = await Promise.all([
    prisma.announcement.count(),
    prisma.announcement.findMany({
      take: ITEMS_PER_PAGE,
      skip: skip,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const totalPages = Math.ceil(totalAnnonces / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 font-sans antialiased">
      <div className="max-w-4xl mx-auto">
        
        {/* --- En-tête --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4 tracking-tighter uppercase italic">
              <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                <MegaphoneIcon className="h-6 w-6 stroke-[2.5]" />
              </div>
              Actualités
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 ml-1">
              {totalAnnonces} Annonce{totalAnnonces > 1 ? 's' : ''} 
            </p>
          </div>

          {role === "admin" && (
            <Link 
              href="/admin/annonces" 
              className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-200 flex items-center gap-3"
            >
              <PlusIcon className="h-4 w-4" /> Gérer
            </Link>
          )}
        </div>

        {/* --- Liste des annonces --- */}
        <div className="space-y-10">
          {annonces.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <MegaphoneIcon className="h-16 w-16 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-300 font-black uppercase text-xs tracking-widest">Aucune annonce publiée</p>
            </div>
          ) : (
            annonces.map((a) => {
              const hasNoTitle = !a.title || a.title === "Sans titre";
              const hasNoContent = !a.content || a.content.trim() === "";

              return (
                <article 
                  key={a.id} 
                  className={`overflow-hidden rounded-[3rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 ${
                    a.priority === 'urgent' && !hasNoTitle
                      ? 'border-red-100 bg-white ring-1 ring-red-50' 
                      : 'bg-white border-slate-50'
                  }`}
                >
                  {/* 1. Image */}
                  {a.imageUrl && (
                    <div className="w-full bg-slate-50 overflow-hidden">
                      <img 
                        src={a.imageUrl} 
                        alt={a.title ?? "Annonce"} 
                        className="w-full h-auto max-h-[600px] block object-contain hover:scale-[1.02] transition-transform duration-700"
                      />
                    </div>
                  )}

                  {/* 2. Contenu texte */}
                  {(!hasNoTitle || !hasNoContent) && (
                    <div className="p-10">
                      <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                        <div className="flex items-center gap-4">
                          {!hasNoTitle && (
                            <>
                              {a.priority === 'urgent' ? (
                                <span className="flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                                  <BellIcon className="h-3.5 w-3.5" />
                                  Urgent
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                  Info
                                </span>
                              )}
                              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{a.title}</h2>
                            </>
                          )}
                        </div>
                        
                        <time className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-5 py-2 rounded-full">
                          {new Date(a.createdAt).toLocaleDateString('fr-CA', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </time>
                      </div>
                      
                      {!hasNoContent && (
                        <div className="text-slate-500 whitespace-pre-wrap leading-relaxed text-lg font-medium italic">
                          {a.content}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Admin Footer */}
                  {role === "admin" && (
                    <div className={`px-10 pb-8 ${hasNoTitle && hasNoContent ? 'pt-6' : ''}`}>
                      <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                        {hasNoTitle && (
                           <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Image seule</span>
                        )}
                        <Link 
                          href={`/admin/annonces/edit/${a.id}`} 
                          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition ml-auto"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          Modifier
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* --- PAGINATION --- */}
        <div className="mt-16">
           <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

// --- ICONES ---
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function PencilSquareIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}
import prisma from "../../lib/prisma";
import { checkRole } from "../../lib/role"; 
import Link from "next/link";
import { MegaphoneIcon, BellIcon } from "@heroicons/react/24/outline";

export default async function AnnoncesPage() {
  const annonces = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  const role = await checkRole();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* --- En-tête --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <MegaphoneIcon className="h-8 w-8 text-blue-700" />
              Annonces & Actualités
            </h1>
            <p className="text-slate-500 mt-1">Restez informé des dernières mises à jour importantes.</p>
          </div>

          {role === "admin" && (
            <Link 
              href="/admin/annonces" 
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" /> Gérer les annonces
            </Link>
          )}
        </div>

        {/* --- Liste des annonces --- */}
        <div className="space-y-8">
          {annonces.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <MegaphoneIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="italic text-slate-400">Aucune annonce n'a été publiée pour le moment.</p>
            </div>
          ) : (
            annonces.map((a) => {
              // On définit si l'annonce est considérée comme "sans titre"
              const hasNoTitle = !a.title || a.title === "Sans titre";
              const hasNoContent = !a.content || a.content.trim() === "";

              return (
                <article 
                  key={a.id} 
                  className={`overflow-hidden rounded-3xl shadow-sm border transition hover:shadow-md ${
                    a.priority === 'urgent' && !hasNoTitle
                      ? 'border-l-8 border-l-red-500 bg-red-50/30 border-red-100' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {/* 1. Affichage de l'image */}
                  {a.imageUrl && (
                    <div className="w-full bg-slate-100 border-b border-slate-100">
                      <img 
                        src={a.imageUrl} 
                        alt={a.title ?? "Annonce"} 
                        className="w-full h-auto max-h-[800px] block object-contain"
                      />
                    </div>
                  )}

                  {/* 2. Zone de texte - Affichée uniquement s'il y a un titre ou du contenu */}
                  {(!hasNoTitle || !hasNoContent) && (
                    <div className="p-8">
                      <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                        <div className="flex items-center gap-3">
                          {/* Affichage du badge uniquement si un titre existe */}
                          {!hasNoTitle && (
                            <>
                              {a.priority === 'urgent' ? (
                                <span className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                  <BellIcon className="h-4 w-4 animate-pulse" />
                                  Urgent
                                </span>
                              ) : (
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                  Info
                                </span>
                              )}
                              <h2 className="text-2xl font-bold text-slate-800">{a.title}</h2>
                            </>
                          )}
                        </div>
                        
                        <time className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full">
                          {new Date(a.createdAt).toLocaleDateString('fr-CA', { 
                            day: 'numeric', month: 'long', year: 'numeric' 
                          })}
                        </time>
                      </div>
                      
                      {!hasNoContent && (
                        <div className="text-slate-600 whitespace-pre-wrap leading-relaxed text-lg">
                          {a.content}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Pied de page pour Admin (toujours visible pour l'admin, même si image seule) */}
                  {role === "admin" && (
                    <div className={`px-8 pb-6 ${hasNoTitle && hasNoContent ? 'pt-4' : ''}`}>
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        {hasNoTitle && (
                           <span className="text-[10px] text-slate-400 italic font-medium">Annonce image seule</span>
                        )}
                        <Link 
                          href={`/admin/annonces/edit/${a.id}`} 
                          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition ml-auto"
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
      </div>
    </div>
  );
}

// Composants Icones
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function PencilSquareIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}
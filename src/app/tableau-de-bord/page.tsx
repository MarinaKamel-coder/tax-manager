import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import Link from "next/link";

// Composants
import StatusUpdater from "../../components/StatusUpdater";
import DeleteButton from "../../components/DeleteButton";
import Pagination from "../../components/Pagination";
import DashboardSearch from "../../components/DashboardSearch";
import StatusFilterItem from "../../components/StatusFilterItem";

// Icons
import { 
  PlusIcon, 
  Squares2X2Icon, 
  LockClosedIcon,
  ClockIcon,
  CheckIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  const params = await searchParams;

  if (!userId) redirect("/sign-in");

  // --- FILTRES & CONFIGURATION ---
  const query = params.q || "";
  const filterStatus = params.status || "Tous";
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 9;

  // --- CONSTRUCTION DE LA REQUÊTE PRISMA ---
  const whereClause: any = {
    ...(role === "admin" ? {} : { userId }),
    ...(filterStatus !== "Tous" ? { status: filterStatus } : {}),
    ...(query ? {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ]
    } : {}),
  };

  const [totalItems, allDemandes] = await Promise.all([
    prisma.taxSubmission.count({ where: whereClause }),
    prisma.taxSubmission.findMany({
      where: whereClause,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const statusFilters = ["Tous", "En attente", "Acceptée", "En cours", "Terminé", "Annulé"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans antialiased">
      
      {/* HEADER & FILTRES */}
      <div className="bg-white border-b border-slate-200 px-8 py-10 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">
                {role === "admin" ? "Console Admin" : "Mon Suivi Fiscal"}
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                {totalItems} Dossier{totalItems > 1 ? 's' : ''} trouvé{totalItems > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-80">
                <DashboardSearch />
              </div>
              {role !== "admin" && (
                <Link href="/demande" className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                  <PlusIcon className="h-4 w-4 stroke-[3]" /> Nouveau
                </Link>
              )}
            </div>
          </div>

          {/* ONGLETS DE FILTRAGE */}
          <div className="flex flex-wrap gap-2 border-t border-slate-50 pt-6">
            {statusFilters.map((s) => (
              <StatusFilterItem key={s} label={s} isActive={filterStatus === s} />
            ))}
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {allDemandes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allDemandes.map((d) => (
              <div key={d.id} className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-slate-900 text-white text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                      Année {d.taxYear}
                    </span>
                    <div className="flex items-center gap-2">
                       <StatusBadge status={d.status} />
                       {role === "admin" && <DeleteButton id={d.id} />}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3 uppercase">
                      {d.firstName} <br/>
                      <span className="text-slate-400 text-lg">{d.lastName}</span>
                    </h3>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Squares2X2Icon className="h-3.5 w-3.5 stroke-[2.5]" />
                      {d.serviceType.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50 mt-auto">
                  {role === "admin" ? (
                    <div className="space-y-4">
                      <StatusUpdater id={d.id} currentStatus={d.status} />
                      <Link 
                        href={`/admin/clients/${d.userId}`} 
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
                      >
                        Dossier Complet
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-tight">
                        Soumis le <br/>
                        <span className="text-slate-900 text-xs font-black">{new Date(d.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {(d.status === "En attente" || d.status === "Acceptée") ? (
                          <>
                            <Link href={`/demande/edit/${d.id}`} className="px-5 py-2.5 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">
                              Éditer
                            </Link>
                            <DeleteButton id={d.id} />
                          </>
                        ) : (
                          <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-xl text-slate-300 border border-slate-100">
                            <LockClosedIcon className="h-4 w-4" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Traité</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
             <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em]">Aucun dossier ne correspond à votre recherche</p>
          </div>
        )}

        <div className="mt-16">
          <Pagination totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}

// --- PETIT COMPOSANT DE BADGE ---
function StatusBadge({ status }: { status: string }) {
    const config: any = {
        "En attente": "bg-amber-100 text-amber-700",
        "Acceptée": "bg-blue-100 text-blue-700",
        "En cours": "bg-indigo-100 text-indigo-700",
        "Terminé": "bg-emerald-100 text-emerald-700",
        "Annulé": "bg-slate-100 text-slate-700",
    };
    return (
        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${config[status] || "bg-slate-100"}`}>
            {status}
        </span>
    );
}
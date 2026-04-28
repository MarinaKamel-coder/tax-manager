import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import StatusUpdater from "../../components/StatusUpdater";
import DeleteButton from "../../components/DeleteButton";
import Link from "next/link";
import { 
  PlusIcon,
  Squares2X2Icon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
  UserGroupIcon,
  CheckIcon,
  XCircleIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (!userId) redirect("/sign-in");

  const allDemandes = await prisma.taxSubmission.findMany({
    where: role === "admin" ? {} : { userId },
    orderBy: { createdAt: 'desc' }
  });

  const sections = [
    { id: "attente", title: "En Attente", status: "En attente", color: "bg-amber-500", icon: <ClockIcon className="h-5 w-5"/> },
    { id: "acceptee", title: "Acceptée", status: "Acceptée", color: "bg-blue-500", icon: <CheckIcon className="h-5 w-5"/> },
    { id: "progression", title: "En Progression", status: "En cours", color: "bg-indigo-500", icon: <ArrowPathIcon className="h-5 w-5"/> },
    { id: "terminee", title: "Terminée", status: "Terminé", color: "bg-emerald-500", icon: <CheckBadgeIcon className="h-5 w-5"/> },
    { id: "annulee", title: "Annulée", status: "Annulé", color: "bg-slate-400", icon: <XCircleIcon className="h-5 w-5"/> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-8 py-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
              {role === "admin" ? "Console Administration" : "Mon Suivi Fiscal"}
            </h1>
          </div>
          
          <div className="flex gap-4">
            {role === "admin" && (
              <Link href="/admin/clients" className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all border border-slate-200">
                <UserGroupIcon className="h-4 w-4" /> Clients
              </Link>
            )}
            {role !== "admin" && (
              <Link href="/demande" className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                <PlusIcon className="h-4 w-4" /> Nouveau Dossier
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* SECTIONS WORKFLOW */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {sections.map((section) => {
          const items = allDemandes.filter(d => d.status === section.status);
          if (items.length === 0 && role !== "admin") return null;

          return (
            <section key={section.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className={`${section.color} p-2 rounded-xl text-white shadow-lg`}>
                  {section.icon}
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">{section.title}</h2>
                <div className="h-[1px] flex-1 bg-slate-200" />
                <span className="bg-white border border-slate-200 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                  {items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.length > 0 ? (
                  items.map((d) => (
                    <div key={d.id} className="group bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-start mb-6">
                        <span className="bg-slate-900 text-white text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                          Année {d.taxYear}
                        </span>
                        {role === "admin" && <DeleteButton id={d.id} />}
                      </div>

                      <div className="mb-8">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                          {`${d.firstName} ${d.lastName}`}
                        </h3>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                          <Squares2X2Icon className="h-3 w-3" />
                          {d.serviceType.replace('_', ' ')}
                        </p>
                      </div>

                      <div className="pt-8 border-t border-slate-50">
                        {role === "admin" ? (
                          <div className="space-y-4">
                            <StatusUpdater id={d.id} currentStatus={d.status} />
                            <Link 
                              href={`/admin/clients/${d.userId}`} 
                              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all shadow-lg"
                            >
                              Ouvrir le dossier complet
                            </Link>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="text-[9px] font-black text-slate-400 uppercase">
                              Reçu le <br/>
                              <span className="text-slate-900 text-xs font-bold">{new Date(d.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {/* LOGIQUE DE VERROUILLAGE */}
                            <div className="flex gap-2">
                              {(d.status === "En attente" || d.status === "Acceptée") ? (
                                <>
                                  <Link href={`/demande/edit/${d.id}`} className="p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all">
                                    Modifier
                                  </Link>
                                  <DeleteButton id={d.id} />
                                </>
                              ) : (
                                <div className="p-3 bg-slate-100 rounded-2xl text-slate-300 flex items-center gap-2 grayscale" title="Dossier en traitement">
                                  <span className="text-[8px] font-black uppercase tracking-tighter">Traitement</span>
                                  <LockClosedIcon className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">File vide</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
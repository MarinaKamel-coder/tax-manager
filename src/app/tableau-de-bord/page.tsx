import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import StatusUpdater from "../../components/StatusUpdater";
import DeleteButton from "../../components/DeleteButton";
import Link from "next/link";
import { 
  PencilSquareIcon, 
  DocumentTextIcon, 
  PhoneIcon, 
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  InboxStackIcon
} from "@heroicons/react/24/outline";

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (!userId) redirect("/sign-in");

  const demandes = await prisma.taxSubmission.findMany({
    where: role === "admin" ? {} : { userId },
    orderBy: { createdAt: 'desc' }
  });

  // Statistiques rapides
  const stats = {
    total: demandes.length,
    pending: demandes.filter(d => d.status === "En attente").length,
    completed: demandes.filter(d => d.status === "Terminé").length,
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      {/* --- HEADER --- */}
      <div className="bg-slate-900 pt-12 pb-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {role === "admin" ? "Console Administrateur" : "Mes Dossiers Fiscaux"}
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              {role === "admin" 
                ? "Gestion centralisée des soumissions clients." 
                : "Suivi en temps réel de vos déclarations de revenus."}
            </p>
          </div>
          {role !== "admin" && (
            <Link href="/demande" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 w-fit">
              <PencilSquareIcon className="h-5 w-5" />
              Nouvelle demande
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12">
        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <InboxStackIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total dossiers</p>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">En attente</p>
              <p className="text-2xl font-black text-slate-900">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Terminés</p>
              <p className="text-2xl font-black text-slate-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* --- LISTE DES DOSSIERS --- */}
        <div className="grid gap-6">
          {demandes.map((d) => (
            <div 
              key={d.id} 
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* SECTION GAUCHE : INFOS */}
                <div className="p-8 flex-1">
                  {role === "admin" ? (
                    <>
                      <div className="mb-2">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                          Année {d.taxYear}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase">
                        {d.firstName} {d.lastName}
                      </h3>
                    </>
                  ) : (
                    <h3 className="text-3xl font-black text-slate-900 mb-4">
                      Impots pour l'Année {d.taxYear}
                    </h3>
                  )}

                  <div className="flex items-center gap-2 text-slate-500 font-bold bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                    <BriefcaseIcon className="h-5 w-5 text-slate-400" />
                    <span className="capitalize">{d.serviceType.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* SECTION DROITE : STATUT & ACTIONS */}
                <div className="bg-slate-50/50 p-8 md:w-80 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center md:text-left">
                    Statut Actuel
                  </p>

                  {role === "admin" ? (
                    <StatusUpdater id={d.id} currentStatus={d.status} />
                  ) : (
                    <div className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-black border w-full ${
                      d.status === 'En attente' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                      d.status === 'En cours' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        d.status === 'En attente' ? 'bg-amber-500' : 
                        d.status === 'En cours' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}></span>
                      {d.status}
                    </div>
                  )}

                  {role !== "admin" && d.status === "En attente" && (
                    <div className="flex items-center gap-2 mt-4">
                      <Link 
                        href={`/demande/edit/${d.id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Modifier
                      </Link>
                      <DeleteButton id={d.id}/>
                    </div>
                  )}
                </div>
              </div>

              {/* PIED DE CARTE : NOTE (si présente) */}
              {d.notes && (
                <div className="px-8 py-4 bg-blue-50/40 border-t border-blue-100/50 flex items-center gap-3">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Note client:</span>
                  <p className="text-sm text-blue-700 font-bold">{d.notes}</p>
                </div>
              )}
            </div>
          ))}

          {/* ÉTAT VIDE */}
          {demandes.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="h-10 w-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Aucun dossier à afficher</h2>
              <p className="text-slate-500 max-w-sm mx-auto mt-3 font-medium">
                Vous n'avez pas encore soumis de demande.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import prisma from "../../../lib/prisma";
import { checkRole } from "../../../lib/role";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toggleClientStatus } from "../../../actions/adminActions";
import DeleteClientButton from "../../../components/DeleteClientButton";
import SearchBar from "../../../components/SearchBar"; 
import { FolderIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default async function AdminClientsPage(props: {
  searchParams: Promise<{ query?: string }>
}) {
  // 1. Sécurité et récupération des paramètres de recherche
  const { query } = await props.searchParams;
  const role = await checkRole();
  if (role !== "admin") redirect("/");

  // 2. Récupération filtrée des clients
  const clients = await prisma.user.findMany({
    where: query ? {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    } : {},
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* HEADER AVEC BARRE DE RECHERCHE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Répertoire Clients
            </h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">
            Gérez les accès et consultez les dossiers individuels ({clients.length} clients).
          </p>
        </div>

        {/* La barre de recherche (Client Component) */}
        <div className="w-full md:w-96">
          <SearchBar placeholder="Rechercher par nom ou email..." />
        </div>
      </div>

      {/* TABLEAU DES CLIENTS */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Statut</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                  <td className="p-6">
                    <div className="font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-700 transition-colors">
                      {client.lastName}, {client.firstName}
                    </div>
                    <div className="text-[10px] font-bold text-blue-400 uppercase mt-1 tracking-widest">
                      Ref: {client.id.slice(-6)}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-sm font-semibold text-slate-700">{client.email}</div>
                    <div className="text-xs text-slate-400 font-medium">{client.phone || "—"}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      <form action={toggleClientStatus.bind(null, client.id, client.isActive)}>
                        <button className={`px-5 py-2 rounded-2xl text-[9px] font-black tracking-widest uppercase transition-all shadow-sm border ${
                          client.isActive 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-200' 
                            : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white hover:shadow-rose-200'
                        }`}>
                          {client.isActive ? '● Actif' : '○ Inactif'}
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/admin/clients/${client.clerkId}`} 
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                      >
                        <FolderIcon className="h-4 w-4" />
                        Dossier
                      </Link>

                      <Link 
                        href={`/admin/clients/edit/${client.id}`} 
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Éditer le profil"
                      >
                        <span className="text-[10px] font-black uppercase">Modifier</span>
                      </Link>
                      
                      <DeleteClientButton 
                        clientId={client.id} 
                        clientName={`${client.firstName} ${client.lastName}`} 
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <div className="text-slate-300 font-black uppercase tracking-[0.2em] text-sm">
                    Aucun client trouvé pour "{query}"
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
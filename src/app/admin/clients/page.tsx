import prisma from "../../../lib/prisma";
import { checkRole } from "../../../lib/role";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toggleClientStatus } from "../../../actions/adminActions";
import DeleteClientButton from "../../../components/DeleteClientButton";
import SearchBar from "../../../components/SearchBar"; 
import Pagination from "../../../components/Pagination";
import { FolderIcon, UserGroupIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default async function AdminClientsPage(props: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  // 1. Sécurité et récupération des paramètres
  const { query, page } = await props.searchParams;
  const role = await checkRole();
  if (role !== "admin") redirect("/");

  // 2. Configuration Pagination
  const ITEMS_PER_PAGE = 8;
  const currentPage = Number(page) || 1;

  // 3. Construction de la requête Prisma
  const whereClause = query ? {
    OR: [
      { firstName: { contains: query, mode: 'insensitive' as const } },
      { lastName: { contains: query, mode: 'insensitive' as const } },
      { email: { contains: query, mode: 'insensitive' as const } },
    ],
  } : {};

  // 4. Récupération des données en parallèle
  const [totalItems, clients] = await Promise.all([
    prisma.user.count({ where: whereClause }),
    prisma.user.findMany({
      where: whereClause,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: { lastName: 'asc' }
    })
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 font-sans antialiased">
      
      {/* HEADER AVEC RECHERCHE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
              <UserGroupIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
              Répertoire Clients
            </h1>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-1">
            Administration des accès • {totalItems} Membre{totalItems > 1 ? 's' : ''}
          </p>
        </div>

        <div className="w-full md:w-[400px]">
          <SearchBar placeholder="Nom, prénom ou email..." />
        </div>
      </div>

      {/* TABLEAU DES CLIENTS */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-8 text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">Identité Client</th>
                <th className="p-8 text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">Coordonnées</th>
                <th className="p-8 text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">État du Compte</th>
                <th className="p-8 text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Gestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id} className="group hover:bg-slate-50/80 transition-colors duration-300">
                    <td className="p-8">
                      <div className="font-black text-slate-900 uppercase tracking-tight text-lg group-hover:text-indigo-600 transition-colors">
                        {client.lastName}, {client.firstName}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="text-s font-black text-slate-900 tracking-wide">{client.email}</div>
                      <div className="text-[12px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{client.phone || "—"}</div>
                    </td>
                    <td className="p-8">
                      <div className="flex justify-center">
                        <form action={toggleClientStatus.bind(null, client.id, client.isActive)}>
                          <button className={`px-6 py-2.5 rounded-xl text-[9px] font-black tracking-[0.15em] uppercase transition-all shadow-sm border-2 ${
                            client.isActive 
                              ? 'bg-white text-emerald-600 border-emerald-50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600' 
                              : 'bg-white text-rose-400 border-rose-50 hover:bg-rose-600 hover:text-white hover:border-rose-600'
                          }`}>
                            {client.isActive ? '● Actif' : '○ Suspendu'}
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/clients/${client.clerkId}`} 
                          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                        >
                          <FolderIcon className="h-4 w-4 stroke-[2.5]" />
                          Dossier
                        </Link>

                        <Link 
                          href={`/admin/clients/edit/${client.id}`} 
                          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Modifier les infos"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
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
                  <td colSpan={4} className="p-32 text-center">
                    <div className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs italic">
                      Aucune donnée correspondant à "{query}"
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center pt-4">
        <Pagination totalPages={totalPages} />
      </div>

    </div>
  );
}
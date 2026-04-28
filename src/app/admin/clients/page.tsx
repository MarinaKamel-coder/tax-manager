import prisma from "../../../lib/prisma";
import { checkRole } from "../../../lib/role";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toggleClientStatus, deleteClient } from "../../../actions/adminActions";
import DeleteClientButton from "../../../components/DeleteClientButton";
import { FolderIcon } from "@heroicons/react/24/outline";

export default async function AdminClientsPage() {
  const role = await checkRole();
  if (role !== "admin") redirect("/");

  const clients = await prisma.user.findMany({
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Répertoire Clients</h1>
        <p className="text-slate-500 font-medium">Gérez les accès et consultez les dossiers individuels.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.map((client) => (
              <tr key={client.id} className="group hover:bg-blue-50/30 transition-colors">
                <td className="p-6">
                  <div className="font-black text-slate-900 uppercase tracking-tight">{client.lastName}, {client.firstName}</div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase mt-1">Ref: {client.id.slice(-6)}</div>
                </td>
                <td className="p-6">
                  <div className="text-sm font-semibold text-slate-700">{client.email}</div>
                  <div className="text-xs text-slate-400 font-medium">{client.phone || "—"}</div>
                </td>
                <td className="p-6">
                  <form action={toggleClientStatus.bind(null, client.id, client.isActive)}>
                    <button className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase transition-all shadow-sm ${
                      client.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white'
                    }`}>
                      {client.isActive ? '● Actif' : '○ Inactif'}
                    </button>
                  </form>
                </td>
                <td className="p-6">
                  <div className="flex items-center justify-end gap-2">
                    
                    {/* CORRECTION ICI : On utilise client.clerkId pour correspondre à la page détails */}
                    <Link 
                      href={`/admin/clients/${client.clerkId}`} 
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all shadow-md"
                    >
                      <FolderIcon className="h-3.5 w-3.5" />
                      Dossier
                    </Link>

                    <Link 
                      href={`/admin/clients/edit/${client.id}`} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <span className="text-[10px] font-black uppercase">Éditer</span>
                    </Link>
                    
                    <DeleteClientButton 
                      clientId={client.id} 
                      clientName={`${client.firstName} ${client.lastName}`} 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
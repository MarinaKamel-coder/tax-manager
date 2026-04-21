import prisma from "../../../lib/prisma";
import { checkRole } from "../../../lib/role";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toggleClientStatus, deleteClient } from "../../../actions/adminActions";
import DeleteClientButton from "../../../components/DeleteClientButton";

export default async function AdminClientsPage() {
  const role = await checkRole();
  if (role !== "admin") redirect("/");

  const clients = await prisma.user.findMany({
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Répertoire des Clients</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Client</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Contact</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Statut</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{client.lastName.toUpperCase()}, {client.firstName}</div>
                  <div className="text-xs text-slate-400">Rôle: {client.role}</div>
                </td>
                <td className="p-4 text-sm">
                  <div>{client.email}</div>
                  <div className="text-slate-500">{client.phone || "—"}</div>
                </td>
                <td className="p-4">
                  <form action={toggleClientStatus.bind(null, client.id, client.isActive)}>
                    <button className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition ${
                      client.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}>
                      {client.isActive ? '● Actif' : '○ Inactif'}
                    </button>
                  </form>
                </td>
                <td className="p-4 text-right space-x-3">
                  <Link href={`/admin/clients/edit/${client.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                    Modifier
                  </Link>
                  <DeleteClientButton 
                      clientId={client.id} 
                      clientName={`${client.firstName} ${client.lastName}`} 
                    />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import prisma from "../../../../../lib/prisma";
import { checkRole } from "../../../../../lib/role";
import { redirect } from "next/navigation";
import { updateClientDetails } from "../../../../../actions/adminActions";

export default async function EditClientPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 2. Attend que les paramètres soient résolus
  const { id } = await params;

  const role = await checkRole();
  if (role !== "admin") redirect("/");

  // 3. Utilise l'id extrait (qui n'est plus undefined)
  const client = await prisma.user.findUnique({
    where: { id: id }
  });

  if (!client) redirect("/admin/clients");

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Modifier le profil client</h1>
        <p className="text-slate-500">Mettez à jour les informations de contact ou le statut du compte.</p>
      </div>
      
      <form action={updateClientDetails.bind(null, client.id)} className="bg-white p-8 shadow-sm rounded-xl border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
            <input 
              name="firstName" 
              aria-label="firstName"
              defaultValue={client.firstName} 
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input 
              name="lastName" 
              aria-label="lastName"
              defaultValue={client.lastName} 
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
          <input 
            name="phone" 
            defaultValue={client.phone || ""} 
            placeholder="(514) 000-0000"
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Courriel</label>
          <input 
            name="email" 
            defaultValue={client.email || ""} 
            placeholder="test@email.com"
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">État du compte</label>
          <select 
            name="isActive" 
            aria-label="status"
            defaultValue={client.isActive ? "true" : "false"} 
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
          >
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </div>

        <div className="pt-6 flex flex-col md:flex-row gap-3">
          <button type="submit" className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-md">
            Sauvegarder les modifications
          </button>
          <a 
            href="/admin/clients" 
            className="px-6 py-3 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 text-center transition"
          >
            Annuler
          </a>
        </div>
      </form>
    </div>
  );
}
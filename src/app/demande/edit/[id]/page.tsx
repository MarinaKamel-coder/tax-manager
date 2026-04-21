import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";
import { updateTaxRequest } from "../../../../actions/taxActions";
import Link from "next/link";

export default async function EditDemandePage(props: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ error?: string, year?: string }> 
}) {
  const { id } = await props.params;
  const sParams = await props.searchParams;

  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  // 1. Récupérer la demande existante
  const submission = await prisma.taxSubmission.findUnique({
    where: { id },
  });

  // 2. Vérifications de sécurité
  if (!submission) redirect("/tableau-de-bord");
  
  // Seul le propriétaire peut modifier
  if (submission.userId !== userId) redirect("/tableau-de-bord");
  
  // On ne peut modifier que si c'est en attente
  if (submission.status !== "En attente") redirect("/tableau-de-bord");

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-blue-900 text-white py-12 px-6 text-center">
        <h1 className="text-3xl font-bold">Modifier ma demande</h1>
        <p className="mt-2 text-blue-100">
          Année {submission.taxYear}
        </p>
      </div>
      {sParams.error === "duplicate" && (
        <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded-r-lg shadow-sm">
          <p className="font-bold">Erreur de modification</p>
          <p className="text-sm">
            Vous avez déjà une demande pour l'année **{sParams.year}**. 
            Chaque année fiscale ne peut avoir qu'un seul dossier.
          </p>
        </div>
      )}
      <div className="max-w-4xl mx-auto -mt-8 px-4">
        <form action={updateTaxRequest.bind(null, submission.id)} className="bg-white shadow-xl rounded-xl p-8 border border-slate-200">
          
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Informations de contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 mb-6 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prenom *</label>
                <input 
                  type="text" 
                  aria-label="firstName"
                  name="firstName" 
                  defaultValue={submission.firstName} 
                  required
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
                <input 
                  name="LastName" 
                  type="text" 
                  aria-label="LastName"
                  defaultValue={submission.lastName}
                  required 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone *</label>
                <input 
                  name="phone" 
                  placeholder="xxx.xxx.xxxx"
                  type="tel" 
                  defaultValue={submission.phone}
                  required 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Courriel de suivi *</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="votre@email.com"
                  defaultValue={submission.email || user.emailAddresses[0].emailAddress}
                  required 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Détails de la déclaration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Année fiscale *</label>
                <select name="taxYear" aria-label="taxyear" defaultValue={submission.taxYear} required className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type de service *</label>
                <select name="serviceType" aria-label="serviceType"  defaultValue={submission.serviceType} required className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                  <option value="particulier">Particulier</option>
                  <option value="travailleur_autonome">Particulier + Travailleur autonome</option>
                  <option value="entreprise">Entreprise / Inc</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="hasSpouse" 
                  defaultChecked={submission.hasSpouse}
                  className="w-5 h-5 accent-blue-700" 
                />
                <span className="text-slate-700">J'ai un conjoint</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="hasDependents" 
                  defaultChecked={submission.hasDependents}
                  className="w-5 h-5 accent-blue-700" 
                />
                <span className="text-slate-700">J'ai des personnes à charge</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Notes ou instructions</h2>
            <textarea 
              name="notes" 
              defaultValue={submission.notes || ""}
              rows={4} 
              aria-label="notes" 
              className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow transition">
              Enregistrer les modifications
            </button>
            <Link 
              href="/tableau-de-bord" 
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-lg text-center transition"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
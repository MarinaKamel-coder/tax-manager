import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { submitTaxRequest } from "../../actions/taxActions"; 

export default async function DemandePage(props: { 
  searchParams: Promise<{ error?: string, year?: string }> 
}) {

  const params = await props.searchParams;
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-900 text-white py-12 px-6 text-center">
        <h1 className="text-3xl font-bold">Demande de déclaration fiscale</h1>
        <p className="mt-2 text-blue-100 max-w-xl mx-auto">
          Remplissez le formulaire ci-dessous et nous vous contacterons rapidement.
        </p>
      </div>

      <div className="max-w-4xl mx-auto -mt-8 px-4 pb-20">
        {params.error === "duplicate" && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <p className="font-bold text-amber-900">Demande déjà existante</p>
            <p className="text-sm">
              Vous avez déjà soumis un dossier pour l'année **{params.year}**. 
              Vous pouvez consulter son avancement dans votre tableau de bord.
            </p>
          </div>
        )}
        <form action={submitTaxRequest} className="bg-white shadow-xl rounded-xl p-8 border border-slate-200">
          
          {/* Champ caché pour envoyer l'email à l'action sans que l'user puisse le changer */}
          <input type="hidden" name="emailHidden" value={user?.emailAddresses[0].emailAddress} />

          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prénom *</label>
                <input 
                  type="text" 
                  aria-label="firstName"
                  name="firstName" 
                  defaultValue={user?.firstName || ""} 
                  required
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
                <input 
                  type="text" 
                  aria-label="lastName"
                  name="lastName" 
                  defaultValue={user?.lastName || ""} 
                  required
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Courriel *</label>
                <input 
                  type="email" 
                  name="email"
                  aria-label="email"
                  defaultValue={user?.emailAddresses[0].emailAddress || ""} 
                  required
                  placeholder="votre@email.com"
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone *</label>
                <input 
                  name="phone" 
                  type="tel" 
                  placeholder="(514) 555-0123" 
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
                <select name="taxYear" aria-label="taxYear" required className="w-full p-3 border border-slate-300 rounded-lg text-slate-900">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type de service *</label>
                <select name="serviceType" aria-label="serviceType" required className="w-full p-3 border border-slate-300 rounded-lg text-slate-900">
                  <option value="particulier">Particulier</option>
                  <option value="travailleur_autonome">Particulier + Travailleur autonome</option>
                  <option value="entreprise">Entreprise / Inc</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="hasSpouse" className="w-5 h-5 accent-blue-700" />
                <span className="text-slate-700">J'ai un conjoint</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="hasDependents" className="w-5 h-5 accent-blue-700" />
                <span className="text-slate-700">J'ai des personnes à charge</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Informations supplémentaires (optionnel)</h2>
            <textarea 
              name="notes" 
              aria-label="notes"
              rows={4} 
              className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-lg shadow-lg transition duration-200">
            Soumettre la demande
          </button>
        </form>
      </div>
    </div>
  );
}
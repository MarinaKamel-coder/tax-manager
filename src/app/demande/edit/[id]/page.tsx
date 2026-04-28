import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";
import { updateTaxRequest } from "../../../../actions/taxActions";
import Link from "next/link";
import { 
  UserIcon, 
  ClipboardDocumentCheckIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon 
} from "@heroicons/react/24/outline";

export default async function EditDemandePage(props: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ error?: string, year?: string }> 
}) {
  const { id } = await props.params;
  const sParams = await props.searchParams;

  const { userId, sessionClaims } = await auth();
  const user = await currentUser();
  const role = sessionClaims?.metadata?.role;

  if (!userId || !user) redirect("/sign-in");

  // 1. Récupérer la demande existante
  const submission = await prisma.taxSubmission.findUnique({
    where: { id },
  });

  // 2. Vérifications de sécurité
  if (!submission) redirect("/tableau-de-bord");
  
  if (submission.userId !== userId && role !== "admin") {
    redirect("/tableau-de-bord");
  }
  
  const isModifiable = submission.status === "En attente" || submission.status === "Acceptée";
  if (role !== "admin" && !isModifiable) {
    redirect("/tableau-de-bord?error=locked");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* HEADER STYLE MODERNE */}
      <div className="bg-slate-900 text-white py-20 px-6 text-center shadow-2xl">
        <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-5xl">
          Modifier mon dossier
        </h1>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
          Identifiant Unique : #{submission.id.slice(-8)}
        </p>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 px-4">
        {sParams.error === "duplicate" && (
          <div className="mb-8 p-6 bg-amber-50 border-l-8 border-amber-500 text-amber-900 rounded-2xl shadow-lg animate-bounce">
            <p className="font-black uppercase text-xs tracking-widest">Attention</p>
            <p className="text-sm font-medium">Vous possédez déjà un dossier pour l'année {sParams.year}.</p>
          </div>
        )}

        <form 
          action={updateTaxRequest.bind(null, submission.id)} 
          className="bg-white shadow-2xl rounded-[3rem] p-8 md:p-12 border border-slate-100"
        >
          {/* SECTION 1 : CONTACT */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <UserIcon className="h-5 w-5 text-indigo-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">1. Informations de contact</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1 tracking-widest">Prénom</label>
                <input 
                  type="text" name="firstName" defaultValue={submission.firstName} aria-label="firstName" required
                  className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1 tracking-widest">Nom</label>
                <input 
                  type="text" name="LastName" defaultValue={submission.lastName} aria-label="lastName" required
                  className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1 tracking-widest">Téléphone</label>
                <input 
                  type="tel" name="phone" defaultValue={submission.phone} aria-label="phone" required
                  className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1 tracking-widest">Courriel</label>
                <input 
                  type="email" name="email" defaultValue={submission.email || ""} aria-label="email" required
                  className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 transition-all" 
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 : FISCALITÉ */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">2. Détails fiscaux</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1 tracking-widest">Année fiscale</label>
                <select name="taxYear" defaultValue={submission.taxYear} aria-label="taxYear" className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-all">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1 tracking-widest">Type de service</label>
                <select name="serviceType" defaultValue={submission.serviceType} aria-label="serviceType" className="w-full p-5 bg-slate-50 border-none rounded-[1.5rem] font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-all">
                  <option value="particulier">Particulier</option>
                  <option value="travailleur_autonome">Particulier + Autonome</option>
                  <option value="entreprise">Entreprise / INC</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3 : SITUATION FAMILIALE */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <UsersIcon className="h-5 w-5 text-indigo-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">3. Situation familiale</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center p-6 bg-slate-50 rounded-[2rem] cursor-pointer hover:bg-slate-100 transition-all group border-2 border-transparent hover:border-indigo-100">
                <input 
                  type="checkbox" name="hasSpouse" defaultChecked={submission.hasSpouse}
                  className="h-6 w-6 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-600">J'ai un conjoint</span>
              </label>
              <label className="flex items-center p-6 bg-slate-50 rounded-[2rem] cursor-pointer hover:bg-slate-100 transition-all group border-2 border-transparent hover:border-indigo-100">
                <input 
                  type="checkbox" name="hasDependents" defaultChecked={submission.hasDependents}
                  className="h-6 w-6 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                />
                <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-600">Personnes à charge</span>
              </label>
            </div>
          </div>

          {/* SECTION 4 : NOTES */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">4. Notes & Instructions</h2>
            </div>
            <textarea 
              name="notes" defaultValue={submission.notes || ""} rows={4}
              placeholder="Précisez tout changement ou information pertinente ici..."
              className="w-full p-6 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
            ></textarea>
          </div>

          {/* ACTIONS BONTIONS */}
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              type="submit" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[11px] tracking-[0.2em] py-6 rounded-[2rem] shadow-2xl shadow-indigo-200 transition-all active:scale-95"
            >
              Mettre à jour le dossier
            </button>
            <Link 
              href="/tableau-de-bord" 
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black uppercase text-[11px] tracking-[0.2em] py-6 rounded-[2rem] text-center transition-all"
            >
              Retour
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
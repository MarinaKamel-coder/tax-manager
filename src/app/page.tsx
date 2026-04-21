import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { 
  ClipboardDocumentCheckIcon, 
  UserGroupIcon, 
  MegaphoneIcon, 
  ArrowRightIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";

export default async function HomePage() {
  const { userId, sessionClaims } = await auth();
  const user = await currentUser();
  const role = sessionClaims?.metadata?.role || "client";

  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-slate-950 pt-32 pb-24 px-6 overflow-hidden">
        {/* Effets de lumière en arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-sm font-medium mb-8 backdrop-blur-md">
            <SparklesIcon className="h-4 w-4" />
            <span>Saison d'impôts 2026 maintenant ouverte</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            La comptabilité,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">
              réinventée pour vous.
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Une plateforme intuitive pour gérer vos déclarations fiscales. Simple, sécurisée et conçue pour les particuliers et entrepreneurs de la Rive-Sud.
          </p>

          {!userId ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
              <Link href="/sign-up" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1">
                Commencer gratuitement
              </Link>
              <Link href="/sign-in" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black hover:bg-white/10 transition backdrop-blur-md">
                Se connecter
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl inline-flex items-center shadow-2xl">
                <div className="flex flex-col items-center text-center">
                  <p className="text-blue-400 text-xs uppercase tracking-[0.3em] font-black mb-2">
                    Bienvenue
                  </p>
                  <p className="text-white font-black text-3xl tracking-tighter">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- QUICK ACTIONS --- */}
      <section className="relative -mt-16 max-w-7xl mx-auto py-26 px-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Action 1 */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 hover:border-blue-500 transition-all group">
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
              {role === "admin" ? "Console Admin" : "Soumettre un dossier"}
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              {role === "admin" 
                ? "Gérez les déclarations entrantes et organisez votre flux de travail."
                : "Remplissez votre formulaire en quelques clics et déposez vos documents."}
            </p>
            <Link 
              href={role === "admin" ? "/tableau-de-bord" : "/demande"} 
              className="inline-flex items-center gap-2 text-blue-600 font-black group-hover:gap-4 transition-all"
            >
              Accéder <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          {/* Action 2 */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 hover:border-indigo-500 transition-all group">
            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors">
              <MegaphoneIcon className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Annonces</h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              Restez informé des changements législatifs et des dates limites fiscales importantes.
            </p>
            <Link href="/annonces" className="inline-flex items-center gap-2 text-indigo-600 font-black group-hover:gap-4 transition-all">
              Voir l'actualité <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          {/* Action 3 */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 hover:border-emerald-500 transition-all group">
            <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-colors">
              <UserGroupIcon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
              {role === "admin" ? "Mes Clients" : "État du dossier"}
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              {role === "admin"
                ? "Accédez aux fiches détaillées et à l'historique complet de vos clients."
                : "Suivez l'avancement de votre déclaration en temps réel."}
            </p>
            <Link 
              href={role === "admin" ? "/admin/clients" : "/tableau-de-bord"} 
              className="inline-flex items-center gap-2 text-emerald-600 font-black group-hover:gap-4 transition-all"
            >
              {role === "admin" ? "Gérer les clients" : "Voir mon suivi"} <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION PORTRAIT & CARTE FADY MIKHAIL --- */}
      <section className="py-24 bg-white overflow-hidden border-t border-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Côté Portrait Visuel (CORRIGÉ POUR UTILISER fady.jpeg) */}
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5]">
                  
                  {/* UTILISATION DE VOTRE PHOTO fady.jpeg */}
                  <img 
                    src="/fady.jpeg" 
                    alt="Fady Mikhail - Expert Comptable Rive-Sud"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay d'information sur l'image */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-10 pt-20">
                    <h4 className="text-white text-3xl font-black tracking-tight">Fady Mikhail</h4>
                    <p className="text-blue-400 font-bold tracking-[0.2em] uppercase text-sm mt-1">Expert en Fiscalité</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Côté Argumentaire (Reste le même) */}
            <div className="space-y-8">
              <h2 className="text-blue-600 font-black text-sm uppercase tracking-[0.4em] flex items-center gap-4">
                <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                Votre Expert Local
              </h2>
              <h3 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                Une expertise rigoureuse,<br />un service humain.
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed">
                Basé à <strong>Longueuil</strong>, Fady Mikhail propose un accompagnement personnalisé pour simplifier vos obligations fiscales. Que vous soyez salarié ou travailleur autonome, bénéficiez d'une précision exemplaire.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-3xl font-black text-blue-600 tracking-tighter">15+</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Ans d'expérience</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-3xl font-black text-blue-600 tracking-tighter">100%</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Confidentialité</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/demande" className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-blue-600 transition-all shadow-2xl hover:-translate-y-1">
                  Soummis une Demande
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BADGES --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center group">
            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Sécurité Totale</h4>
            <p className="text-sm text-slate-500 mt-2">Chiffrement SSL et protection des documents</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckBadgeIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Conformité</h4>
            <p className="text-sm text-slate-500 mt-2">Respect strict des normes ARC et Revenu Québec</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <SparklesIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Rive-Sud</h4>
            <p className="text-sm text-slate-500 mt-2">Votre comptable de proximité à Longueuil</p>
          </div>
        </div>
      </section>
    </div>
  );
}
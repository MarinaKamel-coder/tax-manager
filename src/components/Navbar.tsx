import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { checkRole } from "../lib/role";

import { 
  HomeIcon, 
  MegaphoneIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon 
} from "@heroicons/react/24/outline";

export default async function Navbar() {
  const { userId } = await auth();
  const role = await checkRole();

  if (!userId) return null; // Ne pas afficher la navbar si non connecté

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo / Nom */}
            <div className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                FM
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 leading-none tracking-tighter">
                  FADY <span className="text-blue-600">MIKHAIL</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">
                  Expertise Comptable
                </span>
              </div>
            </div>

            {/* Liens de navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" icon={<HomeIcon className="h-5 w-5" />} label="Accueil" />
              <NavLink href="/annonces" icon={<MegaphoneIcon className="h-5 w-5" />} label="Annonces" />
              <NavLink href="/tableau-de-bord" icon={<ClipboardDocumentListIcon className="h-5 w-5" />} label="Demandes" />
              
              {role === "admin" && (
                <NavLink href="/admin/clients" icon={<UsersIcon className="h-5 w-5" />} label="Clients" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {role === "admin" && (
              <span className="hidden sm:inline-block bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Mode Administrateur
              </span>
            )}
            <UserButton />
          </div>
        </div>
      </div>

      {/* Navigation Mobile (bas de l'écran ou menu hamburger si tu préfères) */}
      <div className="md:hidden flex justify-around border-t p-2 bg-white">
          <Link href="/" className="p-2 text-slate-500"><HomeIcon className="h-6 w-6" /></Link>
          <Link href="/annonces" className="p-2 text-slate-500"><MegaphoneIcon className="h-6 w-6" /></Link>
          <Link href="/tableau-de-bord" className="p-2 text-slate-500"><ClipboardDocumentListIcon className="h-6 w-6" /></Link>
          {role === "admin" && (
            <Link href="/admin/clients" className="p-2 text-slate-500"><UsersIcon className="h-6 w-6" /></Link>
          )}
      </div>
    </nav>
  );
}

// Petit sous-composant pour les liens pour éviter la répétition
function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition"
    >
      {icon}
      {label}
    </Link>
  );
}
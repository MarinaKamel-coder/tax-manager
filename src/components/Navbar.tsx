import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { checkRole } from "../lib/role";

import { 
  HomeIcon, 
  MegaphoneIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon,
  BookOpenIcon // Nouvelle icône pour les ressources
} from "@heroicons/react/24/outline";

export default async function Navbar() {
  const { userId } = await auth();
  const role = await checkRole();

  if (!userId) return null;

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

            {/* Liens de navigation Desktop */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" icon={<HomeIcon className="h-5 w-5" />} label="Accueil" />
              <NavLink href="/tableau-de-bord" icon={<ClipboardDocumentListIcon className="h-5 w-5" />} label="Demandes" />
              
              
              <NavLink 
                href={role === "admin" ? "/admin/ressources" : "/documents"} 
                icon={<BookOpenIcon className="h-5 w-5" />} 
                label="Documents" 
              />

              <NavLink href="/annonces" icon={<MegaphoneIcon className="h-5 w-5" />} label="Annonces" />
              
              {role === "admin" && (
                <NavLink href="/admin/clients" icon={<UsersIcon className="h-5 w-5" />} label="Clients" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {role === "admin" && (
              <span className="hidden sm:inline-block bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-red-200">
                Admin
              </span>
            )}
            <UserButton/>
          </div>
        </div>
      </div>

      {/* Navigation Mobile */}
      <div className="md:hidden flex justify-around border-t py-3 bg-slate-50">
          <MobileIconLink href="/" icon={<HomeIcon className="h-6 w-6" />} />
          <MobileIconLink href="/tableau-de-bord" icon={<ClipboardDocumentListIcon className="h-6 w-6" />} />
          <MobileIconLink 
            href={role === "admin" ? "/admin/ressources" : "/tableau-de-bord"} 
            icon={<BookOpenIcon className="h-6 w-6" />} 
          />
          {role === "admin" && (
            <MobileIconLink href="/admin/clients" icon={<UsersIcon className="h-6 w-6" />} />
          )}
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileIconLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <Link href={href} className="p-2 text-slate-500 hover:text-blue-600 active:scale-95 transition-transform">
      {icon}
    </Link>
  );
}
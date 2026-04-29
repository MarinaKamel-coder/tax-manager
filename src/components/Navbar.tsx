import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { checkRole } from "../lib/role";
import prisma from "../lib/prisma";
import UnreadBadge from "./UnreadBadge";

import { 
  HomeIcon, 
  MegaphoneIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon 
} from "@heroicons/react/24/outline";

export default async function Navbar() {
  const { userId } = await auth();
  const role = await checkRole();

  if (!userId) return null;

  // --- LOGIQUE DES NOTIFICATIONS (NON LUS) ---
  const unreadCount = await prisma.message.count({
    where: {
      // Si admin, on voit tous les messages reçus. Si client, seulement les siens.
      userId: role === "admin" ? undefined : userId,
      isRead: false,
      senderId: { not: userId }, // Ne pas compter ses propres messages
    },
  });

  // --- LOGIQUE DE NAVIGATION ---
  const chatHref = role === "admin" ? "/admin/messages" : "/tableau-de-bord/chat";
  const docHref = role === "admin" ? "/admin/ressources" : "/documents";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
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
            </Link>

            {/* Liens Desktop */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" icon={<HomeIcon className="h-5 w-5" />} label="Accueil" />
              <NavLink href="/tableau-de-bord" icon={<ClipboardDocumentListIcon className="h-5 w-5" />} label="Demandes" />
              <NavLink href={docHref} icon={<BookOpenIcon className="h-5 w-5" />} label="Documents" />
              <NavLink href="/annonces" icon={<MegaphoneIcon className="h-5 w-5" />} label="Annonces" />

              {role === "admin" && (
                <NavLink href="/admin/clients" icon={<UsersIcon className="h-5 w-5" />} label="Clients" />
              )}

              {/* LIEN MESSAGES AVEC BADGE */}
              <NavLink 
                href={chatHref} 
                label="Messages" 
                icon={
                  <div className="relative">
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <UnreadBadge 
                      initialCount={unreadCount} 
                      userId={userId} 
                      role={role} 
                    />
                  </div>
                }
              />
              

            </div>
          </div>

          {/* Droite */}
          <div className="flex items-center gap-4">
            {role === "admin" && (
              <span className="hidden sm:inline-block bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-800 shadow-sm">
                Console Admin
              </span>
            )}
            <div className="pl-2 border-l border-slate-100">
              <UserButton/>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION MOBILE */}
      <div className="md:hidden flex justify-around border-t border-slate-100 py-3 bg-white/90 backdrop-blur-md">
          <MobileIconLink href="/" icon={<HomeIcon className="h-6 w-6" />} />
          <MobileIconLink href="/tableau-de-bord" icon={<ClipboardDocumentListIcon className="h-6 w-6" />} />
          
          {/* Badge Mobile */}
          <Link href={chatHref} className="p-3 text-slate-400 relative">
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <MobileIconLink href={docHref} icon={<BookOpenIcon className="h-6 w-6" />} />
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
      className="group flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl transition-all duration-200"
    >
      <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
        {icon}
      </span>
      {label}
    </Link>
  );
}

function MobileIconLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <Link href={href} className="p-3 text-slate-400 hover:text-blue-600 active:scale-90 transition-all rounded-2xl">
      {icon}
    </Link>
  );
}
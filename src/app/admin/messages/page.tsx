import prisma from "../../../lib/prisma";
import { checkRole } from "../../../lib/role";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  MagnifyingGlassIcon, 
  InboxIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; filter?: string }>;
}) {
  const role = await checkRole();
  if (role !== "admin") redirect("/");

  const { q, page, filter } = await searchParams;

  // --- CONFIGURATION DE LA PAGINATION ---
  const ITEMS_PER_PAGE = 8;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // --- CALCUL DES MESSAGES NON LUS POUR LE BADGE DE L'ONGLET ---
  const totalUnreadCount = await prisma.message.count({
    where: {
      isRead: false,
      // On exclut les messages envoyés par l'admin lui-même (userId != senderId pour les clients)
    },
  });

  // --- CONSTRUCTION DE LA REQUÊTE ---
  const whereCondition: any = {
    messages: { some: {} },
  };

  if (filter === "unread") {
    whereCondition.messages = {
      some: { isRead: false }
    };
  }

  if (q) {
    whereCondition.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
    ];
  }

  // --- RÉCUPÉRATION DES DONNÉES (PARALLELISÉE) ---
  const [totalUsersMatching, users] = await Promise.all([
    prisma.user.count({ where: whereCondition }),
    prisma.user.findMany({
      where: whereCondition,
      take: ITEMS_PER_PAGE,
      skip: skip,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        // Optionnel: On pourrait trier par la date du dernier message
        createdAt: 'desc',
      },
    })
  ]);

  const totalPages = Math.ceil(totalUsersMatching / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans antialiased text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* EN-TÊTE & RECHERCHE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                    <InboxIcon className="h-6 w-6 stroke-[2]" />
                </div>
                <h1 className="text-4xl font-black tracking-tightest text-slate-900 uppercase italic">
                  Inbox
                </h1>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] ml-1">
              {totalUsersMatching} conversation{totalUsersMatching > 1 ? 's' : ''} trouvée{totalUsersMatching > 1 ? 's' : ''}
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <form>
              <input 
                name="q"
                defaultValue={q}
                placeholder="Rechercher un client..." 
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-semibold placeholder:text-slate-300 placeholder:font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none shadow-sm transition-all"
              />
            </form>
          </div>
        </div>

        {/* ONGLETS DE FILTRAGE AVEC BADGE DYNAMIQUE */}
        <div className="flex gap-3 mb-10">
          <Link 
            href="/admin/messages"
            className={`px-7 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${
              !filter 
              ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
              : "bg-white text-slate-400 border border-slate-100 hover:text-slate-600"
            }`}
          >
            Toutes
          </Link>
          <Link 
            href="/admin/messages?filter=unread"
            className={`flex items-center gap-3 px-7 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${
              filter === "unread" 
              ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
              : "bg-white text-slate-400 border border-slate-100 hover:text-slate-600"
            }`}
          >
            <span>Non lues</span>
            {totalUnreadCount > 0 && (
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-colors ${
                filter === "unread" ? "bg-white text-blue-600" : "bg-blue-600 text-white"
              }`}>
                {totalUnreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* LISTE DES CONVERSATIONS */}
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => {
              const lastMsg = user.messages[0];
              const isUnread = lastMsg?.isRead === false;

              return (
                <Link 
                  key={user.id} 
                  href={`/admin/clients/${user.clerkId}`}
                  className={`group flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-500 ${
                    isUnread 
                    ? "bg-white border-blue-100 shadow-xl shadow-blue-50/50" 
                    : "bg-white/40 border-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner ${
                            isUnread ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-200" : "bg-slate-800"
                        }`}>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        {isUnread && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 border-[3px] border-white rounded-full animate-pulse"></span>
                        )}
                    </div>

                    <div className="max-w-[200px] md:max-w-sm">
                      <h3 className={`text-sm uppercase tracking-tight mb-0.5 ${isUnread ? "font-black text-slate-900" : "font-bold text-slate-700"}`}>
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className={`text-[13px] truncate leading-relaxed ${isUnread ? "font-bold text-blue-600" : "font-medium text-slate-400"}`}>
                        {lastMsg?.text || "Aucun message"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="hidden sm:block text-[10px] font-black text-slate-200 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : ""}
                    </span>
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isUnread ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-[-45deg]"
                    }`}>
                      <ChevronRightIcon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-100 shadow-inner">
              <ChatBubbleLeftRightIcon className="h-16 w-16 text-slate-100 mx-auto mb-6" />
              <p className="text-slate-300 font-black uppercase text-xs tracking-[0.3em]">Aucun message trouvé</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-5 mt-16">
            <Link 
              href={`/admin/messages?page=${currentPage - 1}${q ? `&q=${q}` : ""}${filter ? `&filter=${filter}` : ""}`}
              className={`p-4 rounded-2xl border transition-all ${
                currentPage <= 1 ? "opacity-10 pointer-events-none" : "bg-white hover:bg-slate-900 hover:text-white shadow-sm"
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5 stroke-[2]" />
            </Link>

            <div className="bg-white px-8 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <span className="text-xs font-black text-slate-900">{currentPage}</span>
                <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">sur</span>
                <span className="text-xs font-black text-slate-400">{totalPages}</span>
            </div>

            <Link 
              href={`/admin/messages?page=${currentPage + 1}${q ? `&q=${q}` : ""}${filter ? `&filter=${filter}` : ""}`}
              className={`p-4 rounded-2xl border transition-all ${
                currentPage >= totalPages ? "opacity-10 pointer-events-none" : "bg-white hover:bg-slate-900 hover:text-white shadow-sm"
              }`}
            >
              <ChevronRightIcon className="h-5 w-5 stroke-[2]" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
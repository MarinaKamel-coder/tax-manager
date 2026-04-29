import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import ChatBox from "../../../components/ChatBox";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default async function ClientChatPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 1. Récupérer l'historique des messages pour ce client
  const messages = await prisma.message.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation retour */}
        <Link 
          href="/tableau-de-bord" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Retour au tableau de bord
        </Link>

        {/* En-tête de la discussion */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Support Fiscal</h1>
            <p className="text-slate-500 font-medium text-sm">Posez vos questions à votre expert en direct.</p>
          </div>
        </div>

        {/* Le composant de Chat */}
        <ChatBox 
          clientId={userId} 
          currentUserId={userId} 
          initialMessages={JSON.parse(JSON.stringify(messages))} 
        />
        
        <p className="text-center text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">
          Vos échanges sont sécurisés et confidentiels
        </p>
      </div>
    </div>
  );
}
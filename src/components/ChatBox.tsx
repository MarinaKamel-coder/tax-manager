"use client";

import { useState, useEffect, useRef } from "react";
import { getPusherClient } from "../lib/pusher";
import { sendMessage, markMessagesAsRead, deleteChat } from "../actions/chatActions";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: Date | string;
}

interface ChatBoxProps {
  clientId: string;      
  currentUserId: string; 
  initialMessages: Message[];
  submissionId?: string;
  isAdmin?: boolean; // Ajout d'une prop pour conditionner l'affichage du bouton supprimer
}

export default function ChatBox({ clientId, currentUserId, initialMessages, submissionId, isAdmin }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 1. SCROLL : Défilement interne uniquement
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 2. MARQUER COMME LU + SIGNAL NAVBAR
  useEffect(() => {
    const clearUnread = async () => {
    try {
        await markMessagesAsRead(clientId); 
        window.dispatchEvent(new Event("messages-read")); 
    } catch (err) {
        console.error(err);
    }
    };
    
    if (messages.length > 0) {
        clearUnread();
    }
  }, [clientId, messages]);

  // 3. PUSHER : Temps réel
  useEffect(() => {
    const client = getPusherClient();
    if (!client) return;

    const channel = client.subscribe(`chat-${clientId}`);

    channel.bind("new-message", (newMessage: Message) => {
      setMessages((prev) => {
        if (prev.find(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      client.unsubscribe(`chat-${clientId}`);
    };
  }, [clientId]);

  // 4. SUPPRESSION DU CHAT
  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer toute la conversation ?")) return;

    const result = await deleteChat(clientId);
    if (result.success) {
      setMessages([]);
    } else {
      alert("Erreur lors de la suppression.");
    }
  };

  // 5. ENVOI DE MESSAGE
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await sendMessage({
        text: input,
        clientId: clientId,
        submissionId: submissionId || null
      });

      if (result?.success) {
        setInput("");
      }
    } catch (error) {
      console.error("Erreur envoi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
      {/* HEADER */}
      <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
        <div>
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Canal sécurisé</h3>
          <p className="text-sm font-bold tracking-tight">Support Direct</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button 
              type="button"
              title="deleteButton"
              onClick={handleDelete}
              className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* ZONE DES MESSAGES */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FBFDFF] scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
            <p className="text-xs font-bold uppercase tracking-widest">Aucun message</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm font-semibold shadow-sm ${
                isMe 
                  ? "bg-blue-600 text-white rounded-br-none shadow-blue-100" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-slate-100"
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT SECTION */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez ici..."
          disabled={isLoading}
          className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
        <button
          type="submit"
          title="loadButton"
          disabled={isLoading || !input.trim()}
          className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all disabled:bg-slate-100 disabled:text-slate-300 shadow-lg shadow-slate-200"
        >
          <PaperAirplaneIcon className={`h-5 w-5 ${isLoading ? "animate-pulse" : ""}`} />
        </button>
      </form>
    </div>
  );
}
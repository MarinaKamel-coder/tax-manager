"use client";

import { useEffect, useState, useCallback } from "react";
import { getPusherClient } from "../lib/pusher";

export default function UnreadBadge({ initialCount, userId, role }: any) {
  const [count, setCount] = useState(initialCount);

  // Fonction pour récupérer le vrai chiffre depuis l'API
  const refreshCount = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/unread-count");
      const data = await res.json();
      setCount(data.count);
    } catch (err) {
      console.error("Erreur refresh badge:", err);
    }
  }, []);

  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = role === "admin" ? "admin-notifications" : `chat-${userId}`;
    const channel = pusher.subscribe(channelName);

    // Quand un nouveau message arrive -> Refresh
    channel.bind("new-message", () => {
      refreshCount();
    });

    // Quand on reçoit le signal "lu" depuis ChatBox.tsx -> Refresh
    const handleRead = () => {
      refreshCount();
    };

    window.addEventListener("messages-read", handleRead);

    return () => {
      pusher.unsubscribe(channelName);
      window.removeEventListener("messages-read", handleRead);
    };
  }, [userId, role, refreshCount]);

  if (count <= 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
      {count}
    </span>
  );
}
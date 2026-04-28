"use client";

import { useState, useEffect } from "react";
import { DocumentIcon, TrashIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { deleteDocument } from "../actions/documentActions";

interface DocumentListProps {
  documents: any[];
  isAdmin: boolean;
}

export default function DocumentList({ documents, isAdmin }: DocumentListProps) {
  // 1. On ajoute un état pour vérifier si le composant est monté côté client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce document ?")) {
      await deleteDocument(id);
    }
  };

  return (
    <div className="grid gap-4 mt-6">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center gap-3">
            <DocumentIcon className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{doc.name}</p>
              {/* 2. On affiche la date uniquement après le montage. 
                Pendant le rendu serveur (SSR), on affiche une chaîne vide ou un placeholder.
              */}
              <p className="text-xs text-slate-500">
                {isMounted ? new Date(doc.createdAt).toLocaleDateString() : ""}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <a href={doc.url} title="link" target="_blank" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600">
              <ArrowDownTrayIcon className="w-5 h-5" />
            </a>
            {isAdmin && (
              <button 
                type="button" // Changé 'submit' en 'button' pour éviter des comportements de formulaire imprévus
                title="deleteButton" 
                onClick={() => handleDelete(doc.id)} 
                className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
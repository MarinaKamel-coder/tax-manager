"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { createAnnouncement, deleteAnnouncement } from "../../../actions/announcementActions";
import { TrashIcon, MegaphoneIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import ImageUploader from "../../../components/ImageUploader"; 

export default function AdminAnnoncesPage({ annonces }: { annonces: any[] }) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
  setIsMounted(true);
}, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Titre de la page */}
        <div className="flex items-center gap-3 mb-8">
          <MegaphoneIcon className="h-8 w-8 text-blue-700" />
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Annonces</h1>
        </div>

        {/* Formulaire de création */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <PlusIcon className="h-5 w-5 text-blue-600" />
            Publier une nouvelle annonce
          </h2>
          
          <form 
            action={async (formData) => {
              await createAnnouncement(formData);
              setImageUrl(""); 
            }} 
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Titre</label>
                  <input 
                    name="title" 
                    placeholder="Ex: Date limite des impôts 2025" 
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Niveau d'importance</label>
                  <select name="priority" aria-label="priority" className="w-full p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-600 outline-none transition">
                    <option value="info">Information (Bleu)</option>
                    <option value="normal">Normal (Gris)</option>
                    <option value="urgent">Urgent / Prioritaire (Rouge) 🚨</option>
                  </select>
                </div>
              </div>

              {/* Upload d'image depuis l'ordinateur */}
              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                <ImageUploader onUploadComplete={(url) => setImageUrl(url)} />
                {/* Champ caché pour envoyer l'URL à l'action Server */}
                <input type="hidden" name="imageUrl" value={imageUrl} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contenu du message</label>
              <textarea 
                name="content"  
                rows={4} 
                placeholder="Détails de l'annonce..." 
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              {/* Bouton Annuler qui vide les champs ou ferme le formulaire */}
              <button
                type="button"
                onClick={() => {
                  window.location.reload(); 
                }}
                className="px-6 py-2 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition duration-200 text-sm"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={!imageUrl} 
                className={`w-full md:w-auto font-bold py-3 px-8 rounded-xl transition shadow-lg ${
                  !imageUrl ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-100'
                }`}
              >
                Publier maintenant
              </button>
            </div>
          </form>
        </section>

        {/* Liste des annonces */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Annonces publiées</h2>
          {annonces.map((a) => (
            <div key={a.id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-5 items-center group hover:border-blue-200 transition">
              
              {a.imageUrl ? (
                <div className="w-full md:w-32 h-24 flex-shrink-0">
                  <img 
                    src={a.imageUrl} 
                    alt={a.title} 
                    className="w-full h-full object-cover rounded-lg border border-slate-100"
                  />
                </div>
              ) : (
                <div className="w-full md:w-32 h-24 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                  Pas d'image
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                    a.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {a.priority}
                  </span>
                  <h3 className="font-bold text-slate-800">{a.title}</h3>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{a.content}</p>
                <span className="text-[10px] text-slate-400 mt-2 block italic">
                  Publié le {isMounted ? new Date(a.createdAt).toLocaleDateString() : ""}
                </span>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/annonces/edit/${a.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
                <form action={deleteAnnouncement.bind(null, a.id)}>
                  <button title= "button" type="submit" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
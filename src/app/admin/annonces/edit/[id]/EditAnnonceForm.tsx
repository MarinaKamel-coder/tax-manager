"use client";

import { useState } from "react";
import { updateAnnouncement } from "../../../../../actions/announcementActions";
import ImageUploader from "../../../../../components/ImageUploader";
import { XMarkIcon, PencilSquareIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline"; 

export default function EditAnnonceForm({ annonce }: { annonce: any }) {
  // L'état contient l'URL de l'image (l'originale ou la nouvelle)
  const [imageUrl, setImageUrl] = useState<string>(annonce.imageUrl || "");

  // Fonction pour supprimer l'image
  const handleRemoveImage = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
    setImageUrl(""); 
    }
  };

  return (
    <form 
      action={updateAnnouncement.bind(null, annonce.id)} 
      className="bg-white p-8 shadow-sm rounded-2xl border border-slate-200 space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Titre de l'annonce</label>
        <input 
          name="title" 
          aria-label="title"
          defaultValue={annonce.title} 
          className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition" 
           
        />
      </div>

      {/* --- SECTION IMAGE AVEC BOUTON DE SUPPRESSION "X" --- */}
      <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <PencilSquareIcon className="h-5 w-5 text-blue-600" />
            Image de l'annonce
        </label>
        
        {imageUrl ? (
          // --- Si une image existe : On l'affiche avec le X ---
          <div className="relative group w-full h-48 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <img 
              src={imageUrl} 
              alt="Aperçu" 
              className="w-full h-full object-contain p-2" 
            />
            
            {/* Le bouton "X" rouge en haut à droite, visible au survol de l'image */}
            <button
              type="button" // Important : type="button" pour NE PAS soumettre le formulaire
              onClick={handleRemoveImage}
              title="Supprimer cette image"
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 focus:opacity-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            
            {/* Petit overlay au survol pour indiquer qu'on peut cliquer sur le X */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition pointer-events-none rounded-xl" />
          </div>
        ) : (
          // --- Si aucune image : On affiche l'Uploader (Dropzone) ---
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-xl bg-white hover:border-blue-300 hover:bg-blue-50/50 transition">
             <ImageUploader onUploadComplete={(url) => setImageUrl(url)} />
             <p className="text-xs text-slate-400 mt-2 italic px-4 text-center">Glissez votre fichier ici pour ajouter une image (Bannière recommandée)</p>
          </div>
        )}

        {/* Champ caché pour envoyer la valeur à l'action */}
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Contenu de l'annonce</label>
        <textarea 
          name="content" 
          aria-label="content"
          defaultValue={annonce.content} 
          rows={5} 
          className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition" 
           
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Priorité</label>
        <select 
          name="priority" 
          aria-label="priority"
          defaultValue={annonce.priority} 
          className="w-full border border-slate-300 p-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
        >
          <option value="info">Information (Bleu)</option>
          <option value="normal">Normal (Gris)</option>
          <option value="urgent">Urgent (Rouge)</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <a href="/admin/annonces" className="bg-slate-100 px-6 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-200 transition">
          Annuler
        </a>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-100 flex items-center gap-2">
            <CloudArrowUpIcon className="h-5 w-5" />
            Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
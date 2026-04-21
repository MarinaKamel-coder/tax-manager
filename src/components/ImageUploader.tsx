"use client";

import { useState } from "react";
import { UploadDropzone } from "../utils/uploadthing"; 

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full">
      <UploadDropzone
        endpoint="imageUploader"
        content={{
          label: "Glissez l'image ici ou cliquez",
          allowedContent: "Images (max 4MB)"
        }}
        appearance={{
        container: "border-slate-200 bg-white hover:bg-slate-50 transition border-2 border-dashed rounded-2xl h-40 cursor-pointer",
        label: "text-blue-700 font-semibold text-sm",
        allowedContent: "text-slate-500 text-[10px] mt-1 italic",
        // AU LIEU DE "hidden", on lui donne un vrai style de bouton
        button: "bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg mt-2 ut-ready:bg-blue-600 ut-uploading:bg-slate-400 after:bg-blue-700",
        }}
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            const url = res[0].url;
            console.log("Image uploadée avec succès:", url);
            setPreview(url); // <-- CRUCIAL : Met à jour l'aperçu local
            onUploadComplete(url); // <-- Envoie l'URL au formulaire parent
          }
        }}
        onUploadError={(error: Error) => {
          alert(`Erreur d'upload : ${error.message}`);
        }}
      />
      
      {/* Cette partie affiche l'image dès qu'elle est uploadée */}
      {preview && (
        <div className="mt-4 p-2 bg-white rounded-xl border border-blue-100 shadow-sm animate-in fade-in zoom-in duration-300">
          <p className="text-[10px] font-bold text-blue-600 mb-2 uppercase tracking-wider">Aperçu du nouveau fichier :</p>
          <img 
            src={preview} 
            alt="Nouveau téléchargement" 
            className="h-48 w-full object-contain rounded-lg" 
          />
        </div>
      )}
    </div>
  );
}
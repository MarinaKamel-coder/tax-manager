"use client";

import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "../app/api/uploadthing/core";
import { useState } from "react";
import { createDocument } from "../actions/documentActions";
import { DocumentIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface ImageUploaderProps {
  clientId?: string; 
  isGeneral?: boolean;
}

export default function ImageUploader({ clientId, isGeneral = false }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  return (
    <div className="p-8 border-2 border-dashed border-blue-100 rounded-[2rem] bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        <DocumentIcon className="w-5 h-5" />
        Téléverser un document (PDF ou Image)
      </h3>

      <UploadDropzone<OurFileRouter, "documentUploader">
        endpoint="documentUploader"
        onUploadBegin={() => {
          setIsUploading(true);
          setUploadStatus("idle");
        }}
        onClientUploadComplete={async (res) => {
          if (res && res[0]) {
            try {
              // Vérification : si c'est privé, on a besoin du clientId
              if (!isGeneral && !clientId) {
                setUploadStatus("error");
                return;
              }

              await createDocument(res[0].name, res[0].url, clientId, isGeneral);
              setUploadStatus("success");
            } catch (error) {
              console.error("Erreur base de données:", error);
              setUploadStatus("error");
            }
          }
          setIsUploading(false);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          setUploadStatus("error");
          alert(`Erreur: ${error.message}`);
        }}
        appearance={{
          button: "bg-blue-600 dark:bg-blue-500 after:bg-blue-700",
          container: "border-none p-0",
          label: "text-blue-600 dark:text-blue-400 hover:text-blue-700",
        }}
        content={{
          label: "Glissez vos fichiers ici ou cliquez",
          allowedContent: "PDF, Images (Max 16MB)"
        }}
      />

      {/* Feedback visuel après l'upload */}
      {uploadStatus === "success" && (
        <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Document enregistré avec succès !</span>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <XCircleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Échec de l'enregistrement en base de données.</span>
        </div>
      )}
    </div>
  );
}
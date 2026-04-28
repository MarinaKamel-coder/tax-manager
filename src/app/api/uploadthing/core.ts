import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server"; 

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    pdf: { maxFileSize: "16MB" },
    image: { maxFileSize: "16MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "16MB" },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "16MB" },
    "application/msword": { maxFileSize: "16MB" },
    "application/vnd.ms-excel": { maxFileSize: "16MB" },
  })
    // 1. LE MIDDLEWARE : C'est ici que l'on définit 'metadata'
    .middleware(async () => {
      const { userId } = await auth();
      
      // Si l'utilisateur n'est pas connecté, on bloque l'upload
      if (!userId) throw new Error("Non autorisé");

      // Ce qui est retourné ici devient 'metadata' dans onUploadComplete
      return { userId };
    })
    // 2. ON UPLOAD COMPLETE : metadata contient maintenant userId
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complété pour l'utilisateur:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
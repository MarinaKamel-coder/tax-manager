import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // On définit une route qui accepte images ET PDF
  documentUploader: f({ 
    image: { maxFileSize: "4MB" }, 
    pdf: { maxFileSize: "16MB" } // Les PDF sont souvent plus lourds
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complet pour:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
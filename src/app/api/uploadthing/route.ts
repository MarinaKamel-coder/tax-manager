import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Expose les routes pour Next.js
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
import { auth } from "@clerk/nextjs/server";

export async function checkRole() {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata?.role || "client";
}
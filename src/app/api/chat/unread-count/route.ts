import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "../../../../lib/role";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ count: 0 });

  const role = await checkRole();

  const count = await prisma.message.count({
    where: {
      userId: role === "admin" ? undefined : userId,
      isRead: false,
      senderId: { not: userId },
    },
  });

  return NextResponse.json({ count });
}
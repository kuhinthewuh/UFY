import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const sessionUser = await getCurrentAdmin();
  if (!sessionUser) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  if (!user || !user.active) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}

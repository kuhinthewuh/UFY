import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin, hashPassword } from "@/lib/auth";

export async function GET() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only SUPER_ADMIN can create other users
  if (currentAdmin.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Permission denied: Only Super Administrators can invite team members" }, { status: 403 });
  }

  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "An administrator with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim(),
        role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "EDITOR",
        active: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create administrator" }, { status: 500 });
  }
}

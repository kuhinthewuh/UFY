import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, hashPassword, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const envAdminEmail = (process.env.INITIAL_ADMIN_EMAIL || "admin@ufy.org").toLowerCase().trim();
    const envAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || "UfyAdminPassword2026!";
    const envAdminName = process.env.INITIAL_ADMIN_NAME || "UFY Lead Director";

    let admin = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    // If logging in with INITIAL_ADMIN_EMAIL & INITIAL_ADMIN_PASSWORD configured in Vercel/env,
    // automatically provision or sync the AdminUser record so login always succeeds seamlessly
    if (normalizedEmail === envAdminEmail && password === envAdminPassword) {
      const passwordHash = await hashPassword(password);
      admin = await prisma.adminUser.upsert({
        where: { email: normalizedEmail },
        update: {
          passwordHash,
          active: true,
          role: "SUPER_ADMIN",
        },
        create: {
          email: normalizedEmail,
          passwordHash,
          name: envAdminName,
          role: "SUPER_ADMIN",
          active: true,
        },
      });
    }

    if (!admin || !admin.active) {
      return NextResponse.json({ error: "Invalid credentials or account inactive" }, { status: 401 });
    }

    const isValid =
      (normalizedEmail === envAdminEmail && password === envAdminPassword) ||
      (await verifyPassword(password, admin.passwordHash));

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update lastLoginAt
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await createSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    const isDbError =
      error?.message?.includes("Can't reach database") ||
      error?.message?.includes("PrismaClient") ||
      error?.code?.startsWith?.("P1");
    return NextResponse.json(
      {
        error: isDbError
          ? "Database connection error on Vercel: please update DATABASE_URL in Vercel Settings to the Supabase pooler URL (aws-0-us-east-1.pooler.supabase.com) and redeploy."
          : "An unexpected error occurred during login",
      },
      { status: 500 }
    );
  }
}

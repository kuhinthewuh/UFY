import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyPassword,
  createVolunteerSessionToken,
  VOLUNTEER_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const volunteer = await prisma.volunteer.findUnique({
      where: { email: normalizedEmail },
    });

    if (!volunteer) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (volunteer.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "This volunteer account is currently suspended. Contact UFY organizers." },
        { status: 403 }
      );
    }

    const valid = await verifyPassword(String(password), volunteer.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createVolunteerSessionToken({
      id: volunteer.id,
      email: volunteer.email,
      fullName: volunteer.fullName,
    });

    const res = NextResponse.json({
      success: true,
      volunteer: {
        id: volunteer.id,
        email: volunteer.email,
        fullName: volunteer.fullName,
        schoolOrOrg: volunteer.schoolOrOrg,
        city: volunteer.city,
        interests: volunteer.interests,
        status: volunteer.status,
        totalVerifiedHours: volunteer.totalVerifiedHours,
        bonusHours: volunteer.bonusHours,
        createdAt: volunteer.createdAt,
      },
    });

    res.cookies.set(VOLUNTEER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error) {
    console.error("Volunteer login error:", error);
    return NextResponse.json({ error: "Failed to sign in." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(VOLUNTEER_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}


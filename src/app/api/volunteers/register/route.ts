import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  hashPassword,
  createVolunteerSessionToken,
  VOLUNTEER_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      fullName,
      schoolOrOrg,
      city,
      phone,
      interests,
      bio,
    } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await prisma.volunteer.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An Up for Youth volunteer account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(String(password));

    const volunteer = await prisma.volunteer.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: String(fullName).trim(),
        schoolOrOrg: schoolOrOrg ? String(schoolOrOrg).trim() : null,
        city: city ? String(city).trim() : "Community Chapter",
        phone: phone ? String(phone).trim() : null,
        interests: Array.isArray(interests)
          ? interests.join(", ")
          : interests
          ? String(interests).trim()
          : "Virtual Letters, Workshops",
        bio: bio ? String(bio).trim() : null,
      },
    });

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
    console.error("Volunteer registration error:", error);
    return NextResponse.json(
      { error: "Failed to create volunteer account." },
      { status: 500 }
    );
  }
}


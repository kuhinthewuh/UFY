import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin, getCurrentVolunteer } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");

  if (scope === "admin") {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const letters = await prisma.affirmationLetter.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        volunteer: {
          select: { id: true, fullName: true, email: true, schoolOrOrg: true },
        },
      },
    });
    return NextResponse.json({ letters });
  }

  const letters = await prisma.affirmationLetter.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return NextResponse.json({ letters });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      authorName,
      recipientTag,
      message,
      stationeryColor,
      stampStyle,
      requestVolunteerHours,
      minutesSpent,
      honeypot,
    } = body;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!message || String(message).trim().length < 15) {
      return NextResponse.json(
        { error: "Please write a heartfelt message of at least 15 characters." },
        { status: 400 }
      );
    }

    const cleanMessage = String(message).trim().slice(0, 1200);
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { hoursPerLetter: true, autoApproveLetters: true },
    });

    const volunteerSession = await getCurrentVolunteer();
    const wantsHours = Boolean(requestVolunteerHours && volunteerSession);

    if (wantsHours && cleanMessage.split(/\s+/).length < 20) {
      return NextResponse.json(
        {
          error:
            "For verified volunteer service credit, letters must be at least 20 thoughtful words following UFY Hospital Card Guidelines.",
        },
        { status: 400 }
      );
    }

    const defaultHours = settings?.hoursPerLetter ?? 0.25;
    const autoApprove = settings?.autoApproveLetters ?? true;

    const created = await prisma.affirmationLetter.create({
      data: {
        authorName: authorName && String(authorName).trim()
          ? String(authorName).trim().slice(0, 60)
          : volunteerSession?.fullName || "A UFY Friend",
        recipientTag: recipientTag || "For Hospitalized Youth",
        message: cleanMessage,
        stationeryColor: stationeryColor || "#ffffff",
        stampStyle: stampStyle || "heart",
        volunteerId: wantsHours ? volunteerSession!.id : null,
        minutesSpent: minutesSpent ? Math.max(5, Math.min(120, Number(minutesSpent))) : 15,
        hoursAwarded: wantsHours ? defaultHours : 0,
        hoursStatus: wantsHours ? "PENDING" : "NONE",
        status: autoApprove ? "APPROVED" : "PENDING",
        isFeaturedOnHome: true,
        heartsCount: 1,
      },
    });

    return NextResponse.json({
      success: true,
      letter: created,
      message: wantsHours
        ? "Letter submitted! It has been logged in your UFY Volunteer Portal for service hour verification."
        : autoApprove
        ? "Your envelope is now live on the Up for Youth Affirmation Wall!"
        : "Your letter has been submitted to the UFY moderation queue!",
    });
  } catch (error) {
    console.error("Create letter error:", error);
    return NextResponse.json({ error: "Failed to submit letter" }, { status: 500 });
  }
}


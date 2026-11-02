import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentVolunteer } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentVolunteer();
  if (!session) {
    return NextResponse.json({ volunteer: null });
  }

  const volunteer = await prisma.volunteer.findUnique({
    where: { id: session.id },
    include: {
      letters: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!volunteer) {
    return NextResponse.json({ volunteer: null });
  }

  const pendingHours = volunteer.letters
    .filter((l) => l.hoursStatus === "PENDING")
    .reduce((acc, l) => acc + (l.hoursAwarded || 0), 0);

  return NextResponse.json({
    volunteer: {
      id: volunteer.id,
      email: volunteer.email,
      fullName: volunteer.fullName,
      schoolOrOrg: volunteer.schoolOrOrg,
      city: volunteer.city,
      phone: volunteer.phone,
      interests: volunteer.interests,
      bio: volunteer.bio,
      status: volunteer.status,
      totalVerifiedHours: volunteer.totalVerifiedHours,
      bonusHours: volunteer.bonusHours,
      pendingHours: Number(pendingHours.toFixed(2)),
      createdAt: volunteer.createdAt,
      letters: volunteer.letters,
    },
  });
}


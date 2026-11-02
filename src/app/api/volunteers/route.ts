import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      letters: {
        select: {
          id: true,
          hoursAwarded: true,
          hoursStatus: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  const formatted = volunteers.map((v) => {
    const pendingHours = v.letters
      .filter((l) => l.hoursStatus === "PENDING")
      .reduce((acc, l) => acc + l.hoursAwarded, 0);

    return {
      id: v.id,
      email: v.email,
      fullName: v.fullName,
      schoolOrOrg: v.schoolOrOrg,
      city: v.city,
      phone: v.phone,
      interests: v.interests,
      bio: v.bio,
      status: v.status,
      totalVerifiedHours: v.totalVerifiedHours,
      bonusHours: v.bonusHours,
      pendingHours: Number(pendingHours.toFixed(2)),
      lettersCount: v.letters.length,
      createdAt: v.createdAt,
    };
  });

  return NextResponse.json({ volunteers: formatted });
}


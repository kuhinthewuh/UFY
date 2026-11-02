import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

async function syncVolunteerVerifiedHours(volunteerId: string) {
  const vol = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
    include: {
      letters: {
        where: { hoursStatus: "VERIFIED" },
        select: { hoursAwarded: true },
      },
    },
  });
  if (!vol) return null;

  const letterHours = vol.letters.reduce((acc, l) => acc + (l.hoursAwarded || 0), 0);
  const total = Number((letterHours + (vol.bonusHours || 0)).toFixed(2));

  return prisma.volunteer.update({
    where: { id: volunteerId },
    data: { totalVerifiedHours: total },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Optional bulk-verify all pending letters for this volunteer
    if (body.verifyAllPendingLetters) {
      await prisma.affirmationLetter.updateMany({
        where: { volunteerId: params.id, hoursStatus: "PENDING" },
        data: { hoursStatus: "VERIFIED", status: "APPROVED" },
      });
    }

    await prisma.volunteer.update({
      where: { id: params.id },
      data: {
        ...(body.fullName !== undefined && { fullName: String(body.fullName).trim() }),
        ...(body.schoolOrOrg !== undefined && { schoolOrOrg: body.schoolOrOrg ? String(body.schoolOrOrg).trim() : null }),
        ...(body.city !== undefined && { city: String(body.city).trim() }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.bonusHours !== undefined && { bonusHours: Math.max(0, Number(body.bonusHours)) }),
      },
    });

    const synced = await syncVolunteerVerifiedHours(params.id);

    return NextResponse.json({ success: true, volunteer: synced });
  } catch (error) {
    console.error("Update volunteer error:", error);
    return NextResponse.json({ error: "Failed to update volunteer" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.volunteer.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete volunteer error:", error);
    return NextResponse.json({ error: "Failed to delete volunteer" }, { status: 500 });
  }
}


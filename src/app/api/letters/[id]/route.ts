import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

async function recalculateVolunteerHours(volunteerId: string | null | undefined) {
  if (!volunteerId) return;
  const vol = await prisma.volunteer.findUnique({
    where: { id: volunteerId },
    include: {
      letters: {
        where: { hoursStatus: "VERIFIED" },
        select: { hoursAwarded: true },
      },
    },
  });
  if (!vol) return;
  const verifiedFromLetters = vol.letters.reduce((sum, l) => sum + (l.hoursAwarded || 0), 0);
  await prisma.volunteer.update({
    where: { id: volunteerId },
    data: {
      totalVerifiedHours: Number((verifiedFromLetters + (vol.bonusHours || 0)).toFixed(2)),
    },
  });
}

// Public POST for hearting an affirmation envelope
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === "heart") {
      const updated = await prisma.affirmationLetter.update({
        where: { id: params.id },
        data: { heartsCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, heartsCount: updated.heartsCount });
    }
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    console.error("Heart letter error:", error);
    return NextResponse.json({ error: "Failed to react to letter" }, { status: 500 });
  }
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
    const updated = await prisma.affirmationLetter.update({
      where: { id: params.id },
      data: {
        ...(body.authorName !== undefined && { authorName: String(body.authorName).trim() }),
        ...(body.recipientTag !== undefined && { recipientTag: String(body.recipientTag).trim() }),
        ...(body.message !== undefined && { message: String(body.message).trim() }),
        ...(body.stationeryColor !== undefined && { stationeryColor: body.stationeryColor }),
        ...(body.stampStyle !== undefined && { stampStyle: body.stampStyle }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.hoursAwarded !== undefined && { hoursAwarded: Math.max(0, Number(body.hoursAwarded)) }),
        ...(body.hoursStatus !== undefined && { hoursStatus: body.hoursStatus }),
        ...(body.isFeaturedOnHome !== undefined && { isFeaturedOnHome: Boolean(body.isFeaturedOnHome) }),
      },
    });

    await recalculateVolunteerHours(updated.volunteerId);

    return NextResponse.json({ success: true, letter: updated });
  } catch (error) {
    console.error("Update letter error:", error);
    return NextResponse.json({ error: "Failed to update letter" }, { status: 500 });
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
    const existing = await prisma.affirmationLetter.findUnique({
      where: { id: params.id },
      select: { volunteerId: true },
    });
    await prisma.affirmationLetter.delete({
      where: { id: params.id },
    });
    await recalculateVolunteerHours(existing?.volunteerId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete letter error:", error);
    return NextResponse.json({ error: "Failed to delete letter" }, { status: 500 });
  }
}


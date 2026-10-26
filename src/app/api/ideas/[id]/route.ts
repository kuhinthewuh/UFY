import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, internalNotes, linkedOutcome, isPubliclyDisplayed } = body;

    const updated = await prisma.ideaSubmission.update({
      where: { id: params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(internalNotes !== undefined && { internalNotes }),
        ...(linkedOutcome !== undefined && { linkedOutcome }),
        ...(isPubliclyDisplayed !== undefined && { isPubliclyDisplayed: Boolean(isPubliclyDisplayed) }),
        reviewedAt: new Date(),
        reviewedBy: admin.name,
      },
    });

    return NextResponse.json({ success: true, idea: updated });
  } catch (error) {
    console.error("Update idea error:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.ideaSubmission.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Submission removed" });
  } catch (error) {
    console.error("Delete idea error:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}

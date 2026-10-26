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
    const updated = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.role !== undefined && { role: body.role.trim() }),
        ...(body.bio !== undefined && { bio: body.bio.trim() }),
        ...(body.pronouns !== undefined && { pronouns: body.pronouns ? body.pronouns.trim() : null }),
        ...(body.department !== undefined && { department: body.department ? body.department.trim() : null }),
        ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl || null }),
        ...(body.focalPointX !== undefined && { focalPointX: Number(body.focalPointX) }),
        ...(body.focalPointY !== undefined && { focalPointY: Number(body.focalPointY) }),
        ...(body.linkUrl !== undefined && { linkUrl: body.linkUrl ? body.linkUrl.trim() : null }),
        ...(body.linkType !== undefined && { linkType: body.linkType || null }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.isPublished !== undefined && { isPublished: Boolean(body.isPublished) }),
      },
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.teamMember.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (error) {
    console.error("Delete team member error:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}

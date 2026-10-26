import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const team = await prisma.teamMember.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ team });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, role, bio, pronouns, department, photoUrl, focalPointX, focalPointY, linkUrl, linkType, displayOrder, isPublished } = body;

    if (!name || !role || !bio) {
      return NextResponse.json({ error: "Name, role, and biography are required" }, { status: 400 });
    }

    const maxOrder = await prisma.teamMember.aggregate({ _max: { displayOrder: true } });
    const nextOrder = displayOrder !== undefined ? displayOrder : (maxOrder._max.displayOrder || 0) + 1;

    const member = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        pronouns: pronouns ? pronouns.trim() : null,
        department: department ? department.trim() : null,
        photoUrl: photoUrl || null,
        focalPointX: focalPointX ?? 50,
        focalPointY: focalPointY ?? 50,
        linkUrl: linkUrl ? linkUrl.trim() : null,
        linkType: linkType || null,
        displayOrder: nextOrder,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error("Create team member error:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

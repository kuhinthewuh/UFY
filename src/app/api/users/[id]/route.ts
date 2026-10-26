import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin, hashPassword } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only SUPER_ADMIN can change roles or active status, or user updating their own name/password
  const isSelf = currentAdmin.id === params.id;
  const isSuper = currentAdmin.role === "SUPER_ADMIN";

  if (!isSelf && !isSuper) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.name) updateData.name = body.name.trim();
    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }
      updateData.passwordHash = await hashPassword(body.password);
    }

    if (isSuper && !isSelf) {
      if (body.role !== undefined) updateData.role = body.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "EDITOR";
      if (body.active !== undefined) updateData.active = Boolean(body.active);
    }

    const updated = await prisma.adminUser.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentAdmin.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Permission denied: Only Super Administrators can delete accounts" }, { status: 403 });
  }

  if (currentAdmin.id === params.id) {
    return NextResponse.json({ error: "You cannot delete your own administrative account" }, { status: 400 });
  }

  try {
    await prisma.adminUser.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

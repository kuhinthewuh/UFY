import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const items = await prisma.navigationItem.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.action === "reorder" && Array.isArray(body.orderedIds)) {
      for (let i = 0; i < body.orderedIds.length; i++) {
        await prisma.navigationItem.update({
          where: { id: body.orderedIds[i] },
          data: { displayOrder: i + 1 },
        });
      }
      const updated = await prisma.navigationItem.findMany({ orderBy: { displayOrder: "asc" } });
      return NextResponse.json({ success: true, items: updated });
    }

    const { label, path, target, displayOrder, isVisible, isCta } = body;
    if (!label || !path) {
      return NextResponse.json({ error: "Label and path are required" }, { status: 400 });
    }

    const maxOrder = await prisma.navigationItem.aggregate({ _max: { displayOrder: true } });
    const nextOrder = displayOrder !== undefined ? displayOrder : (maxOrder._max.displayOrder || 0) + 1;

    const item = await prisma.navigationItem.create({
      data: {
        label: label.trim(),
        path: path.trim(),
        target: target || "_self",
        displayOrder: nextOrder,
        isVisible: isVisible ?? true,
        isCta: Boolean(isCta),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Navigation error:", error);
    return NextResponse.json({ error: "Failed to manage navigation item" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, label, path, target, isVisible, isCta, displayOrder } = body;

    const updated = await prisma.navigationItem.update({
      where: { id },
      data: {
        ...(label !== undefined && { label: label.trim() }),
        ...(path !== undefined && { path: path.trim() }),
        ...(target !== undefined && { target }),
        ...(isVisible !== undefined && { isVisible: Boolean(isVisible) }),
        ...(isCta !== undefined && { isCta: Boolean(isCta) }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Update nav error:", error);
    return NextResponse.json({ error: "Failed to update navigation item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.navigationItem.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error("Delete nav error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

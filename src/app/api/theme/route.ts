import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const theme = await prisma.themeSettings.findUnique({
    where: { id: "global" },
  });
  return NextResponse.json({ theme });
}

export async function PATCH(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Check if restore action
    if (body.action === "restore") {
      const restored = await prisma.themeSettings.update({
        where: { id: "global" },
        data: {
          headingFont: "Space Grotesk",
          bodyFont: "Inter",
          primaryColor: "#7629f0",
          secondaryColor: "#ffffff",
          buttonRadius: "14px",
          buttonStyle: "solid",
          typeScale: "expressive",
          baseSpacing: "balanced",
          containerMaxWidth: "1240px",
          animationLevel: "playful",
        },
      });
      return NextResponse.json({ success: true, theme: restored, message: "Restored UFY brand defaults" });
    }

    const updated = await prisma.themeSettings.update({
      where: { id: "global" },
      data: {
        ...(body.headingFont && { headingFont: body.headingFont }),
        ...(body.bodyFont && { bodyFont: body.bodyFont }),
        primaryColor: "#7629f0", // Strictly enforced
        secondaryColor: "#ffffff", // Strictly enforced
        ...(body.buttonRadius && { buttonRadius: body.buttonRadius }),
        ...(body.buttonStyle && { buttonStyle: body.buttonStyle }),
        ...(body.typeScale && { typeScale: body.typeScale }),
        ...(body.baseSpacing && { baseSpacing: body.baseSpacing }),
        ...(body.containerMaxWidth && { containerMaxWidth: body.containerMaxWidth }),
        ...(body.animationLevel && { animationLevel: body.animationLevel }),
      },
    });

    return NextResponse.json({ success: true, theme: updated });
  } catch (error) {
    console.error("Update theme error:", error);
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}

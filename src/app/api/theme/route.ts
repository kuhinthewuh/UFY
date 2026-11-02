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

    if (body.action === "restore") {
      const restored = await prisma.themeSettings.update({
        where: { id: "global" },
        data: {
          headingFont: "Plus Jakarta Sans",
          bodyFont: "Plus Jakarta Sans",
          bgColor: "#f7f4fc",
          primaryColor: "#7629f0",
          secondaryColor: "#ffffff",
          accentColor: "#8e48ff",
          darkColor: "#140529",
          cardBgColor: "#ffffff",
          footerBgColor: "#140529",
          headingLetterSpacing: "-0.03em",
          buttonRadius: "9999px",
          buttonStyle: "solid",
          typeScale: "expressive",
          baseSpacing: "balanced",
          containerMaxWidth: "100%",
          marqueeSpeed: 28,
          enableDuotone: true,
          animationLevel: "playful",
        },
      });
      return NextResponse.json({
        success: true,
        theme: restored,
        message: "Restored Up for Youth signature palette & edge-to-edge layout",
      });
    }

    const updated = await prisma.themeSettings.update({
      where: { id: "global" },
      data: {
        ...(body.headingFont !== undefined && { headingFont: body.headingFont }),
        ...(body.bodyFont !== undefined && { bodyFont: body.bodyFont }),
        ...(body.bgColor !== undefined && { bgColor: body.bgColor }),
        ...(body.primaryColor !== undefined && { primaryColor: body.primaryColor }),
        ...(body.secondaryColor !== undefined && { secondaryColor: body.secondaryColor }),
        ...(body.accentColor !== undefined && { accentColor: body.accentColor }),
        ...(body.darkColor !== undefined && { darkColor: body.darkColor }),
        ...(body.cardBgColor !== undefined && { cardBgColor: body.cardBgColor }),
        ...(body.footerBgColor !== undefined && { footerBgColor: body.footerBgColor }),
        ...(body.headingLetterSpacing !== undefined && { headingLetterSpacing: body.headingLetterSpacing }),
        ...(body.buttonRadius !== undefined && { buttonRadius: body.buttonRadius }),
        ...(body.buttonStyle !== undefined && { buttonStyle: body.buttonStyle }),
        ...(body.typeScale !== undefined && { typeScale: body.typeScale }),
        ...(body.baseSpacing !== undefined && { baseSpacing: body.baseSpacing }),
        ...(body.containerMaxWidth !== undefined && { containerMaxWidth: body.containerMaxWidth }),
        ...(body.marqueeSpeed !== undefined && { marqueeSpeed: Math.max(8, Math.min(90, Number(body.marqueeSpeed))) }),
        ...(body.enableDuotone !== undefined && { enableDuotone: Boolean(body.enableDuotone) }),
        ...(body.fontDetailingJson !== undefined && { fontDetailingJson: body.fontDetailingJson }),
        ...(body.animationLevel !== undefined && { animationLevel: body.animationLevel }),
      },
    });

    return NextResponse.json({ success: true, theme: updated });
  } catch (error) {
    console.error("Update theme error:", error);
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}

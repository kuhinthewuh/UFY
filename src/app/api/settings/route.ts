import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
  });
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await prisma.siteSettings.update({
      where: { id: "global" },
      data: {
        ...(body.siteTitle !== undefined && { siteTitle: body.siteTitle.trim() }),
        ...(body.siteDescription !== undefined && { siteDescription: body.siteDescription.trim() }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl || null }),
        ...(body.logoHeight !== undefined && { logoHeight: Number(body.logoHeight) }),
        ...(body.logoWidth !== undefined && { logoWidth: Number(body.logoWidth) }),
        ...(body.primaryCtaLabel !== undefined && { primaryCtaLabel: body.primaryCtaLabel.trim() }),
        ...(body.primaryCtaUrl !== undefined && { primaryCtaUrl: body.primaryCtaUrl.trim() }),
        ...(body.primaryCtaVisible !== undefined && { primaryCtaVisible: Boolean(body.primaryCtaVisible) }),
        ...(body.footerMissionText !== undefined && { footerMissionText: body.footerMissionText.trim() }),
        ...(body.contactEmail !== undefined && { contactEmail: body.contactEmail ? body.contactEmail.trim() : null }),
        ...(body.socialInstagram !== undefined && { socialInstagram: body.socialInstagram ? body.socialInstagram.trim() : null }),
        ...(body.socialTwitter !== undefined && { socialTwitter: body.socialTwitter ? body.socialTwitter.trim() : null }),
        ...(body.socialLinkedin !== undefined && { socialLinkedin: body.socialLinkedin ? body.socialLinkedin.trim() : null }),
        ...(body.socialYoutube !== undefined && { socialYoutube: body.socialYoutube ? body.socialYoutube.trim() : null }),
        ...(body.socialGithub !== undefined && { socialGithub: body.socialGithub ? body.socialGithub.trim() : null }),
        ...(body.copyrightText !== undefined && { copyrightText: body.copyrightText.trim() }),
        ...(body.privacyNotice !== undefined && { privacyNotice: body.privacyNotice.trim() }),
        ...(body.enableReducedMotion !== undefined && { enableReducedMotion: Boolean(body.enableReducedMotion) }),
        ...(body.teamDisplayCount !== undefined && { teamDisplayCount: Number(body.teamDisplayCount) }),
        ...(body.teamPresentationStyle !== undefined && { teamPresentationStyle: body.teamPresentationStyle }),
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}

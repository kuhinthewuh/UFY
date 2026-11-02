import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
    });
    if (settings) return NextResponse.json({ settings });
  } catch {}
  return NextResponse.json({
    settings: {
      id: "global",
      siteTitle: "UFY — Up for Youth | Youth-Led Action, Care & Learning",
      siteDescription:
        "Up for Youth (UFY) is a youth-driven movement uplifting communities through letters for hospitalized children, hands-on first-aid & CPR workshops, educational videos, and neighborhood book drives.",
      brandTagline: "Up for Youth",
      primaryCtaLabel: "Volunteer",
      primaryCtaUrl: "/volunteer",
      primaryCtaVisible: true,
      heroEyebrow: "ufy — up for youth\nyouth community initiative",
      heroMarqueeText: "ufy",
      heroSticker1: "manteca, ca • youth hq\nestablished for youth",
      heroSticker2: "write a virtual letter →",
      heroSticker2Url: "/letters",
      heroSticker3: "100% youth-led impact",
      impactBannerText: "Youth stepping up for hospitalized kids, campus safety & neighborhood literacy",
      videosEducatedCount: 0,
      videosGridColumns: 3,
      hoursPerLetter: 0.25,
      autoApproveLetters: true,
      footerMissionText:
        "Up for Youth (UFY) mobilizes student leaders in Manteca, CA and beyond to deliver uplifting hospital letters, peer-led emergency readiness education, and free neighborhood book drives.",
      footerLocationText: "MANTECA, CA • UP FOR YOUTH (UFY)",
      contactEmail: "hello@ufy.org",
      ufyInboxEmail: "ideas@ufy.org",
      copyrightText: "© 2026 UFY — Up for Youth. Built by youth, for youth.",
      privacyNotice: "We respect youth privacy. Zero invasive tracking, zero data selling.",
    },
  });
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
        ...(body.brandTagline !== undefined && { brandTagline: body.brandTagline.trim() }),
        ...(body.siteDescription !== undefined && { siteDescription: body.siteDescription.trim() }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl || null }),
        ...(body.logoHeight !== undefined && { logoHeight: Number(body.logoHeight) }),
        ...(body.logoWidth !== undefined && { logoWidth: Number(body.logoWidth) }),
        ...(body.primaryCtaLabel !== undefined && { primaryCtaLabel: body.primaryCtaLabel.trim() }),
        ...(body.primaryCtaUrl !== undefined && { primaryCtaUrl: body.primaryCtaUrl.trim() }),
        ...(body.primaryCtaVisible !== undefined && { primaryCtaVisible: Boolean(body.primaryCtaVisible) }),
        ...(body.heroEyebrow !== undefined && { heroEyebrow: body.heroEyebrow.trim() }),
        ...(body.heroMarqueeText !== undefined && { heroMarqueeText: body.heroMarqueeText.trim() }),
        ...(body.heroSticker1 !== undefined && { heroSticker1: body.heroSticker1.trim() }),
        ...(body.heroSticker2 !== undefined && { heroSticker2: body.heroSticker2.trim() }),
        ...(body.heroSticker2Url !== undefined && { heroSticker2Url: body.heroSticker2Url.trim() }),
        ...(body.heroSticker3 !== undefined && { heroSticker3: body.heroSticker3.trim() }),
        ...(body.impactBannerText !== undefined && { impactBannerText: body.impactBannerText.trim() }),
        ...(body.footerMissionText !== undefined && { footerMissionText: body.footerMissionText.trim() }),
        ...(body.footerLocationText !== undefined && { footerLocationText: body.footerLocationText.trim() }),
        ...(body.footerColumnsJson !== undefined && { footerColumnsJson: body.footerColumnsJson }),
        ...(body.contactEmail !== undefined && { contactEmail: body.contactEmail ? body.contactEmail.trim() : null }),
        ...(body.ufyInboxEmail !== undefined && { ufyInboxEmail: body.ufyInboxEmail.trim() }),
        ...(body.journeyTitle !== undefined && { journeyTitle: body.journeyTitle.trim() }),
        ...(body.journeySubtitle !== undefined && { journeySubtitle: body.journeySubtitle.trim() }),
        ...(body.impactTitle !== undefined && { impactTitle: body.impactTitle.trim() }),
        ...(body.impactSubtitle !== undefined && { impactSubtitle: body.impactSubtitle.trim() }),
        ...(body.galleryTitle !== undefined && { galleryTitle: body.galleryTitle.trim() }),
        ...(body.gallerySubtitle !== undefined && { gallerySubtitle: body.gallerySubtitle.trim() }),
        ...(body.teamTitle !== undefined && { teamTitle: body.teamTitle.trim() }),
        ...(body.teamSubtitle !== undefined && { teamSubtitle: body.teamSubtitle.trim() }),
        ...(body.proposeTitle !== undefined && { proposeTitle: body.proposeTitle.trim() }),
        ...(body.proposeSubtitle !== undefined && { proposeSubtitle: body.proposeSubtitle.trim() }),
        ...(body.videosTitle !== undefined && { videosTitle: body.videosTitle.trim() }),
        ...(body.videosSubtitle !== undefined && { videosSubtitle: body.videosSubtitle.trim() }),
        ...(body.videosEducatedCount !== undefined && { videosEducatedCount: Math.max(0, Number(body.videosEducatedCount)) }),
        ...(body.videosGridColumns !== undefined && { videosGridColumns: Number(body.videosGridColumns) === 2 ? 2 : 3 }),
        ...(body.volunteerTitle !== undefined && { volunteerTitle: body.volunteerTitle.trim() }),
        ...(body.volunteerSubtitle !== undefined && { volunteerSubtitle: body.volunteerSubtitle.trim() }),
        ...(body.lettersTitle !== undefined && { lettersTitle: body.lettersTitle.trim() }),
        ...(body.lettersSubtitle !== undefined && { lettersSubtitle: body.lettersSubtitle.trim() }),
        ...(body.hoursPerLetter !== undefined && { hoursPerLetter: Math.max(0, Number(body.hoursPerLetter)) }),
        ...(body.autoApproveLetters !== undefined && { autoApproveLetters: Boolean(body.autoApproveLetters) }),
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

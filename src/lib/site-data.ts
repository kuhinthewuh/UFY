import prisma from "@/lib/prisma";

export async function getPublicChromeData() {
  const [settings, theme, navItems] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "global" } }),
    prisma.themeSettings.findUnique({ where: { id: "global" } }),
    prisma.navigationItem.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return {
    settings,
    theme,
    navItems,
  };
}

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) return match[1];
  }
  return null;
}

export function getVideoThumbnailUrl(youtubeUrl: string, customThumbnail?: string | null): string {
  if (customThumbnail && customThumbnail.trim().length > 0) {
    return customThumbnail.trim();
  }
  const ytId = extractYoutubeId(youtubeUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80";
}


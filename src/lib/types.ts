export interface SiteSettingsData {
  id: string;
  siteTitle: string;
  siteDescription: string;
  brandTagline: string;
  logoUrl: string | null;
  logoHeight: number;
  logoWidth: number;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  primaryCtaVisible: boolean;

  heroEyebrow: string;
  heroMarqueeText: string;
  heroSticker1: string;
  heroSticker2: string;
  heroSticker2Url: string;
  heroSticker3: string;
  impactBannerText: string;

  journeyTitle: string;
  journeySubtitle: string;
  impactTitle: string;
  impactSubtitle: string;
  galleryTitle: string;
  gallerySubtitle: string;
  teamTitle: string;
  teamSubtitle: string;
  proposeTitle: string;
  proposeSubtitle: string;
  videosTitle: string;
  videosSubtitle: string;
  videosEducatedCount: number;
  videosGridColumns: number;
  volunteerTitle: string;
  volunteerSubtitle: string;
  lettersTitle: string;
  lettersSubtitle: string;
  hoursPerLetter: number;
  autoApproveLetters: boolean;

  footerMissionText: string;
  footerLocationText: string;
  footerColumnsJson?: string | null;
  contactEmail: string | null;
  ufyInboxEmail: string;
  socialInstagram: string | null;
  socialTwitter: string | null;
  socialLinkedin: string | null;
  socialYoutube: string | null;
  socialGithub: string | null;
  copyrightText: string;
  privacyNotice: string;
  enableReducedMotion: boolean;
  teamDisplayCount: number;
  teamPresentationStyle: "editorial" | "grid" | "offset";
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface ThemeSettingsData {
  id: string;
  headingFont: string;
  bodyFont: string;
  bgColor: string;
  cardBgColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkColor: string;
  footerBgColor: string;
  headingLetterSpacing: string;
  marqueeSpeed: number;
  enableDuotone: boolean;
  fontDetailingJson?: string | null;
  buttonRadius: string;
  buttonStyle: string;
  typeScale: string;
  baseSpacing: string;
  containerMaxWidth: string;
  animationLevel: string;
  updatedAt: string;
}

export interface NavigationItemData {
  id: string;
  label: string;
  path: string;
  target: string;
  displayOrder: number;
  isVisible: boolean;
  isCta: boolean;
}

export interface PageSectionData {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string | null;
  contentJson: string;
  layoutVariation: string;
  displayOrder: number;
  isVisible: boolean;
  backgroundMode: "transparent" | "white" | "purple" | "subtle-tint" | "dark-purple";
  updatedAt: string;
}

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  bio: string;
  pronouns: string | null;
  department: string | null;
  photoUrl: string | null;
  pegColor?: string;
  focalPointX: number;
  focalPointY: number;
  linkUrl: string | null;
  linkType: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface ProgramData {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  impactStat?: string | null;
  ctaLabel?: string | null;
  accentColor?: string | null;
  imageUrl: string | null;
  status: "active" | "upcoming" | "completed" | "proposed";
  dateLabel: string | null;
  externalUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface EducationalVideoData {
  id: string;
  title: string;
  category: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string | null;
  duration: string | null;
  instructor: string | null;
  viewsCount: number;
  isFeatured: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export interface VolunteerData {
  id: string;
  email: string;
  fullName: string;
  schoolOrOrg: string | null;
  city: string;
  phone: string | null;
  interests: string;
  bio: string | null;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  totalVerifiedHours: number;
  bonusHours: number;
  createdAt: string;
  letters?: AffirmationLetterData[];
}

export interface AffirmationLetterData {
  id: string;
  authorName: string;
  recipientTag: string;
  message: string;
  stationeryColor: string;
  stampStyle: string;
  volunteerId: string | null;
  volunteer?: {
    id: string;
    fullName: string;
    email: string;
    schoolOrOrg: string | null;
  } | null;
  minutesSpent: number;
  hoursAwarded: number;
  hoursStatus: "NONE" | "PENDING" | "VERIFIED" | "REJECTED";
  status: "PENDING" | "APPROVED" | "ARCHIVED";
  heartsCount: number;
  isFeaturedOnHome: boolean;
  createdAt: string;
}

export interface MediaAssetData {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  altText: string;
  caption: string | null;
  credit: string | null;
  width: number | null;
  height: number | null;
  focalPointX: number;
  focalPointY: number;
  usageCount: number;
  createdAt: string;
}

export interface IdeaSubmissionData {
  id: string;
  title: string;
  category: string;
  description: string;
  problemAddressed: string;
  proposedApproach: string | null;
  submitterEmail: string | null;
  status:
    | "NEW"
    | "UNDER_REVIEW"
    | "NEEDS_CLARIFICATION"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "DECLINED";
  internalNotes: string | null;
  linkedOutcome: string | null;
  isPubliclyDisplayed: boolean;
  ipHash: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEventData {
  id: string;
  eventType: string;
  path: string;
  sectionId: string | null;
  targetLabel: string | null;
  sessionId: string;
  deviceCategory: string;
  referrer: string | null;
  timestamp: string;
}

export interface SiteRevisionData {
  id: string;
  revisionNumber: number;
  title: string;
  description: string | null;
  snapshotJson: string;
  createdById: string | null;
  createdAt: string;
}

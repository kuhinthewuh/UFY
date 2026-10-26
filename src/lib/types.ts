export interface SiteSettingsData {
  id: string;
  siteTitle: string;
  siteDescription: string;
  logoUrl: string | null;
  logoHeight: number;
  logoWidth: number;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  primaryCtaVisible: boolean;
  footerMissionText: string;
  contactEmail: string | null;
  socialInstagram: string | null;
  socialTwitter: string | null;
  socialLinkedin: string | null;
  socialYoutube: string | null;
  socialGithub: string | null;
  copyrightText: string;
  privacyNotice: string;
  enableReducedMotion: boolean;
  teamDisplayCount: number;
  teamPresentationStyle: 'editorial' | 'grid' | 'offset';
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface ThemeSettingsData {
  id: string;
  headingFont: string;
  bodyFont: string;
  primaryColor: string;
  secondaryColor: string;
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
  backgroundMode: 'white' | 'purple' | 'subtle-tint' | 'dark-purple';
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
  imageUrl: string | null;
  status: 'active' | 'upcoming' | 'completed' | 'proposed';
  dateLabel: string | null;
  externalUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
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
  status: 'NEW' | 'UNDER_REVIEW' | 'NEEDS_CLARIFICATION' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED';
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

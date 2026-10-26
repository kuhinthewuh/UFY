import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding UFY database with initial brand data and settings...");

  // 1. Initial Admin
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@ufy.org";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "UfyAdminPassword2026!";
  const adminName = process.env.INITIAL_ADMIN_NAME || "UFY Lead Director";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
      role: "SUPER_ADMIN",
      active: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "SUPER_ADMIN",
      active: true,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email} (Role: ${admin.role})`);

  // 2. Site Settings
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      siteTitle: "UFY — Youth-Led Action & Learning",
      siteDescription: "A youth-driven platform dedicated to peer health education, community action, first aid skills, and youth-led initiatives.",
      logoUrl: null,
      logoHeight: 40,
      logoWidth: 120,
      primaryCtaLabel: "Propose an Idea",
      primaryCtaUrl: "#submit-idea",
      primaryCtaVisible: true,
      footerMissionText: "UFY equips young changemakers with real first-aid training, interactive health learning kits, and community mini-libraries to strengthen neighborhoods.",
      contactEmail: "hello@ufy.org",
      socialInstagram: "",
      socialTwitter: "",
      socialLinkedin: "",
      socialYoutube: "",
      socialGithub: "https://github.com/kuhinthewuh/UFY",
      copyrightText: `© ${new Date().getFullYear()} UFY. Dedicated to youth-led health education and community knowledge.`,
      privacyNotice: "We strictly uphold youth privacy. We do not sell data, track invasive identifiers, or require unnecessary personal details.",
      enableReducedMotion: false,
      teamDisplayCount: 6,
      teamPresentationStyle: "editorial",
      isPublished: true,
    },
  });
  console.log("✅ Site settings seeded");

  // 3. Theme Settings
  await prisma.themeSettings.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
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
  console.log("✅ Theme settings seeded (Strict #7629f0 & #ffffff)");

  // 4. Navigation Items
  await prisma.navigationItem.deleteMany({});
  const navItems = [
    { label: "Mission & Purpose", path: "#mission", displayOrder: 1, isVisible: true, isCta: false },
    { label: "Initiatives", path: "#programs", displayOrder: 2, isVisible: true, isCta: false },
    { label: "Team", path: "#team", displayOrder: 3, isVisible: true, isCta: false },
    { label: "Approved Ideas", path: "#accepted-ideas", displayOrder: 4, isVisible: true, isCta: false },
    { label: "Propose an Idea", path: "#submit-idea", displayOrder: 5, isVisible: true, isCta: true },
  ];
  for (const item of navItems) {
    await prisma.navigationItem.create({ data: item });
  }
  console.log("✅ Navigation items seeded");

  // 5. Team Members (Six Initial Members)
  await prisma.teamMember.deleteMany({});
  const teamMembers = [
    {
      name: "Maya Lin",
      role: "Youth Health & First Aid Lead",
      department: "Health & Wellness",
      pronouns: "she/her",
      bio: "Leads peer-to-peer first aid workshops and designs accessible health infographics for local youth groups and community centers.",
      displayOrder: 1,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 50,
    },
    {
      name: "Tariq Al-Mansoor",
      role: "Community Action Coordinator",
      department: "Community Outreach",
      pronouns: "he/him",
      bio: "Organizes neighborhood Little Libraries book drives and facilitates youth-led civic planning circles across local parks.",
      displayOrder: 2,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 50,
    },
    {
      name: "Sofia Morales",
      role: "Creative Director & Publications",
      department: "Creative & Media",
      pronouns: "they/them",
      bio: "Directs educational card illustrations, visual learning kits, and community zines for primary and middle school students.",
      displayOrder: 3,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 50,
    },
    {
      name: "Jordan Chen",
      role: "Workshops Facilitator",
      department: "Education",
      pronouns: "he/him",
      bio: "Mentors teen facilitators delivering interactive emergency response training, CPR fundamentals, and mental well-being circles.",
      displayOrder: 4,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 50,
    },
    {
      name: "Amara Okafor",
      role: "Little Libraries Program Lead",
      department: "Literacy & Access",
      pronouns: "she/her",
      bio: "Coordinates book distribution, inventory curation, and accessible micro-library installations across underserved public spaces.",
      displayOrder: 5,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 50,
    },
    {
      name: "Devon Ellis",
      role: "Youth Engagement & Submissions",
      department: "Youth Programs",
      pronouns: "they/he",
      bio: "Reviews student community proposals, moderates idea submissions, and connects young innovators with practical tools and mentorship.",
      displayOrder: 6,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 50,
    },
  ];
  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log(`✅ 6 Team members seeded dynamically`);

  // 6. Programs and Initiatives
  await prisma.program.deleteMany({});
  const programs = [
    {
      title: "Youth Emergency Response & First Aid Workshops",
      category: "Health Education",
      summary: "Hands-on peer training equipping teenagers with CPR, choking relief, and emergency wound care basics.",
      description: "Our certified workshop series demystifies emergency care for middle and high school students. Designed with pediatric educators, participants practice real emergency procedures and leave with pocket guides.",
      status: "active",
      dateLabel: "Ongoing • Bi-weekly Workshops",
      externalUrl: "#submit-idea",
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: "Little Libraries & Community Book Drive",
      category: "Literacy & Knowledge",
      summary: "Placing custom youth-built mini-libraries stocked with science, art, and fiction in neighborhood centers.",
      description: "We construct and stock weather-resistant community book kiosks. Over 1,200 books curated by youth for youth, focusing on health literacy, STEM curiosity, and creative storytelling.",
      status: "active",
      dateLabel: "Spring & Summer 2026",
      externalUrl: "#submit-idea",
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: "Peer Health Educational Cards & Zines",
      category: "Health Literacy",
      summary: "Compact, beautifully illustrated health cards designed by youth artists tackling daily physical and mental well-being.",
      description: "Distributed to local schools and youth clubs, these pocket-sized cards break down nutrition, sleep hygiene, stress relief, and hydration in friendly, jargon-free visual summaries.",
      status: "active",
      dateLabel: "Published Edition 3",
      externalUrl: "#submit-idea",
      displayOrder: 3,
      isPublished: true,
    },
  ];
  for (const prog of programs) {
    await prisma.program.create({ data: prog });
  }
  console.log("✅ Real programs & initiatives seeded");

  // 7. Page Sections with structured content
  await prisma.pageSection.deleteMany({});
  const sections = [
    {
      sectionKey: "hero",
      title: "Youth-Led Action. Tangible Knowledge.",
      subtitle: "UFY equips young people with practical first-aid skills, educational resources, and micro-library initiatives to uplift their communities.",
      layoutVariation: "expressive",
      displayOrder: 1,
      isVisible: true,
      backgroundMode: "purple",
      contentJson: JSON.stringify({
        badgeText: "UFY Youth Action Initiative",
        headlineStart: "Where Young Voices",
        headlineHighlight: "Build Real Health",
        headlineEnd: "& Stronger Communities.",
        description: "We are an organization dedicated to youth empowerment, pediatric health literacy, first-aid workshops, and peer-to-peer neighborhood projects.",
        primaryButtonText: "Propose an Idea",
        primaryButtonLink: "#submit-idea",
        secondaryButtonText: "Explore Initiatives",
        secondaryButtonLink: "#programs",
        statsNote: "Youth-Led • Strictly Community-Focused",
      }),
    },
    {
      sectionKey: "mission",
      title: "Our Mission & Purpose",
      subtitle: "Knowledge belongs in the hands of young people who want to protect and inspire their peers.",
      layoutVariation: "split-editorial",
      displayOrder: 2,
      isVisible: true,
      backgroundMode: "white",
      contentJson: JSON.stringify({
        eyebrow: "Why UFY Exists",
        leadParagraph: "UFY was created to replace passive observation with practical, youth-led education. We believe teenagers and young adults have the energy, empathy, and insight needed to address real neighborhood challenges.",
        pillars: [
          {
            title: "Health Education",
            description: "Demystifying emergency response, CPR basics, pediatric first aid, and everyday mental and physical health literacy through hands-on practice.",
          },
          {
            title: "Accessible Knowledge",
            description: "Placing Little Libraries in public parks and printing youth-designed educational card kits to put health wisdom directly into young hands.",
          },
          {
            title: "Community-Led Action",
            description: "Creating an open channel for any young person to propose, fund, and launch actionable community projects with our team's support.",
          },
        ],
      }),
    },
    {
      sectionKey: "programs",
      title: "Initiatives & Workshops",
      subtitle: "Real programs developed with healthcare educators, community leaders, and youth organizers.",
      layoutVariation: "cards-interactive",
      displayOrder: 3,
      isVisible: true,
      backgroundMode: "subtle-tint",
      contentJson: JSON.stringify({
        eyebrow: "What We Do",
        ctaTitle: "Have a proposal for our next workshop?",
        ctaButton: "Submit Your Proposal",
      }),
    },
    {
      sectionKey: "team",
      title: "The Youth Team",
      subtitle: "A dynamic group of facilitators, designers, and organizers guiding UFY's programs.",
      layoutVariation: "editorial",
      displayOrder: 4,
      isVisible: true,
      backgroundMode: "white",
      contentJson: JSON.stringify({
        eyebrow: "Meet Our Team",
        noteText: "Our core team is composed of passionate youth leaders and mentors dedicated to community health education.",
      }),
    },
    {
      sectionKey: "accepted-ideas",
      title: "Community Ideas in Action",
      subtitle: "Approved proposals from students and community members that are shaping our upcoming work.",
      layoutVariation: "grid",
      displayOrder: 5,
      isVisible: true,
      backgroundMode: "white",
      contentJson: JSON.stringify({
        eyebrow: "Community Voices",
        emptyText: "Ideas submitted by the community appear here once reviewed and approved by the UFY team.",
      }),
    },
    {
      sectionKey: "community-idea",
      title: "Have an Idea for UFY?",
      subtitle: "Help shape what comes next. Propose an activity, workshop topic, library location, or community resource.",
      layoutVariation: "form-prominent",
      displayOrder: 6,
      isVisible: true,
      backgroundMode: "purple",
      contentJson: JSON.stringify({
        eyebrow: "Shape the Future",
        promiseTitle: "How We Review Every Idea",
        promisePoints: [
          "Every proposal is read directly by our youth coordinator team.",
          "We never publish your contact information or personal notes.",
          "Viable projects receive mentorship, materials, and support to become real initiatives.",
        ],
        categories: [
          "First Aid & Health Workshop",
          "Little Libraries & Books",
          "Educational Cards & Zines",
          "Community Partnership",
          "Youth Well-Being Event",
          "Other Idea",
        ],
      }),
    },
  ];

  for (const s of sections) {
    await prisma.pageSection.create({ data: s });
  }
  console.log("✅ Page sections seeded");

  // 8. Seed an approved sample idea so the Approved Ideas showcase has authentic content
  const sampleIdea = await prisma.ideaSubmission.create({
    data: {
      title: "Pocket CPR Quick-Reference Cards for Sports Teams",
      category: "First Aid & Health Workshop",
      description: "Produce waterproof, badge-sized emergency CPR cards that student athletes can keep attached to their sports bags.",
      problemAddressed: "During after-school sports practices, coaches and teammates need instantaneous reminders for chest compression rhythm and emergency dispatch steps.",
      proposedApproach: "Collaborate with local EMS trainers to verify the graphic card layout, then pilot 200 copies with high school track and soccer teams.",
      status: "ACCEPTED",
      internalNotes: "Reviewed by Maya Lin and Jordan Chen. Verified with local pediatric first-aid guidelines. Material sample approved.",
      linkedOutcome: "Integrated into upcoming Youth Emergency Response workshop batch in May 2026.",
      isPubliclyDisplayed: true,
      submitterEmail: null, // Zero personal info displayed
    },
  });
  console.log(`✅ Approved community idea sample seeded: ${sampleIdea.title}`);

  // 9. Initial Revision Snapshot
  const initialSnapshot = {
    settings: siteSettings,
    sections,
    team: teamMembers,
    programs,
    timestamp: new Date().toISOString(),
  };
  await prisma.siteRevision.create({
    data: {
      revisionNumber: 1,
      title: "Initial UFY Production Release",
      description: "Default brand deployment with 6 team members, core initiatives, and community idea portal.",
      snapshotJson: JSON.stringify(initialSnapshot),
      createdById: admin.id,
    },
  });
  console.log("✅ Initial revision snapshot created");

  console.log("🎉 Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

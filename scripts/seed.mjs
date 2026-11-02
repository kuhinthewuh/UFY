import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Up for Youth (UFY) database...");

  // 1. Initial Admin Account
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
  console.log(`✅ Admin user ready: ${admin.email}`);

  // 2. SiteSettings (UFY — Up for Youth)
  const settingsData = {
    siteTitle: "UFY — Up for Youth | Youth-Led Action, Health & Community Care",
    brandTagline: "Up for Youth",
    siteDescription:
      "Up for Youth (UFY) is a youth-driven collective equipping young people with first-aid skills, educational videos, virtual hospital letters, and neighborhood literacy initiatives.",
    logoUrl: null,
    logoHeight: 40,
    logoWidth: 120,
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
    footerMissionText:
      "Up for Youth (UFY) mobilizes student leaders in Manteca, CA and beyond to deliver uplifting hospital letters, peer-led emergency readiness education, and free neighborhood book drives.",
    footerLocationText: "MANTECA, CA • UP FOR YOUTH (UFY)",
    contactEmail: "hello@ufy.org",
    ufyInboxEmail: "ideas@ufy.org",
    proposeTitle: "UFY Community Mailbox",
    proposeSubtitle:
      "Drop your boldest youth-led initiative, workshop proposal, or school collaboration directly into the Up for Youth organizing inbox.",
    journeyTitle: "Our Community Journey",
    journeySubtitle:
      "Follow Up for Youth's winding expedition trail of pediatric hospital visits, student CPR trainings, and neighborhood literacy campaigns.",
    impactTitle: "Our Community Impact",
    impactSubtitle:
      "Live metrics capturing thousands of smiles delivered, youth trained in emergency readiness, and neighborhood books distributed by Up for Youth.",
    galleryTitle: "Moments in Motion",
    gallerySubtitle:
      "Spin, drag, and tap through our interactive 3D Dome Gallery of hospital care visits, youth CPR certifications, and Up for Youth changemakers in Manteca and beyond.",
    teamTitle: "Meet Our Youth Leaders",
    teamSubtitle:
      "Passionate young organizers leading compassionate health literacy, pediatric hospital care, and community solidarity at Up for Youth.",
    videosTitle: "Educational Videos",
    videosSubtitle:
      "Bite-sized, youth-led lessons on Hands-Only CPR, first-aid readiness, mental wellness, and compassionate community care.",
    videosEducatedCount: 0,
    videosGridColumns: 3,
    volunteerTitle: "Become an Up for Youth Volunteer",
    volunteerSubtitle:
      "Create your free UFY Volunteer Account to join youth workshops, write virtual letters for hospitalized kids, and earn verified community service hours.",
    lettersTitle: "Virtual Letters & Affirmations",
    lettersSubtitle:
      "Send a virtual envelope of encouragement to hospitalized youth and fellow students—or sign in with your UFY Volunteer Account to earn verified volunteer hours.",
    hoursPerLetter: 0.25,
    autoApproveLetters: true,
    socialInstagram: "https://instagram.com",
    socialYoutube: "https://youtube.com",
    socialLinkedin: "https://linkedin.com",
    socialGithub: "https://github.com/kuhinthewuh/UFY",
    copyrightText: `© ${new Date().getFullYear()} UFY — Up for Youth. Built by youth, for youth.`,
    privacyNotice:
      "Up for Youth strictly protects student & youth privacy. Zero invasive tracking, zero data selling.",
    enableReducedMotion: false,
    teamDisplayCount: 6,
    teamPresentationStyle: "editorial",
    isPublished: true,
  };

  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: settingsData,
    create: { id: "global", ...settingsData },
  });
  console.log("✅ SiteSettings synced (UFY — Up for Youth)");

  // 3. ThemeSettings (Edge-to-Edge 100% + Signature Lilac/Purple Palette)
  const themeData = {
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
  };

  await prisma.themeSettings.upsert({
    where: { id: "global" },
    update: themeData,
    create: { id: "global", ...themeData },
  });
  console.log("✅ ThemeSettings synced (100% Edge-to-Edge)");

  // 4. Navigation Items (All Core Pages)
  await prisma.navigationItem.deleteMany({});
  const navItems = [
    { label: "Home", path: "/", displayOrder: 1, isVisible: true, isCta: false },
    { label: "Educational Videos", path: "/videos", displayOrder: 2, isVisible: true, isCta: false },
    { label: "Virtual Letters", path: "/letters", displayOrder: 3, isVisible: true, isCta: false },
    { label: "Our Journey", path: "/journey", displayOrder: 4, isVisible: true, isCta: false },
    { label: "Impact", path: "/impact", displayOrder: 5, isVisible: true, isCta: false },
    { label: "Our Team", path: "/team", displayOrder: 6, isVisible: true, isCta: false },
    { label: "Gallery", path: "/gallery", displayOrder: 7, isVisible: true, isCta: false },
    { label: "Propose", path: "/propose", displayOrder: 8, isVisible: true, isCta: false },
  ];
  for (const item of navItems) {
    await prisma.navigationItem.create({ data: item });
  }
  console.log("✅ 8 Navigation routes seeded");

  // 5. Homepage PageSections (Matched to UfyMainPage)
  await prisma.pageSection.deleteMany({});
  const sections = [
    {
      sectionKey: "hero",
      title: "Up for Youth — Compassion & Action in Motion.",
      subtitle:
        "UFY (Up for Youth) unites student leaders across schools and cities to deliver uplifting hospital letters, peer-taught emergency readiness, educational videos, and community book drives.",
      layoutVariation: "default",
      displayOrder: 1,
      isVisible: true,
      backgroundMode: "transparent",
      contentJson: JSON.stringify({
        primaryButtonText: "Become a Volunteer",
        primaryButtonLink: "/volunteer",
        secondaryButtonText: "Educational Videos",
        secondaryButtonLink: "/videos",
      }),
    },
    {
      sectionKey: "initiatives",
      title: "initiatives",
      subtitle:
        "Hands-on programs designed and led by Up for Youth student organizers—open for anyone to join or bring to their school.",
      layoutVariation: "cards",
      displayOrder: 2,
      isVisible: true,
      backgroundMode: "transparent",
      contentJson: JSON.stringify({ eyebrow: "What UFY Does" }),
    },
    {
      sectionKey: "affirmations",
      title: "words of affirmation",
      subtitle:
        "Tap any sealed envelope below to read a sweet message written by our community—or write your own virtual letter for hospitalized youth!",
      layoutVariation: "default",
      displayOrder: 3,
      isVisible: true,
      backgroundMode: "transparent",
      contentJson: JSON.stringify({ eyebrow: "Virtual Letter Desk" }),
    },
    {
      sectionKey: "leaders",
      title: "our team",
      subtitle:
        "Meet the student organizers, health educators, and creatives steering Up for Youth.",
      layoutVariation: "editorial",
      displayOrder: 4,
      isVisible: true,
      backgroundMode: "transparent",
      contentJson: JSON.stringify({ eyebrow: "Organizing Collective" }),
    },
    {
      sectionKey: "impact",
      title: "impact",
      subtitle:
        "Every card written, video watched, and workshop hosted compounds into measurable neighborhood care.",
      layoutVariation: "default",
      displayOrder: 5,
      isVisible: true,
      backgroundMode: "transparent",
      contentJson: JSON.stringify({ eyebrow: "Verified Impact" }),
    },
  ];
  for (const s of sections) {
    await prisma.pageSection.create({ data: s });
  }
  console.log("✅ 5 Homepage sections seeded");

  // 6. Educational Videos (6 Rich Modules with Real Educational YouTube Links)
  await prisma.educationalVideo.deleteMany({});
  const videos = [
    {
      title: "Hands-Only CPR: Save a Life in Two Simple Steps",
      category: "First-Aid & CPR",
      description:
        "Learn the two essential steps of Hands-Only CPR—calling 911 and pushing hard and fast in the center of the chest at 100–120 beats per minute.",
      youtubeUrl: "https://www.youtube.com/watch?v=M4ACYp75mjU",
      thumbnailUrl: "https://img.youtube.com/vi/M4ACYp75mjU/hqdefault.jpg",
      duration: "1:35",
      instructor: "AHA & UFY Health Track",
      viewsCount: 0,
      isFeatured: true,
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: "How to Use an AED (Automated External Defibrillator)",
      category: "First-Aid & CPR",
      description:
        "Demystifying public AED cabinets found in schools and gyms so any student can step in with calm confidence during a cardiac emergency.",
      youtubeUrl: "https://www.youtube.com/watch?v=UFvL7wTFzl0",
      thumbnailUrl: "https://img.youtube.com/vi/UFvL7wTFzl0/hqdefault.jpg",
      duration: "3:18",
      instructor: "Red Cross & UFY Peer Demo",
      viewsCount: 0,
      isFeatured: true,
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: "Choking First-Aid: Conscious Adult & Teen Relief",
      category: "First-Aid & CPR",
      description:
        "Step-by-step walkthrough of recognizing severe airway obstruction and performing safe back blows and abdominal thrusts.",
      youtubeUrl: "https://www.youtube.com/watch?v=PA9hpOnvtCk",
      thumbnailUrl: "https://img.youtube.com/vi/PA9hpOnvtCk/hqdefault.jpg",
      duration: "2:42",
      instructor: "Emergency Care Module",
      viewsCount: 0,
      isFeatured: false,
      displayOrder: 3,
      isPublished: true,
    },
    {
      title: "Box Breathing & Grounding for Student Exam Stress",
      category: "Youth Mental Wellness",
      description:
        "A calm, practical 4-4-4-4 breathing and sensory reset routine youth can use before exams, games, or overwhelming moments.",
      youtubeUrl: "https://www.youtube.com/watch?v=tEmt1Znux58",
      thumbnailUrl: "https://img.youtube.com/vi/tEmt1Znux58/hqdefault.jpg",
      duration: "4:10",
      instructor: "UFY Wellness Circle",
      viewsCount: 0,
      isFeatured: false,
      displayOrder: 4,
      isPublished: true,
    },
    {
      title: "How Thoughtful Letters Uplift Hospitalized Youth",
      category: "Pediatric Empathy",
      description:
        "Why inclusive, creative letters matter for young patients spending weeks in pediatric wards—and how to write cards that truly brighten their day.",
      youtubeUrl: "https://www.youtube.com/watch?v=1Evwgu369Jw",
      thumbnailUrl: "https://img.youtube.com/vi/1Evwgu369Jw/hqdefault.jpg",
      duration: "2:55",
      instructor: "Empathy & Care Series",
      viewsCount: 0,
      isFeatured: false,
      displayOrder: 5,
      isPublished: true,
    },
    {
      title: "Recognizing Signs of Stroke FAST in Your Neighborhood",
      category: "Community Health",
      description:
        "Empowering teenagers and families to remember Face, Arms, Speech, Time (F.A.S.T.) so grandparents and neighbors get rapid care.",
      youtubeUrl: "https://www.youtube.com/watch?v=mkpbbWZvYmw",
      thumbnailUrl: "https://img.youtube.com/vi/mkpbbWZvYmw/hqdefault.jpg",
      duration: "2:12",
      instructor: "UFY Community Health",
      viewsCount: 0,
      isFeatured: false,
      displayOrder: 6,
      isPublished: true,
    },
  ];
  for (const v of videos) {
    await prisma.educationalVideo.create({ data: v });
  }
  console.log("✅ 6 Educational Videos seeded");

  // 7. Reset Volunteers & Virtual Affirmation Letters to Clean Launch State (0 Placeholder Letters/Accounts)
  await prisma.affirmationLetter.deleteMany({});
  await prisma.volunteer.deleteMany({});
  console.log("✅ Volunteers & Affirmation Envelopes cleared to 0 for real community launch");

  // 8. Programs / Initiatives (Zeroed Launch Counters)
  await prisma.program.deleteMany({});
  const programs = [
    {
      title: "Virtual & Handwritten Hospital Letters",
      category: "Pediatric Care",
      summary:
        "Crafting uplifting watercolor cards and virtual affirmation envelopes for hospitalized children and teens—earning verified volunteer hours from anywhere.",
      description:
        "Partnering with pediatric wards and youth clinics, UFY volunteers write inclusive, cheerful letters that remind young patients they have a whole community cheering them on.",
      impactStat: "0 Letters Delivered",
      ctaLabel: "write a letter",
      accentColor: "#7629f0",
      status: "active",
      dateLabel: "24/7 Virtual + Monthly Drops",
      externalUrl: "/letters",
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: "Hands-Only CPR & Youth First-Aid Clinics",
      category: "Emergency Readiness",
      summary:
        "Peer-to-peer school workshops and bite-sized educational videos teaching chest compressions, AED confidence, and choking relief.",
      description:
        "Our student facilitators demystify lifesaving emergency care using training mannequins and accessible video modules so young people never freeze in a crisis.",
      impactStat: "0 People Educated",
      ctaLabel: "watch videos",
      accentColor: "#8e48ff",
      status: "active",
      dateLabel: "Bi-Weekly Campus Workshops",
      externalUrl: "/videos",
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: "Little Libraries & Youth Book Drives",
      category: "Neighborhood Literacy",
      summary:
        "Building, painting, and stocking neighborhood micro-libraries with children's picture books, STEM guides, and youth wellness zines.",
      description:
        "Curated by Up for Youth chapters in Manteca and beyond to make reading joyful and free in parks, clinics, and community centers.",
      impactStat: "0 Books Shared",
      ctaLabel: "join a drive",
      accentColor: "#5c18c9",
      status: "active",
      dateLabel: "Seasonal Chapter Drives",
      externalUrl: "/volunteer",
      displayOrder: 3,
      isPublished: true,
    },
  ];
  for (const prog of programs) {
    await prisma.program.create({ data: prog });
  }
  console.log("✅ 3 Flagship UFY Initiatives seeded");

  // 9. Team Members (With Custom Clothespin Peg Colors & Portraits)
  await prisma.teamMember.deleteMany({});
  const teamMembers = [
    {
      name: "Maya Lin",
      role: "Co-Founder & Health Education Lead",
      department: "Health & CPR",
      pronouns: "she/her",
      bio: "Leads peer-to-peer Hands-Only CPR workshops and directs Up for Youth's accessible emergency readiness curriculum.",
      photoUrl: "/readymag_assets/speaker_1_giovanna.png",
      pegColor: "#e0c7a8",
      displayOrder: 1,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 35,
    },
    {
      name: "Tariq Al-Mansoor",
      role: "Community Outreach Director",
      department: "Chapters & Drives",
      pronouns: "he/him",
      bio: "Coordinates neighborhood Little Libraries book drives and mentors new high-school Up for Youth chapters.",
      photoUrl: "/readymag_assets/speaker_2_lino_laura.png",
      pegColor: "#7629f0",
      displayOrder: 2,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 35,
    },
    {
      name: "Sofia Morales",
      role: "Creative & Hospital Letters Lead",
      department: "Pediatric Care",
      pronouns: "they/them",
      bio: "Curates hospital card-writing circles, stationery illustrations, and our virtual affirmation letter wall.",
      photoUrl: "/readymag_assets/speaker_3_helena.png",
      pegColor: "#8e48ff",
      displayOrder: 3,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 35,
    },
    {
      name: "Jordan Chen",
      role: "Educational Video Producer",
      department: "Media & Teaching",
      pronouns: "he/him",
      bio: "Produces bite-sized first-aid and mental wellness videos making health literacy engaging for students everywhere.",
      photoUrl: "/readymag_assets/speaker_4_esenia.png",
      pegColor: "#d4b8fc",
      displayOrder: 4,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 35,
    },
    {
      name: "Amara Okafor",
      role: "Neighborhood Literacy Lead",
      department: "Chapters & Drives",
      pronouns: "she/her",
      bio: "Organizes bilingual youth book collections and micro-library restorations across underserved parks and clinics.",
      photoUrl: "/readymag_assets/speaker_1_giovanna.png",
      pegColor: "#e0c7a8",
      displayOrder: 5,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 35,
    },
    {
      name: "Devon Ellis",
      role: "Volunteer & Proposal Coordinator",
      department: "Youth Organizing",
      pronouns: "they/he",
      bio: "Verifies student volunteer hours and helps young changemakers turn mailbox ideas into funded community action.",
      photoUrl: "/readymag_assets/speaker_3_helena.png",
      pegColor: "#7629f0",
      displayOrder: 6,
      isPublished: true,
      focalPointX: 50,
      focalPointY: 35,
    },
  ];
  for (const m of teamMembers) {
    await prisma.teamMember.create({ data: m });
  }
  console.log("✅ 6 UFY Team Leaders seeded");

  // 10. Journey Nodes (Zeroed Stats Ready for Admin Updates)
  await prisma.journeyNode.deleteMany({});
  const journeyNodes = [
    {
      title: "Founding Hospital Encouragement Drive",
      dateLabel: "Manteca Chapter",
      location: "Children's Hospital Pediatric Wing",
      category: "Hospital Action",
      description:
        "Up for Youth mobilizes student volunteers to create watercolor-illustrated and virtual encouragement letters to brighten inpatient rooms.",
      stats: "0 Letters Delivered",
      badgeLabel: "UFY Origin",
      imageUrl: "/readymag_assets/speaker_1_giovanna.png",
      isHighlight: true,
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: "Student Hands-Only CPR Clinic",
      dateLabel: "Campus Outreach",
      location: "Student Union Commons",
      category: "First-Aid CPR",
      description:
        "Peer-led training in chest compression rhythm, AED pad placement, and calm emergency dispatch communication.",
      stats: "0 Youth Trained",
      badgeLabel: "Campus Clinic",
      imageUrl: "/readymag_assets/speaker_2_lino_laura.png",
      isHighlight: false,
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: "Neighborhood Micro-Library Drive",
      dateLabel: "Community Literacy",
      location: "Community Park & Youth Center",
      category: "Book Drive",
      description:
        "Stocking public Little Libraries with picture books, STEM guides, and youth novels.",
      stats: "0 Books Installed",
      badgeLabel: "Literacy Push",
      imageUrl: "/readymag_assets/speaker_3_helena.png",
      isHighlight: false,
      displayOrder: 3,
      isPublished: true,
    },
    {
      title: "Seasonal Pediatric Care Kit Drive",
      dateLabel: "Hospital Outreach",
      location: "Regional Pediatric Ward",
      category: "Hospital Action",
      description:
        "Mobilizing teen writers across local schools to assemble seasonal encouragement envelopes and care kits.",
      stats: "0 Care Envelopes",
      badgeLabel: "Care Drive",
      imageUrl: "/readymag_assets/speaker_4_esenia.png",
      isHighlight: true,
      displayOrder: 4,
      isPublished: true,
    },
    {
      title: "High-School First-Aid Workshop",
      dateLabel: "School Tour",
      location: "Auditorium Assembly",
      category: "First-Aid CPR",
      description:
        "Interactive student workshop equipping high-school peers with choking relief maneuvers and cardiac response basics.",
      stats: "0 Students Equipped",
      badgeLabel: "School Tour",
      imageUrl:
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
      isHighlight: false,
      displayOrder: 5,
      isPublished: true,
    },
    {
      title: "Launch of Digital Videos & Virtual Letter Desk",
      dateLabel: "2026 Launch",
      location: "UFY Digital Platform",
      category: "Milestone",
      description:
        "Expanding Up for Youth online with open-access educational videos and virtual hospital letter writing for verified student volunteer hours.",
      stats: "0 Educated Online",
      badgeLabel: "Digital Launch",
      imageUrl:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
      isHighlight: true,
      displayOrder: 6,
      isPublished: true,
    },
  ];
  for (const node of journeyNodes) {
    await prisma.journeyNode.create({ data: node });
  }
  console.log("✅ 6 Journey Trail Milestones seeded (stats reset to 0)");

  // 11. Impact Metrics (All Reset to 0 for Real Admin Updates)
  await prisma.impactMetric.deleteMany({});
  const impactMetrics = [
    {
      label: "Hospital Letters & Affirmations",
      targetValue: 0,
      currentValue: 0,
      prefix: "",
      suffix: "",
      subtitle: "Handcrafted & virtual notes of encouragement shared with youth",
      icon: "Heart",
      color: "#7629f0",
      isLive: true,
      displayOrder: 1,
      isPublished: true,
    },
    {
      label: "Youth Educated in First-Aid",
      targetValue: 0,
      currentValue: 0,
      prefix: "",
      suffix: "",
      subtitle: "Students reached via Hands-Only CPR workshops & UFY video modules",
      icon: "Activity",
      color: "#8e48ff",
      isLive: true,
      displayOrder: 2,
      isPublished: true,
    },
    {
      label: "Donated Books Distributed",
      targetValue: 0,
      currentValue: 0,
      prefix: "",
      suffix: "",
      subtitle: "Books placed in free neighborhood micro-libraries & waiting rooms",
      icon: "BookOpen",
      color: "#5c18c9",
      isLive: true,
      displayOrder: 3,
      isPublished: true,
    },
    {
      label: "Verified Volunteer Hours",
      targetValue: 0,
      currentValue: 0,
      prefix: "",
      suffix: " hrs",
      subtitle: "Service hours earned by student organizers & virtual letter writers",
      icon: "Clock",
      color: "#7629f0",
      isLive: true,
      displayOrder: 4,
      isPublished: true,
    },
    {
      label: "School & Clinic Partners",
      targetValue: 0,
      currentValue: 0,
      prefix: "",
      suffix: "",
      subtitle: "High schools, youth centers, and pediatric wards collaborating with UFY",
      icon: "Users",
      color: "#8e48ff",
      isLive: true,
      displayOrder: 5,
      isPublished: true,
    },
    {
      label: "Moments of Youth Uplift",
      targetValue: 0,
      currentValue: 0,
      prefix: "",
      suffix: "",
      subtitle: "Smiles sparked across workshops, hospital deliveries, and affirmation envelopes",
      icon: "Award",
      color: "#7629f0",
      isLive: true,
      displayOrder: 6,
      isPublished: true,
    },
  ];
  for (const metric of impactMetrics) {
    await prisma.impactMetric.create({ data: metric });
  }
  console.log("✅ 6 Impact Counters seeded (all set to 0)");

  // 12. Clothesline Gallery Photos
  await prisma.galleryPhoto.deleteMany({});
  const galleryPhotos = [
    {
      imageUrl: "/readymag_assets/speaker_1_giovanna.png",
      caption: "Inaugural Up for Youth card-writing circle for pediatric wards",
      dateLabel: "Nov 2024",
      location: "Children's Wing",
      orientation: "portrait",
      tiltAngle: -3.0,
      pegColor: "#e0c7a8",
      displayOrder: 1,
      isPublished: true,
    },
    {
      imageUrl: "/readymag_assets/speaker_2_lino_laura.png",
      caption: "Hands-Only CPR compression rhythm practice with student facilitators",
      dateLabel: "Jan 2025",
      location: "Student Commons",
      orientation: "landscape",
      tiltAngle: 2.6,
      pegColor: "#7629f0",
      displayOrder: 2,
      isPublished: true,
    },
    {
      imageUrl: "/readymag_assets/speaker_3_helena.png",
      caption: "Sorting bilingual children's books for neighborhood Little Libraries",
      dateLabel: "Apr 2025",
      location: "Community Hub",
      orientation: "portrait",
      tiltAngle: -2.2,
      pegColor: "#d4b8fc",
      displayOrder: 3,
      isPublished: true,
    },
    {
      imageUrl: "/readymag_assets/speaker_4_esenia.png",
      caption: "Sealing winter encouragement envelopes & origami stars",
      dateLabel: "Dec 2025",
      location: "Pediatric Drive",
      orientation: "landscape",
      tiltAngle: 3.1,
      pegColor: "#e0c7a8",
      displayOrder: 4,
      isPublished: true,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
      caption: "High-school emergency readiness workshop & AED walkthrough",
      dateLabel: "Feb 2026",
      location: "Campus Auditorium",
      orientation: "portrait",
      tiltAngle: -2.5,
      pegColor: "#8e48ff",
      displayOrder: 5,
      isPublished: true,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      caption: "Restocking park book kiosks with youth wellness zines & novels",
      dateLabel: "Mar 2026",
      location: "Park Kiosk",
      orientation: "landscape",
      tiltAngle: 1.9,
      pegColor: "#e0c7a8",
      displayOrder: 6,
      isPublished: true,
    },
  ];
  for (const photo of galleryPhotos) {
    await prisma.galleryPhoto.create({ data: photo });
  }
  console.log("✅ 6 Gallery Polaroids seeded");

  // 13. Clear Placeholder Idea Submissions & Analytics Events for Clean Launch
  await prisma.ideaSubmission.deleteMany({});
  await prisma.analyticsEvent.deleteMany({});
  console.log("✅ Idea submissions & analytics events cleared to 0 for launch");

  // 14. Initial Revision Snapshot
  const count = await prisma.siteRevision.count();
  if (count === 0) {
    await prisma.siteRevision.create({
      data: {
        revisionNumber: 1,
        title: "Up for Youth (UFY) — Full Studio Launch",
        description:
          "Edge-to-edge aesthetic overhaul, Educational Videos hub, Virtual Letters & Volunteer Hours portal, and full no-code Admin Builder.",
        snapshotJson: JSON.stringify({
          settings: siteSettings,
          theme: themeData,
          sections,
          snapshotTimestamp: new Date().toISOString(),
        }),
        createdById: admin.id,
      },
    });
  }

  console.log("🎉 Up for Youth database seeded cleanly!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

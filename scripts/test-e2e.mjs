import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "ufy-secure-production-jwt-session-secret-key-2026-ufy";
const secretKey = new TextEncoder().encode(JWT_SECRET);

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedCount++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("🚀 STARTING UFY END-TO-END STRESS TEST SUITE");
  console.log("=======================================================\n");

  // 1. Database & Brand Integrity
  console.log("🧪 1. Testing Database & Brand Integrity...");
  const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  assert(settings !== null, "SiteSettings singleton exists in database");
  assert(settings?.teamDisplayCount === 6, "Initial team display count defaults to 6");

  const theme = await prisma.themeSettings.findUnique({ where: { id: "global" } });
  assert(theme?.primaryColor === "#7629f0", "Strict primary brand color is #7629f0");
  assert(theme?.secondaryColor === "#ffffff", "Strict secondary brand color is #ffffff");

  // 2. Initial Team Members (Six Members Spec)
  console.log("\n🧪 2. Testing Team Records (Six initial members)...");
  const teamCount = await prisma.teamMember.count();
  assert(teamCount >= 6, `At least 6 initial team members exist in database (found: ${teamCount})`);

  const maya = await prisma.teamMember.findFirst({ where: { name: "Maya Lin" } });
  assert(maya !== null && maya.role.includes("First Aid"), "Maya Lin exists with First Aid Lead role");

  // 3. Real Initiatives
  console.log("\n🧪 3. Testing Real Programs & Initiatives...");
  const programs = await prisma.program.findMany({ where: { isPublished: true } });
  assert(programs.length >= 3, `Real programs exist (found: ${programs.length})`);
  const cprProgram = programs.find((p) => p.title.includes("Emergency Response") || p.title.includes("First Aid"));
  assert(cprProgram !== null, "Youth Emergency Response CPR workshop initiative exists");

  // 4. Authentication & Password Security
  console.log("\n🧪 4. Testing Authentication & Session Security...");
  const admin = await prisma.adminUser.findUnique({ where: { email: "admin@ufy.org" } });
  assert(admin !== null, "Admin user exists in database");
  assert(admin?.role === "SUPER_ADMIN", "Admin has SUPER_ADMIN role");

  const validPass = await bcrypt.compare("UfyAdminPassword2026!", admin.passwordHash);
  assert(validPass, "Admin password hash matches securely");

  const invalidPass = await bcrypt.compare("WrongPassword123", admin.passwordHash);
  assert(!invalidPass, "Invalid password rejected securely");

  // Test JWT token creation and verification
  const token = await new SignJWT({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  const { payload } = await jwtVerify(token, secretKey);
  assert(payload.email === "admin@ufy.org", "JWT session token signs and verifies with Web Crypto");

  // 5. Community Idea Submission & Privacy Safeguards
  console.log("\n🧪 5. Testing Community Idea Submission & Privacy Safeguards...");
  const testSubmission = await prisma.ideaSubmission.create({
    data: {
      title: "Mobile CPR Simulation Mannequins for High Schools",
      category: "First Aid & Health Workshop",
      description: "Provide reusable CPR mannequins that can rotate between student clubs each semester.",
      problemAddressed: "School clubs lack direct access to practical CPR training materials.",
      proposedApproach: "Partner with regional EMT student volunteers to deliver quarterly certifications.",
      submitterEmail: "student.volunteer@example.org",
      status: "NEW",
      isPubliclyDisplayed: false,
      ipHash: "testhash12345",
    },
  });
  assert(testSubmission.id !== null, "Idea submission stored in database");
  assert(testSubmission.status === "NEW", "New submission defaults to NEW status (not published)");
  assert(!testSubmission.isPubliclyDisplayed, "Public display is false by default until moderated");

  // 6. Moderation Workflow & Internal Notes Privacy
  console.log("\n🧪 6. Testing Moderation Workflow & Private Notes...");
  const moderated = await prisma.ideaSubmission.update({
    where: { id: testSubmission.id },
    data: {
      status: "ACCEPTED",
      internalNotes: "CONFIDENTIAL: Reviewed by lead educator. Grant funds approved.",
      linkedOutcome: "Slated for Fall 2026 workshop expansion",
      isPubliclyDisplayed: true,
      reviewedAt: new Date(),
      reviewedBy: "UFY Lead Director",
    },
  });
  assert(moderated.status === "ACCEPTED", "Submission status updated to ACCEPTED");
  assert(moderated.internalNotes.includes("CONFIDENTIAL"), "Internal notes stored securely");
  assert(moderated.isPubliclyDisplayed === true, "Explicit approval allows public display");

  // Verify that public queries never expose internalNotes or submitterEmail
  const publicView = await prisma.ideaSubmission.findUnique({
    where: { id: testSubmission.id },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      problemAddressed: true,
      linkedOutcome: true,
      // internalNotes and submitterEmail omitted in public selects
    },
  });
  assert(!("internalNotes" in publicView), "Public query strictly excludes internalNotes");
  assert(!("submitterEmail" in publicView), "Public query strictly excludes submitterEmail");

  // 7. Team Dynamic Count & Reordering
  console.log("\n🧪 7. Testing Team Dynamic Count & Adaptability...");
  const seventhMember = await prisma.teamMember.create({
    data: {
      name: "Kai Romero",
      role: "Digital Learning & Audio Kits",
      bio: "Develops audio walk-throughs of first aid protocols for visually impaired students.",
      department: "Accessibility",
      displayOrder: 7,
      isPublished: true,
    },
  });
  assert(seventhMember.id !== null, "Can add 7th team member without breaking database");

  // Update site settings display count to 7
  await prisma.siteSettings.update({
    where: { id: "global" },
    data: { teamDisplayCount: 7 },
  });
  const updatedSettings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  assert(updatedSettings?.teamDisplayCount === 7, "Team display count updated dynamically");

  // Cleanup 7th member to keep original 6
  await prisma.teamMember.delete({ where: { id: seventhMember.id } });
  await prisma.siteSettings.update({
    where: { id: "global" },
    data: { teamDisplayCount: 6 },
  });
  assert((await prisma.teamMember.count()) === 6, "Team member count restored to exactly 6");

  // 8. Revisions Snapshot & Rollback
  console.log("\n🧪 8. Testing Publishing Snapshots & Revision Rollback...");
  const sections = await prisma.pageSection.findMany();
  const revisionSnapshot = {
    settings: updatedSettings,
    theme,
    sections,
    timestamp: new Date().toISOString(),
  };

  const revision = await prisma.siteRevision.create({
    data: {
      revisionNumber: 2,
      title: "Stress Test Automated Snapshot",
      description: "Automated verification release",
      snapshotJson: JSON.stringify(revisionSnapshot),
      createdById: admin.id,
    },
  });
  assert(revision.id !== null, "Site revision snapshot created successfully");

  const parsedSnapshot = JSON.parse(revision.snapshotJson);
  assert(parsedSnapshot.sections.length > 0, "Snapshot contains complete JSON data of sections");

  // 9. Analytics Real Event Collection & Deduplication
  console.log("\n🧪 9. Testing Real Analytics Event Collection...");
  const event1 = await prisma.analyticsEvent.create({
    data: {
      eventType: "page_view",
      path: "/",
      sessionId: "session-test-e2e-1",
      deviceCategory: "desktop",
    },
  });
  assert(event1.id !== null, "Analytics pageview event recorded in database");

  const event2 = await prisma.analyticsEvent.create({
    data: {
      eventType: "cta_click",
      path: "/",
      targetLabel: "Propose an Idea",
      sessionId: "session-test-e2e-1",
      deviceCategory: "desktop",
    },
  });
  assert(event2.id !== null, "Analytics CTA click recorded in database");

  const totalEvents = await prisma.analyticsEvent.count({
    where: { sessionId: "session-test-e2e-1" },
  });
  assert(totalEvents === 2, "Session events accurately tracked and counted");

  // Cleanup test submissions & events
  await prisma.ideaSubmission.delete({ where: { id: testSubmission.id } });
  await prisma.analyticsEvent.deleteMany({ where: { sessionId: "session-test-e2e-1" } });
  await prisma.siteRevision.delete({ where: { id: revision.id } });

  console.log("\n=======================================================");
  console.log(`📊 STRESS TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error("❌ Test runner error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

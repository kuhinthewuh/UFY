import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      description,
      problemAddressed,
      proposedApproach,
      submitterEmail,
      honeypot, // Spam trap
    } = body;

    // 1. Honeypot check for bots
    if (honeypot && String(honeypot).trim().length > 0) {
      // Pretend success so bot doesn't retry
      return NextResponse.json({ success: true, message: "Thank you for sharing your idea!" });
    }

    // 2. Validate required inputs
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Idea title is required" }, { status: 400 });
    }
    if (!category || !category.trim()) {
      return NextResponse.json({ error: "Idea category is required" }, { status: 400 });
    }
    if (!description || description.trim().length < 10) {
      return NextResponse.json({ error: "Please provide a detailed description (at least 10 characters)" }, { status: 400 });
    }
    if (!problemAddressed || problemAddressed.trim().length < 5) {
      return NextResponse.json({ error: "Please describe what problem this addresses or who it helps" }, { status: 400 });
    }

    // Optional email format validation
    if (submitterEmail && submitterEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(submitterEmail.trim())) {
        return NextResponse.json({ error: "Please enter a valid email address or leave it blank" }, { status: 400 });
      }
    }

    // 3. Privacy-preserving rate limiting (hash IP with salt)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(ip + "ufy-privacy-salt-2026").digest("hex");

    const recentSubmissionsCount = await prisma.ideaSubmission.count({
      where: {
        ipHash,
        createdAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000), // last 15 min
        },
      },
    });

    if (recentSubmissionsCount >= 5) {
      return NextResponse.json(
        { error: "Too many proposals received recently from your network. Please wait a few minutes before submitting another." },
        { status: 429 }
      );
    }

    // 4. Create submission with NEW status (never auto-published)
    const newSubmission = await prisma.ideaSubmission.create({
      data: {
        title: title.trim().slice(0, 150),
        category: category.trim().slice(0, 80),
        description: description.trim().slice(0, 3000),
        problemAddressed: problemAddressed.trim().slice(0, 1500),
        proposedApproach: proposedApproach ? proposedApproach.trim().slice(0, 2000) : null,
        submitterEmail: submitterEmail ? submitterEmail.trim().toLowerCase().slice(0, 120) : null,
        status: "NEW",
        isPubliclyDisplayed: false,
        ipHash,
      },
    });

    // 5. Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventType: "idea_form_submit",
        path: "/",
        sectionId: "community-idea",
        targetLabel: newSubmission.category,
        sessionId: "sub-" + crypto.randomUUID(),
        deviceCategory: "desktop",
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: newSubmission.id,
      message: "Thank you! Your idea has been received and will be reviewed by the UFY team.",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to submit proposal. Please try again." }, { status: 500 });
  }
}

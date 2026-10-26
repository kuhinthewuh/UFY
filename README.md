# UFY — Complete Website, Visual CMS, Community Portal & Analytics Platform

A production-ready digital platform built for **UFY**, dedicated to youth-led health education, pediatric first aid workshops, community Little Libraries, and youth-driven initiatives.

---

## 🌟 The UFY Brand & Design Identity

- **Primary Brand Color**: `#7629f0` (UFY Purple)
- **Secondary Brand Color**: `#ffffff` (Pure White)
- **Strict Brand Restriction**: The entire public site and administrative suite exclusively use `#7629f0` and `#ffffff` alongside controlled tonal variations (tints and shades of `#7629f0`). No blue, green, orange, pink, or rainbow gradients.
- **Aesthetic**: Youthful, energetic, modern, and sleek. Built with asymmetric editorial layouts, expressive display typography, purposeful micro-animations, and balanced whitespace without generic AI template cards.

---

## 🚀 Key Features

### 1. The Public Website
- **Dynamic Header & Navigation**: Fully customizable links, logo sizing controls, accessible mobile drawer menu, and primary "Propose an Idea" call to action.
- **Bespoke Hero Section**: High-impact purple `#7629f0` canvas, expressive display typography, animated badge, and interactive preview cards.
- **Mission & Purpose**: Authentic split-editorial storytelling covering health literacy, peer CPR training, and community access.
- **Programs & Initiatives**: Reusable, database-backed program cards (Youth Emergency Response & First Aid, Little Libraries & Community Book Drive, Peer Health Cards).
- **Team Section**: 6 initial members by default (Maya Lin, Tariq Al-Mansoor, Sofia Morales, Jordan Chen, Amara Okafor, Devon Ellis) with configurable display limits and 3 presentation styles (`editorial`, `grid`, `offset`).
- **Community Idea Submission Portal**:
  - Interactive proposal form with category picker, proposal details, problem addressed, and optional email for updates.
  - Youth privacy protection notice advising against submitting medical or sensitive personal information.
  - Anti-spam honeypot and privacy-preserving rate limiting (IPs are hashed with SHA-256 salt; raw IPs are never stored).
  - Celebration confetti burst in UFY purple and white tones upon successful submission.
- **Approved Community Ideas Showcase**: Real proposals approved by UFY moderators, showing the community problem and linked outcome (zero submitter emails or private notes are exposed).
- **Footer**: Mission statement, navigation links, verified repository links, copyright, privacy statement, and admin portal gateway.

### 2. The 13 Dedicated Administrative Areas
1. **Overview**: Key metrics (real pageviews, unique sessions, proposals, active programs), recent activity feed, quick action shortcuts, and platform health.
2. **Visual Website Builder**:
   - 3-Panel workspace:
     - *Left Panel*: Section catalog, component hierarchy, drag-and-drop & keyboard accessible up/down reordering, duplicate, delete, and add custom sections.
     - *Center Panel*: Live interactive canvas with responsive viewport toggles (Desktop 1240px, Tablet 768px, Mobile 390px).
     - *Right Panel*: Contextual property inspector for active section (headings, subtitles, background mode, layout variation, raw JSON parameters).
   - Undo/Redo history stack.
   - Save Draft and Publish Live controls.
3. **Page Sections**: Structured editor for each individual website section.
4. **Typography & Theme Studio**:
   - Google Font selector for Headline and Body typefaces (`Space Grotesk`, `Syne`, `Outfit`, `Plus Jakarta Sans`, `Inter`).
   - Button corner radius controls (`0px`, `8px`, `14px`, `24px`, `9999px`).
   - Type scale multiplier and layout density settings.
   - "Restore UFY Brand Defaults" button.
5. **Media Library**: Real asset upload manager with file validation, interactive focal point & crop reticle, alt text editor, caption, and safe deletion checks.
6. **Team Management**: Complete member editor (add, edit, duplicate, reorder, delete), display count limiter, and presentation style selector (`editorial`, `grid`, `offset`).
7. **Programs & Initiatives**: Program CRUD manager, status selector (`active`, `upcoming`, `completed`, `proposed`), dates, links, and display order.
8. **Idea Inbox & Moderation**:
   - Moderation statuses: `NEW`, `UNDER_REVIEW`, `NEEDS_CLARIFICATION`, `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `DECLINED`.
   - Private internal team notes (never exposed publicly).
   - Linked outcome tracker.
   - "Publish to Public Showcase" toggle.
   - CSV export for reporting.
9. **Analytics Platform**:
   - 100% verified server-backed event tracking (zero fake demo numbers).
   - Metrics: Pageviews, unique sessions, CTA clicks, idea form starts, idea submissions, conversion rate.
   - Daily trends bar chart.
   - Device categories breakdown (`desktop`, `mobile`, `tablet`).
   - Date range filters (`7d`, `30d`, `90d`, `all`).
   - Analytics event log CSV export.
10. **Navigation & Footer**: Reorder header menu items, configure header CTA button, custom logo upload & height, footer mission copy, and copyright text.
11. **Site Settings & Launch Checklist**:
    - Global site title and meta descriptions for SEO.
    - Accessibility options (Reduced Motion default toggle).
    - 9-Step Launch Checklist guiding first-time administrators.
12. **Publishing & Revisions**:
    - Immutable database snapshots created upon every publication.
    - Full JSON snapshot inspector.
    - One-click revision rollback / restore.
13. **Users & Security**:
    - Role-based permissions (`SUPER_ADMIN` vs `EDITOR`).
    - Invite new administrator accounts.
    - Password update controls.
    - Secure initial admin provisioning.

---

## 🛠️ Technology Stack & Architecture

- **Framework**: Next.js 14 (App Router, TypeScript, React Server Components & Server Actions)
- **Database & ORM**: SQLite (`dev.db`) for immediate zero-config persistence, seamlessly switchable to PostgreSQL in production via `DATABASE_URL`
- **Authentication**: Secure HTTP-only JWT session cookies using `jose` (Web Crypto API) and `bcryptjs` password hashing
- **Styling**: Vanilla CSS Modules & CSS Design Tokens enforcing `#7629f0` and `#ffffff`
- **Analytics**: Lightweight client beacon logging to `/api/analytics/event` with 5-second session deduplication
- **Media Storage**: Local file system storage (`/public/uploads/`) with database-backed metadata and safe-delete validation

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed
```bash
# Push Prisma schema to SQLite dev.db
npm run db:push

# Seed database with UFY brand settings, 6 team members, and initial programs
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public website.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Portal.

---

## 🔐 Default Administrator Credentials

- **Email**: `admin@ufy.org`
- **Password**: `UfyAdminPassword2026!`
- **Role**: `SUPER_ADMIN`

You can also provision custom administrator accounts anytime from the CLI:
```bash
node scripts/create-admin.mjs <email> <password> <name> [role]
# Example:
node scripts/create-admin.mjs director@ufy.org MySecurePassword! "Alex Rivera" SUPER_ADMIN
```

---

## 🧪 Testing & Validation

Run the automated end-to-end stress test suite:
```bash
npm run test:e2e
```
Validates:
- Database models and brand constraints
- 6 initial team members
- Real programs and initiatives
- Authentication and session security
- Community proposal submissions and honeypot spam protection
- Moderation workflow and internal notes privacy
- Dynamic team display count and reordering
- Revision snapshots and rollback safety
- Real analytics event recording and deduplication

Run the production build:
```bash
npm run build
```

---

## 🚢 Production Deployment Guide

### Environment Variables (`.env`)
Copy `.env.example` to `.env`:
```bash
DATABASE_URL="file:./dev.db" # Or postgresql://... for PostgreSQL
JWT_SECRET="generate-a-secure-random-64-character-string"
INITIAL_ADMIN_EMAIL="admin@ufy.org"
INITIAL_ADMIN_PASSWORD="ChooseAStrongPassword123!"
INITIAL_ADMIN_NAME="UFY Lead Director"
NEXT_PUBLIC_APP_URL="https://ufy.org"
```

### Deploying to Vercel or Railway
1. Push repository to GitHub: `https://github.com/kuhinthewuh/UFY`
2. Connect repository to Vercel, Railway, or your chosen cloud host.
3. Configure `DATABASE_URL` (PostgreSQL connection string or persistent SQLite volume) and `JWT_SECRET`.
4. In build command, specify:
   ```bash
   npx prisma db push && node scripts/seed.mjs && next build
   ```
5. Deploy and log into `/admin` with your provisioned credentials.

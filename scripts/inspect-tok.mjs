import fs from "fs";

const html = fs.readFileSync("C:/Users/kusha/.gemini/antigravity-ide/brain/3ea9134d-5c45-4e2c-bc55-e288370526f9/.system_generated/steps/322/content.md", "utf8");

// Look for all top level elements inside <body>
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  const bodyContent = bodyMatch[1];
  
  // Find all direct/major container classes
  const classes = [...bodyContent.matchAll(/class="([^"]+)"/g)].map(m => m[1]);
  const uniqueClassRoots = [...new Set(classes.flatMap(c => c.split(/\s+/)).map(c => c.split('__')[0]))];
  console.log("=== COMPONENT ROOTS ===");
  console.log(uniqueClassRoots);
}

// Check scripts and animations: GSAP, Lenis, etc.?
const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
console.log("\n=== SCRIPTS ===");
console.log(scripts);

// Check if GSAP, Lenis, Locomotive, Swiper or custom JS are used
console.log("\nHas Lenis?", html.includes("lenis"));
console.log("Has GSAP?", html.includes("gsap"));
console.log("Has Swiper?", html.includes("swiper"));

// Let's examine the main sections and their HTML
const majorBlocks = [
  "module-soumission",
  "module-spontaneous-application",
  "header",
  "home-hero",
  "module-services",
  "module-projects",
  "module-about",
  "module-articles",
  "module-marquee",
  "footer"
];

console.log("\n=== MAJOR BLOCKS FOUND IN HTML ===");
for (const block of majorBlocks) {
  const count = (html.match(new RegExp(block, 'g')) || []).length;
  console.log(`${block}: ${count} occurrences`);
}

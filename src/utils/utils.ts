import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  codeLink?: string;
  link?: string;
};

// Words kept lowercase in titles made from slugs (except the first word)
const minorWords = new Set("a an and as at by for in of on or the to with".split(" "));

/**
 * Turn a slug into a title, e.g. "news-and-events" -> "News and Events"
 */
export function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((word, index) =>
      index > 0 && minorWords.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

/**
 * List the .mdx files in a folder as paths relative to it, e.g. "project.mdx", "project/page.mdx".
 * Files and folders starting with "_" are skipped (same idea as Next.js private folders),
 * so drafts and archived pages can be kept in e.g. "_old/" without being published.
 */
function getMDXFiles(dir: string, recursive: boolean, subDir = ""): string[] {
  return fs.readdirSync(path.join(dir, subDir), { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(subDir, entry.name);

    if (entry.name.startsWith("_")) return [];
    if (entry.isDirectory()) return recursive ? getMDXFiles(dir, recursive, file) : [];
    return path.extname(file) === ".mdx" ? [file] : [];
  });
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    // Pages without a title get one from the file name: "hero-banner-system" -> "Hero Banner System"
    title: data.title || slugToTitle(path.basename(filePath, ".mdx")),
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    codeLink: data.codeLink || "",
    link: data.link || "",
  };

  return { metadata, content };
}

function getMDXData(dir: string, recursive: boolean) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return getMDXFiles(dir, recursive).map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    // URL path relative to dir, always with "/" (also on Windows): "project/page.mdx" -> "project/page"
    const slug = file
      .replace(/\.mdx$/, "")
      .split(path.sep)
      .join("/");

    return {
      metadata,
      slug,
      content,
    };
  });
}

/**
 * All posts in a folder, including its subfolders.
 * "project.mdx" gets the slug "project", "project/page.mdx" gets "project/page".
 */
export function getPosts(customPath: string[]) {
  return getMDXData(path.join(process.cwd(), ...customPath), true);
}

/**
 * Only the posts directly inside a folder, without subfolders (e.g. projects without their pages).
 */
export function getTopLevelPosts(customPath: string[]) {
  return getMDXData(path.join(process.cwd(), ...customPath), false);
}

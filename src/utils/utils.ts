import fs from "fs";
import path from "path";
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

/**
 * Recursively collect all .mdx files from a folder and its subfolders
 */
function getAllMDXFilesRecursively(dir: string): string[] {
    if (!fs.existsSync(dir)) {
        notFound();
    }

    let results: string[] = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // dive deeper
            results = results.concat(getAllMDXFilesRecursively(fullPath));
        } else if (stat.isFile() && path.extname(file) === ".mdx") {
            results.push(fullPath);
        }
    }

    return results;
}

/**
 * Get only .mdx files directly inside a folder (NOT recursive)
 */
function getTopLevelMDXFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
        notFound();
    }

    return fs
        .readdirSync(dir)
        .filter((file) => path.extname(file) === ".mdx")
        .map((file) => path.join(dir, file));
}

/**
 * Public API for ONLY top-level MDX files
 */
export function getTopLevelPosts(customPath = ["", "", "", ""]) {
    const postsDir = path.join(process.cwd(), ...customPath);
    const mdxFiles = getTopLevelMDXFiles(postsDir);

    return mdxFiles.map((fullPath) => {
        const { metadata, content } = readMDXFile(fullPath);

        const slug = path.basename(fullPath, ".mdx");

        return {
            metadata,
            slug,
            content,
        };
    });
}

/**
 * Read one MDX file and extract metadata + content
 */
function readMDXFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const metadata: Metadata = {
        title: data.title || "",
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

/**
 * Read all nested MDX files and generate slug paths like:
 *  - "project-a"
 *  - "design/colors"
 *  - "design/ui/forms"
 */
function getMDXData(dir: string) {
    const mdxFiles = getAllMDXFilesRecursively(dir);

    return mdxFiles.map((fullPath) => {
        const { metadata, content } = readMDXFile(fullPath);

        // Create a relative slug
        const slug = fullPath
            .replace(dir + "/", "")      // remove base path
            .replace(/\.mdx$/, "");      // remove extension

        return {
            metadata,
            slug,
            content,
        };
    });
}

/**
 * Public API used in your page components
 */
export function getPosts(customPath = ["", "", "", ""]) {
    const postsDir = path.join(process.cwd(), ...customPath);
    return getMDXData(postsDir);
}

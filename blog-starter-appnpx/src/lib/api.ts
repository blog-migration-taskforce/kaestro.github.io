import { Post } from "@/interfaces/post";
import fs from "fs";
import { join } from "path";

const postsDirectory = join(process.cwd(), '.next/server/pages');

export function getPostSlugs() {
  const readDirectory = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries
      .filter((fileDirent) => fileDirent.isFile())
      .map((fileDirent) => join(dir, fileDirent.name));
    const folders = entries.filter((folderDirent) => folderDirent.isDirectory());
    for (const folder of folders) {
      files.push(...readDirectory(join(dir, folder.name)));
    }
    return files;
  };
  return readDirectory(postsDirectory);
}


export function getPostBySlug(slug: string) {
  const postsDirectory = join(process.cwd(), `.next/server/app/posts/${slug}`);
  const fullPath = join(postsDirectory, `page_client-reference-manifest.js`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const data = JSON.parse(fileContents);

  return { slug: slug, meta: data, content: '' };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((filePath) => getPostBySlug(filePath)) // Use filePath instead of slug
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
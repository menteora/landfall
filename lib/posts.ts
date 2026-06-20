import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, GraphData, E3Type } from '@/types/post';
import { buildGraph } from '@/lib/client-utils';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const pagesDirectory = path.join(process.cwd(), 'content/pages');

export function getPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const slug = data.slug || fileName.replace(/\.md$/, '');
      const wordsPerMinute = 200;
      const words = content.trim().split(/\s+/).length;
      const readingTime = `${Math.ceil(words / wordsPerMinute)} min read`;

      return {
        ...(data as Omit<Post, 'content' | 'slug' | 'readingTime'>),
        slug,
        type: (data.type as E3Type) || 'engage',
        tags: (data.tags as string[]) || [],
        readingTime,
        content,
      } as Post;
    });

  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllTags(): string[] {
  const posts = getPosts();
  const tags = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): Post[] {
  return getPosts().filter(post => 
    post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getGraphData(): GraphData {
  const posts = getPosts();
  return buildGraph(posts);
}

export interface PageData {
  title: string;
  subtitle?: string;
  image?: string;
  content: string;
}

export function getPageSlugs(): string[] {
  if (!fs.existsSync(pagesDirectory)) return [];
  const fileNames = fs.readdirSync(pagesDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}

export function getPage(slug: string): PageData | null {
  if (!fs.existsSync(pagesDirectory)) return null;
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    ...(data as Omit<PageData, 'content'>),
    content,
  };
}

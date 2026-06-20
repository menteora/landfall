export type E3Type = 'engage' | 'explain' | 'exchange';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: string;
  tags: string[];
  type: E3Type;
  readingTime?: string;
}

export interface GraphData {
  nodes: { id: string; title: string; category: string }[];
  links: { source: string; target: string }[];
}

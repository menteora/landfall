import { Post, GraphData, E3Type } from '@/types/post';

export function getRelatedPosts(currentPost: Post, allPosts: Post[], limit = 2): Post[] {
  const posts = allPosts.filter(p => p.slug !== currentPost.slug);
  return posts
    .map(post => ({
      post,
      score: post.tags.filter(tag => currentPost.tags.includes(tag)).length
    }))
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .slice(0, limit)
    .map(item => item.post);
}

export function buildGraph(posts: Post[]): GraphData {
  const nodes = posts.map(p => ({ 
    id: p.slug, 
    title: p.title, 
    category: p.tags[0] 
  }));
  
  const links: { source: string; target: string }[] = [];
  
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const commonTags = posts[i].tags.filter(tag => posts[j].tags.includes(tag));
      if (commonTags.length > 0) {
        links.push({ source: posts[i].slug, target: posts[j].slug });
      }
    }
  }
  
  return { nodes, links };
}

export function getLocalGraphData(slug: string, allPosts: Post[]): GraphData {
  const currentPost = allPosts.find(p => p.slug === slug);
  if (!currentPost) return { nodes: [], links: [] };

  const neighbors = allPosts.filter(p => 
    p.slug !== slug && p.tags.some(t => currentPost.tags.includes(t))
  );

  return buildGraph([currentPost, ...neighbors]);
}

/**
 * Percorso Evolutivo: 
 * Priorità 1: Non Letti con Tag comuni
 * Priorità 2: Non Letti dello stesso tipo target
 * Priorità 3: Già Letti con Tag comuni (per continuità)
 * Priorità 4: Già Letti dello stesso tipo target
 */
export function getE3Suggestions(currentPost: Post, allPosts: Post[], readSlugs: string[]): Post[] {
  const nextTypeMap: Record<E3Type, E3Type> = {
    'engage': 'explain',
    'explain': 'exchange',
    'exchange': 'engage'
  };
  
  const targetType = nextTypeMap[currentPost.type];
  // Engage posts show 2 explain suggestions as requested, others show 1
  const limit = currentPost.type === 'engage' ? 2 : 1;
  
  const pool = allPosts.filter(p => p.slug !== currentPost.slug && p.type === targetType);
  
  const getScore = (post: Post) => {
    let score = 0;
    const isRead = readSlugs.includes(post.slug);
    const hasCommonTags = post.tags.some(tag => 
      currentPost.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
    );
    
    if (!isRead) score += 100;
    if (hasCommonTags) score += 50;
    
    // Usiamo il tempo come tie-breaker
    score += new Date(post.date).getTime() / 100000000000;
    
    return score;
  };

  return pool
    .sort((a, b) => getScore(b) - getScore(a))
    .slice(0, limit);
}

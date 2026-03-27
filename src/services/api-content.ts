import { delay, getSingleton, getAll } from '@/lib/mock-db'

export interface BlogPost {
  slug: string
  title: string
  description?: string
  content: string
  date: string
  author?: string
  tags?: string[]
}

interface DocPage {
  page: { title: string; content: string }
  tree?: Array<{ slug: string; title: string; children?: Array<{ slug: string; title: string }> }>
  prev?: { slug: string; title: string }
  next?: { slug: string; title: string }
}

export const contentApi = {
  async docs(slug?: string): Promise<DocPage> {
    await delay()
    const docs = getSingleton<Record<string, DocPage>>('docs')
    return docs[slug ?? 'default'] ?? docs['default']
  },

  async blogPosts(): Promise<BlogPost[]> {
    await delay()
    return getAll<BlogPost>('blog_posts')
  },

  async blogPost(slug: string): Promise<BlogPost> {
    await delay()
    const posts = getAll<BlogPost>('blog_posts')
    const post = posts.find((p) => p.slug === slug)
    if (!post) throw new Error(`Blog post "${slug}" not found`)
    return post
  },

  async legal(page: string): Promise<{ title: string; content: string }> {
    await delay()
    const legal = getSingleton<Record<string, { title: string; content: string }>>('legal')
    return legal[page] ?? { title: 'Not Found', content: 'Page not found.' }
  }
}

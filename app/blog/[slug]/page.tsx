import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPost, getStoredBlogPost } from '@/lib/blog';
import { siteConfig } from '@/lib/site';
import { ShareButtons } from '@/components/ShareButtons';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = (await getStoredBlogPost(params.slug)) || getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = (await getStoredBlogPost(params.slug)) || getPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author || siteConfig.name },
    publisher: { '@type': 'Organization', name: siteConfig.name },
  };

  return (
    <article className="container-prose py-12">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft size={14} /> Bloggen
      </Link>
      <header className="mt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="flex items-center gap-2 text-xs text-slate-500"><Calendar size={12} /> {new Date(post.date).toLocaleDateString('sv-SE')}</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">{post.title}</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">{post.description}</p>
          </div>
          <ShareButtons 
            title={post.title}
            url={`${siteConfig.url}/blog/${post.slug}`}
            description={post.description}
          />
        </div>
      </header>
      <div className="prose prose-slate dark:prose-invert mt-10 max-w-none">
        <MDXRemote source={post.content} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </article>
  );
}

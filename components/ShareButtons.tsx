'use client';

import { Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Länk kopierad!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">Dela:</span>
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-600 dark:hover:text-brand-400 transition"
        aria-label="Dela på Twitter"
      >
        <Twitter size={18} />
      </a>
      <a
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-600 dark:hover:text-brand-400 transition"
        aria-label="Dela på LinkedIn"
      >
        <Linkedin size={18} />
      </a>
      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-600 dark:hover:text-brand-400 transition"
        aria-label="Dela på Facebook"
      >
        <Facebook size={18} />
      </a>
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-100 dark:hover:bg-brand-900 hover:text-brand-600 dark:hover:text-brand-400 transition"
        aria-label="Kopiera länk"
      >
        <LinkIcon size={18} />
      </button>
    </div>
  );
}

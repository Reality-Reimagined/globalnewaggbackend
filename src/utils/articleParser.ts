import DOMPurify from 'dompurify';
import type { Article } from '../types';

export function parseArticleContent(content: string): {
  cleanContent: string;
  imageUrl?: string;
} {
  // Remove any embedded articles or related content sections
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Remove common newsletter/related article sections
  const removeSelectors = [
    '.related-articles',
    '.newsletter-signup',
    '.embedded-posts',
    '.advertisement',
    '[data-related]',
    '[data-newsletter]',
  ];
  
  removeSelectors.forEach(selector => {
    tempDiv.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Extract the first image if present
  let imageUrl: string | undefined;
  const firstImage = tempDiv.querySelector('img');
  if (firstImage) {
    imageUrl = firstImage.src;
    firstImage.remove(); // Remove image from content as we'll display it separately
  }

  // Clean the HTML content
  const cleanContent = DOMPurify.sanitize(tempDiv.innerHTML, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'a', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote'
    ],
    ALLOWED_ATTR: ['href', 'target'],
    FORBID_TAGS: ['style', 'script'],
    FORBID_ATTR: ['style', 'class', 'id'],
  });

  return { cleanContent, imageUrl };
}

export function extractImageUrl(item: any): string | undefined {
  // Try multiple possible image sources in order of preference
  const possibleSources = [
    item.media?.$.url,
    item.thumbnail?.$.url,
    item.enclosures?.[0]?.url,
    (() => {
      const match = item.content?.match(/<img[^>]+src="([^">]+)"/);
      return match?.[1];
    })(),
    (() => {
      const match = item.description?.match(/<img[^>]+src="([^">]+)"/);
      return match?.[1];
    })(),
  ];

  return possibleSources.find(url => url && isValidImageUrl(url));
}

function isValidImageUrl(url: string): boolean {
  // Check if URL is valid and points to an image
  try {
    const urlObj = new URL(url);
    const extension = urlObj.pathname.split('.').pop()?.toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    return validExtensions.includes(extension || '');
  } catch {
    return false;
  }
}
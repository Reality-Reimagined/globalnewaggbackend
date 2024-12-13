import React, { useState } from 'react';
import { Share2, Link, Twitter, Facebook, Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if native sharing is available AND we're in a secure context
  const canUseNativeShare = Boolean(
    navigator.share && 
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
  );

  const handleNativeShare = async () => {
    if (!canUseNativeShare) {
      setIsOpen(true);
      return;
    }

    try {
      await navigator.share({
        title,
        text: description,
        url,
      });
    } catch (error) {
      // Only show the fallback if it's not a user cancellation
      if (error instanceof Error && error.name !== 'AbortError') {
        setIsOpen(true);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const shareLinks = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Link,
      onClick: handleCopyLink,
      className: copied ? 'text-green-600 bg-green-50' : '',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Facebook,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
  ];

  // Always render the button, but handle the click differently based on native share support
  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        title="Share article"
      >
        <Share2 size={20} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="p-2">
              {shareLinks.map((link) => (
                <div key={link.name} className="flex items-center">
                  {link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md",
                        "hover:bg-gray-100 transition-colors duration-200",
                        link.className
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <link.icon size={16} className="mr-2" />
                      {link.name}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        link.onClick?.();
                        if (copied) setIsOpen(false);
                      }}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm rounded-md",
                        "hover:bg-gray-100 transition-colors duration-200",
                        link.className
                      )}
                    >
                      <link.icon size={16} className="mr-2" />
                      {link.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
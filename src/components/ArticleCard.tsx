import React, { useState } from 'react';
import { format } from 'date-fns';
import { Bookmark, ExternalLink, BookText, FileText, FileSearch } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';
import { ShareButton } from './ShareButton';
import DOMPurify from 'dompurify';

const API_BASE_URL = 'https://molly-sweeping-exactly.ngrok-free.app';

const API_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Origin, X-Requested-With'
} as const;

type SummaryType = "tldr" | "summary" | "full";

const ENDPOINTS = {
  tldr: (url: string) => `${API_BASE_URL}/generate_tldr/${encodeURIComponent(url)}`,
  summary: (url: string) => `${API_BASE_URL}/generate_summery/${encodeURIComponent(url)}`,
  full: (url: string) => `${API_BASE_URL}/generate_text/${encodeURIComponent(url)}`,
} as const;

interface ArticleCardProps {
  article: Article;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function ArticleCard({ article, expanded, onToggleExpand }: ArticleCardProps) {
  const { toggleBookmark, markAsRead, bookmarks } = useStore();
  const isBookmarked = bookmarks.includes(article.id);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    markAsRead(article.id);
    onToggleExpand?.();
  };

  const fetchAnalysis = async (type: SummaryType) => {
    setLoading(type);
    setError(null);
    setAnalysisResult(null);

    try {
      const endpoint = ENDPOINTS[type](article.link);
      const response = await fetch(endpoint, {
        headers: API_HEADERS,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      setAnalysisResult(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
    } finally {
      setLoading(null);
    }
  };

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(article.content, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'a', 'img',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target']
  });

  return (
    <article
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden transition-all',
        expanded ? 'col-span-2 row-span-2' : 'hover:shadow-lg'
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
              {article.country}
            </span>
            <span className="ml-2 text-sm text-gray-500">{article.source}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleBookmark(article.id)}
              className={cn(
                'p-2 rounded-full hover:bg-gray-100 transition-colors duration-200',
                isBookmarked && 'text-yellow-500'
              )}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <Bookmark size={20} />
            </button>
            <ShareButton
              url={article.link}
              title={article.title}
              description={article.contentSnippet}
            />
          </div>
        </div>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover mt-3 rounded-lg"
          />
        )}

        <h2
          className={cn(
            'font-bold text-gray-900 mt-3 cursor-pointer hover:text-blue-600',
            expanded ? 'text-2xl' : 'text-lg'
          )}
          onClick={handleClick}
        >
          {article.title}
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          {format(new Date(article.isoDate), 'MMM d, yyyy • h:mm a')}
        </p>

        {expanded ? (
          <>
            <div
              className="mt-4 text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Read full article <ExternalLink size={16} className="ml-1" />
                </a>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => fetchAnalysis('tldr')}
                  disabled={loading !== null}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    'bg-blue-50 text-blue-600 hover:bg-blue-100',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <BookText size={16} className="mr-2" />
                  TLDR
                </button>
                <button
                  onClick={() => fetchAnalysis('summary')}
                  disabled={loading !== null}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    'bg-green-50 text-green-600 hover:bg-green-100',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <FileText size={16} className="mr-2" />
                  EXEC Summary
                </button>
                <button
                  onClick={() => fetchAnalysis('full')}
                  disabled={loading !== null}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    'bg-purple-50 text-purple-600 hover:bg-purple-100',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <FileSearch size={16} className="mr-2" />
                  Full Analysis
                </button>
              </div>

              {loading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin inline-block w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full" />
                  <p className="mt-2 text-sm text-gray-600">Generating {loading}...</p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
                  {error}
                </div>
              )}

              {analysisResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {analysisResult}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="mt-2 text-gray-600 line-clamp-3">{article.contentSnippet}</p>
        )}
      </div>
    </article>
  );
}
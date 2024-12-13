import { useEffect, useState, useCallback, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { fetchArticles } from '../services/articleService';
import { feedSources } from '../config/feeds';

export function useArticles() {
  const { articles, setArticles, filter } = useStore();
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchAllFeeds = useCallback(async () => {
    setLoading(true);
    try {
      const allArticles = await fetchArticles(feedSources);
      // Sort articles by publication date (newest first)
      const sortedArticles = allArticles.sort((a, b) => 
        new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
      );
      setArticles(sortedArticles);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching feeds:', error);
    }
    setLoading(false);
  }, [setArticles]);

  useEffect(() => {
    fetchAllFeeds();
    const interval = setInterval(fetchAllFeeds, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllFeeds]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (filter.countries.length && !filter.countries.includes(article.country)) {
        return false;
      }
      if (filter.sources.length && !filter.sources.includes(article.source)) {
        return false;
      }
      if (
        filter.searchQuery &&
        !article.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
        !article.contentSnippet.toLowerCase().includes(filter.searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [articles, filter]);

  return {
    articles: filteredArticles,
    loading,
    lastUpdate,
    refreshFeeds: fetchAllFeeds,
  };
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Article, Filter, FeedSource } from '../types';
import { feedSources } from '../config/feeds';

interface Store {
  articles: Article[];
  filter: Filter;
  bookmarks: string[];
  readArticles: string[];
  setArticles: (articles: Article[]) => void;
  addArticles: (articles: Article[]) => void;
  setFilter: (filter: Partial<Filter>) => void;
  toggleBookmark: (articleId: string) => void;
  markAsRead: (articleId: string) => void;
  clearFilters: () => void;
}

const initialFilter: Filter = {
  countries: [],
  sources: [],
  categories: [],
  dateRange: {
    start: null,
    end: null,
  },
  searchQuery: '',
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      articles: [],
      filter: initialFilter,
      bookmarks: [],
      readArticles: [],
      
      setArticles: (articles) => set({ articles }),
      
      addArticles: (newArticles) =>
        set((state) => ({
          articles: [...state.articles, ...newArticles].filter(
            (article, index, self) =>
              index === self.findIndex((a) => a.guid === article.guid)
          ),
        })),
      
      setFilter: (filter) =>
        set((state) => ({
          filter: { ...state.filter, ...filter },
        })),
      
      toggleBookmark: (articleId) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(articleId)
            ? state.bookmarks.filter((id) => id !== articleId)
            : [...state.bookmarks, articleId],
        })),
      
      markAsRead: (articleId) =>
        set((state) => ({
          readArticles: [...state.readArticles, articleId],
        })),
      
      clearFilters: () => set({ filter: initialFilter }),
    }),
    {
      name: 'rss-storage',
    }
  )
);
export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories?: string[];
  isoDate: string;
  source: string;
  country: string;
  imageUrl?: string;
  isRead: boolean;
  isBookmarked: boolean;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  country: string;
  category: string;
}

export interface Filter {
  countries: string[];
  sources: string[];
  categories: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string;
}
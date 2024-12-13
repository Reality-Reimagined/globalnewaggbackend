export const feedSources = [
  // North America
  {
    id: 'nyt',
    name: 'New York Times',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    country: 'USA',
    category: 'General'
  },
  {
    id: 'wsj',
    name: 'Wall Street Journal',
    url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
    country: 'USA',
    category: 'Business'
  },
  {
    id: 'cbc',
    name: 'CBC News',
    url: 'https://www.cbc.ca/cmlink/rss-world',
    country: 'Canada',
    category: 'General'
  },
  {
    id: 'globe',
    name: 'The Globe and Mail',
    url: 'https://www.theglobeandmail.com/feed/world/',
    country: 'Canada',
    category: 'General'
  },
  
  // Europe
  {
    id: 'guardian',
    name: 'The Guardian',
    url: 'https://www.theguardian.com/world/rss',
    country: 'UK',
    category: 'General'
  },
  {
    id: 'ft',
    name: 'Financial Times',
    url: 'https://www.ft.com/world?format=rss',
    country: 'UK',
    category: 'Business'
  },
  {
    id: 'lemonde',
    name: 'Le Monde',
    url: 'https://www.lemonde.fr/en/rss/une.xml',
    country: 'France',
    category: 'General'
  },
  {
    id: 'france24',
    name: 'France 24',
    url: 'https://www.france24.com/en/rss',
    country: 'France',
    category: 'General'
  },
  {
    id: 'dw',
    name: 'Deutsche Welle',
    url: 'https://rss.dw.com/rdf/rss-en-all',
    country: 'Germany',
    category: 'General'
  },
  {
    id: 'reuters',
    name: 'Reuters',
    url: 'https://feeds.reuters.com/reuters/worldNews',
    country: 'International',
    category: 'General'
  },

  // Asia Pacific
  {
    id: 'scmp',
    name: 'South China Morning Post',
    url: 'https://www.scmp.com/rss/91/feed',
    country: 'China',
    category: 'General'
  },
  {
    id: 'japantimes',
    name: 'Japan Times',
    url: 'https://www.japantimes.co.jp/feed/',
    country: 'Japan',
    category: 'General'
  },
  // {
  //   id: 'abc',
  //   name: 'ABC News',
  //   url: 'https://www.abc.net.au/news/feed/51120/rss.xml',
  //   country: 'Australia',
  //   category: 'General'
  // },
  {
    id: 'straits',
    name: 'The Straits Times',
    url: 'https://www.straitstimes.com/news/world/rss.xml',
    country: 'Singapore',
    category: 'General'
  },

  // South Asia
  {
    id: 'toi',
    name: 'Times of India',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    country: 'India',
    category: 'General'
  },
  {
    id: 'hindu',
    name: 'The Hindu',
    url: 'https://www.thehindu.com/news/international/feeder/default.rss',
    country: 'India',
    category: 'General'
  },

  // Middle East
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    country: 'Qatar',
    category: 'General'
  },
  {
    id: 'haaretz',
    name: 'Haaretz',
    url: 'https://www.haaretz.com/srv/feed/world',
    country: 'Israel',
    category: 'General'
  },
  {
    id: 'arabnews',
    name: 'Arab News',
    url: 'https://www.arabnews.com/rss.xml',
    country: 'Saudi Arabia',
    category: 'General'
  },

  // Africa
  {
    id: 'news24',
    name: 'News24',
    url: 'https://feeds.24.com/articles/news24/World/rss',
    country: 'South Africa',
    category: 'General'
  },
  {
    id: 'nation',
    name: 'Daily Nation',
    url: 'https://nation.africa/kenya/rss/world.rss',
    country: 'Kenya',
    category: 'General'
  },

  // Latin America
  {
    id: 'mercopress',
    name: 'MercoPress',
    url: 'https://en.mercopress.com/rss/',
    country: 'Uruguay',
    category: 'General'
  },
  {
    id: 'buenosaires',
    name: 'Buenos Aires Times',
    url: 'https://www.batimes.com.ar/feed',
    country: 'Argentina',
    category: 'General'
  }
] as const;

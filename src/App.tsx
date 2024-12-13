import React, { useState } from 'react';
import { Newspaper, RefreshCw } from 'lucide-react';
import { ArticleCard } from './components/ArticleCard';
import { Filters } from './components/Filters';
import { useArticles } from './hooks/useArticles';

function App() {
  const { articles, loading, lastUpdate, refreshFeeds } = useArticles();
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Newspaper className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                Global News Aggregator
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <button
                onClick={refreshFeeds}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={`mr-2 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <Filters />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && articles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
              <p className="mt-2 text-gray-600">Loading feeds...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No articles found matching your filters.</p>
            </div>
          ) : (
            articles.map((article) => (
              <ArticleCard
                key={article.guid}
                article={article}
                expanded={expandedArticle === article.guid}
                onToggleExpand={() =>
                  setExpandedArticle(
                    expandedArticle === article.guid ? null : article.guid
                  )
                }
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
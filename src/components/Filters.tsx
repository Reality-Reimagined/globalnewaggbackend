import React from 'react';
import { Filter, Search, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { feedSources } from '../config/feeds';
import { SelectFilter } from './SelectFilter';
import { cn } from '../utils/cn';

export function Filters() {
  const { filter, setFilter, clearFilters } = useStore();

  const countries = Array.from(new Set(feedSources.map((source) => source.country)));
  const sources = Array.from(new Set(feedSources.map((source) => source.name)));
  const categories = Array.from(new Set(feedSources.map((source) => source.category)));

  const hasActiveFilters = 
    filter.countries.length > 0 || 
    filter.sources.length > 0 || 
    filter.categories.length > 0 || 
    filter.searchQuery.length > 0;

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                className={cn(
                  "w-full pl-10 pr-4 py-2 border rounded-lg",
                  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "placeholder-gray-400 transition-shadow duration-200",
                  filter.searchQuery && "border-blue-500"
                )}
                value={filter.searchQuery}
                onChange={(e) => setFilter({ searchQuery: e.target.value })}
              />
              {filter.searchQuery && (
                <button
                  onClick={() => setFilter({ searchQuery: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <SelectFilter
              label="Country"
              options={countries}
              value={filter.countries}
              onChange={(values) => setFilter({ countries: values })}
            />

            <SelectFilter
              label="Source"
              options={sources}
              value={filter.sources}
              onChange={(values) => setFilter({ sources: values })}
            />

            <SelectFilter
              label="Category"
              options={categories}
              value={filter.categories}
              onChange={(values) => setFilter({ categories: values })}
            />

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={cn(
                  "inline-flex items-center px-4 py-2 text-sm font-medium",
                  "bg-blue-50 text-blue-600 rounded-lg",
                  "hover:bg-blue-100 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
              >
                <Filter size={16} className="mr-2" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
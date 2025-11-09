import { useState } from 'react';
import { Search, Clock, Dumbbell, Apple, Book } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const recentSearches = [
  'Push-ups',
  'Protein shake',
  'Cardio workout',
  'Healthy breakfast',
];

const quickLinks = [
  { name: 'Workouts', icon: Dumbbell, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950' },
  { name: 'Recipes', icon: Apple, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950' },
  { name: 'Guides', icon: Book, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950' },
];

export function SearchTab() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Search Header */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search exercises, meals, guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-16 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="mb-3 text-gray-900 dark:text-gray-100">Quick Access</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <Card key={link.name} className="cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className={`p-3 rounded-full ${link.bg}`}>
                  <link.icon className={`w-6 h-6 ${link.color}`} />
                </div>
                <span className="text-sm dark:text-gray-100">{link.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-gray-900 dark:text-gray-100">Recent</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((search, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="px-3 py-2 cursor-pointer hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              {search}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

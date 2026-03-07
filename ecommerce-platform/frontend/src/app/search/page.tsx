import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SearchContent from './SearchContent';

function SearchFallback() {
  return (
    <div className="min-h-screen bg-royal-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-gray-500 text-lg">Loading search...</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}
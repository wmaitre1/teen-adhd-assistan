import React from 'react';
import type { JournalEntry } from '../../types';

interface TagsCloudProps {
  entries: JournalEntry[];
}

export function TagsCloud({ entries }: TagsCloudProps) {
  const tags = entries.reduce((acc, entry) => {
    entry.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="flex flex-wrap gap-2">
      {sortedTags.map(([tag, count]) => (
        <span
          key={tag}
          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          style={{
            fontSize: `${Math.max(0.8, Math.min(1.5, count / 5))}rem`,
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
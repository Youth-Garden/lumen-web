import React from 'react';

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  query,
  className = '',
  highlightClassName = 'bg-primary/20 text-primary rounded-sm font-semibold',
}) => {
  if (!query) {
    return <span className={className}>{text}</span>;
  }

  // Split text on query term, keeping the match in the result array (case-insensitive)
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className={`bg-transparent ${highlightClassName}`}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

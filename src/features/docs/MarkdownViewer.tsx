import React from 'react';
import { cn } from '../../utils/cn';

export interface MarkdownViewerProps {
  content: string;
  className?: string;
}

/**
 * Clean, lightweight, dependency-free Markdown renderer
 * for the Central Documentation Hub.
 */
export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushCodeBlock = (key: string) => {
    if (codeBlockLines.length > 0) {
      elements.push(
        <pre
          key={key}
          className="p-4 my-4 bg-navy-950 text-cream rounded-frame text-small font-mono overflow-x-auto border border-navy-800"
        >
          <code>{codeBlockLines.join('\n')}</code>
        </pre>
      );
      codeBlockLines = [];
    }
    inCodeBlock = false;
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const dataRows = tableRows.slice(2); // Skip separator row

      elements.push(
        <div key={key} className="overflow-x-auto my-4 rounded-frame border-2 border-sage-300">
          <table className="w-full text-left text-small border-collapse bg-white">
            <thead className="bg-surface-light border-b-2 border-sage-300">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-3 font-bold text-navy">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-200">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-cream/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 text-navy-950 font-medium">
                      {formatInlineMarkdown(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
  };

  const formatInlineMarkdown = (text: string): React.ReactNode => {
    // Bold: **text**
    const parts: React.ReactNode[] = [];
    let current = text;
    let idx = 0;

    // Basic regex replacer for bold, backticks, and links
    const tokenRegex = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
    let match;
    let lastIdx = 0;

    while ((match = tokenRegex.exec(current)) !== null) {
      if (match.index > lastIdx) {
        parts.push(current.substring(lastIdx, match.index));
      }

      if (match[2]) {
        // Bold
        parts.push(<strong key={idx++} className="font-bold text-navy">{match[2]}</strong>);
      } else if (match[3]) {
        // Inline code
        parts.push(
          <code key={idx++} className="px-1.5 py-0.5 rounded bg-sage-100 text-navy font-mono text-[12px] font-bold border border-sage-300">
            {match[3]}
          </code>
        );
      } else if (match[4] && match[5]) {
        // Link
        parts.push(
          <span key={idx++} className="text-navy font-bold underline">
            {match[4]}
          </span>
        );
      }

      lastIdx = tokenRegex.lastIndex;
    }

    if (lastIdx < current.length) {
      parts.push(current.substring(lastIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock(`code-${i}`);
      } else {
        if (inTable) flushTable(`tbl-${i}`);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Markdown tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      const cells = line.split('|').slice(1, -1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable(`tbl-${i}`);
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(<hr key={`hr-${i}`} className="my-6 border-sage-300" />);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-h1 font-display font-bold text-navy mt-6 mb-3">
          {line.substring(2)}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-h2 font-display font-bold text-navy mt-5 mb-2.5">
          {line.substring(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-h3 font-display font-bold text-navy mt-4 mb-2">
          {line.substring(4)}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="border-l-4 border-sage p-3 my-3 bg-cream rounded-r-frame text-small italic text-navy-950 font-medium"
        >
          {formatInlineMarkdown(line.substring(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(
        <li key={`li-${i}`} className="ml-5 list-disc text-small text-navy-950 font-medium my-1">
          {formatInlineMarkdown(line.trim().substring(2))}
        </li>
      );
      continue;
    }

    // Numbered lists
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <li key={`num-${i}`} className="ml-5 list-decimal text-small text-navy-950 font-medium my-1">
          {formatInlineMarkdown(numMatch[2])}
        </li>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-body font-medium text-navy-950 my-2 leading-relaxed">
        {formatInlineMarkdown(line)}
      </p>
    );
  }

  if (inCodeBlock) flushCodeBlock('code-end');
  if (inTable) flushTable('tbl-end');

  return <div className={cn('flex flex-col w-full', className)}>{elements}</div>;
};

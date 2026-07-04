import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { marked } from 'marked';

// Configure Turndown for consistent HTML→Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
  strongDelimiter: '**',
});

// Add GitHub Flavored Markdown support (tables, strikethrough, etc.)
turndownService.use(gfm);

/**
 * Convert HTML from the rich text editor to Markdown for storage.
 * @param html - HTML string from React Quill
 * @returns Markdown string
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === '') return '';
  
  // Turndown converts HTML to Markdown
  const markdown = turndownService.turndown(html);
  
  // Clean up excessive newlines
  return markdown.trim();
}

/**
 * Convert Markdown from storage to HTML for the rich text editor.
 * @param markdown - Markdown string from Supabase
 * @returns HTML string
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || markdown.trim() === '') return '';

  const html = marked.parse(markdown, {
    async: false,
    breaks: true,
    gfm: true,
  });
  return typeof html === 'string' ? html : '';
}

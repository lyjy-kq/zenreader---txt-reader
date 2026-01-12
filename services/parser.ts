import { Chapter, Book } from '../types';

/**
 * Parses a raw text string into a Book object with chapters.
 * It uses regular expressions to detect common Chinese chapter headers.
 * e.g., "第1章", "第一章", "Chapter 1"
 */
export const parseTxtToBook = (text: string, fileName: string): Book => {
  // Regex Explanation:
  // ^\s* -> Start of line, optional whitespace
  // (第[0-9零一二三四五六七八九十百千万]+[章卷回节]|Chapter\s+\d+) -> Capture "第X章" or "Chapter X"
  // .*$ -> Capture the rest of the line as the title
  const chapterRegex = /^\s*(?:第[0-9零一二三四五六七八九十百千万]+[章卷回节]|Chapter\s+\d+).*$/gm;
  
  const matches = [...text.matchAll(chapterRegex)];
  
  if (matches.length === 0) {
    // If no chapters found, treat whole text as one chapter
    return {
      title: fileName.replace('.txt', ''),
      fileName,
      parsedAt: Date.now(),
      chapters: [{
        id: 0,
        title: '正文',
        content: text.trim(),
        wordCount: text.length
      }]
    };
  }

  const chapters: Chapter[] = [];
  let lastIndex = 0;

  // Process matches
  matches.forEach((match, index) => {
    const title = match[0].trim();
    const startIndex = match.index!;
    
    // If there is content before the first chapter (preamble/intro)
    if (index === 0 && startIndex > 0) {
      const preContent = text.substring(0, startIndex).trim();
      if (preContent) {
        chapters.push({
          id: -1,
          title: '序章 / 简介',
          content: preContent,
          wordCount: preContent.length
        });
      }
    }

    // Determine end index for current chapter (start of next chapter or end of file)
    const nextMatch = matches[index + 1];
    const endIndex = nextMatch ? nextMatch.index! : text.length;

    // Extract content
    // We skip the length of the title itself to avoid repeating it in the body if desired,
    // but usually, we want the body to start after the title line.
    const contentStart = startIndex + match[0].length;
    const content = text.substring(contentStart, endIndex).trim();

    chapters.push({
      id: index,
      title: title,
      content: content,
      wordCount: content.length
    });
  });

  return {
    title: fileName.replace('.txt', ''),
    fileName,
    parsedAt: Date.now(),
    chapters
  };
};
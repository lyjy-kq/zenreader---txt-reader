export interface Chapter {
  id: number;
  title: string;
  content: string; // The text content of the chapter
  wordCount: number;
}

export interface Book {
  title: string;
  chapters: Chapter[];
  fileName: string;
  parsedAt: number;
  lastReadChapterIndex?: number;
  lastReadTime?: number;
}

export enum ReaderTheme {
  BEIGE = 'beige',
  DARK = 'dark',
  eyeProtection = 'green',
}
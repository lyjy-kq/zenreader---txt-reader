import { Book } from '../types';

const DB_NAME = 'ZenReaderDB';
const DB_VERSION = 1;
const STORE_NAME = 'books';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'fileName' });
      }
    };
  });
};

export const saveBookToDB = async (book: Book): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    // Ensure we preserve existing progress if we are just re-saving content
    // Actually, usually we overwrite, but let's ensure lastReadTime is set
    const bookToSave = { 
      ...book, 
      lastReadTime: book.lastReadTime || Date.now(),
      lastReadChapterIndex: book.lastReadChapterIndex || 0
    };
    const request = store.put(bookToSave);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getBookFromDB = async (fileName: string): Promise<Book | undefined> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(fileName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllBooksMeta = async (): Promise<Book[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      // Return books. Note: For a real large scale app we might want a separate index 
      // or store just for metadata to avoid loading all content strings, 
      // but for a text reader this is acceptable for now.
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
};

export const updateBookProgress = async (fileName: string, chapterIndex: number): Promise<void> => {
  const db = await openDB();
  const book = await getBookFromDB(fileName);
  if (book) {
    book.lastReadChapterIndex = chapterIndex;
    book.lastReadTime = Date.now();
    await saveBookToDB(book);
  }
};

export const deleteBookFromDB = async (fileName: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(fileName);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
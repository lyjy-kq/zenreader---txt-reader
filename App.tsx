import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { Reader } from './components/Reader';
import { parseTxtToBook } from './services/parser';
import { saveBookToDB, getAllBooksMeta, updateBookProgress, deleteBookFromDB } from './services/db';
import { Book } from './types';

function App() {
  const [book, setBook] = useState<Book | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  // Load saved books on mount
  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      const books = await getAllBooksMeta();
      setSavedBooks(books);
    } catch (error) {
      console.error("Failed to load library:", error);
    }
  };

  const handleFileLoaded = (content: string, fileName: string) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const parsedBook = parseTxtToBook(content, fileName);
        await saveBookToDB(parsedBook);
        setBook(parsedBook);
        setCurrentChapterIndex(0);
        await loadLibrary(); // Refresh library list
      } catch (error) {
        console.error("Error saving book:", error);
        alert("Failed to save book to storage.");
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  const handleOpenBook = (selectedBook: Book) => {
    setBook(selectedBook);
    setCurrentChapterIndex(selectedBook.lastReadChapterIndex || 0);
  };

  const handleDeleteBook = async (fileName: string) => {
    await deleteBookFromDB(fileName);
    await loadLibrary();
  };

  const handleChapterChange = async (index: number) => {
    setCurrentChapterIndex(index);
    if (book) {
      // Update local state first for responsiveness
      const updatedBook = { ...book, lastReadChapterIndex: index, lastReadTime: Date.now() };
      setBook(updatedBook);
      
      // Update DB
      try {
        await updateBookProgress(book.fileName, index);
        // We don't necessarily need to reload the whole library list here to avoid jank,
        // but if we were strictly reactive we might.
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
  };

  const handleBackToHome = async () => {
    setBook(null);
    await loadLibrary(); // Refresh list to update progress bars
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f1e7] flex items-center justify-center">
        <div className="flex flex-col items-center">
           <div className="w-12 h-12 border-4 border-qidian-red border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-qidian-text font-serif">Processing book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <FileUpload 
        onFileLoaded={handleFileLoaded} 
        savedBooks={savedBooks}
        onOpenBook={handleOpenBook}
        onDeleteBook={handleDeleteBook}
      />
    );
  }

  return (
    <Reader 
      book={book} 
      currentChapterIndex={currentChapterIndex} 
      onChapterChange={handleChapterChange}
      onBackToHome={handleBackToHome}
    />
  );
}

export default App;
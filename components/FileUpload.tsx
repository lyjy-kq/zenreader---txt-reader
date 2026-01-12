import React, { useRef, useState } from 'react';
import { UploadIcon, BookIcon, TrashIcon } from './Icons';
import { Book } from '../types';

interface FileUploadProps {
  onFileLoaded: (content: string, fileName: string) => void;
  savedBooks: Book[];
  onOpenBook: (book: Book) => void;
  onDeleteBook: (fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileLoaded, 
  savedBooks, 
  onOpenBook,
  onDeleteBook 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          onFileLoaded(text, file.name);
        }
      };
      reader.readAsText(file, 'utf-8');
    } else {
      alert("Please upload a valid .txt file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Sort books by last read time
  const sortedBooks = [...savedBooks].sort((a, b) => (b.lastReadTime || 0) - (a.lastReadTime || 0));

  return (
    <div className="min-h-screen bg-qidian-bg flex flex-col items-center p-6 noise-bg">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 mt-4">
        <h1 className="text-3xl font-serif font-bold text-qidian-text flex items-center gap-2">
          <BookIcon /> ZenReader
        </h1>
        <div className="text-sm text-qidian-gray">
          Persistent Web Library
        </div>
      </div>

      {/* Upload Box */}
      <div 
        className={`
          max-w-4xl w-full p-10 border-2 border-dashed rounded-xl transition-all duration-300
          flex flex-col items-center justify-center text-center cursor-pointer mb-12
          ${isDragging ? 'border-qidian-red bg-white shadow-lg scale-102' : 'border-qidian-lightGray bg-white/50 hover:border-qidian-gray'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className={`mb-4 transition-colors ${isDragging ? 'text-qidian-red' : 'text-qidian-gray'}`}>
          <UploadIcon />
        </div>
        <h2 className="text-2xl font-serif text-qidian-text mb-2">Import New Book</h2>
        <p className="text-qidian-gray mb-6">Drag & Drop your .txt file here</p>
        <button className="bg-qidian-red text-white px-8 py-2 rounded-full hover:bg-red-700 transition shadow-md">
          Select File
        </button>
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept=".txt" 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* Library Section */}
      {sortedBooks.length > 0 && (
        <div className="max-w-4xl w-full">
          <h3 className="text-xl font-serif font-bold text-qidian-text mb-4 border-l-4 border-qidian-red pl-3">
            Your Library
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedBooks.map((book) => {
              const progress = Math.round(((book.lastReadChapterIndex || 0) / (book.chapters.length || 1)) * 100);
              
              return (
                <div 
                  key={book.fileName} 
                  className="bg-white/80 p-5 rounded-lg border border-qidian-border shadow-sm hover:shadow-md transition-all group relative flex flex-col"
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => onOpenBook(book)}
                  >
                    <h4 className="font-bold text-lg text-qidian-text mb-1 truncate font-serif">
                      {book.title}
                    </h4>
                    <p className="text-xs text-qidian-gray mb-3">
                      {new Date(book.lastReadTime || Date.now()).toLocaleDateString()}
                    </p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-qidian-red h-1.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-qidian-gray flex justify-between">
                      <span>{progress}% Read</span>
                      <span>{book.chapters.length} Chapters</span>
                    </p>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm(`Remove "${book.title}" from library?`)) {
                        onDeleteBook(book.fileName);
                      }
                    }}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Remove from library"
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
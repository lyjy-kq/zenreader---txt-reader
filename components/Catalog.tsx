import React, { useEffect, useRef } from 'react';
import { Book } from '../types';
import { CloseIcon } from './Icons';

interface CatalogProps {
  book: Book;
  currentChapterIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (index: number) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ 
  book, 
  currentChapterIndex, 
  isOpen, 
  onClose, 
  onSelectChapter 
}) => {
  const activeRef = useRef<HTMLButtonElement>(null);
  
  // Scroll active chapter into view when activeRef changes
  useEffect(() => {
    if (isOpen && activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`
          fixed top-0 left-0 h-full w-[320px] bg-[#fdfaf5] shadow-2xl z-[70] 
          transform transition-transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-qidian-border flex items-center justify-between bg-[#f6f1e7]">
          <div>
            <h2 className="text-lg font-bold text-qidian-text font-serif truncate max-w-[240px]">
              {book.title}
            </h2>
            <p className="text-xs text-qidian-gray mt-1">
              共 {book.chapters.length} 章
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-black/5 rounded-full text-qidian-gray hover:text-qidian-red transition"
          >
            <CloseIcon />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto reader-scrollbar p-2">
          {book.chapters.map((chapter, index) => {
            const isActive = index === currentChapterIndex;
            return (
              <button
                key={index}
                ref={isActive ? activeRef : null}
                onClick={() => {
                  onSelectChapter(index);
                  onClose();
                }}
                className={`
                  w-full text-left px-4 py-3 text-sm rounded-md transition-all duration-200 border-b border-transparent
                  ${isActive 
                    ? 'bg-qidian-red text-white font-medium shadow-md' 
                    : 'text-qidian-text hover:bg-[#efeadd] hover:text-qidian-red border-b-slate-100'
                  }
                `}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="truncate">{chapter.title}</span>
                  {isActive && <span className="text-xs opacity-80 ml-2">Reading</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
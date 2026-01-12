import React, { useEffect, useRef, useState } from 'react';
import { Book } from '../types';
import { Catalog } from './Catalog';
import { 
  BookIcon, UserIcon, SettingIcon, MoonIcon, ChevronRight, ListIcon 
} from './Icons';

interface ReaderProps {
  book: Book;
  currentChapterIndex: number;
  onChapterChange: (index: number) => void;
  onBackToHome: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ 
  book, 
  currentChapterIndex, 
  onChapterChange,
  onBackToHome
}) => {
  const chapter = book.chapters[currentChapterIndex];
  const topRef = useRef<HTMLDivElement>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentChapterIndex]);

  const goToNext = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      onChapterChange(currentChapterIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentChapterIndex > 0) {
      onChapterChange(currentChapterIndex - 1);
    }
  };

  // Format content: Split by newlines and create paragraph elements
  // Qidian usually has text-indent: 2em
  const renderContent = (text: string) => {
    return text.split('\n').map((para, i) => {
      const trimmed = para.trim();
      if (!trimmed) return <br key={i} />;
      return (
        <p key={i} className="mb-6 text-lg leading-[1.8] text-justify indent-8">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-qidian-bg noise-bg flex flex-col items-center relative">
      
      {/* Catalog Sidebar */}
      <Catalog 
        book={book} 
        currentChapterIndex={currentChapterIndex} 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        onSelectChapter={onChapterChange}
      />

      {/* --- Top Navbar --- */}
      <nav className="w-full bg-qidian-panel border-b border-qidian-border sticky top-0 z-50 h-[64px] flex items-center justify-between px-4 lg:px-8 shadow-sm">
        <div className="flex items-center space-x-6 text-qidian-gray text-sm">
           {/* Logo / Home Button */}
           <div 
             className="cursor-pointer font-bold text-xl text-qidian-text flex items-center gap-2 hover:text-qidian-red transition-colors"
             onClick={onBackToHome}
           >
             <BookIcon />
             <span>ZenReader</span>
           </div>
        </div>

        {/* Breadcrumbs (Simulated) */}
        <div className="hidden md:flex items-center text-sm text-qidian-gray space-x-2">
            <span className="hover:text-qidian-text cursor-pointer" onClick={onBackToHome}>Library</span>
            <ChevronRight />
            <span 
              className="hover:text-qidian-text cursor-pointer truncate max-w-[150px]" 
              onClick={() => setIsCatalogOpen(true)}
            >
              {book.title}
            </span>
            <ChevronRight />
            <span className="text-qidian-text font-medium truncate max-w-[200px]">{chapter.title}</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center text-sm text-qidian-text cursor-pointer hover:text-qidian-red">
          <span className="mr-2 hidden sm:inline">Guest Reader</span>
          <div className="w-8 h-8 rounded-full bg-qidian-border flex items-center justify-center text-qidian-gray">
            <UserIcon />
          </div>
        </div>
      </nav>

      {/* --- Main Layout --- */}
      <div className="flex justify-center w-full relative">
        
        {/* --- Left Sidebar (Fixed) --- */}
        {/*<div className="hidden xl:flex fixed left-[calc(50%-580px)] top-[100px] flex-col gap-2 z-10">*/}
        {/*  <SidebarButton label="Report" />*/}
        {/*  <SidebarButton label="Guide" />*/}
        {/*  <SidebarButton label="Feedback" />*/}
        {/*</div>*/}

        {/* --- Center Content --- */}
        <div ref={topRef} className="w-full max-w-[900px] bg-qidian-panel min-h-screen shadow-panel px-8 py-12 sm:px-16 sm:py-16 mt-4 mb-20">
          
          {/* Chapter Header */}
          <div className="border-b border-dashed border-qidian-border pb-6 mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-qidian-text mb-4 leading-tight">
              {chapter.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-qidian-gray gap-4 font-sans">
              <span 
                className="flex items-center gap-1 hover:text-qidian-text cursor-pointer"
                onClick={() => setIsCatalogOpen(true)}
              >
                <BookIcon /> {book.title}
              </span>
              <span>•</span>
              <span>{chapter.wordCount} words</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Chapter Body */}
          <article className="font-serif text-qidian-text text-[20px]">
             {renderContent(chapter.content)}
          </article>

          {/* Chapter Footer / Author Note Placeholder */}
          <div className="mt-16 bg-[#eef1f3]/50 p-6 rounded-lg text-sm text-qidian-gray border border-qidian-border/50">
             <p className="font-bold text-qidian-red mb-2">Author's Note</p>
             <p>This is a generated preview of the parsed content. Support original authors if applicable.</p>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="mt-12 flex justify-between items-center select-none">
            <NavButton 
              onClick={goToPrev} 
              disabled={currentChapterIndex === 0} 
              label="Previous Chapter" 
            />
            <div 
              className="text-qidian-gray text-sm hidden sm:block cursor-pointer hover:text-qidian-red"
              onClick={() => setIsCatalogOpen(true)}
            >
              Chapter {currentChapterIndex + 1} of {book.chapters.length}
            </div>
            <NavButton 
              onClick={goToNext} 
              disabled={currentChapterIndex === book.chapters.length - 1} 
              label="Next Chapter" 
            />
          </div>

        </div>

        {/* --- Right Sidebar (Fixed) --- */}
        <div className="hidden xl:flex fixed right-[calc(50%-560px)] bottom-[100px] flex-col gap-3 z-10">
          <RightFloatingButton 
            icon={<ListIcon />} 
            label="Catalog" 
            onClick={() => setIsCatalogOpen(true)} 
          />
          <RightFloatingButton icon={<BookIcon />} label="Details" onClick={() => {}} />
          <RightFloatingButton icon={<SettingIcon />} label="Settings" onClick={() => {}} />
          <RightFloatingButton icon={<MoonIcon />} label="Night" onClick={() => {}} />
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---

const SidebarButton: React.FC<{ label: string }> = ({ label }) => (
  <button className="text-xs text-qidian-gray hover:text-qidian-red bg-white/60 hover:bg-white border border-transparent hover:border-qidian-border px-3 py-1 rounded shadow-sm transition-all duration-200">
    {label}
  </button>
);

const RightFloatingButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative w-12 h-12 bg-[#f9f9f9] border border-[#eee] rounded-lg flex flex-col items-center justify-center text-qidian-gray hover:text-qidian-red hover:bg-white shadow-sm transition-all"
  >
    <div className="scale-75 group-hover:scale-100 transition-transform">{icon}</div>
    {/* Tooltip on hover */}
    <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
      {label}
    </span>
  </button>
);

const NavButton: React.FC<{ onClick: () => void, disabled: boolean, label: string }> = ({ onClick, disabled, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-6 py-3 rounded-full border transition-all duration-200 font-medium
      ${disabled 
        ? 'opacity-30 cursor-not-allowed border-transparent text-gray-400' 
        : 'bg-white border-qidian-border text-qidian-text hover:text-qidian-red hover:border-qidian-red shadow-sm'
      }
    `}
  >
    {label}
  </button>
);
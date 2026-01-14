import React, { useEffect, useRef, useState } from 'react';
import { Book } from '../types';
import { Catalog } from './Catalog';
import { SettingsPanel } from './SettingsPanel';
import { getSettings, saveSettings, toggleNightMode } from '../services/settings';
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(() => getSettings().scrollAmount);
  const [nightMode, setNightMode] = useState(() => getSettings().nightMode);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentChapterIndex]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch(e.key.toLowerCase()) {
        // Scroll up: W, ArrowUp
        case 'w':
        case 'arrowup':
          e.preventDefault();
          window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
          break;
        
        // Scroll down: S, ArrowDown, Space
        case 's':
        case 'arrowdown':
          e.preventDefault();
          window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          break;
        
        case ' ':
          e.preventDefault();
          window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          break;
        
        // Previous chapter: A, ArrowLeft
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          if (currentChapterIndex > 0) {
            onChapterChange(currentChapterIndex - 1);
          }
          break;
        
        // Next chapter: D, ArrowRight
        case 'd':
        case 'arrowright':
          e.preventDefault();
          if (currentChapterIndex < book.chapters.length - 1) {
            onChapterChange(currentChapterIndex + 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex, book.chapters.length, onChapterChange, scrollAmount]);

  const handleScrollAmountChange = (amount: number) => {
    setScrollAmount(amount);
    saveSettings({ scrollAmount: amount });
  };

  const handleToggleNightMode = () => {
    const newNightMode = toggleNightMode();
    setNightMode(newNightMode);
  };

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
    <div className={`min-h-screen flex flex-col items-center relative transition-colors duration-300 ${
      nightMode 
        ? 'bg-[#1a1a1a]' 
        : 'bg-qidian-bg noise-bg'
    }`}>
      
      {/* Catalog Sidebar */}
      <Catalog 
        book={book} 
        currentChapterIndex={currentChapterIndex} 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        onSelectChapter={onChapterChange}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        scrollAmount={scrollAmount}
        onScrollAmountChange={handleScrollAmountChange}
      />

      {/* --- Top Navbar --- */}
      <nav className={`w-full border-b sticky top-0 z-50 h-[64px] flex items-center justify-between px-4 lg:px-8 shadow-sm transition-colors duration-300 ${
        nightMode
          ? 'bg-[#242424] border-[#3a3a3a] text-gray-300'
          : 'bg-qidian-panel border-qidian-border'
      }`}>
        <div className="flex items-center space-x-6 text-sm">
           {/* Logo / Home Button */}
           <div 
             className={`cursor-pointer font-bold text-xl flex items-center gap-2 transition-colors ${
               nightMode
                 ? 'text-gray-200 hover:text-[#ff6b6b]'
                 : 'text-qidian-text hover:text-qidian-red'
             }`}
             onClick={onBackToHome}
           >
             <BookIcon />
             <span>ZenReader</span>
           </div>
        </div>

        {/* Breadcrumbs (Simulated) */}
        <div className={`hidden md:flex items-center text-sm space-x-2 ${
          nightMode ? 'text-gray-400' : 'text-qidian-gray'
        }`}>
            <span className={`cursor-pointer ${
              nightMode ? 'hover:text-gray-200' : 'hover:text-qidian-text'
            }`} onClick={onBackToHome}>Library</span>
            <ChevronRight />
            <span 
              className={`cursor-pointer truncate max-w-[150px] ${
                nightMode ? 'hover:text-gray-200' : 'hover:text-qidian-text'
              }`}
              onClick={() => setIsCatalogOpen(true)}
            >
              {book.title}
            </span>
            <ChevronRight />
            <span className={`font-medium truncate max-w-[200px] ${
              nightMode ? 'text-gray-200' : 'text-qidian-text'
            }`}>{chapter.title}</span>
        </div>

        {/* User Profile */}
        <div className={`flex items-center text-sm cursor-pointer transition-colors ${
          nightMode
            ? 'text-gray-300 hover:text-[#ff6b6b]'
            : 'text-qidian-text hover:text-qidian-red'
        }`}>
          <span className="mr-2 hidden sm:inline">Guest Reader</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            nightMode ? 'bg-[#3a3a3a] text-gray-400' : 'bg-qidian-border text-qidian-gray'
          }`}>
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
        <div ref={topRef} className={`w-full max-w-[900px] min-h-screen shadow-panel px-8 py-12 sm:px-16 sm:py-16 mt-4 mb-20 transition-colors duration-300 ${
          nightMode
            ? 'bg-[#242424]'
            : 'bg-qidian-panel'
        }`}>
          
          {/* Chapter Header */}
          <div className={`border-b border-dashed pb-6 mb-10 ${
            nightMode ? 'border-[#3a3a3a]' : 'border-qidian-border'
          }`}>
            <h1 className={`text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight ${
              nightMode ? 'text-gray-100' : 'text-qidian-text'
            }`}>
              {chapter.title}
            </h1>
            <div className={`flex flex-wrap items-center text-sm gap-4 font-sans ${
              nightMode ? 'text-gray-400' : 'text-qidian-gray'
            }`}>
              <span 
                className={`flex items-center gap-1 cursor-pointer ${
                  nightMode ? 'hover:text-gray-200' : 'hover:text-qidian-text'
                }`}
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
          <article className={`font-serif text-[20px] ${
            nightMode ? 'text-gray-100' : 'text-qidian-text'
          }`}>
             {renderContent(chapter.content)}
          </article>

          {/*/!* Chapter Footer / Author Note Placeholder *!/*/}
          {/*<div className={`mt-16 p-6 rounded-lg text-sm border transition-colors duration-300 ${*/}
          {/*  nightMode*/}
          {/*    ? 'bg-[#2a2a2a] text-gray-400 border-[#3a3a3a]'*/}
          {/*    : 'bg-[#eef1f3]/50 text-qidian-gray border-qidian-border/50'*/}
          {/*}`}>*/}
          {/*   <p className={`font-bold mb-2 ${*/}
          {/*     nightMode ? 'text-[#ff6b6b]' : 'text-qidian-red'*/}
          {/*   }`}>Author's Note</p>*/}
          {/*   <p>This is a generated preview of the parsed content. Support original authors if applicable.</p>*/}
          {/*</div>*/}

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

          {/* Keyboard shortcuts hint */}
          <div className={`mt-8 text-center text-xs ${
            nightMode ? 'text-gray-500' : 'text-qidian-lightGray'
          }`}>
            快捷键：<kbd className={`px-2 py-1 rounded mx-1 ${
              nightMode ? 'bg-[#3a3a3a]' : 'bg-qidian-hover'
            }`}>W/↑</kbd> 向上 
            <kbd className={`px-2 py-1 rounded mx-1 ${
              nightMode ? 'bg-[#3a3a3a]' : 'bg-qidian-hover'
            }`}>S/↓/空格</kbd> 向下 
            <kbd className={`px-2 py-1 rounded mx-1 ${
              nightMode ? 'bg-[#3a3a3a]' : 'bg-qidian-hover'
            }`}>A/←</kbd> 上一章 
            <kbd className={`px-2 py-1 rounded mx-1 ${
              nightMode ? 'bg-[#3a3a3a]' : 'bg-qidian-hover'
            }`}>D/→</kbd> 下一章
          </div>

        </div>

        {/* --- Right Sidebar (Fixed) --- */}
        <div className="hidden xl:flex fixed right-[calc(50%-560px)] bottom-[100px] flex-col gap-3 z-10">
          <RightFloatingButton 
            icon={<ListIcon />} 
            label="目录" 
            onClick={() => setIsCatalogOpen(true)}
            nightMode={nightMode}
          />
          <RightFloatingButton 
            icon={<SettingIcon />} 
            label="设置" 
            onClick={() => setIsSettingsOpen(true)}
            nightMode={nightMode}
          />
          <RightFloatingButton 
            icon={<MoonIcon />} 
            label={nightMode ? "日间" : "夜间"} 
            onClick={handleToggleNightMode}
            nightMode={nightMode}
            active={nightMode}
          />
          <RightFloatingButton 
            icon={<BookIcon />} 
            label="详情" 
            onClick={() => {}}
            nightMode={nightMode}
          />
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

const RightFloatingButton: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void,
  nightMode?: boolean,
  active?: boolean
}> = ({ icon, label, onClick, nightMode = false, active = false }) => (
  <button 
    onClick={onClick}
    className={`group relative w-12 h-12 border rounded-lg flex flex-col items-center justify-center shadow-sm transition-all ${
      nightMode
        ? active
          ? 'bg-[#ff6b6b] text-white border-[#ff6b6b]'
          : 'bg-[#2a2a2a] border-[#3a3a3a] text-gray-400 hover:text-[#ff6b6b] hover:bg-[#333333]'
        : active
          ? 'bg-qidian-red text-white border-qidian-red'
          : 'bg-[#f9f9f9] border-[#eee] text-qidian-gray hover:text-qidian-red hover:bg-white'
    }`}
  >
    <div className="scale-75 group-hover:scale-100 transition-transform">{icon}</div>
    {/* Tooltip on hover */}
    <span className={`absolute right-full mr-2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity ${
      nightMode ? 'bg-[#3a3a3a] text-gray-200' : 'bg-gray-800 text-white'
    }`}>
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
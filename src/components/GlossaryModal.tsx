import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BookOpen, Search, X, Sparkles, Lightbulb, CheckCircle2 } from 'lucide-react';
import { GLOSSARY_ITEMS } from '../data/glossary';
import { GlossaryItem } from '../types';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string | null;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTermId
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GlossaryItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialTermId) {
      const match = GLOSSARY_ITEMS.find(
        item => item.id.toLowerCase() === initialTermId.toLowerCase()
      );
      if (match) {
        setSelectedItem(match);
        setSelectedCategory('All');
        setSearch('');
      }
    } else if (!selectedItem && GLOSSARY_ITEMS.length > 0) {
      setSelectedItem(GLOSSARY_ITEMS[0]);
    }
  }, [initialTermId, isOpen]);

  useEffect(() => {
    if (isOpen && !initialTermId) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialTermId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = useMemo(() => {
    return ['All', 'Planning', 'Architecture', 'Testing', 'Operations', 'Security'];
  }, []);

  const filteredItems = useMemo(() => {
    return GLOSSARY_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.term.toLowerCase().includes(q) ||
        item.plainLanguageSummary.toLowerCase().includes(q) ||
        item.analogy.toLowerCase().includes(q) ||
        item.realWorldExample.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#122e43]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-title"
    >
      <div
        className="bg-white border border-[#dce6ee] rounded-3xl max-w-4xl w-full h-[88vh] max-h-[760px] flex flex-col overflow-hidden shadow-2xl text-[#132b40]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Petrol Blue */}
        <div className="p-4 sm:p-5 border-b border-[#163f5f] bg-[#1e537d] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#122e43] border border-[#2b5e85] flex items-center justify-center text-[#e59b24] shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="glossary-title" className="text-base sm:text-lg font-bold text-white">
                  Plain-English Technical Glossary
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e59b24] text-[#132b40]">
                  {GLOSSARY_ITEMS.length} Concepts
                </span>
              </div>
              <p className="text-xs text-[#b8d2e8] mt-0.5">
                Everyday analogies and software examples for technical terms.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#122e43] hover:bg-[#0c2030] text-[#b8d2e8] hover:text-white transition-colors cursor-pointer"
            aria-label="Close glossary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-3 sm:p-4 border-b border-[#e5edf3] bg-[#f8fbfe] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8ba3b8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full bg-white border border-[#dce6ee] rounded-2xl pl-9 pr-3 py-1.5 text-xs text-[#132b40] placeholder:text-[#8ba3b8] focus:outline-none focus:border-[#e59b24]"
              placeholder="Search concepts by term, plain words, or analogy..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ba3b8] hover:text-[#132b40] text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#e59b24] text-[#132b40] shadow-xs'
                    : 'bg-white text-[#516b80] hover:text-[#132b40] border border-[#dce6ee]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Split list on left, detail card on right */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[#f0f4f8]">
          {/* Term List (5 cols) */}
          <div className="md:col-span-5 border-r border-[#dce6ee] overflow-y-auto p-3 space-y-2">
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#516b80]">
                <Search className="w-6 h-6 mx-auto mb-2 text-[#8ba3b8]" />
                <p>No concepts found matching "{search}".</p>
                <button
                  type="button"
                  onClick={() => { setSearch(''); setSelectedCategory('All'); }}
                  className="mt-2 text-[#1e537d] font-bold underline hover:text-[#e59b24]"
                >
                  View all terms
                </button>
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#fdfaf2] border-[#e59b24] shadow-xs ring-1 ring-[#e59b24]/40'
                        : 'bg-white border-[#dce6ee] hover:border-[#b8d2e8] text-[#132b40]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#132b40]">
                        {item.term}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#eef5fa] text-[#1e537d] font-semibold border border-[#d2e2ec]">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#516b80] mt-1 line-clamp-1 leading-normal">
                      {item.shortDefinition}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Term Detail View (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-5 sm:p-6 space-y-4 bg-white">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="border-b border-[#eaf0f5] pb-3">
                  <span className="text-[11px] font-bold text-[#b87e21] uppercase tracking-wider">
                    {selectedItem.category} Architecture Concept
                  </span>
                  <h3 className="text-xl font-black text-[#132b40] mt-0.5">
                    {selectedItem.term}
                  </h3>
                  <p className="text-xs text-[#3b5972] mt-1 font-medium leading-relaxed">
                    {selectedItem.shortDefinition}
                  </p>
                </div>

                {/* Plain-English Meaning */}
                <div className="bg-[#f8fbfe] p-4 rounded-2xl border border-[#dce6ee] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1e537d]">
                    <Sparkles className="w-4 h-4 text-[#e59b24]" />
                    <span>Plain English Translation</span>
                  </div>
                  <p className="text-xs text-[#132b40] leading-relaxed">
                    {selectedItem.plainLanguageSummary}
                  </p>
                </div>

                {/* Real-World Everyday Analogy */}
                <div className="bg-[#fdfaf2] p-4 rounded-2xl border border-[#f3ddb3] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#976412]">
                    <Lightbulb className="w-4 h-4 text-[#e59b24]" />
                    <span>Real-World Everyday Analogy</span>
                  </div>
                  <p className="text-xs text-[#61450a] italic leading-relaxed">
                    "{selectedItem.analogy}"
                  </p>
                </div>

                {/* Concrete Software Example */}
                <div className="bg-[#eef5fa] p-4 rounded-2xl border border-[#cce1f0] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1e537d]">
                    <CheckCircle2 className="w-4 h-4 text-[#1e537d]" />
                    <span>Where It Is Used in Real Systems</span>
                  </div>
                  <p className="text-xs text-[#334e68] leading-relaxed">
                    {selectedItem.realWorldExample}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#516b80]">
                <BookOpen className="w-8 h-8 text-[#8ba3b8] mb-2" />
                <p className="text-xs">Select any term on the left to inspect its plain-English explanation.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#e5edf3] bg-[#f8fbfe] px-5 text-xs text-[#516b80] flex items-center justify-between">
          <span>Tip: In any document or form, tap any term link to view its explanation here.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-2xl bg-[#e59b24] hover:bg-[#d68e1c] text-[#132b40] text-xs font-bold shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

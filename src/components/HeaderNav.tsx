import React from 'react';
import { FileDown, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  activeView: 'editor' | 'compare' | 'preview';
  onSelectView: (view: 'editor' | 'compare' | 'preview') => void;
  onDownloadDocx: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeView,
  onSelectView,
  onDownloadDocx,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl">✈</span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectView('editor');
          }}
          className="text-lg font-bold tracking-tight text-[#003366] font-brand whitespace-nowrap shrink-0"
        >
          International Tour & Travel
        </a>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onSelectView('editor')}
          className={`hover:text-[#003366] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'editor' ? 'text-[#003366] font-semibold border-b-2 border-[#003366]' : ''
          }`}
        >
          Invoice Workspace
        </button>
        <button
          onClick={() => onSelectView('compare')}
          className={`hover:text-[#003366] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'compare' ? 'text-[#003366] font-semibold border-b-2 border-[#003366]' : ''
          }`}
        >
          Original Template
        </button>
        <button
          onClick={() => onSelectView('preview')}
          className={`hover:text-[#003366] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeView === 'preview' ? 'text-[#003366] font-semibold border-b-2 border-[#003366]' : ''
          }`}
        >
          Full Page View
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onDownloadDocx}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#003366] hover:bg-[#002244] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <FileDown className="w-3.5 h-3.5 text-amber-400" />
          <span>Convert to Word (.docx)</span>
        </button>
      </div>
    </header>
  );
};

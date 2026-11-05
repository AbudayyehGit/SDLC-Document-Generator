import React from 'react';
import { HelpCircle } from 'lucide-react';
import { findGlossaryItem } from '../data/glossary';

interface GlossaryLinkProps {
  termId: string;
  onSelectTerm: (termId: string) => void;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const GlossaryLink: React.FC<GlossaryLinkProps> = ({
  termId,
  onSelectTerm,
  children,
  showIcon = true
}) => {
  const item = findGlossaryItem(termId);
  const displayText = children || (item ? item.term.split('(')[0].trim() : termId);

  return (
    <button
      type="button"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        onSelectTerm(termId);
      }}
      className="inline-flex items-center gap-0.5 text-teal-300 hover:text-teal-200 underline decoration-teal-400/50 hover:decoration-teal-300 underline-offset-2 transition-colors font-medium text-left cursor-pointer"
      title={item ? `Click to see plain-English definition for ${item.term}: "${item.shortDefinition}"` : 'View definition in glossary'}
    >
      <span>{displayText}</span>
      {showIcon && <HelpCircle className="w-3 h-3 text-teal-400/80 inline shrink-0" />}
    </button>
  );
};

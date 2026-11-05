import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileCheck,
  BookOpen,
  Check,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Sliders
} from 'lucide-react';
import { CLOSED_ENDED_FLOWS } from '../data/qaQuestions';
import { SDLCFormData, ClosedEndedQuestion } from '../types';
import { GlossaryLink } from './GlossaryLink';

interface QAWizardProps {
  stepId: 'prd' | 'sdd' | 'test' | 'runbook';
  formData: SDLCFormData;
  onUpdateField: (field: keyof SDLCFormData, value: any) => void;
  onOpenGlossary: (termId: string) => void;
  onSwitchToDirectForm: () => void;
}

export const QAWizard: React.FC<QAWizardProps> = ({
  stepId,
  formData,
  onUpdateField,
  onOpenGlossary,
  onSwitchToDirectForm
}) => {
  const flow = CLOSED_ENDED_FLOWS[stepId];
  const [currentQIndex, setCurrentQIndex] = useState(0);

  if (!flow || !flow.questions || flow.questions.length === 0) return null;

  const currentQ: ClosedEndedQuestion = flow.questions[currentQIndex];

  // Helper to read field (supporting nested keys like 'techStack.database')
  const getCurrentValue = (): string => {
    if (!currentQ) return '';
    if (typeof currentQ.targetField === 'string' && currentQ.targetField.startsWith('techStack.')) {
      const techKey = currentQ.targetField.split('.')[1] as keyof SDLCFormData['techStack'];
      return formData.techStack?.[techKey] || '';
    }
    return (formData as any)[currentQ.targetField] || '';
  };

  // Helper to write field
  const handleSetValue = (value: string) => {
    if (!currentQ) return;
    if (typeof currentQ.targetField === 'string' && currentQ.targetField.startsWith('techStack.')) {
      const techKey = currentQ.targetField.split('.')[1] as keyof SDLCFormData['techStack'];
      onUpdateField('techStack' as any, {
        ...formData.techStack,
        [techKey]: value
      });
    } else {
      onUpdateField(currentQ.targetField as keyof SDLCFormData, value);
    }
  };

  const currentVal = getCurrentValue();
  const isLastQuestion = currentQIndex === flow.questions.length - 1;

  return (
    <div className="space-y-4">
      {/* Top Petrol Blue Banner Card (matching attachment dark petrol card #1d4869) */}
      <div className="bg-[#1d4869] rounded-3xl p-4 sm:p-5 text-white border border-[#2b5e85] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-white bg-[#122e43] uppercase tracking-wider px-2.5 py-1 rounded-full">
                {flow.badgeText}
              </span>
              <span className="text-xs text-slate-200">
                Decision {currentQIndex + 1} of {flow.questions.length}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 leading-snug">
              {flow.title}
            </h3>
            <p className="text-xs text-[#b8d2e8] mt-0.5 leading-relaxed">
              {flow.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchToDirectForm}
            className="text-xs px-3.5 py-1.5 rounded-2xl bg-[#122e43] hover:bg-[#0c2030] text-[#e59b24] font-medium border border-[#244c6c] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Direct Form
          </button>
        </div>

        {/* Step Progress Bar with touch tap */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-4">
          {flow.questions.map((q, idx) => {
            const isDone = idx < currentQIndex;
            const isCurrent = idx === currentQIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentQIndex(idx)}
                className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#e59b24] shadow-sm'
                    : isDone
                    ? 'bg-[#407ba3]'
                    : 'bg-[#122e43]'
                }`}
                aria-label={`Jump to question ${idx + 1}`}
                title={`Question ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Question Card (matching attachment white rounded-3xl card #ffffff) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#dce6ee] shadow-sm space-y-5 text-[#132b40]">
        {/* Question Header & Context */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[#b87e21] tracking-wider uppercase">
              DECISION #{currentQIndex + 1}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#e8f3fb] text-[#1c6799] font-semibold border border-[#cce1f0]">
              {currentQ.kind === 'yes-no' ? 'Yes / No Choice' : currentQ.kind === 'single-choice' ? 'Single Choice' : 'Short Phrase'}
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-[#132b40] mt-1.5 leading-snug">
            {currentQ.question}
          </h4>

          <p className="text-xs sm:text-sm text-[#516b80] mt-1 leading-relaxed">
            {currentQ.subtext}
          </p>

          {/* Linked Glossary Terms */}
          {currentQ.glossaryTerms && currentQ.glossaryTerms.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#eaf0f5] text-xs">
              <span className="flex items-center gap-1 text-[#516b80] font-medium text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-[#1e537d]" /> Architecture Terms:
              </span>
              {currentQ.glossaryTerms.map(termId => (
                <GlossaryLink
                  key={termId}
                  termId={termId}
                  onSelectTerm={onOpenGlossary}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================= KIND 1: YES / NO (T/F CLOSED-ENDED) ================= */}
        {currentQ.kind === 'yes-no' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* YES OPTION */}
              <button
                type="button"
                onClick={() => handleSetValue(currentQ.yesText || 'Yes')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  currentVal.trim() === (currentQ.yesText || 'Yes').trim()
                    ? 'border-[#e59b24] bg-[#fdfaf2] shadow-sm ring-1 ring-[#e59b24]/40'
                    : 'border-[#dce6ee] bg-[#f8fbfe] hover:border-[#b8d2e8] text-[#132b40]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#132b40]">
                    {currentQ.yesLabel || 'Yes'}
                  </span>
                  {currentVal.trim() === (currentQ.yesText || 'Yes').trim() ? (
                    <div className="w-5 h-5 rounded-full bg-[#e59b24] text-[#132b40] flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#b8d2e8]" />
                  )}
                </div>
                <p className="text-xs text-[#516b80] mt-2 leading-relaxed">
                  {currentQ.yesText}
                </p>
              </button>

              {/* NO OPTION */}
              <button
                type="button"
                onClick={() => handleSetValue(currentQ.noText || 'No')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  currentVal.trim() === (currentQ.noText || 'No').trim()
                    ? 'border-[#e59b24] bg-[#fdfaf2] shadow-sm ring-1 ring-[#e59b24]/40'
                    : 'border-[#dce6ee] bg-[#f8fbfe] hover:border-[#b8d2e8] text-[#132b40]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#132b40]">
                    {currentQ.noLabel || 'No'}
                  </span>
                  {currentVal.trim() === (currentQ.noText || 'No').trim() ? (
                    <div className="w-5 h-5 rounded-full bg-[#e59b24] text-[#132b40] flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#b8d2e8]" />
                  )}
                </div>
                <p className="text-xs text-[#516b80] mt-2 leading-relaxed">
                  {currentQ.noText}
                </p>
              </button>
            </div>

            {/* Current Selected Summary Preview */}
            <div className="bg-[#eef5fa] p-3 rounded-2xl text-xs border border-[#d2e2ec] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1e537d] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#132b40]">Current Specification: </span>
                <span className="text-[#3b5972]">
                  {currentVal ? currentVal : '(Not yet selected. Tap Yes or No above.)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= KIND 2: SINGLE-CHOICE (MULTIPLE CHOICE) ================= */}
        {currentQ.kind === 'single-choice' && currentQ.options && (
          <div className="space-y-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = currentVal.trim() === opt.value.trim();
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSetValue(opt.value)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-[#e59b24] bg-[#fdfaf2] shadow-sm ring-1 ring-[#e59b24]/40'
                      : 'border-[#dce6ee] bg-[#f8fbfe] hover:border-[#b8d2e8] hover:bg-white text-[#132b40]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-[#132b40]">
                        {opt.label}
                      </span>
                      {opt.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fdf6e7] text-[#976412] border border-[#f3ddb3]">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.hint && (
                      <p className="text-xs text-[#516b80] mt-1 leading-relaxed">
                        {opt.hint}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 mt-0.5">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#e59b24] text-[#132b40] flex items-center justify-center font-bold shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#b8d2e8]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ================= KIND 3: SHORT-PHRASE (SINGLE LINE + QUICK PRESET CHIPS) ================= */}
        {currentQ.kind === 'short-phrase' && (
          <div className="space-y-3">
            {/* Single-line text input (NO textarea) */}
            <div>
              <label htmlFor="closed-short-phrase" className="block text-xs font-semibold text-[#132b40] mb-1.5">
                Type 2-3 words or tap a preset chip below:
              </label>
              <input
                id="closed-short-phrase"
                type="text"
                className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#132b40] placeholder:text-[#8ba3b8] focus:outline-none focus:border-[#e59b24] font-medium transition-colors"
                placeholder={currentQ.placeholder || 'e.g. Aegis Sentinel'}
                value={currentVal}
                onChange={e => handleSetValue(e.target.value)}
              />
            </div>

            {/* Quick-tap preset chips */}
            {currentQ.phraseSuggestions && currentQ.phraseSuggestions.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-[#b87e21] uppercase tracking-wider block mb-1.5">
                  Tap to apply instant preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentQ.phraseSuggestions.map((phrase, pIdx) => {
                    const isSelected = currentVal.trim() === phrase.trim();
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSetValue(phrase)}
                        className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#e59b24] text-[#132b40] shadow-sm ring-2 ring-[#e59b24]/40'
                            : 'bg-[#eef5fa] text-[#1e537d] border border-[#cce1f0] hover:bg-[#e0eef7]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{phrase}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#eaf0f5]">
          <button
            type="button"
            onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQIndex === 0}
            className="px-3.5 py-2 rounded-2xl text-xs font-semibold text-[#516b80] hover:text-[#132b40] hover:bg-[#eef5fa] disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={onSwitchToDirectForm}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#e59b24] hover:bg-[#d68e1c] text-[#132b40] flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Review Completed Plan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentQIndex(prev => Math.min(flow.questions.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#e59b24] hover:bg-[#d68e1c] text-[#132b40] flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <span>Next Decision</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

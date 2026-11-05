import React, { useState } from 'react';
import { Sparkles, X, Check, FolderPlus, Layers } from 'lucide-react';
import { TEMPLATES } from '../utils/templates';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, templateKey: string) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('aegis');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = projectName.trim() || 'New SDLC Project';
    onCreateProject(finalName, selectedTemplate);
    setProjectName('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#122e43]/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-project-title"
    >
      <div
        className="bg-white border border-[#dce6ee] rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-5 shadow-2xl text-[#132b40]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eaf0f5] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#eef5fa] border border-[#cce1f0] flex items-center justify-center text-[#1e537d]">
              <FolderPlus className="w-5 h-5 text-[#1e537d]" />
            </div>
            <div>
              <h2 id="new-project-title" className="text-base font-bold text-[#132b40]">
                Create Auto-Saved Project
              </h2>
              <p className="text-xs text-[#516b80]">
                Start a fresh reverse decision tree project with instant persistence.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8ba3b8] hover:text-[#132b40] hover:bg-[#f0f4f8] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="new-project-name" className="block font-bold text-[#132b40] mb-1.5">
              Project Short Title *
            </label>
            <input
              id="new-project-name"
              type="text"
              required
              autoFocus
              className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#132b40] placeholder:text-[#8ba3b8] focus:outline-none focus:border-[#e59b24] font-medium"
              placeholder="e.g. ShopStream Mobile, CloudWatch Guard"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-bold text-[#132b40] mb-1.5">
              Choose Starter Blueprint Preset:
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {Object.entries(TEMPLATES).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTemplate(key)}
                  className={`w-full p-3 rounded-2xl text-left border-2 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    selectedTemplate === key
                      ? 'bg-[#fdfaf2] border-[#e59b24] text-[#132b40] shadow-xs ring-1 ring-[#e59b24]/40'
                      : 'bg-[#f8fbfe] border-[#dce6ee] hover:border-[#b8d2e8] text-[#132b40]'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-[#132b40] block">
                      {item.label}
                    </span>
                    <p className="text-[11px] text-[#516b80] mt-0.5 line-clamp-1 leading-normal">
                      {item.description}
                    </p>
                  </div>
                  {selectedTemplate === key && (
                    <div className="w-5 h-5 rounded-full bg-[#e59b24] text-[#132b40] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setSelectedTemplate('blank')}
                className={`w-full p-3 rounded-2xl text-left border-2 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  selectedTemplate === 'blank'
                    ? 'bg-[#fdfaf2] border-[#e59b24] text-[#132b40] shadow-xs ring-1 ring-[#e59b24]/40'
                    : 'bg-[#f8fbfe] border-[#dce6ee] hover:border-[#b8d2e8] text-[#132b40]'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-[#132b40] block">
                    Clean Blank Canvas
                  </span>
                  <p className="text-[11px] text-[#516b80] mt-0.5 leading-normal">
                    Start completely from scratch with empty specification fields.
                  </p>
                </div>
                {selectedTemplate === 'blank' && (
                  <div className="w-5 h-5 rounded-full bg-[#e59b24] text-[#132b40] flex items-center justify-center font-bold shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-semibold text-[#516b80] hover:text-[#132b40] hover:bg-[#f0f4f8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#e59b24] hover:bg-[#d68e1c] text-[#132b40] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

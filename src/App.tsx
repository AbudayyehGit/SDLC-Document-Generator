/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Layers,
  ShieldCheck,
  Terminal,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Eye,
  Code,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  FileDown,
  Gauge,
  Edit3,
  HelpCircle,
  FolderPlus,
  ChevronDown,
  CopyCheck,
  MessageSquare
} from 'lucide-react';
import { SDLCFormData, StepConfig, CoreFeature, ProjectRecord } from './types';
import { TEMPLATES, DEFAULT_FORM_DATA, BLANK_FORM_DATA } from './utils/templates';
import {
  generatePRD,
  generateSDD,
  generateTestPlan,
  generateRunbook,
  generateMasterDossier,
  calculateDocumentStats,
  calculateReadinessScore
} from './utils/markdownGenerators';
import { MarkdownViewer } from './components/MarkdownViewer';
import { GlossaryModal } from './components/GlossaryModal';
import { GlossaryLink } from './components/GlossaryLink';
import { QAWizard } from './components/QAWizard';
import { NewProjectModal } from './components/NewProjectModal';
import { GLOSSARY_ITEMS } from './data/glossary';

const PROJECTS_STORAGE_KEY = 'sdlc_projects_collection_v2';
const ACTIVE_PROJECT_ID_KEY = 'sdlc_active_project_id_v2';

const STEPS: StepConfig[] = [
  {
    id: 'prd',
    label: '1. Product Plan (PRD)',
    stepNumber: 1,
    subtitle: 'What We Are Building',
    friendlyTitle: 'Plan What We Are Building & Who It Helps',
    tagline: 'Define the target audience, the core friction we solve, business goals, and prioritized functional requirements.'
  },
  {
    id: 'sdd',
    label: '2. Architecture (SDD)',
    stepNumber: 2,
    subtitle: 'How It Works Under the Hood',
    friendlyTitle: 'Design How the System Works Internally',
    tagline: 'Select system organization, choose technologies, structure data entities, and define security rules.'
  },
  {
    id: 'test',
    label: '3. Quality & Testing',
    stepNumber: 3,
    subtitle: 'How We Prevent Bugs',
    friendlyTitle: 'Verify Code Quality & User Journeys',
    tagline: 'Set unit test coverage targets, configure integration test environments, and establish automated quality gates.'
  },
  {
    id: 'runbook',
    label: '4. Operations & Safety',
    stepNumber: 4,
    subtitle: 'How to Run & Recover',
    friendlyTitle: 'Run the System & Handle Outages',
    tagline: 'Define safe rollout procedures, observability alerts, step-by-step rollback runbooks, and recovery targets.'
  },
  {
    id: 'master',
    label: '5. Complete Guidebook',
    stepNumber: 5,
    subtitle: 'All Documents Combined',
    friendlyTitle: 'Master SDLC Engineering Blueprint',
    tagline: 'Inspect the complete synthesized engineering dossier, review architectural readiness, and export deliverables.'
  }
];

export default function App() {
  // Multi-project state with auto-save
  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    try {
      const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved projects list, seeding default project:', e);
    }
    const initialProject: ProjectRecord = {
      id: 'proj-aegis-1',
      name: DEFAULT_FORM_DATA.projectName,
      updatedAt: new Date().toISOString(),
      data: DEFAULT_FORM_DATA
    };
    return [initialProject];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const savedActiveId = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
      if (savedActiveId) return savedActiveId;
    } catch {}
    return 'proj-aegis-1';
  });

  // Active project data
  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || projects[0] || {
      id: 'default',
      name: 'Default Project',
      updatedAt: new Date().toISOString(),
      data: DEFAULT_FORM_DATA
    };
  }, [projects, activeProjectId]);

  const formData = activeProject.data;

  // View & UI controls
  const [activeStep, setActiveStep] = useState<number>(0);
  const [stepMode, setStepMode] = useState<Record<number, 'qa' | 'form'>>({
    0: 'qa',
    1: 'qa',
    2: 'qa',
    3: 'qa',
    4: 'form'
  });
  const [previewTab, setPreviewTab] = useState<'current' | 'master'>('current');
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [copied, setCopied] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Modals & Popovers
  const [showGlossaryModal, setShowGlossaryModal] = useState<boolean>(false);
  const [selectedGlossaryTermId, setSelectedGlossaryTermId] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formScrollRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close project dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProjectDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to top when changing steps
  useEffect(() => {
    if (formScrollRef.current) {
      formScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeStep]);

  // Persist projects to localStorage with debounce
  useEffect(() => {
    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
        localStorage.setItem(ACTIVE_PROJECT_ID_KEY, activeProjectId);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to auto-save projects to localStorage:', err);
        setSaveStatus('error');
      }
    }, 400);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [projects, activeProjectId]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2800);
  };

  const handleOpenGlossary = (termId: string) => {
    setSelectedGlossaryTermId(termId);
    setShowGlossaryModal(true);
  };

  // Update active project's form data
  const updateActiveProjectData = (updater: (prev: SDLCFormData) => SDLCFormData) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === activeProjectId) {
          const updatedData = updater(p.data);
          return {
            ...p,
            name: updatedData.projectName || p.name,
            updatedAt: new Date().toISOString(),
            data: updatedData
          };
        }
        return p;
      });
    });
  };

  // Field change handler
  const handleInputChange = <K extends keyof SDLCFormData>(field: K, value: SDLCFormData[K]) => {
    updateActiveProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleTechStackChange = (techKey: keyof SDLCFormData['techStack'], value: string) => {
    updateActiveProjectData(prev => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [techKey]: value
      }
    }));
  };

  const handleFeatureChange = (index: number, key: keyof CoreFeature, value: string) => {
    updateActiveProjectData(prev => {
      const updated = [...prev.coreFeatures];
      if (updated[index]) {
        updated[index] = { ...updated[index], [key]: value };
      }
      return { ...prev, coreFeatures: updated };
    });
  };

  const addFeature = () => {
    const newId = `feat-${Date.now().toString().slice(-4)}`;
    updateActiveProjectData(prev => ({
      ...prev,
      coreFeatures: [
        ...prev.coreFeatures,
        {
          id: newId,
          title: 'New User Feature',
          priority: 'P1',
          desc: 'Describe what the user can do and what happens next.',
          acceptance: 'Passes automated checks and manual verification.'
        }
      ]
    }));
    triggerToast('Added a new feature requirement.');
  };

  const removeFeature = (index: number) => {
    updateActiveProjectData(prev => ({
      ...prev,
      coreFeatures: prev.coreFeatures.filter((_, i) => i !== index)
    }));
    triggerToast('Removed requirement.');
  };

  // Project Management Actions
  const handleCreateNewProject = (name: string, templateKey: string) => {
    const templateData = templateKey === 'blank'
      ? { ...BLANK_FORM_DATA, projectName: name }
      : TEMPLATES[templateKey]
      ? { ...TEMPLATES[templateKey].data, projectName: name }
      : { ...DEFAULT_FORM_DATA, projectName: name };

    const newProject: ProjectRecord = {
      id: `proj-${Date.now()}`,
      name: name,
      updatedAt: new Date().toISOString(),
      data: templateData
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setActiveStep(0);
    triggerToast(`Created new auto-saved project "${name}".`);
  };

  const handleDuplicateCurrentProject = () => {
    const duplicate: ProjectRecord = {
      id: `proj-${Date.now()}`,
      name: `${activeProject.name} (Copy)`,
      updatedAt: new Date().toISOString(),
      data: {
        ...formData,
        projectName: `${formData.projectName} (Copy)`
      }
    };
    setProjects(prev => [duplicate, ...prev]);
    setActiveProjectId(duplicate.id);
    setShowProjectDropdown(false);
    triggerToast(`Duplicated into "${duplicate.name}".`);
  };

  const handleDeleteCurrentProject = () => {
    if (projects.length <= 1) {
      alert('You must keep at least one project. You can reset this project instead.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete project "${activeProject.name}"?`)) {
      const remaining = projects.filter(p => p.id !== activeProjectId);
      setProjects(remaining);
      setActiveProjectId(remaining[0].id);
      setShowProjectDropdown(false);
      triggerToast('Project deleted.');
    }
  };

  const handleLoadTemplatePreset = (key: string) => {
    const t = TEMPLATES[key];
    if (t) {
      updateActiveProjectData(() => ({ ...t.data }));
      setShowTemplateModal(false);
      triggerToast(`Loaded "${t.label}" blueprint preset.`);
    }
  };

  const handleResetCurrent = () => {
    if (window.confirm('Reset current project inputs to default blueprint? Any uncommitted changes will be replaced.')) {
      updateActiveProjectData(() => ({ ...DEFAULT_FORM_DATA }));
      triggerToast('Reset project to default blueprint.');
    }
  };

  // Dynamic Markdown outputs
  const currentPhaseMarkdown = useMemo(() => {
    switch (activeStep) {
      case 0:
        return generatePRD(formData);
      case 1:
        return generateSDD(formData);
      case 2:
        return generateTestPlan(formData);
      case 3:
        return generateRunbook(formData);
      case 4:
      default:
        return generateMasterDossier(formData);
    }
  }, [activeStep, formData]);

  const masterMarkdown = useMemo(() => generateMasterDossier(formData), [formData]);

  const contentToDisplay = useMemo(() => {
    if (activeStep === 4 || previewTab === 'master') {
      return masterMarkdown;
    }
    return currentPhaseMarkdown;
  }, [activeStep, previewTab, currentPhaseMarkdown, masterMarkdown]);

  const stats = useMemo(() => calculateDocumentStats(contentToDisplay), [contentToDisplay]);
  const readiness = useMemo(() => calculateReadinessScore(formData), [formData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    triggerToast('Copied Markdown document to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type: 'current' | 'master' = 'current') => {
    const isMaster = type === 'master' || previewTab === 'master' || activeStep === 4;
    const text = isMaster ? masterMarkdown : currentPhaseMarkdown;
    const sanitizedTitle = (formData.projectName || 'project').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const fileName = isMaster
      ? `${sanitizedTitle}_sdlc_complete_guidebook.md`
      : `${sanitizedTitle}_${STEPS[activeStep].id}.md`;

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    triggerToast(`Downloaded ${fileName}`);
  };

  const getStepIcon = (id: string) => {
    switch (id) {
      case 'prd':
        return FileText;
      case 'sdd':
        return Layers;
      case 'test':
        return ShieldCheck;
      case 'runbook':
        return Terminal;
      case 'master':
      default:
        return BookOpen;
    }
  };

  const currentStepMode = stepMode[activeStep] || 'form';

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#132b40] flex flex-col font-sans selection:bg-[#e59b24]/30 selection:text-[#132b40]">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1d4869] border border-[#2b5e85] text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#e59b24] shrink-0" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Top Application Bar - Petrol Blue (#1e537d) from attachment */}
      <header className="h-16 bg-[#1e537d] border-b border-[#163f5f] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-[#122e43] border border-[#2b5e85] flex items-center justify-center text-[#e59b24] shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white truncate">
                SDLC Architect
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#122e43] text-[#e59b24] border border-[#2b5e85] whitespace-nowrap">
                Decision Tree
              </span>
            </div>

            {/* Active Project Switcher Dropdown */}
            <div className="relative mt-0.5" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowProjectDropdown(prev => !prev)}
                className="flex items-center gap-1 text-xs text-[#b8d2e8] hover:text-white transition-colors cursor-pointer group truncate"
                aria-expanded={showProjectDropdown}
                aria-label="Switch project"
              >
                <span className="text-[11px] text-[#8ba3b8] hidden sm:inline">Project:</span>
                <span className="font-bold text-white group-hover:underline decoration-[#e59b24] truncate max-w-[120px] sm:max-w-[180px]">
                  {activeProject.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#b8d2e8] group-hover:text-white shrink-0" />
              </button>

              {showProjectDropdown && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-[#dce6ee] rounded-3xl shadow-2xl p-2.5 z-50 text-xs text-[#132b40]">
                  <div className="px-3 py-1.5 border-b border-[#eaf0f5] text-[11px] font-bold text-[#516b80] flex items-center justify-between">
                    <span>Your Projects ({projects.length})</span>
                    <button
                      type="button"
                      onClick={() => { setShowProjectDropdown(false); setShowNewProjectModal(true); }}
                      className="text-[#1e537d] font-bold hover:text-[#e59b24] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> New
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto py-1 space-y-1">
                    {projects.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setActiveProjectId(p.id); setShowProjectDropdown(false); }}
                        className={`w-full text-left px-3 py-2 rounded-2xl flex items-center justify-between transition-colors cursor-pointer ${
                          p.id === activeProjectId
                            ? 'bg-[#fdfaf2] text-[#132b40] font-bold border border-[#e59b24]'
                            : 'hover:bg-[#f0f4f8] text-[#516b80]'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        {p.id === activeProjectId && (
                          <Check className="w-3.5 h-3.5 text-[#e59b24] shrink-0 font-bold" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#eaf0f5] space-y-1">
                    <button
                      type="button"
                      onClick={handleDuplicateCurrentProject}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-[#334e68] hover:bg-[#f0f4f8] flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <CopyCheck className="w-3.5 h-3.5 text-[#8ba3b8]" />
                      <span>Duplicate this Project</span>
                    </button>
                    {projects.length > 1 && (
                      <button
                        type="button"
                        onClick={handleDeleteCurrentProject}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete this Project</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Storage status */}
          <div className="text-xs text-[#b8d2e8] hidden xl:flex items-center gap-1.5 mr-1" aria-live="polite">
            {saveStatus === 'saved' ? (
              <span className="flex items-center text-emerald-300 gap-1 font-mono text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-saved
              </span>
            ) : saveStatus === 'saving' ? (
              <span className="text-[#e59b24] flex items-center gap-1 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-[#e59b24] animate-pulse" /> Saving...
              </span>
            ) : (
              <span className="text-rose-300 flex items-center gap-1 font-mono text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" /> Save error
              </span>
            )}
          </div>

          {/* New Project Button */}
          <button
            type="button"
            onClick={() => setShowNewProjectModal(true)}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-[#e59b24] hover:bg-[#d68e1c] text-[#132b40] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            title="Create a new auto-saved project"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Link-driven Glossary Button */}
          <button
            type="button"
            onClick={() => handleOpenGlossary('prd')}
            className="px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs font-semibold bg-[#122e43] hover:bg-[#0c2030] text-[#e59b24] border border-[#2b5e85] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Open Link-Driven Technical Glossary"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#e59b24]" />
            <span className="hidden md:inline">Glossary</span>
            <span className="text-[10px] text-white bg-[#1e537d] px-1.5 py-0.2 rounded-full">
              {GLOSSARY_ITEMS.length}
            </span>
          </button>

          {/* Blueprint Presets Modal Button */}
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="hidden lg:flex px-3 py-1.5 rounded-2xl text-xs font-medium bg-[#163f5f] hover:bg-[#12344e] text-white border border-[#2b5e85] items-center gap-1.5 transition-colors cursor-pointer"
            title="Load starter blueprints"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#b8d2e8]" />
            <span>Templates</span>
          </button>

          {/* Reset (matches coral button from screenshot) */}
          <button
            type="button"
            onClick={handleResetCurrent}
            className="hidden xl:flex px-3 py-1.5 rounded-2xl text-xs font-bold bg-[#d94436] hover:bg-[#c23629] text-white items-center gap-1 transition-colors cursor-pointer shadow-xs"
            title="Reset current project to default blueprint"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Copy MD */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 sm:px-3 py-1.5 rounded-2xl text-xs font-semibold bg-[#122e43] hover:bg-[#0c2030] text-white border border-[#2b5e85] flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy document to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Export .md */}
          <button
            type="button"
            onClick={() => handleDownload('current')}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white hover:bg-[#f0f4f8] text-[#1e537d] border border-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Export markdown file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export .md</span>
            <span className="sm:hidden">.md</span>
          </button>
        </div>
      </header>

      {/* Stepper Navigation Bar - Horizontal Touch Scrollable */}
      <nav aria-label="Documentation Processes" className="bg-white border-b border-[#dce6ee] px-3 sm:px-6 py-2 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center max-w-7xl mx-auto gap-2 min-w-max">
          {STEPS.map((step, idx) => {
            const Icon = getStepIcon(step.id);
            const isActive = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1e537d] text-white shadow-xs font-bold'
                    : isCompleted
                    ? 'bg-[#eef5fa] text-[#1e537d] hover:bg-[#e2edf5] border border-[#d2e2ec] font-semibold'
                    : 'text-[#516b80] hover:text-[#132b40] hover:bg-[#f0f4f8] font-medium'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs ${
                    isActive
                      ? 'bg-[#e59b24] text-[#132b40] font-black'
                      : isCompleted
                      ? 'bg-[#1e537d] text-white font-bold'
                      : 'bg-[#e5edf3] text-[#516b80]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-xs leading-tight">{step.label}</div>
                </div>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#b8d2e8] ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Mode Switcher (< lg screens) */}
      <div className="lg:hidden px-3 pt-2.5 pb-0 max-w-7xl mx-auto w-full">
        <div className="flex bg-[#e2edf5] p-1 rounded-2xl text-xs gap-1">
          <button
            type="button"
            onClick={() => setMobileView('form')}
            className={`flex-1 py-1.5 rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileView === 'form' ? 'bg-[#1e537d] text-white shadow-xs' : 'text-[#516b80] hover:text-[#132b40]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Wizard Q&A</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-1.5 rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileView === 'preview' ? 'bg-[#1e537d] text-white shadow-xs' : 'text-[#516b80] hover:text-[#132b40]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Document Preview ({stats.lines} lines)</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Q&A Wizard / Right Live Markdown */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden max-w-7xl w-full mx-auto p-3 sm:p-4 gap-4">
        {/* LEFT PANE: Guided Q&A Wizard & Direct Inputs (7 Cols on desktop) */}
        <section
          aria-labelledby="form-pane-heading"
          className={`lg:col-span-7 flex-col overflow-hidden max-w-full ${
            mobileView === 'form' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Header Card (matching screenshot white card with rounded-3xl and golden subtitle) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#dce6ee] shadow-sm mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#b87e21] uppercase tracking-wider">
                    PROCESS #{activeStep + 1} OF 5
                  </span>
                  <span className="text-xs text-[#516b80] font-medium hidden sm:inline">
                    {STEPS[activeStep].subtitle}
                  </span>
                </div>
                <h2 id="form-pane-heading" className="text-base sm:text-lg font-black text-[#132b40] mt-1 leading-snug">
                  {STEPS[activeStep].friendlyTitle}
                </h2>
                <p className="text-xs text-[#516b80] mt-0.5 leading-relaxed">
                  {STEPS[activeStep].tagline}
                </p>
              </div>

              {/* Mode switch (Q&A vs Direct) and Previous/Next buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {activeStep < 4 && (
                  <div className="flex bg-[#eef5fa] p-1 rounded-2xl border border-[#d2e2ec] text-xs">
                    <button
                      type="button"
                      onClick={() => setStepMode(prev => ({ ...prev, [activeStep]: 'qa' }))}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                        currentStepMode === 'qa' ? 'bg-[#1e537d] text-white shadow-xs' : 'text-[#516b80] hover:text-[#132b40]'
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Q&A</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStepMode(prev => ({ ...prev, [activeStep]: 'form' }))}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                        currentStepMode === 'form' ? 'bg-[#1e537d] text-white shadow-xs' : 'text-[#516b80] hover:text-[#132b40]'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Direct</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    className="p-1.5 rounded-xl bg-[#eef5fa] hover:bg-[#e0edf7] disabled:opacity-30 text-[#1e537d] transition-colors cursor-pointer"
                    title="Previous process"
                    aria-label="Previous process"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                    disabled={activeStep === STEPS.length - 1}
                    className="p-1.5 rounded-xl bg-[#eef5fa] hover:bg-[#e0edf7] disabled:opacity-30 text-[#1e537d] transition-colors cursor-pointer"
                    title="Next process"
                    aria-label="Next process"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form & Wizard Scrollable Area */}
          <div ref={formScrollRef} className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
            {/* QA Wizard Mode for steps 0, 1, 2, 3 */}
            {activeStep < 4 && currentStepMode === 'qa' && (
              <QAWizard
                stepId={STEPS[activeStep].id as 'prd' | 'sdd' | 'test' | 'runbook'}
                formData={formData}
                onUpdateField={handleInputChange}
                onOpenGlossary={handleOpenGlossary}
                onSwitchToDirectForm={() => setStepMode(prev => ({ ...prev, [activeStep]: 'form' }))}
              />
            )}

            {/* Direct Form Mode for step 0 (PRD) */}
            {activeStep === 0 && currentStepMode === 'form' && (
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#dce6ee] shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="field-project-name" className="block font-bold text-[#132b40] mb-1">
                      Project Name *
                    </label>
                    <input
                      id="field-project-name"
                      type="text"
                      className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                      value={formData.projectName}
                      onChange={e => handleInputChange('projectName', e.target.value)}
                      placeholder="e.g. Aegis Sentinel"
                    />
                  </div>
                  <div>
                    <label htmlFor="field-target-version" className="block font-bold text-[#132b40] mb-1">
                      Target Release Version
                    </label>
                    <input
                      id="field-target-version"
                      type="text"
                      className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-mono font-medium"
                      value={formData.version}
                      onChange={e => handleInputChange('version', e.target.value)}
                      placeholder="e.g. 1.0.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="field-author" className="block font-bold text-[#132b40] mb-1">
                      Author / Responsible Team
                    </label>
                    <input
                      id="field-author"
                      type="text"
                      className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                      value={formData.author}
                      onChange={e => handleInputChange('author', e.target.value)}
                      placeholder="e.g. Platform Engineering Guild"
                    />
                  </div>
                  <div>
                    <label htmlFor="field-target-audience" className="block font-bold text-[#132b40] mb-1">
                      Target Audience & Users
                    </label>
                    <input
                      id="field-target-audience"
                      type="text"
                      className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                      value={formData.targetAudience}
                      onChange={e => handleInputChange('targetAudience', e.target.value)}
                      placeholder="e.g. Enterprise SRE, Compliance Officers"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-problem-statement" className="block font-bold text-[#132b40]">
                      Problem Statement (The Friction We Solve)
                    </label>
                    <GlossaryLink termId="prd" onSelectTerm={handleOpenGlossary}>
                      What is a PRD?
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-problem-statement"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.problemStatement}
                    onChange={e => handleInputChange('problemStatement', e.target.value)}
                    placeholder="Describe the root friction, current latency/failures, and who suffers."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-business-objectives" className="block font-bold text-[#132b40]">
                      Business Goals & Success Numbers
                    </label>
                    <GlossaryLink termId="sla" onSelectTerm={handleOpenGlossary}>
                      SLAs
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-business-objectives"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.businessObjectives}
                    onChange={e => handleInputChange('businessObjectives', e.target.value)}
                    placeholder="1. Target outcome, 2. Measurable SLA metric, 3. Availability target."
                  />
                </div>

                {/* Core Features with Priorities */}
                <div className="bg-[#f8fbfe] p-4 rounded-3xl border border-[#dce6ee] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#132b40]">Must-Have Capabilities & Feature Scope</span>
                        <GlossaryLink termId="p0-p1-p2" onSelectTerm={handleOpenGlossary}>
                          P0 / P1 / P2 Priorities
                        </GlossaryLink>
                      </div>
                      <p className="text-[11px] text-[#516b80]">List core user features with priorities and acceptance criteria.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-xs text-[#132b40] bg-[#e59b24] hover:bg-[#d68e1c] px-3.5 py-1.5 rounded-2xl flex items-center gap-1 font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Requirement
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formData.coreFeatures.map((feat, fIdx) => (
                      <div key={feat.id || fIdx} className="bg-white p-3.5 rounded-2xl border border-[#dce6ee] space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            aria-label={`Feature ${fIdx + 1} Title`}
                            className="flex-1 bg-[#f8fbfe] border border-[#dce6ee] rounded-xl px-2.5 py-1.5 text-xs text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                            placeholder="Feature Title"
                            value={feat.title}
                            onChange={e => handleFeatureChange(fIdx, 'title', e.target.value)}
                          />
                          <select
                            aria-label={`Feature ${fIdx + 1} Priority`}
                            className="bg-[#fdfaf2] border border-[#e59b24] rounded-xl px-2.5 py-1.5 text-xs text-[#976412] font-bold focus:outline-none cursor-pointer"
                            value={feat.priority}
                            onChange={e => handleFeatureChange(fIdx, 'priority', e.target.value as 'P0' | 'P1' | 'P2')}
                          >
                            <option value="P0">P0 (Critical Blocker)</option>
                            <option value="P1">P1 (High Priority)</option>
                            <option value="P2">P2 (Medium Iteration)</option>
                          </select>
                          {formData.coreFeatures.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(fIdx)}
                              className="text-rose-600 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title="Delete requirement"
                              aria-label={`Delete requirement ${feat.title || fIdx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            aria-label={`Feature ${fIdx + 1} Description`}
                            className="bg-[#f8fbfe] border border-[#dce6ee] rounded-xl px-2.5 py-1.5 text-[11px] text-[#516b80] focus:outline-none focus:border-[#e59b24]"
                            placeholder="User journey & technical description"
                            value={feat.desc}
                            onChange={e => handleFeatureChange(fIdx, 'desc', e.target.value)}
                          />
                          <input
                            type="text"
                            aria-label={`Feature ${fIdx + 1} Acceptance Criteria`}
                            className="bg-[#f8fbfe] border border-[#dce6ee] rounded-xl px-2.5 py-1.5 text-[11px] text-[#516b80] focus:outline-none focus:border-[#e59b24]"
                            placeholder="Acceptance criteria (e.g. Completes in < 100ms)"
                            value={feat.acceptance || ''}
                            onChange={e => handleFeatureChange(fIdx, 'acceptance', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-nfr" className="block font-bold text-[#132b40]">
                      Non-Functional Standards (Speed, Uptime & Encryption)
                    </label>
                    <GlossaryLink termId="nfr" onSelectTerm={handleOpenGlossary}>
                      What are NFRs?
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-nfr"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.nonFunctionalReqs}
                    onChange={e => handleInputChange('nonFunctionalReqs', e.target.value)}
                    placeholder="99.99% availability, p99 latency < 80ms, TLS 1.3 only, AES-256-GCM encryption."
                  />
                </div>
              </div>
            )}

            {/* Direct Form Mode for step 1 (SDD) */}
            {activeStep === 1 && currentStepMode === 'form' && (
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#dce6ee] shadow-sm space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-architecture-pattern" className="block font-bold text-[#132b40]">
                      System Organization Pattern
                    </label>
                    <div className="flex gap-2">
                      <GlossaryLink termId="microservices" onSelectTerm={handleOpenGlossary}>
                        Microservices
                      </GlossaryLink>
                      <GlossaryLink termId="cqrs" onSelectTerm={handleOpenGlossary}>
                        CQRS
                      </GlossaryLink>
                    </div>
                  </div>
                  <select
                    id="field-architecture-pattern"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2.5 text-[#132b40] font-bold focus:outline-none focus:border-[#e59b24] cursor-pointer"
                    value={formData.architecturePattern}
                    onChange={e => handleInputChange('architecturePattern', e.target.value)}
                  >
                    <option value="Event-Driven Microservices with CQRS">Event-Driven Microservices with CQRS</option>
                    <option value="Modular Monolith (Domain-Driven Design)">Modular Monolith (Domain-Driven Design)</option>
                    <option value="Serverless & EventBridge Reactive Pipelines">Serverless & EventBridge Reactive Pipelines</option>
                    <option value="Hexagonal / Ports & Adapters Architecture">Hexagonal / Ports & Adapters Architecture</option>
                  </select>
                </div>

                {/* Tech Stack Matrix */}
                <div className="bg-[#f8fbfe] p-4 rounded-3xl border border-[#dce6ee] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#132b40]">Technology Stack Choices</span>
                    <GlossaryLink termId="kafka" onSelectTerm={handleOpenGlossary}>
                      Event Brokers
                    </GlossaryLink>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="tech-db" className="block text-[11px] font-bold text-[#516b80] mb-1">Database</label>
                      <input
                        id="tech-db"
                        type="text"
                        className="w-full bg-white border border-[#dce6ee] rounded-xl px-2.5 py-1.5 text-xs text-[#132b40] focus:border-[#e59b24]"
                        value={formData.techStack.database}
                        onChange={e => handleTechStackChange('database', e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="tech-broker" className="block text-[11px] font-bold text-[#516b80] mb-1">Message Broker / Queue</label>
                      <input
                        id="tech-broker"
                        type="text"
                        className="w-full bg-white border border-[#dce6ee] rounded-xl px-2.5 py-1.5 text-xs text-[#132b40] focus:border-[#e59b24]"
                        value={formData.techStack.broker}
                        onChange={e => handleTechStackChange('broker', e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="tech-backend" className="block text-[11px] font-bold text-[#516b80] mb-1">Backend Service Runtime</label>
                      <input
                        id="tech-backend"
                        type="text"
                        className="w-full bg-white border border-[#dce6ee] rounded-xl px-2.5 py-1.5 text-xs text-[#132b40] focus:border-[#e59b24]"
                        value={formData.techStack.backend}
                        onChange={e => handleTechStackChange('backend', e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="tech-infra" className="block text-[11px] font-bold text-[#516b80] mb-1">Infrastructure & Cloud</label>
                      <input
                        id="tech-infra"
                        type="text"
                        className="w-full bg-white border border-[#dce6ee] rounded-xl px-2.5 py-1.5 text-xs text-[#132b40] focus:border-[#e59b24]"
                        value={formData.techStack.infra}
                        onChange={e => handleTechStackChange('infra', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-security" className="block font-bold text-[#132b40]">
                      Authentication & Security Controls
                    </label>
                    <GlossaryLink termId="zero-trust" onSelectTerm={handleOpenGlossary}>
                      Zero-Trust
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-security"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.authSecurity}
                    onChange={e => handleInputChange('authSecurity', e.target.value)}
                    placeholder="Zero-Trust mTLS, Casbin RBAC, KMS envelope encryption."
                  />
                </div>
              </div>
            )}

            {/* Direct Form Mode for step 2 (Test Plan) */}
            {activeStep === 2 && currentStepMode === 'form' && (
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#dce6ee] shadow-sm space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-unit-tests" className="block font-bold text-[#132b40]">
                      Unit Testing & Coverage Gates
                    </label>
                    <GlossaryLink termId="branch-coverage" onSelectTerm={handleOpenGlossary}>
                      Branch Coverage
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-unit-tests"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.unitTestFramework}
                    onChange={e => handleInputChange('unitTestFramework', e.target.value)}
                    placeholder="Vitest / Go testing with hard quality gate requiring >= 85% branch coverage."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-integration" className="block font-bold text-[#132b40]">
                      Integration Test Container Strategy
                    </label>
                    <GlossaryLink termId="integration-testing" onSelectTerm={handleOpenGlossary}>
                      Integration Testing
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-integration"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.integrationTests}
                    onChange={e => handleInputChange('integrationTests', e.target.value)}
                    placeholder="Testcontainers spinning up ephemeral PostgreSQL and Kafka instances per execution suite."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-cicd" className="block font-bold text-[#132b40]">
                      CI/CD Pipeline Security & Quality Gates
                    </label>
                    <GlossaryLink termId="ci-cd" onSelectTerm={handleOpenGlossary}>
                      CI/CD
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-cicd"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.cicdQualityGates}
                    onChange={e => handleInputChange('cicdQualityGates', e.target.value)}
                    placeholder="GitHub Actions running Trivy vulnerability scans, SonarQube static analysis, and zero CVE policy."
                  />
                </div>
              </div>
            )}

            {/* Direct Form Mode for step 3 (Runbook) */}
            {activeStep === 3 && currentStepMode === 'form' && (
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#dce6ee] shadow-sm space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-deploy" className="block font-bold text-[#132b40]">
                      Deployment Rollout Strategy
                    </label>
                    <GlossaryLink termId="canary-deployment" onSelectTerm={handleOpenGlossary}>
                      Canary Deployments
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-deploy"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.deploymentStrategy}
                    onChange={e => handleInputChange('deploymentStrategy', e.target.value)}
                    placeholder="ArgoCD GitOps Canary deployments (10% -> 25% -> 50% -> 100%) with automated rollbacks."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-rollback" className="block font-bold text-[#132b40]">
                      Emergency Rollback Runbook Steps
                    </label>
                    <GlossaryLink termId="rollback" onSelectTerm={handleOpenGlossary}>
                      Rollback Procedure
                    </GlossaryLink>
                  </div>
                  <input
                    id="field-rollback"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.rollbackProcedure}
                    onChange={e => handleInputChange('rollbackProcedure', e.target.value)}
                    placeholder="Abort sync, revert to previous stable tag in < 60s, verify backward compatibility."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="field-dr" className="block font-bold text-[#132b40]">
                      Disaster Recovery Targets (RTO / RPO)
                    </label>
                    <div className="flex gap-2">
                      <GlossaryLink termId="rto" onSelectTerm={handleOpenGlossary}>
                        RTO
                      </GlossaryLink>
                      <GlossaryLink termId="rpo" onSelectTerm={handleOpenGlossary}>
                        RPO
                      </GlossaryLink>
                    </div>
                  </div>
                  <input
                    id="field-dr"
                    type="text"
                    className="w-full bg-[#f8fbfe] border-2 border-[#dce6ee] rounded-2xl px-3.5 py-2 text-[#132b40] focus:outline-none focus:border-[#e59b24] font-medium"
                    value={formData.disasterRecovery}
                    onChange={e => handleInputChange('disasterRecovery', e.target.value)}
                    placeholder="RPO < 1 minute, RTO < 15 minutes. Multi-region automated failover."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Complete Master Guidebook Synthesis Review */}
            {activeStep === 4 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dce6ee] shadow-sm space-y-5">
                <div className="bg-[#1d4869] text-white p-5 rounded-3xl border border-[#2b5e85] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#e59b24] uppercase tracking-wider bg-[#122e43] px-2.5 py-1 rounded-full">
                      SDLC Synthesizer
                    </span>
                    <span className="text-xs text-[#b8d2e8]">
                      5 / 5 Documents Ready
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Master Engineering Blueprint Complete
                  </h3>
                  <p className="text-xs text-[#b8d2e8] leading-relaxed">
                    All reverse decision tree phases have been synthesized into a single production markdown dossier. You can download the complete guidebook or individual chapter documents.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleDownload('master')}
                      className="px-4 py-2 rounded-2xl bg-[#e59b24] hover:bg-[#d68e1c] text-[#132b40] text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Complete Blueprint (.md)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-2xl bg-[#122e43] hover:bg-[#0c2030] text-white border border-[#2b5e85] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#e59b24]" />
                      <span>Copy Entire Blueprint</span>
                    </button>
                  </div>
                </div>

                {/* Readiness Score Breakdown */}
                <div className="bg-[#f8fbfe] p-4 rounded-3xl border border-[#dce6ee] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#132b40] text-sm">Specification Completeness</span>
                    <span className="text-sm font-black text-[#1e537d]">{readiness.score}%</span>
                  </div>
                  <div className="w-full bg-[#dce6ee] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#e59b24] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${readiness.score}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-semibold text-[#516b80]">
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> PRD Verified
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> SDD Architecture
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Quality Gates
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" /> Runbook & DR
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT PANE: Real-time Live Markdown Preview (5 Cols on desktop) */}
        <section
          aria-labelledby="preview-pane-heading"
          className={`lg:col-span-5 bg-white border border-[#dce6ee] rounded-3xl flex-col overflow-hidden shadow-sm ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Preview Header - Petrol Blue Bar (#1e537d) */}
          <div className="p-3.5 sm:p-4 bg-[#1e537d] text-white flex items-center justify-between gap-2 border-b border-[#163f5f]">
            {/* Document Selection Tabs */}
            <div className="flex items-center gap-1 bg-[#122e43] p-1 rounded-2xl border border-[#2b5e85] text-xs">
              <button
                type="button"
                onClick={() => setPreviewTab('current')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  previewTab === 'current'
                    ? 'bg-[#e59b24] text-[#132b40] shadow-xs'
                    : 'text-[#b8d2e8] hover:text-white'
                }`}
              >
                Current Phase
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('master')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  previewTab === 'master'
                    ? 'bg-[#e59b24] text-[#132b40] shadow-xs'
                    : 'text-[#b8d2e8] hover:text-white'
                }`}
              >
                Complete Guidebook
              </button>
            </div>

            {/* Quick Actions (Rendered / Raw, Copy, Download) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="flex bg-[#122e43] p-0.5 rounded-xl border border-[#2b5e85] text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('rendered')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'rendered' ? 'bg-[#1e537d] text-[#e59b24]' : 'text-[#8ba3b8] hover:text-white'
                  }`}
                  title="Rendered live preview"
                  aria-label="Rendered live preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('raw')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'raw' ? 'bg-[#1e537d] text-[#e59b24]' : 'text-[#8ba3b8] hover:text-white'
                  }`}
                  title="Raw Markdown source"
                  aria-label="Raw Markdown source"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-xl bg-[#122e43] hover:bg-[#0c2030] text-white border border-[#2b5e85] transition-colors cursor-pointer"
                title="Copy markdown"
                aria-label="Copy markdown"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#e59b24]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => handleDownload(previewTab)}
                className="p-1.5 rounded-xl bg-[#e59b24] hover:bg-[#d68e1c] text-[#132b40] transition-colors cursor-pointer shadow-xs font-bold"
                title="Download this document as .md"
                aria-label="Download markdown"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-header Stats Bar */}
          <div className="px-4 py-2 bg-[#f8fbfe] border-b border-[#dce6ee] flex items-center justify-between text-[11px] text-[#516b80]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#132b40]">
                {previewTab === 'master' ? 'Complete SDLC Guidebook' : STEPS[activeStep].label}
              </span>
              <span className="font-mono text-[#b87e21] font-semibold">
                {stats.words} words • {stats.lines} lines
              </span>
            </div>
            <span className="font-bold text-[#1e537d]">
              Ready for GitHub / Confluence
            </span>
          </div>

          {/* Document Content View Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-white text-xs">
            {viewMode === 'rendered' ? (
              <MarkdownViewer content={contentToDisplay} onOpenGlossary={handleOpenGlossary} />
            ) : (
              <pre className="font-mono text-[11px] text-[#132b40] leading-relaxed whitespace-pre-wrap select-all bg-[#f8fbfe] p-3.5 rounded-2xl border border-[#dce6ee]">
                {contentToDisplay}
              </pre>
            )}
          </div>
        </section>
      </main>

      {/* MODALS */}
      {/* 1. Technical Glossary Modal */}
      <GlossaryModal
        isOpen={showGlossaryModal}
        onClose={() => setShowGlossaryModal(false)}
        initialTermId={selectedGlossaryTermId}
      />

      {/* 2. New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onCreateProject={handleCreateNewProject}
      />

      {/* 3. Starter Blueprint Templates Modal */}
      {showTemplateModal && (
        <div
          className="fixed inset-0 z-50 bg-[#122e43]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowTemplateModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white border border-[#dce6ee] rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl text-[#132b40]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eaf0f5] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#eef5fa] border border-[#cce1f0] flex items-center justify-center text-[#1e537d]">
                  <FolderOpen className="w-5 h-5 text-[#1e537d]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#132b40]">Starter Architecture Blueprints</h3>
                  <p className="text-xs text-[#516b80]">Load industry-standard preset decision paths.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-xl text-[#8ba3b8] hover:text-[#132b40]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleLoadTemplatePreset(key)}
                  className="w-full text-left p-3.5 rounded-2xl border-2 border-[#dce6ee] hover:border-[#e59b24] hover:bg-[#fdfaf2] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#132b40] group-hover:text-[#976412]">
                      {t.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#eef5fa] text-[#1e537d] font-bold">
                      Load
                    </span>
                  </div>
                  <p className="text-[11px] text-[#516b80] mt-1 leading-normal">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 rounded-2xl bg-[#eef5fa] text-[#516b80] hover:text-[#132b40] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

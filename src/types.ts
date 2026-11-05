export interface CoreFeature {
  id: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  desc: string;
  acceptance?: string;
}

export interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  cache: string;
  broker: string;
  infra: string;
}

export interface SDLCFormData {
  archetype?: string;
  // PRD (What we are building)
  projectName: string;
  version: string;
  author: string;
  date: string;
  targetAudience: string;
  problemStatement: string;
  businessObjectives: string;
  coreFeatures: CoreFeature[];
  nonFunctionalReqs: string;

  // SDD (How it works under the hood)
  architecturePattern: string;
  techStack: TechStack;
  dataModelEntities: string;
  apiDesign: string;
  authSecurity: string;
  dataFlowNotes: string;

  // Test Plan (How we verify quality)
  unitTestFramework: string;
  integrationTests: string;
  e2eScenarios: string;
  cicdQualityGates: string;
  performanceTesting: string;

  // Runbook (How we operate and handle emergencies)
  deploymentStrategy: string;
  monitoringAlerting: string;
  rollbackProcedure: string;
  disasterRecovery: string;
  incidentEscalation: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  updatedAt: string;
  data: SDLCFormData;
}

export type StepId = 'prd' | 'sdd' | 'test' | 'runbook' | 'master';

export interface StepConfig {
  id: StepId;
  label: string;
  stepNumber: number;
  subtitle: string;
  friendlyTitle: string;
  tagline: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  shortDefinition: string;
  plainLanguageSummary: string;
  analogy: string;
  realWorldExample: string;
  category: 'Planning' | 'Architecture' | 'Testing' | 'Operations' | 'Security';
}

export type QuestionKind = 'yes-no' | 'single-choice' | 'multi-choice' | 'short-phrase';

export interface QuestionOption {
  label: string;
  value: string;
  hint?: string;
  badge?: string;
}

export interface ClosedEndedQuestion {
  id: string;
  kind: QuestionKind;
  question: string;
  subtext: string;
  targetField: keyof SDLCFormData | string;
  options?: QuestionOption[];
  // For yes-no questions:
  yesText?: string;
  noText?: string;
  yesLabel?: string;
  noLabel?: string;
  // For short-phrase single-line inputs:
  placeholder?: string;
  phraseSuggestions?: string[];
  glossaryTerms?: string[];
}

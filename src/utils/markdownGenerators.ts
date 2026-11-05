import { SDLCFormData } from '../types';

export const generatePRD = (data: SDLCFormData): string => `# Product Requirements Document (PRD)
## Project: ${data.projectName || 'Untitled Project'}
- **Version:** ${data.version || '0.1.0'}
- **Author:** ${data.author || 'Anonymous'}
- **Date:** ${data.date || new Date().toISOString().split('T')[0]}
- **Target Audience:** ${data.targetAudience || 'General Stakeholders'}

---

### 1. Problem Statement (The Friction We Solve)
${data.problemStatement || '_No problem statement provided._'}

### 2. Business Objectives & Success Metrics (What Success Looks Like)
${data.businessObjectives || '_No business objectives defined._'}

### 3. Core Features & Functional Requirements
| Feature | Priority | Technical Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
${(data.coreFeatures && data.coreFeatures.length > 0)
  ? data.coreFeatures.map(f => `| **${f.title || 'Feature'}** | \`${f.priority || 'P1'}\` | ${f.desc || 'N/A'} | ${f.acceptance || 'Operational in staging.'} |`).join('\n')
  : '| _No features defined_ | - | - | - |'
}

### 4. Non-Functional Requirements (NFRs: Speed, Reliability & Security Standards)
${data.nonFunctionalReqs || '_No non-functional requirements specified._'}
`;

export const generateSDD = (data: SDLCFormData): string => `# System Design Document (SDD)
## Project: ${data.projectName || 'Untitled Project'} - Architecture Specification
- **Architecture Pattern:** ${data.architecturePattern || 'Not Specified'}
- **Author / Reviewers:** ${data.author || 'Anonymous'}
- **Date:** ${data.date || new Date().toISOString().split('T')[0]}

---

### 1. Technology Stack Blueprint
- **Frontend Layer:** ${data.techStack?.frontend || 'N/A'}
- **Application Core / Services:** ${data.techStack?.backend || 'N/A'}
- **Primary Data Store:** ${data.techStack?.database || 'N/A'}
- **Caching & Ephemeral State:** ${data.techStack?.cache || 'N/A'}
- **Event Bus / Message Broker:** ${data.techStack?.broker || 'N/A'}
- **Infrastructure & Deployment Target:** ${data.techStack?.infra || 'Cloud Native'}

### 2. Domain Entities & Data Model
\`\`\`sql
-- Key domain entities and schema definitions:
${data.dataModelEntities || '-- No entities specified'}
\`\`\`

### 3. API & Communication Protocols
${data.apiDesign || '_No API specification provided._'}

### 4. Security, Auth & Zero-Trust Architecture
${data.authSecurity || '_No security baseline specified._'}

### 5. Data Flow & Pipeline Architecture
${data.dataFlowNotes || '_Standard request-response and event pipeline flow._'}
`;

export const generateTestPlan = (data: SDLCFormData): string => `# Test Strategy & Verification Plan
## System: ${data.projectName || 'Untitled Project'}
- **Quality Target:** Production Hardened
- **Validation Scope:** Automated Unit, Integration, E2E, and Chaos Scenarios
- **Revision:** ${data.version || '0.1.0'}

---

### 1. Unit Testing Strategy & Target Coverage
${data.unitTestFramework || '_No unit test framework defined._'}

### 2. Integration & Mocking Environment
${data.integrationTests || '_No integration test environment defined._'}

### 3. Critical End-to-End Scenarios & Regression Acceptance
${data.e2eScenarios || '_No E2E scenarios defined._'}

### 4. Automated CI/CD Quality Gates
${data.cicdQualityGates || '_No CI/CD quality gates specified._'}

### 5. Performance, Scale & Resilience Testing
${data.performanceTesting || '_Standard load testing required before production traffic._'}
`;

export const generateRunbook = (data: SDLCFormData): string => `# Production Runbook & Operations Guide
## System: ${data.projectName || 'Untitled Project'}
- **Operational Criticality:** Tier-1 Production System
- **Owner Team:** SRE & ${data.author || 'Platform Engineering'}
- **Effective Date:** ${data.date || new Date().toISOString().split('T')[0]}

---

### 1. Deployment & Rollout Strategy
${data.deploymentStrategy || '_Standard rolling deployment._'}

### 2. Observability, Metrics & Telemetry
${data.monitoringAlerting || '_Standard logs and metrics collection._'}

### 3. Emergency Incident Response & Rollback Procedures
${data.rollbackProcedure || '_Follow standard deployment rollback._'}

### 4. High Availability & Disaster Recovery (DR)
${data.disasterRecovery || '_Standard regional failover._'}

### 5. Incident Escalation & On-Call Matrix
${data.incidentEscalation || '_Notify on-call engineer via PagerDuty._'}
`;

export const generateMasterDossier = (data: SDLCFormData): string => `# SDLC Master Engineering Dossier: ${data.projectName || 'Untitled Project'}
> Automated Engineering Blueprint generated on ${data.date || new Date().toISOString().split('T')[0]}
> System Version: ${data.version || '0.1.0'} | Authored by: ${data.author || 'Anonymous'}

================================================================================
TABLE OF CONTENTS
================================================================================
1. Product Requirements Document (PRD)
2. System Design Document (SDD)
3. Quality & Test Strategy Specification
4. Operations Runbook & Incident Protocols
================================================================================

${generatePRD(data)}

${generateSDD(data)}

${generateTestPlan(data)}

${generateRunbook(data)}
`;

export interface DocumentStats {
  lines: number;
  words: number;
  chars: number;
  sections: number;
}

export const calculateDocumentStats = (text: string): DocumentStats => {
  if (!text) {
    return { lines: 0, words: 0, chars: 0, sections: 0 };
  }
  const lines = text.split('\n').length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sections = (text.match(/^#{1,3}\s/gm) || []).length;
  return { lines, words, chars, sections };
};

export interface ReadinessCheck {
  label: string;
  passed: boolean;
  tip: string;
}

export const calculateReadinessScore = (data: SDLCFormData): { score: number; checks: ReadinessCheck[] } => {
  const checks: ReadinessCheck[] = [
    {
      label: 'Core Project Identity',
      passed: Boolean(data.projectName?.trim() && data.version?.trim() && data.author?.trim()),
      tip: 'Provide project name, target version, and author guild.'
    },
    {
      label: 'PRD Problem & Objectives',
      passed: Boolean(data.problemStatement?.trim().length > 20 && data.businessObjectives?.trim().length > 20),
      tip: 'Flesh out clear problem statements and measurable objectives.'
    },
    {
      label: 'Prioritized Feature Scope',
      passed: Boolean(data.coreFeatures && data.coreFeatures.length >= 2 && data.coreFeatures.some(f => f.priority === 'P0')),
      tip: 'Define at least two core features with at least one critical P0 priority.'
    },
    {
      label: 'SDD Architecture & Stack',
      passed: Boolean(data.architecturePattern?.trim() && data.techStack?.backend?.trim() && data.techStack?.database?.trim()),
      tip: 'Select architecture pattern and specify backend and database layers.'
    },
    {
      label: 'Security & Auth Specification',
      passed: Boolean(data.authSecurity?.trim().length > 25),
      tip: 'Define zero-trust, auth protocols, and encryption standard.'
    },
    {
      label: 'Verification & Quality Gates',
      passed: Boolean(data.unitTestFramework?.trim() && data.e2eScenarios?.trim()),
      tip: 'Specify unit testing coverage threshold and critical E2E scenarios.'
    },
    {
      label: 'Rollback & Disaster Recovery',
      passed: Boolean(data.rollbackProcedure?.trim().length > 20 && data.disasterRecovery?.trim().length > 15),
      tip: 'Document step-by-step rollback runbook and RTO/RPO targets.'
    }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return { score, checks };
};

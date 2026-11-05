import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePRD,
  generateSDD,
  generateTestPlan,
  generateRunbook,
  generateMasterDossier,
  calculateDocumentStats,
  calculateReadinessScore
} from './markdownGenerators';
import { DEFAULT_FORM_DATA } from './templates';
import { SDLCFormData } from '../types';

test('generatePRD includes project name, version, and core features table', () => {
  const md = generatePRD(DEFAULT_FORM_DATA);
  assert.ok(md.includes('## Project: Aegis Sentinel'));
  assert.ok(md.includes('- **Version:** 1.2.0'));
  assert.ok(md.includes('| **Continuous Asset Discovery** | `P0` |'));
  assert.ok(md.includes('### 1. Problem Statement'));
  assert.ok(md.includes('### 4. Non-Functional Requirements'));
});

test('generatePRD handles empty or partial data gracefully', () => {
  const emptyData = {} as SDLCFormData;
  const md = generatePRD(emptyData);
  assert.ok(md.includes('## Project: Untitled Project'));
  assert.ok(md.includes('_No problem statement provided._'));
  assert.ok(md.includes('_No features defined_'));
});

test('generateSDD generates full architecture and stack breakdown', () => {
  const md = generateSDD(DEFAULT_FORM_DATA);
  assert.ok(md.includes('## Project: Aegis Sentinel - Architecture Specification'));
  assert.ok(md.includes('- **Architecture Pattern:** Event-Driven Microservices with CQRS'));
  assert.ok(md.includes('- **Frontend Layer:** React 19, Tailwind CSS, TanStack Query, Vite'));
  assert.ok(md.includes('-- Key domain entities and schema definitions:'));
  assert.ok(md.includes('TenantAccount, CloudIdentity'));
});

test('generateTestPlan includes unit, integration, and e2e testing', () => {
  const md = generateTestPlan(DEFAULT_FORM_DATA);
  assert.ok(md.includes('### 1. Unit Testing Strategy & Target Coverage'));
  assert.ok(md.includes('minimum 85% branch coverage'));
  assert.ok(md.includes('Testcontainers spinning up ephemeral PostgreSQL'));
});

test('generateRunbook covers deployment, rollback, and disaster recovery', () => {
  const md = generateRunbook(DEFAULT_FORM_DATA);
  assert.ok(md.includes('### 1. Deployment & Rollout Strategy'));
  assert.ok(md.includes('ArgoCD GitOps Canary deployments'));
  assert.ok(md.includes('argocd app rollback aegis-sentinel'));
  assert.ok(md.includes('RPO < 1 minute, RTO < 15 minutes'));
});

test('generateMasterDossier synthesizes all 4 phases with table of contents', () => {
  const md = generateMasterDossier(DEFAULT_FORM_DATA);
  assert.ok(md.includes('# SDLC Master Engineering Dossier: Aegis Sentinel'));
  assert.ok(md.includes('TABLE OF CONTENTS'));
  assert.ok(md.includes('1. Product Requirements Document (PRD)'));
  assert.ok(md.includes('2. System Design Document (SDD)'));
  assert.ok(md.includes('3. Quality & Test Strategy Specification'));
  assert.ok(md.includes('4. Operations Runbook & Incident Protocols'));
});

test('calculateDocumentStats returns positive counts for non-empty text', () => {
  const text = `# Title\n\nParagraph with some words.\n\n## Subtitle\n- bullet 1\n- bullet 2`;
  const stats = calculateDocumentStats(text);
  assert.ok(stats.lines > 1);
  assert.ok(stats.words > 5);
  assert.ok(stats.chars > 20);
  assert.equal(stats.sections, 2);
});

test('calculateReadinessScore evaluates default template as 100% ready', () => {
  const readiness = calculateReadinessScore(DEFAULT_FORM_DATA);
  assert.equal(readiness.score, 100);
  assert.ok(readiness.checks.every(c => c.passed));
});

test('calculateReadinessScore flags missing fields accurately', () => {
  const incompleteData: SDLCFormData = {
    ...DEFAULT_FORM_DATA,
    projectName: '',
    authSecurity: '',
    rollbackProcedure: ''
  };
  const readiness = calculateReadinessScore(incompleteData);
  assert.ok(readiness.score < 100);
  const failedChecks = readiness.checks.filter(c => !c.passed);
  assert.ok(failedChecks.length >= 2);
});

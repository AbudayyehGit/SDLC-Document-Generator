import test from 'node:test';
import assert from 'node:assert/strict';
import { DOMAIN_ARCHETYPES } from './domainArchetypes';
import { generatePRD, generateSDD, generateTestPlan, generateRunbook } from '../utils/markdownGenerators';

test('every domain archetype has complete specifications without cross-contamination', () => {
  const archetypes = Object.keys(DOMAIN_ARCHETYPES);
  assert.ok(archetypes.length >= 5);

  for (const key of archetypes) {
    const arch = DOMAIN_ARCHETYPES[key];
    const data = arch.data;

    // Check project name and audience
    assert.ok(data.projectName.length > 0, `${key} must have a project name`);
    assert.ok(data.targetAudience.length > 0, `${key} must have target audience`);
    assert.ok(data.coreFeatures.length >= 2, `${key} must have at least 2 core features`);

    // Verify markdown generation works cleanly
    const prd = generatePRD(data);
    const sdd = generateSDD(data);
    const testPlan = generateTestPlan(data);
    const runbook = generateRunbook(data);

    assert.ok(prd.includes(`## Project: ${data.projectName}`));
    assert.ok(sdd.includes(data.architecturePattern));
    assert.ok(testPlan.includes(data.unitTestFramework));
    assert.ok(runbook.includes(data.deploymentStrategy));

    // Non-security archetypes must not contain "aegis" or "aegis-core"
    if (key !== 'cloudSec') {
      const allText = `${prd} ${sdd} ${testPlan} ${runbook}`.toLowerCase();
      assert.equal(allText.includes('aegis-core'), false, `${key} must not contain aegis-core`);
      assert.equal(allText.includes('aegis sentinel'), false, `${key} must not contain aegis sentinel`);
    }

    // Runbook must not contain un-interpolated <APP_NAME>
    assert.equal(runbook.includes('<APP_NAME>'), false, `${key} runbook must interpolate app name`);
  }
});

test('ecommerce archetype contains retail specific features and models', () => {
  const ecom = DOMAIN_ARCHETYPES.ecommerce.data;
  assert.ok(ecom.coreFeatures.some(f => f.title.includes('Catalog') || f.title.includes('Cart')));
  assert.ok(ecom.dataModelEntities.includes('ShoppingCart'));
  assert.ok(ecom.dataModelEntities.includes('Product'));
  assert.ok(!ecom.dataModelEntities.includes('TelemetryEvent'));
});

test('aiPlatform archetype contains RAG and vector models', () => {
  const ai = DOMAIN_ARCHETYPES.aiPlatform.data;
  assert.ok(ai.coreFeatures.some(f => f.title.includes('RAG') || f.title.includes('Guardrail')));
  assert.ok(ai.dataModelEntities.includes('VectorEmbedding'));
  assert.ok(!ai.dataModelEntities.includes('ShoppingCart'));
});

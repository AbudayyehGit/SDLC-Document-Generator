import { ClosedEndedQuestion } from '../types';

export const CLOSED_ENDED_FLOWS: Record<'prd' | 'sdd' | 'test' | 'runbook', {
  title: string;
  subtitle: string;
  badgeText: string;
  questions: ClosedEndedQuestion[];
}> = {
  prd: {
    title: 'Product Plan Decisions',
    subtitle: 'Tap closed-ended choices below to build your Product Requirements Document (PRD).',
    badgeText: 'PRD DECISIONS',
    questions: [
      {
        id: 'prd-q1',
        kind: 'short-phrase',
        question: 'What is the project short title?',
        subtext: 'Type a short 2-3 word name or tap a preset below.',
        targetField: 'projectName',
        placeholder: 'e.g. Aegis Sentinel',
        phraseSuggestions: [
          'Aegis Sentinel',
          'ShopStream Mobile',
          'Nexus AI Platform',
          'VaultPay Core'
        ],
        glossaryTerms: ['prd']
      },
      {
        id: 'prd-q2',
        kind: 'single-choice',
        question: 'Who is the primary target audience?',
        subtext: 'Select the primary user group that relies on this system.',
        targetField: 'targetAudience',
        options: [
          {
            label: 'Enterprise DevSecOps & SRE',
            value: 'Enterprise DevSecOps, SRE, and Compliance Auditors',
            hint: 'Security engineers and infrastructure platform teams.',
            badge: 'Enterprise'
          },
          {
            label: 'Online Retail Shoppers',
            value: 'Online retail shoppers, customer support agents, and store inventory managers',
            hint: 'Consumers purchasing goods and store fulfillment staff.',
            badge: 'Consumer'
          },
          {
            label: 'AI & Data Scientists',
            value: 'Enterprise Data Scientists, ML Engineers, and Business Analysts',
            hint: 'Internal researchers querying corporate knowledge.',
            badge: 'AI / Data'
          },
          {
            label: 'Financial & Treasury Partners',
            value: 'Banking Partners, Treasury Operations, and Payment Rails',
            hint: 'High-security financial settlement rails.',
            badge: 'FinTech'
          }
        ],
        glossaryTerms: ['prd']
      },
      {
        id: 'prd-q3',
        kind: 'single-choice',
        question: 'What core friction or problem does this solve?',
        subtext: 'Select the main issue this system eliminates.',
        targetField: 'problemStatement',
        options: [
          {
            label: 'Compliance & Vulnerability Lag',
            value: 'Siloed compliance telemetry across multi-cloud environments results in an average 72-hour lag for vulnerability triage and high risk of audit failure.',
            hint: 'Slow manual triage leaves clouds exposed.',
            badge: 'Security'
          },
          {
            label: 'Checkout Cart Abandonment',
            value: 'High peak checkout friction and desynchronized stock counts cause cart abandonment and negative customer reviews.',
            hint: 'Shoppers drop off when checkout takes too long.',
            badge: 'E-Commerce'
          },
          {
            label: 'AI Hallucination & Data Leaks',
            value: 'Enterprises struggle to deploy grounded generative AI workflows safely without hallucination monitoring, data leakage risks, or rate limit throttling.',
            hint: 'Private documents exposed to generic models.',
            badge: 'AI Platform'
          },
          {
            label: 'Duplicate Charge Anomalies',
            value: 'Distributed transactions across disparate banking rails risk duplicate charges and reconciliation variances during network partitions.',
            hint: 'Double-spending risks during network drops.',
            badge: 'FinTech'
          }
        ],
        glossaryTerms: ['prd', 'idempotency']
      },
      {
        id: 'prd-q4',
        kind: 'yes-no',
        question: 'Does the system demand a 99.99% high-availability SLA?',
        subtext: '99.99% (four nines) allows less than 4.3 minutes of unplanned downtime per month.',
        targetField: 'nonFunctionalReqs',
        yesLabel: 'Yes (99.99% Mission Critical)',
        noLabel: 'No (99.9% Standard Business)',
        yesText: '99.99% availability SLA, p99 ingestion latency < 80ms, end-to-end AES-256-GCM encryption with HSM-backed key rotation.',
        noText: '99.9% monthly availability SLA, standard API response times < 300ms, TLS 1.3 encryption for all data in transit.',
        glossaryTerms: ['sla', 'nfr']
      },
      {
        id: 'prd-q5',
        kind: 'single-choice',
        question: 'What is the top business success milestone?',
        subtext: 'Pick the main number that proves this project succeeded.',
        targetField: 'businessObjectives',
        options: [
          {
            label: 'Triage Time < 15 Min & Zero Loss',
            value: '1. Reduce compliance drift remediation time to < 15 minutes.\n2. Provide 100% continuous automated audit evidence collection for SOC2.\n3. Sustain 50,000 security telemetry events/sec without event drop.',
            hint: 'Speed and automated evidence collection.',
            badge: 'P0 Goal'
          },
          {
            label: 'Sub-Second Mobile & -20% Cart Drop',
            value: '1. Sub-second page load speeds on mobile web.\n2. 99.95% uptime during holiday promotion sales.\n3. Reduce cart abandonment by 20% through 1-click checkout.',
            hint: 'Consumer conversion and peak uptime.',
            badge: 'Growth'
          },
          {
            label: 'Sub-400ms AI Search & Zero PII Leak',
            value: '1. Provide low-latency (<400ms time-to-first-token) semantic search across 10M+ internal corporate docs.\n2. Guard against PII leakage and prompt injection with 99.8% precision.\n3. Track inference token costs per department in real time.',
            hint: 'Fast AI retrieval with zero leaks.',
            badge: 'AI Safety'
          },
          {
            label: 'Zero Double-Spend & Sub-200ms Rail',
            value: '1. Guarantee zero double-spend anomalies via strict idempotency keys.\n2. Sub-200ms settlement confirmation across instant payment rails.\n3. Zero reconciliation drift across fiat and merchant escrow balances.',
            hint: 'Strict accounting invariant guarantee.',
            badge: 'FinTech'
          }
        ],
        glossaryTerms: ['sla', 'p0-p1-p2']
      }
    ]
  },

  sdd: {
    title: 'Architecture & Design Decisions',
    subtitle: 'Select architecture models and technology stack components with single taps.',
    badgeText: 'SDD SPECIFICATION',
    questions: [
      {
        id: 'sdd-q1',
        kind: 'single-choice',
        question: 'Which system organization pattern fits best?',
        subtext: 'Choose how your services and database writes are arranged.',
        targetField: 'architecturePattern',
        options: [
          {
            label: 'Event-Driven Microservices (CQRS)',
            value: 'Event-Driven Microservices with CQRS',
            hint: 'Separate read and write paths with Kafka stream events.',
            badge: 'Scalable'
          },
          {
            label: 'Modular Monolith (Domain-Driven)',
            value: 'Modular Monolith (Domain-Driven Design)',
            hint: 'Single deployable unit with clean domain module boundaries.',
            badge: 'Simple'
          },
          {
            label: 'Serverless Reactive Pipelines',
            value: 'Serverless & EventBridge Reactive Pipelines',
            hint: 'Pay-per-execution cloud functions triggered by events.',
            badge: 'Cloud'
          },
          {
            label: 'Hexagonal / Ports & Adapters',
            value: 'Hexagonal / Ports & Adapters Architecture',
            hint: 'Domain logic completely decoupled from database and web layers.',
            badge: 'Clean Code'
          }
        ],
        glossaryTerms: ['microservices', 'cqrs', 'event-driven']
      },
      {
        id: 'sdd-q2',
        kind: 'single-choice',
        question: 'What is the primary database technology?',
        subtext: 'Choose where core records and relational entities live.',
        targetField: 'techStack.database',
        options: [
          {
            label: 'PostgreSQL 16 (TimescaleDB)',
            value: 'PostgreSQL 16 (TimescaleDB partitioned) & ClickHouse (Analytics)',
            hint: 'Relational ACID with time-series partitioning.',
            badge: 'SQL'
          },
          {
            label: 'CockroachDB (Distributed SQL)',
            value: 'CockroachDB (Distributed SQL with Serialized Isolation)',
            hint: 'Multi-region distributed SQL with zero data loss.',
            badge: 'Distributed'
          },
          {
            label: 'Qdrant / Milvus (Vector Store)',
            value: 'Qdrant / Milvus (Vector Store) & PostgreSQL 16 (Metadata & RLS)',
            hint: 'High-speed embedding search for AI applications.',
            badge: 'Vectors'
          },
          {
            label: 'PostgreSQL with Read Replicas',
            value: 'PostgreSQL 16 with read replicas and automated backups',
            hint: 'Standard managed cloud database.',
            badge: 'Standard'
          }
        ],
        glossaryTerms: ['sdd']
      },
      {
        id: 'sdd-q3',
        kind: 'yes-no',
        question: 'Include an Apache Kafka distributed message queue?',
        subtext: 'Kafka guarantees high-throughput ordering across millions of events.',
        targetField: 'techStack.broker',
        yesLabel: 'Yes (Apache Kafka on Strimzi)',
        noLabel: 'No (RabbitMQ / Lightweight Bus)',
        yesText: 'Apache Kafka on Strimzi Kubernetes Operator with exact-once semantics (EOS)',
        noText: 'RabbitMQ / Redis PubSub for lightweight asynchronous messaging',
        glossaryTerms: ['kafka', 'event-driven']
      },
      {
        id: 'sdd-q4',
        kind: 'yes-no',
        question: 'Enforce strict Zero-Trust with mTLS workload identities?',
        subtext: 'Zero-Trust verifies every service identity cryptographically.',
        targetField: 'authSecurity',
        yesLabel: 'Yes (Zero-Trust mTLS & KMS)',
        noLabel: 'No (Standard OAuth2 & TLS)',
        yesText: 'Zero-Trust architecture with SPIFFE/SPIRE workload identities, mTLS mutual authentication, Casbin RBAC, and KMS envelope encryption.',
        noText: 'OAuth2 with OIDC federation, JWT Bearer token authentication, role-based access control, and TLS 1.3 encryption.',
        glossaryTerms: ['zero-trust', 'grpc']
      }
    ]
  },

  test: {
    title: 'Testing & Verification Plan',
    subtitle: 'Set automated code coverage, test container environments, and CI/CD quality gates.',
    badgeText: 'QUALITY GATES',
    questions: [
      {
        id: 'test-q1',
        kind: 'single-choice',
        question: 'What is the minimum branch test coverage requirement?',
        subtext: 'Code cannot merge into main unless tests exercise this threshold.',
        targetField: 'unitTestFramework',
        options: [
          {
            label: 'Strict Gate: >= 85% Branch Coverage',
            value: 'Standard testing suite (Go / Vitest) with hard CI quality gate requiring >= 85% branch coverage.',
            hint: 'Enforces thorough edge case testing.',
            badge: 'Strict'
          },
          {
            label: 'Recommended Gate: >= 80% Branch Coverage',
            value: 'Standard unit testing suite with minimum 80% branch coverage required for CI pass.',
            hint: 'Balanced engineering threshold.',
            badge: 'Standard'
          },
          {
            label: 'Property-Based Invariant Verification',
            value: 'Property-based testing (jqwik / hypothesis) verifying mathematical invariants over 100,000 permutations.',
            hint: 'Mathematical proof of zero anomalies.',
            badge: 'FinTech'
          }
        ],
        glossaryTerms: ['unit-testing', 'branch-coverage']
      },
      {
        id: 'test-q2',
        kind: 'yes-no',
        question: 'Run ephemeral Docker Testcontainers in CI?',
        subtext: 'Testcontainers spin up real databases and brokers during automated tests.',
        targetField: 'integrationTests',
        yesLabel: 'Yes (Real Testcontainers in CI)',
        noLabel: 'No (Fast In-Memory Mocks)',
        yesText: 'Testcontainers spinning up ephemeral PostgreSQL and Kafka instances per execution suite.',
        noText: 'In-memory database SQLite mocks and recorded network cassettes (VCR) for deterministic speed.',
        glossaryTerms: ['integration-testing', 'ci-cd']
      },
      {
        id: 'test-q3',
        kind: 'single-choice',
        question: 'Which critical End-to-End (E2E) scenario is prioritized?',
        subtext: 'Select the primary automated journey tested before every release.',
        targetField: 'e2eScenarios',
        options: [
          {
            label: 'Rogue S3 Bucket Quarantine in < 5s',
            value: '1. Simulated rogue S3 public-bucket creation triggers detection in < 3s, quarantine in < 10s.\n2. Disconnect database cluster, verify Kafka backpressure absorbs telemetry without packet loss.',
            hint: 'Instant security auto-remediation check.',
            badge: 'DevSecOps'
          },
          {
            label: 'Simultaneous 100-Thread Concurrent Race',
            value: '1. Concurrent duplicate transfer race test: 100 simultaneous threads with identical idempotency key.\n2. Banking rail outage triggering auto-retry with exponential backoff and jitter.',
            hint: 'Proves zero double-charging.',
            badge: 'Idempotent'
          },
          {
            label: 'User Signup -> Cart Checkout -> Receipt',
            value: '1. User signs up, adds product to cart, applies discount coupon, and completes payment in under 3 taps.\n2. Out-of-stock item triggers instant alert without transaction crash.',
            hint: 'Full checkout purchase funnel.',
            badge: 'E-Commerce'
          }
        ],
        glossaryTerms: ['e2e-testing', 'idempotency']
      },
      {
        id: 'test-q4',
        kind: 'yes-no',
        question: 'Enforce zero-CVE container vulnerability policy?',
        subtext: 'Blocks builds containing any known High or Critical CVE security vulnerabilities.',
        targetField: 'cicdQualityGates',
        yesLabel: 'Yes (Zero CVE Policy via Trivy)',
        noLabel: 'No (Standard Lint & Type-Check)',
        yesText: 'GitHub Actions running Trivy vulnerability scans, SonarQube static analysis, and zero CVE policy before staging promotion.',
        noText: 'Automated CI build running linter, TypeScript type-check, and 100% passing tests before merge.',
        glossaryTerms: ['ci-cd', 'zero-trust']
      }
    ]
  },

  runbook: {
    title: 'Operations & Emergency Recovery',
    subtitle: 'Decide deployment rollout steps, incident rollbacks, and recovery speed.',
    badgeText: 'RUNBOOK & DR',
    questions: [
      {
        id: 'runbook-q1',
        kind: 'single-choice',
        question: 'What is the deployment rollout strategy?',
        subtext: 'Choose how new versions are phased in safely.',
        targetField: 'deploymentStrategy',
        options: [
          {
            label: 'ArgoCD GitOps Canary (10% -> 100%)',
            value: 'ArgoCD GitOps Canary deployments (10% -> 25% -> 50% -> 100%) with automated rollbacks on metric anomalies.',
            hint: 'Gradual user traffic exposure with metric safety checks.',
            badge: 'Canary'
          },
          {
            label: 'Blue-Green Instant Environment Flip',
            value: 'Blue-Green deployments with 15-minute smoke testing before routing 100% live user traffic.',
            hint: 'Zero-downtime swap between parallel clusters.',
            badge: 'Blue-Green'
          },
          {
            label: 'Rolling Zero-Downtime Container Deploy',
            value: 'Rolling zero-downtime container deploy with automated health check probes requiring 3 consecutive passes.',
            hint: 'Replaces containers one-by-one.',
            badge: 'Rolling'
          }
        ],
        glossaryTerms: ['canary-deployment', 'runbook']
      },
      {
        id: 'runbook-q2',
        kind: 'single-choice',
        question: 'What is the Disaster Recovery (RTO / RPO) target?',
        subtext: 'How quickly must service resume and how much data loss is tolerated?',
        targetField: 'disasterRecovery',
        options: [
          {
            label: 'RPO < 1 min, RTO < 15 min (Multi-Region)',
            value: 'RPO < 1 minute, RTO < 15 minutes. Multi-region automated failover executed via `scripts/dr-orchestrator.sh` with Route53 DNS health checks.',
            hint: 'Near-instant recovery with DNS failover.',
            badge: 'Mission Critical'
          },
          {
            label: 'RPO = 0, RTO < 5s (Active-Active Multi-Region)',
            value: 'RPO = 0 (zero transactional data loss), RTO < 5 seconds via active-active multi-region CockroachDB across 3 cloud regions.',
            hint: 'Zero transactional data loss ever.',
            badge: 'FinTech'
          },
          {
            label: 'RPO < 6 hours, RTO < 30 min (Nightly Backup)',
            value: 'Nightly automated database backups with RPO < 6 hours and RTO < 30 minutes with cloud storage replication.',
            hint: 'Standard business recovery budget.',
            badge: 'Standard'
          }
        ],
        glossaryTerms: ['rpo', 'rto', 'runbook']
      },
      {
        id: 'runbook-q3',
        kind: 'yes-no',
        question: 'Automate rollback when error rate exceeds 0.5%?',
        subtext: 'Automated monitoring aborts canary sync and reverts to previous revision.',
        targetField: 'rollbackProcedure',
        yesLabel: 'Yes (Automated Metric Anomaly Rollback)',
        noLabel: 'No (Manual Engineer Execution)',
        yesText: '1. Abort ArgoCD sync rollout.\n2. Run `argocd app rollback <APP_NAME> --to-revision <PREV_STABLE_TAG>`.\n3. Run db-migration verify script to ensure backward compatibility.\n4. Post incident notice to Slack #incidents-prod channel.',
        noText: '1. Re-tag previous container release image in registry.\n2. Traffic shifts back to previous healthy revision in < 60s.\n3. Verify health checks pass.',
        glossaryTerms: ['rollback', 'runbook']
      },
      {
        id: 'runbook-q4',
        kind: 'yes-no',
        question: 'Page on-call staff via PagerDuty for P1 alerts within 2 minutes?',
        subtext: 'Wakes up primary on-call SRE immediately during severe outages.',
        targetField: 'incidentEscalation',
        yesLabel: 'Yes (Immediate 2-Min PagerDuty Page)',
        noLabel: 'No (Slack Channel Notification)',
        yesText: 'Severity 1 (Data loss or active breach): PagerDuty page to Primary On-Call SRE + VP Engineering within 2 minutes. Incident war room opened immediately.',
        noText: 'Severity 1 triggers notification in Slack #incidents channel with email dispatch to on-duty team.',
        glossaryTerms: ['observability', 'p0-p1-p2']
      }
    ]
  }
};

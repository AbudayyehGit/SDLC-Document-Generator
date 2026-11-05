import { ClosedEndedQuestion } from '../types';

export const CLOSED_ENDED_FLOWS: Record<'prd' | 'sdd' | 'test' | 'runbook', {
  title: string;
  subtitle: string;
  badgeText: string;
  questions: ClosedEndedQuestion[];
}> = {
  prd: {
    title: 'Product Plan Decisions',
    subtitle: 'Answer simple everyday questions to build your Product Requirements Document (PRD).',
    badgeText: 'PRODUCT REQUIREMENTS (PRD)',
    questions: [
      {
        id: 'prd-q1',
        kind: 'short-phrase',
        question: 'What is the name of your project?',
        subtext: 'Type a short 2-3 word project name or tap one of our starter presets below.',
        targetField: 'projectName',
        placeholder: 'e.g. ShopStream Express, Aegis Sentinel',
        phraseSuggestions: [
          'Aegis Sentinel',
          'ShopStream Express',
          'Nexus AI Platform',
          'VaultPay Core'
        ],
        glossaryTerms: ['prd']
      },
      {
        id: 'prd-q2',
        kind: 'single-choice',
        question: 'Who will use this software most?',
        subtext: 'Choose the main audience who will rely on your app day to day.',
        targetField: 'targetAudience',
        options: [
          {
            label: 'Everyday Shoppers & Retail Customers',
            value: 'Online retail shoppers, customer support agents, and store inventory managers',
            hint: 'People buying goods, browsing products, or checking order deliveries.',
            badge: 'Consumer'
          },
          {
            label: 'IT, Security & Operations Engineers',
            value: 'Enterprise DevSecOps, SRE, and Compliance Auditors',
            hint: 'Engineers managing servers, cloud security, and system health.',
            badge: 'Enterprise IT'
          },
          {
            label: 'Business Analysts & Researchers',
            value: 'Enterprise Data Scientists, ML Engineers, and Business Analysts',
            hint: 'People searching company data, generating reports, or using AI tools.',
            badge: 'Analytics & AI'
          },
          {
            label: 'Finance, Banking & Treasury Staff',
            value: 'Banking Partners, Treasury Operations, and Payment Rails',
            hint: 'Teams processing money transfers, payroll, invoices, and accounting.',
            badge: 'Finance'
          }
        ],
        glossaryTerms: ['prd']
      },
      {
        id: 'prd-q3',
        kind: 'single-choice',
        question: 'What is the biggest problem this software solves?',
        subtext: 'Pick the main headache or friction that this new system will eliminate.',
        targetField: 'problemStatement',
        options: [
          {
            label: 'Checkout Cart Drop-offs & Slow Payments',
            value: 'High peak checkout friction and desynchronized stock counts cause cart abandonment and negative customer reviews.',
            hint: 'Shoppers give up and leave when pages load slowly or items are out of stock.',
            badge: 'E-Commerce'
          },
          {
            label: 'Slow Security Audits & Vulnerability Gaps',
            value: 'Siloed compliance telemetry across multi-cloud environments results in an average 72-hour lag for vulnerability triage and high risk of audit failure.',
            hint: 'Teams waste days manually gathering evidence for security and compliance audits.',
            badge: 'Security'
          },
          {
            label: 'Private Company Data Leaking to Public AI',
            value: 'Enterprises struggle to deploy grounded generative AI workflows safely without hallucination monitoring, data leakage risks, or rate limit throttling.',
            hint: 'Employees need smart AI search without risking confidential company data.',
            badge: 'AI Safety'
          },
          {
            label: 'Duplicate Charges & Payment Network Drops',
            value: 'Distributed transactions across disparate banking rails risk duplicate charges and reconciliation variances during network partitions.',
            hint: 'Customers accidentally get charged twice when the internet disconnects during payment.',
            badge: 'Payments'
          }
        ],
        glossaryTerms: ['prd', 'idempotency']
      },
      {
        id: 'prd-q4',
        kind: 'yes-no',
        question: 'Does this system require 24/7 mission-critical uptime?',
        subtext: '99.99% uptime allows less than 4.3 minutes of unplanned downtime per month. 99.9% is standard for most apps.',
        targetField: 'nonFunctionalReqs',
        yesLabel: 'Yes (Mission Critical 24/7 Uptime)',
        noLabel: 'No (Standard Business Hours Uptime)',
        yesText: '99.99% availability SLA, p99 ingestion latency < 80ms, end-to-end AES-256-GCM encryption with HSM-backed key rotation.',
        noText: '99.9% monthly availability SLA, standard API response times < 300ms, TLS 1.3 encryption for all data in transit.',
        glossaryTerms: ['sla', 'nfr']
      },
      {
        id: 'prd-q5',
        kind: 'single-choice',
        question: 'What key milestone proves this project succeeded?',
        subtext: 'Pick the number or achievement your leadership team will look at to measure success.',
        targetField: 'businessObjectives',
        options: [
          {
            label: 'Lightning Fast Pages & 20% Fewer Drop-offs',
            value: '1. Sub-second page load speeds on mobile web.\n2. 99.95% uptime during holiday promotion sales.\n3. Reduce cart abandonment by 20% through 1-click checkout.',
            hint: 'Focuses on customer conversion, faster mobile speeds, and smooth checkout.',
            badge: 'Growth'
          },
          {
            label: 'Under-15-Minute Security Fixes & SOC2 Pass',
            value: '1. Reduce compliance drift remediation time to < 15 minutes.\n2. Provide 100% continuous automated audit evidence collection for SOC2.\n3. Sustain 50,000 security telemetry events/sec without event drop.',
            hint: 'Focuses on fast automated threat fixes and passing security audits.',
            badge: 'Security'
          },
          {
            label: 'Instant AI Document Search with Zero Data Leaks',
            value: '1. Provide low-latency (<400ms time-to-first-token) semantic search across 10M+ internal corporate docs.\n2. Guard against PII leakage and prompt injection with 99.8% precision.\n3. Track inference token costs per department in real time.',
            hint: 'Focuses on accurate answers, strict data privacy, and controlled AI costs.',
            badge: 'AI Safety'
          },
          {
            label: 'Zero Double Charges & Under-1-Second Settlement',
            value: '1. Guarantee zero double-spend anomalies via strict idempotency keys.\n2. Sub-200ms settlement confirmation across instant payment rails.\n3. Zero reconciliation drift across fiat and merchant escrow balances.',
            hint: 'Guarantees reliable accounting and instant receipts for every penny.',
            badge: 'Payments'
          }
        ],
        glossaryTerms: ['sla', 'p0-p1-p2']
      }
    ]
  },

  sdd: {
    title: 'Architecture & System Design',
    subtitle: 'Decide how the software works internally using simple, practical choices.',
    badgeText: 'SYSTEM DESIGN (SDD)',
    questions: [
      {
        id: 'sdd-q1',
        kind: 'single-choice',
        question: 'How should your system\'s software programs be organized?',
        subtext: 'Choose how your codebase is structured so teams can build and scale smoothly.',
        targetField: 'architecturePattern',
        options: [
          {
            label: 'Single All-in-One Application (Modular Monolith)',
            value: 'Modular Monolith (Domain-Driven Design)',
            hint: 'Fastest to build, easiest to maintain, and recommended for small to mid-sized teams.',
            badge: 'Recommended'
          },
          {
            label: 'Independent Microservices (Event-Driven)',
            value: 'Event-Driven Microservices with CQRS',
            hint: 'Multiple separate services communicating via events; best for large engineering teams.',
            badge: 'High Scale'
          },
          {
            label: 'On-Demand Cloud Functions (Serverless)',
            value: 'Serverless & EventBridge Reactive Pipelines',
            hint: 'Code only runs and charges you when an event or web request arrives.',
            badge: 'Cloud'
          },
          {
            label: 'Isolated Business Logic Core (Hexagonal / Clean)',
            value: 'Hexagonal / Ports & Adapters Architecture',
            hint: 'Completely separates business rules from database tools and web frameworks.',
            badge: 'Clean Code'
          }
        ],
        glossaryTerms: ['microservices', 'cqrs', 'event-driven']
      },
      {
        id: 'sdd-q2',
        kind: 'single-choice',
        question: 'Where should your system store and look up data?',
        subtext: 'Choose the storage engine that best fits what your app remembers.',
        targetField: 'techStack.database',
        options: [
          {
            label: 'Standard Relational Database (PostgreSQL)',
            value: 'PostgreSQL 16 with read replicas and automated backups',
            hint: 'Organizes data into clean tables with columns; reliable and battle-tested for almost everything.',
            badge: 'Most Popular'
          },
          {
            label: 'High-Speed Logs & Analytics (PostgreSQL + TimescaleDB)',
            value: 'PostgreSQL 16 (TimescaleDB partitioned) & ClickHouse (Analytics)',
            hint: 'Specialized for high-speed timestamps, server metrics, security logs, and dashboards.',
            badge: 'Logs & Metrics'
          },
          {
            label: 'AI Semantic Search + Relational (Qdrant + PostgreSQL)',
            value: 'Qdrant / Milvus (Vector Store) & PostgreSQL 16 (Metadata & RLS)',
            hint: 'Understands the meaning of sentences and documents for smart AI search.',
            badge: 'AI & Vectors'
          },
          {
            label: 'Global Multi-Region Database (CockroachDB)',
            value: 'CockroachDB (Distributed SQL with Serialized Isolation)',
            hint: 'Automatically replicates data across worldwide data centers with zero data loss.',
            badge: 'Global'
          }
        ],
        glossaryTerms: ['sdd']
      },
      {
        id: 'sdd-q3',
        kind: 'yes-no',
        question: 'Does your system need a heavy-duty real-time message stream?',
        subtext: 'High-speed event queues pass messages between background services so the user never has to wait.',
        targetField: 'techStack.broker',
        yesLabel: 'Yes (High-Volume Stream Pipeline - Apache Kafka)',
        noLabel: 'No (Standard Message Queue - RabbitMQ / Redis)',
        yesText: 'Apache Kafka on Strimzi Kubernetes Operator with exact-once semantics (EOS)',
        noText: 'RabbitMQ / Redis PubSub for lightweight asynchronous messaging',
        glossaryTerms: ['kafka', 'event-driven']
      },
      {
        id: 'sdd-q4',
        kind: 'yes-no',
        question: 'What level of login and system security is required?',
        subtext: 'Zero-Trust verifies every single service and request with cryptographic keys.',
        targetField: 'authSecurity',
        yesLabel: 'Maximum Security (Zero-Trust & Cryptographic Keys)',
        noLabel: 'Standard Security (Modern Login, Social SSO & TLS)',
        yesText: 'Zero-Trust architecture with SPIFFE/SPIRE workload identities, mTLS mutual authentication, Casbin RBAC, and KMS envelope encryption.',
        noText: 'OAuth2 with OIDC federation, JWT Bearer token authentication, role-based access control, and TLS 1.3 encryption.',
        glossaryTerms: ['zero-trust', 'grpc']
      }
    ]
  },

  test: {
    title: 'Testing & Quality Verification',
    subtitle: 'Set up automated safety nets so computers test your app before users ever see bugs.',
    badgeText: 'QUALITY & TESTS',
    questions: [
      {
        id: 'test-q1',
        kind: 'single-choice',
        question: 'How thoroughly should automated tests inspect your code?',
        subtext: 'Automated test suites catch regressions and typos before code is merged.',
        targetField: 'unitTestFramework',
        options: [
          {
            label: 'Industry Standard (80% Automated Coverage)',
            value: 'Standard unit testing suite with minimum 80% branch coverage required for CI pass.',
            hint: 'The recommended sweet spot balancing rapid development with high safety.',
            badge: 'Recommended'
          },
          {
            label: 'Strict Enterprise Quality Gate (85%+ Coverage)',
            value: 'Standard testing suite (Go / Vitest) with hard CI quality gate requiring >= 85% branch coverage.',
            hint: 'Requires tests for nearly every decision branch and unusual edge case.',
            badge: 'High Rigor'
          },
          {
            label: 'Mathematical Proof Testing (100,000+ Permutations)',
            value: 'Property-based testing (jqwik / hypothesis) verifying mathematical invariants over 100,000 permutations.',
            hint: 'Runs thousands of simulated random inputs to mathematically prove zero money calculation errors.',
            badge: 'FinTech'
          }
        ],
        glossaryTerms: ['unit-testing', 'branch-coverage']
      },
      {
        id: 'test-q2',
        kind: 'yes-no',
        question: 'Should automated tests run against real temporary databases?',
        subtext: 'Testing with real temporary databases catches real bugs, but takes a few seconds longer than quick in-memory fakes.',
        targetField: 'integrationTests',
        yesLabel: 'Yes (Test with Real Temporary Databases)',
        noLabel: 'No (Use Fast In-Memory Simulations)',
        yesText: 'Testcontainers spinning up ephemeral PostgreSQL and Kafka instances per execution suite.',
        noText: 'In-memory database SQLite mocks and recorded network cassettes (VCR) for deterministic speed.',
        glossaryTerms: ['integration-testing', 'ci-cd']
      },
      {
        id: 'test-q3',
        kind: 'single-choice',
        question: 'Which full user journey is most vital to test automatically?',
        subtext: 'A simulated robot runs this exact journey before every single release.',
        targetField: 'e2eScenarios',
        options: [
          {
            label: 'User Signup -> Add to Cart -> Instant Checkout',
            value: '1. User signs up, adds product to cart, applies discount coupon, and completes payment in under 3 taps.\n2. Out-of-stock item triggers instant alert without transaction crash.',
            hint: 'Ensures the revenue checkout flow always works seamlessly for shoppers.',
            badge: 'E-Commerce'
          },
          {
            label: 'Security Defense: Detect & Quarantine Threat in < 5s',
            value: '1. Simulated rogue S3 public-bucket creation triggers detection in < 3s, quarantine in < 10s.\n2. Disconnect database cluster, verify Kafka backpressure absorbs telemetry without packet loss.',
            hint: 'Ensures security alerts instantly lock down unauthorized access.',
            badge: 'Security'
          },
          {
            label: 'Financial Integrity: 100 Simultaneous Click Races',
            value: '1. Concurrent duplicate transfer race test: 100 simultaneous threads with identical idempotency key.\n2. Banking rail outage triggering auto-retry with exponential backoff and jitter.',
            hint: 'Ensures clicking the submit button multiple times never double-charges.',
            badge: 'Payments'
          }
        ],
        glossaryTerms: ['e2e-testing', 'idempotency']
      },
      {
        id: 'test-q4',
        kind: 'yes-no',
        question: 'Should software updates be blocked if any security flaw is found?',
        subtext: 'Scans all third-party code packages and container images for known vulnerabilities before deployment.',
        targetField: 'cicdQualityGates',
        yesLabel: 'Yes (Block Any Known Security Flaw)',
        noLabel: 'No (Standard Warning & Clean Code Check)',
        yesText: 'GitHub Actions running Trivy vulnerability scans, SonarQube static analysis, and zero CVE policy before staging promotion.',
        noText: 'Automated CI build running linter, TypeScript type-check, and 100% passing tests before merge.',
        glossaryTerms: ['ci-cd', 'zero-trust']
      }
    ]
  },

  runbook: {
    title: 'Operations & Emergency Recovery',
    subtitle: 'Decide how you update the app safely and what to do if an outage occurs.',
    badgeText: 'RUNBOOK & SAFETY',
    questions: [
      {
        id: 'runbook-q1',
        kind: 'single-choice',
        question: 'How should new software updates roll out to your users?',
        subtext: 'Choose how your team releases updates without causing downtime.',
        targetField: 'deploymentStrategy',
        options: [
          {
            label: 'Gradual Safety Rollout (10% -> 25% -> 50% -> 100%)',
            value: 'ArgoCD GitOps Canary deployments (10% -> 25% -> 50% -> 100%) with automated rollbacks on metric anomalies.',
            hint: 'Shows the update to a small slice of users first; stops immediately if any errors appear.',
            badge: 'Safest'
          },
          {
            label: 'Instant Backup Swap (Blue-Green Deployment)',
            value: 'Blue-Green deployments with 15-minute smoke testing before routing 100% live user traffic.',
            hint: 'Prepares the new version on an identical backup server and swaps users over in one second.',
            badge: 'Instant Swap'
          },
          {
            label: 'Rolling Server-by-Server Update',
            value: 'Rolling zero-downtime container deploy with automated health check probes requiring 3 consecutive passes.',
            hint: 'Replaces old servers with new servers one by one with zero downtime.',
            badge: 'Standard'
          }
        ],
        glossaryTerms: ['canary-deployment', 'runbook']
      },
      {
        id: 'runbook-q2',
        kind: 'single-choice',
        question: 'How quickly must the system recover if a data center crashes?',
        subtext: 'Defines how fast service restarts and how much recent data could be lost in a catastrophe.',
        targetField: 'disasterRecovery',
        options: [
          {
            label: 'Fast Auto-Recovery (Back in < 15 min, Lose < 1 min)',
            value: 'RPO < 1 minute, RTO < 15 minutes. Multi-region automated failover executed via `scripts/dr-orchestrator.sh` with Route53 DNS health checks.',
            hint: 'Switches traffic automatically to another cloud region in under 15 minutes.',
            badge: 'High Uptime'
          },
          {
            label: 'Instant Multi-Region Sync (Back in < 5s, Zero Data Loss)',
            value: 'RPO = 0 (zero transactional data loss), RTO < 5 seconds via active-active multi-region CockroachDB across 3 cloud regions.',
            hint: 'Copies every transaction across 3 regions before confirming; zero data lost ever.',
            badge: 'Financial Grade'
          },
          {
            label: 'Nightly Backup Recovery (Back in < 30 min, Lose up to hours)',
            value: 'Nightly automated database backups with RPO < 6 hours and RTO < 30 minutes with cloud storage replication.',
            hint: 'Restores from safe nightly automated backups; budget-friendly for standard web apps.',
            badge: 'Budget Friendly'
          }
        ],
        glossaryTerms: ['rpo', 'rto', 'runbook']
      },
      {
        id: 'runbook-q3',
        kind: 'yes-no',
        question: 'Should the system automatically revert if an update causes errors?',
        subtext: 'If error rates jump after an update, the system cancels the rollout and restores the previous working version.',
        targetField: 'rollbackProcedure',
        yesLabel: 'Yes (Automatic Revert on Error Spike)',
        noLabel: 'No (Wait for Engineer to Review Manually)',
        yesText: '1. Abort ArgoCD sync rollout.\n2. Run `argocd app rollback <APP_NAME> --to-revision <PREV_STABLE_TAG>`.\n3. Run db-migration verify script to ensure backward compatibility.\n4. Post incident notice to Slack #incidents-prod channel.',
        noText: '1. Re-tag previous container release image in registry.\n2. Traffic shifts back to previous healthy revision in < 60s.\n3. Verify health checks pass.',
        glossaryTerms: ['rollback', 'runbook']
      },
      {
        id: 'runbook-q4',
        kind: 'yes-no',
        question: 'Should critical outages trigger emergency phone alerts to engineers?',
        subtext: 'Sounds an urgent siren on on-call engineers\' phones within 2 minutes during major outages.',
        targetField: 'incidentEscalation',
        yesLabel: 'Yes (Urgent Phone Siren Within 2 Minutes)',
        noLabel: 'No (Team Chat Message & Email Notification)',
        yesText: 'Severity 1 (Data loss or active breach): PagerDuty page to Primary On-Call SRE + VP Engineering within 2 minutes. Incident war room opened immediately.',
        noText: 'Severity 1 triggers notification in Slack #incidents channel with email dispatch to on-duty team.',
        glossaryTerms: ['observability', 'p0-p1-p2']
      }
    ]
  }
};

import { SDLCFormData } from '../types';

export interface DomainArchetype {
  id: string;
  name: string;
  shortLabel: string;
  badge: string;
  iconName: string;
  description: string;
  data: SDLCFormData;
}

export const DOMAIN_ARCHETYPES: Record<string, DomainArchetype> = {
  ecommerce: {
    id: 'ecommerce',
    name: 'Retail & E-Commerce Web Store',
    shortLabel: 'E-Commerce',
    badge: 'Retail',
    iconName: 'ShoppingCart',
    description: 'Online store with catalog search, real-time cart, Stripe checkout, inventory sync, and order tracking.',
    data: {
      projectName: 'MarketPulse Retail',
      version: '1.0.0',
      author: 'Digital Experience Engineering Guild',
      date: new Date().toISOString().split('T')[0],
      targetAudience: 'Online retail shoppers, mobile consumers, customer care agents, and store inventory managers',
      problemStatement: 'High peak checkout friction and desynchronized stock counts cause cart abandonment, overselling, and negative customer reviews.',
      businessObjectives: '1. Sub-second page load speeds on mobile web.\n2. 99.95% uptime during peak holiday promotion sales.\n3. Reduce cart abandonment by 20% through streamlined 1-click checkout.',
      coreFeatures: [
        {
          id: 'feat-eco-1',
          title: 'Instant Catalog Search',
          priority: 'P0',
          desc: 'Full-text fuzzy search with faceted category filters, price sorting, and live in-stock inventory badges.',
          acceptance: 'Returns top 20 relevant products in under 80ms.'
        },
        {
          id: 'feat-eco-2',
          title: 'Real-Time Cart & Checkout',
          priority: 'P0',
          desc: 'Session-synced shopping cart with guest checkout, Apple Pay / Google Pay support, and Stripe payments.',
          acceptance: 'Checkout completes in under 3 user taps.'
        },
        {
          id: 'feat-eco-3',
          title: 'Automated Stock Alerting',
          priority: 'P1',
          desc: 'Automated notification dispatch via SMS/Email when out-of-stock items are replenished in warehouse.',
          acceptance: 'Alerts sent within 60s of warehouse restock event.'
        },
        {
          id: 'feat-eco-4',
          title: 'Self-Service Order Tracking & Returns',
          priority: 'P1',
          desc: 'Customer portal for live carrier tracking, shipment status updates, and 1-click return label generation.',
          acceptance: 'Generates return QR code in < 2 seconds.'
        }
      ],
      nonFunctionalReqs: 'Page response times < 300ms, PCI-DSS Level 2 compliant, 99.95% monthly availability SLA, TLS 1.3 encryption for all data in transit.',
      architecturePattern: 'Modular Monolith (Domain-Driven Design)',
      techStack: {
        frontend: 'React 19, Tailwind CSS, TanStack Query, Vite',
        backend: 'Node.js / Express TypeScript modular services',
        database: 'PostgreSQL 16 with read replicas',
        cache: 'Redis 7 for session cache and live product inventory counts',
        broker: 'RabbitMQ for order confirmation emails and receipts',
        infra: 'Google Cloud Run with auto-scaling containers'
      },
      dataModelEntities: 'User, Product, Category, ShoppingCart, CartItem, Order, OrderItem, PaymentIntent, StockInventory',
      apiDesign: 'Clean RESTful JSON API with JWT Bearer tokens and rate-limiting at 120 req/min for public search.',
      authSecurity: 'Session cookies with SameSite=Lax, bcrypt password hashing, CSRF tokens, and OAuth Google Sign-In.',
      dataFlowNotes: 'User searches product -> Redis cache check -> DB fallback -> Add to cart -> Checkout -> Stripe payment intent -> Order confirmed -> Receipt event published to RabbitMQ.',
      unitTestFramework: 'Vitest with minimum 85% branch coverage on cart calculation, tax rules, and coupon discount logic.',
      integrationTests: 'Supertest with in-memory SQLite / PostgreSQL container for endpoint contracts.',
      e2eScenarios: '1. User adds item to cart, applies discount coupon, and completes payment in under 3 taps.\n2. Out-of-stock item triggers instant alert without transaction crash.',
      cicdQualityGates: 'GitHub Actions running ESLint, TypeScript typecheck, unit tests, and Lighthouse performance checks before merge.',
      performanceTesting: 'k6 load test simulating 2,000 simultaneous shoppers browsing catalog without error spikes.',
      deploymentStrategy: 'Rolling zero-downtime container deploy with automatic health check probes requiring 3 consecutive passes.',
      monitoringAlerting: 'Grafana Cloud monitoring 5xx error rate and response times. Slack alert triggered if error rate exceeds 1%.',
      rollbackProcedure: '1. Re-tag previous container release image in registry.\n2. Traffic shifts back to previous healthy revision in < 60s.\n3. Verify payment endpoint health check.',
      disasterRecovery: 'Nightly automated database backups with RPO < 6 hours and RTO < 30 minutes with cloud storage replication.',
      incidentEscalation: 'Checkout failure triggers SMS page to lead developer within 5 minutes.'
    }
  },

  aiPlatform: {
    id: 'aiPlatform',
    name: 'Enterprise AI & LLM Platform',
    shortLabel: 'AI Platform',
    badge: 'AI / LLM',
    iconName: 'Sparkles',
    description: 'LLM orchestration pipeline with hybrid RAG, vector embeddings, streaming WebSockets, and guardrail proxy.',
    data: {
      projectName: 'Nexus Cognition',
      version: '2.0.0-rc',
      author: 'Applied AI & Core Infrastructure Team',
      date: new Date().toISOString().split('T')[0],
      targetAudience: 'Enterprise Data Scientists, ML Engineers, and Business Analysts',
      problemStatement: 'Enterprises struggle to deploy grounded generative AI workflows safely without hallucination monitoring, data leakage risks, or rate limit throttling.',
      businessObjectives: '1. Provide low-latency (<400ms time-to-first-token) semantic search across 10M+ internal corporate docs.\n2. Guard against PII leakage and prompt injection with 99.8% precision.\n3. Track inference token costs per department in real time.',
      coreFeatures: [
        {
          id: 'feat-ai-1',
          title: 'Hybrid Semantic Retrieval (RAG)',
          priority: 'P0',
          desc: 'Dense + sparse embedding index with cross-encoder re-ranking for enterprise knowledge search.',
          acceptance: 'MRR@10 > 0.82 on enterprise benchmark corpus.'
        },
        {
          id: 'feat-ai-2',
          title: 'LLM Guardrail Proxy',
          priority: 'P0',
          desc: 'Real-time bidirectional scanning for prompt injection, jailbreaks, and PII anonymization.',
          acceptance: 'Blocks known jailbreak vectors with < 15ms latency overhead.'
        },
        {
          id: 'feat-ai-3',
          title: 'Continuous Model Evaluation Engine',
          priority: 'P1',
          desc: 'Automated evaluation suite running golden datasets against newly tuned model checkpoints.',
          acceptance: 'Generates toxicity, faithfulness, and latency reports per commit.'
        }
      ],
      nonFunctionalReqs: 'Time-to-first-token < 450ms, streaming WebSocket uptime 99.95%, strict zero-data-retention compliance with SOC2 Type 2.',
      architecturePattern: 'Modular Microservices with Streaming Async Pipelines',
      techStack: {
        frontend: 'Next.js / React 19, Tailwind CSS, Lucide, SSE Client',
        backend: 'FastAPI (Python 3.12) & Rust (Tokenization/Embedding server)',
        database: 'Qdrant / Milvus (Vector Store) & PostgreSQL 16 (Metadata & RLS)',
        cache: 'Redis 7 (Semantic query caching & session memory)',
        broker: 'RabbitMQ / Kafka for async batch embedding indexing',
        infra: 'Google Cloud GKE with NVIDIA L4 GPU node pools, Ray Serve'
      },
      dataModelEntities: 'Workspace, DocumentChunk, VectorEmbedding, ChatSession, PromptTemplate, EvaluationRun, TokenUsageQuota',
      apiDesign: 'Client: Server-Sent Events (SSE) and WebSockets for token streaming.\nAdmin/Control Plane: RESTful OpenAPI 3.1 with fine-grained API Key authentication.',
      authSecurity: 'Keycloak SSO, OAuth2 / OIDC, RBAC for document access control list (ACL) mirroring at query time.',
      dataFlowNotes: 'User prompt -> Guardrail check -> Query embedding -> Vector similarity lookup + Rerank -> LLM prompt assembly -> Streaming response with citation references.',
      unitTestFramework: 'pytest with pytest-asyncio, minimum 80% coverage on retrieval scoring and sanitization.',
      integrationTests: 'Mock LLM providers with recorded cassettes (VCR.py) and local Milvus vector container.',
      e2eScenarios: '1. Query with PII triggers auto-masking before hitting model API.\n2. Vector store disconnect gracefully degrades to keyword BM25 search.',
      cicdQualityGates: 'Static type checking via mypy, Ruff linter, and prompt regression suite before deployment.',
      performanceTesting: 'Locust load test verifying 500 concurrent streaming tokens/sec connections without buffer stalling.',
      deploymentStrategy: 'Blue-Green deployments with Ray Serve model shadow routing for testing canary checkpoints.',
      monitoringAlerting: 'Grafana dashboards for TTFT (Time to First Token), Token/sec throughput, and hallucination score degradation.',
      rollbackProcedure: '1. Flip Envoy ingress traffic split back to blue cluster.\n2. Revert model alias pointer in registry.\n3. Clear warm semantic cache in Redis.',
      disasterRecovery: 'Cross-region vector replication with cold snapshot backups every 6 hours to Google Cloud Storage.',
      incidentEscalation: 'Model inference degradation (>2s latency) triggers on-call ML Platform engineer page.'
    }
  },

  fintech: {
    id: 'fintech',
    name: 'FinTech Settlement & Ledger',
    shortLabel: 'FinTech',
    badge: 'FinTech',
    iconName: 'CreditCard',
    description: 'Double-entry distributed ledger, idempotent payment processing, instant banking rails, and PCI-DSS compliance.',
    data: {
      projectName: 'VaultPay Core',
      version: '3.1.0',
      author: 'FinTech Infrastructure Architecture',
      date: new Date().toISOString().split('T')[0],
      targetAudience: 'Banking Partners, Treasury Operations, and Payment Rails',
      problemStatement: 'Distributed transactions across disparate banking rails risk duplicate charges and reconciliation variances during network partitions.',
      businessObjectives: '1. Guarantee zero double-spend anomalies via strict idempotency keys.\n2. Sub-200ms settlement confirmation across instant payment rails.\n3. Zero reconciliation drift across fiat and merchant escrow balances.',
      coreFeatures: [
        {
          id: 'feat-fin-1',
          title: 'Immutable Double-Entry Ledger',
          priority: 'P0',
          desc: 'Strict multi-currency balance ledger where every transfer consists of balanced debits and credits.',
          acceptance: 'Balance invariant: Sum(Debits) == Sum(Credits) across all accounts at any point in time.'
        },
        {
          id: 'feat-fin-2',
          title: 'Idempotent Payment Gateway',
          priority: 'P0',
          desc: 'Distributed lock and idempotency key deduplication filter preventing duplicate transactions.',
          acceptance: 'Replaying identical request returns identical transaction ID without secondary balance mutation.'
        },
        {
          id: 'feat-fin-3',
          title: 'Real-time Treasury Reconciliation',
          priority: 'P1',
          desc: 'Continuous stream comparing bank settlement statements against internal ledger state.',
          acceptance: 'Discrepancies flagged and alerted within 60 seconds.'
        }
      ],
      nonFunctionalReqs: '99.999% availability (five nines), RPO = 0 (zero transactional data loss), PCI-DSS Level 1 certification.',
      architecturePattern: 'Hexagonal Domain-Driven Architecture with Event Sourcing',
      techStack: {
        frontend: 'React 19, TypeScript, Tailwind CSS (Merchant Portal)',
        backend: 'Java 21 / Spring Boot 3 & Rust financial math engine',
        database: 'CockroachDB (Distributed SQL with Serialized Isolation)',
        cache: 'Redis 7 with strict persistence (AOF fsync=always)',
        broker: 'Kafka with exact-once semantics (EOS)',
        infra: 'AWS Outposts + Dedicated DirectConnect banking circuits'
      },
      dataModelEntities: 'Account, BalanceSnapshot, Transaction, JournalEntry, IdempotencyRecord, ClearingBatch, AuditTrail',
      apiDesign: 'Strict JSON-RPC 2.0 and REST with cryptographic request signing (ECDSA secp256r1) and mutual TLS (mTLS).',
      authSecurity: 'Hardware Security Module (HSM) for signing, mTLS mutual authentication, and zero-knowledge employee access controls.',
      dataFlowNotes: 'Incoming transfer -> Idempotency check -> Distributed transactional lock -> Double entry journal insert -> Async Kafka event publish -> Bank rail dispatch.',
      unitTestFramework: 'JUnit 5 with jqwik property-based testing to verify accounting invariants over 100,000 randomized permutations.',
      integrationTests: 'Testcontainers CockroachDB cluster verifying isolation levels under simulated split-brain.',
      e2eScenarios: '1. Concurrent duplicate transfer race test (100 simultaneous threads with identical idempotency key).\n2. Bank rail outage triggering auto-retry with exponential backoff and jitter.',
      cicdQualityGates: 'OWASP dependency check, SonarQube zero debt rating, signed git commits required for staging promotion.',
      performanceTesting: '10,000 TPS sustained ledger insertion with p99 latency < 45ms under ACID serialized isolation.',
      deploymentStrategy: 'Canary rolling deploy with active-passive DB validation and transaction pause capability (<2s buffer).',
      monitoringAlerting: 'Datadog APM with anomaly detection on transaction failure rates. Immediate alert if ledger imbalance > 0.00.',
      rollbackProcedure: '1. Execute database migration rollback script.\n2. Flush transient routing caches.\n3. Verify uncommitted transactions in pending queue.',
      disasterRecovery: 'Active-Active multi-region CockroachDB across 3 cloud regions with zero RPO and RTO < 5s.',
      incidentEscalation: 'Any ledger invariant breach triggers immediate code freeze, executive page, and treasury alert.'
    }
  },

  saas: {
    id: 'saas',
    name: 'Modern Full-Stack SaaS Web App',
    shortLabel: 'SaaS App',
    badge: 'SaaS',
    iconName: 'LayoutDashboard',
    description: 'Multi-tenant web application with organization accounts, subscription billing, interactive dashboards, and REST APIs.',
    data: {
      projectName: 'Apex Cloud Portal',
      version: '1.0.0',
      author: 'Core Engineering Guild',
      date: new Date().toISOString().split('T')[0],
      targetAudience: 'Team Administrators, Project Leads, and Organization Members',
      problemStatement: 'Fragmented team tools and opaque billing workflows lead to lost productivity and inefficient cross-department collaboration.',
      businessObjectives: '1. Onboard new organizations in under 2 minutes.\n2. Maintain 99.9% uptime SLA across all user time zones.\n3. Sub-250ms API response time for all dashboard views.',
      coreFeatures: [
        {
          id: 'feat-saas-1',
          title: 'Organization & Workspace Management',
          priority: 'P0',
          desc: 'Multi-tenant hierarchy with role-based member invitations, single sign-on, and custom team roles.',
          acceptance: 'Workspace creation completes in < 3 seconds.'
        },
        {
          id: 'feat-saas-2',
          title: 'Subscription Billing & Metered Usage',
          priority: 'P0',
          desc: 'Stripe billing integration with automated invoicing, plan tier upgrades, and metered seat billing.',
          acceptance: 'Generates instant PDF invoice upon payment.'
        },
        {
          id: 'feat-saas-3',
          title: 'Real-Time Activity & Notification Hub',
          priority: 'P1',
          desc: 'Interactive in-app notification center and outgoing webhook dispatch for team updates.',
          acceptance: 'Webhooks dispatch in < 500ms with HMAC signing.'
        }
      ],
      nonFunctionalReqs: '99.9% availability SLA, standard API response times < 250ms, TLS 1.3 encryption, automated daily data backups.',
      architecturePattern: 'Modular Monolith (Domain-Driven Design)',
      techStack: {
        frontend: 'React 19, Tailwind CSS, TanStack Query, Vite',
        backend: 'Node.js / Express TypeScript with Prisma ORM',
        database: 'PostgreSQL 16 with Row-Level Security (RLS)',
        cache: 'Redis 7 for session cache and rate-limiting',
        broker: 'Redis BullMQ for asynchronous background jobs',
        infra: 'AWS ECS Fargate with CloudFront CDN'
      },
      dataModelEntities: 'Organization, User, TeamMembership, SubscriptionPlan, Invoice, ActivityItem, WebhookEndpoint',
      apiDesign: 'Clean RESTful JSON API with OpenAPI 3.1 documentation, JWT Bearer tokens, and per-tenant rate-limiting.',
      authSecurity: 'OAuth2 with Google & GitHub SSO, session cookies with SameSite=Lax, and encrypted database columns.',
      dataFlowNotes: 'Client request -> CloudFront CDN -> API Gateway -> Auth middleware -> Service logic -> PostgreSQL with RLS -> Response.',
      unitTestFramework: 'Vitest with 85% branch coverage on billing calculations and permission checks.',
      integrationTests: 'Automated Supertest suites running against containerized PostgreSQL test database.',
      e2eScenarios: '1. New user signs up, creates workspace, invites team member, and upgrades to Pro plan.\n2. Expired session redirects cleanly to login.',
      cicdQualityGates: 'GitHub Actions running ESLint, TypeScript typecheck, unit tests, and Playwright E2E tests before production deployment.',
      performanceTesting: 'k6 load test simulating 1,500 simultaneous users browsing dashboards without degradation.',
      deploymentStrategy: 'Automated rolling deployment with health check verification and zero user downtime.',
      monitoringAlerting: 'Sentry for exception tracking, Grafana Cloud for latency and error rates.',
      rollbackProcedure: '1. Roll back container revision to previous stable build.\n2. Verify health probe pass.\n3. Notify engineering channel.',
      disasterRecovery: 'Automated daily PostgreSQL snapshots with point-in-time recovery (PITR) and RPO < 1 hour, RTO < 30 minutes.',
      incidentEscalation: 'P1 outages notify on-call developer via PagerDuty within 5 minutes.'
    }
  },

  cloudSec: {
    id: 'cloudSec',
    name: 'Cloud Security & DevSecOps Platform',
    shortLabel: 'Cloud Security',
    badge: 'Security',
    iconName: 'ShieldCheck',
    description: 'Multi-cloud compliance telemetry, automated policy enforcement, and audit evidence vault.',
    data: {
      projectName: 'Aegis Guard',
      version: '1.2.0',
      author: 'Platform Architecture Guild',
      date: new Date().toISOString().split('T')[0],
      targetAudience: 'Enterprise DevSecOps, SRE, and Compliance Auditors',
      problemStatement: 'Siloed compliance telemetry across multi-cloud environments results in an average 72-hour lag for vulnerability triage and high risk of audit failure.',
      businessObjectives: '1. Reduce compliance drift remediation time to < 15 minutes.\n2. Provide 100% continuous automated audit evidence collection for SOC2 Type II and ISO27001.\n3. Maintain zero-downtime ingestion of up to 50,000 security telemetry events/sec.',
      coreFeatures: [
        {
          id: 'feat-sec-1',
          title: 'Continuous Asset Discovery',
          priority: 'P0',
          desc: 'Real-time telemetry ingest agent tracking all AWS, GCP, and Azure ephemeral workloads.',
          acceptance: 'Discovers new compute/storage instances within 10s of cloud provider notification.'
        },
        {
          id: 'feat-sec-2',
          title: 'Automated Policy Remediator',
          priority: 'P0',
          desc: 'Policy-as-code engine applying automated IAM and network security group isolation rules.',
          acceptance: 'Enforces quarantine on unencrypted S3 buckets or open SSH ports within 5s.'
        },
        {
          id: 'feat-sec-3',
          title: 'Audit Evidence Vault',
          priority: 'P1',
          desc: 'Cryptographically sealed ledger for immutable audit trail snapshots.',
          acceptance: 'Produces verifiable SHA-256 Merkle proofs for compliance inspectors.'
        }
      ],
      nonFunctionalReqs: '99.99% availability SLA, p99 ingestion latency < 80ms, end-to-end AES-256-GCM encryption with HSM-backed key rotation.',
      architecturePattern: 'Event-Driven Microservices with CQRS',
      techStack: {
        frontend: 'React 19, Tailwind CSS, TanStack Query, Vite',
        backend: 'Go (Golang) microservices, gRPC internal service mesh',
        database: 'PostgreSQL 16 (TimescaleDB partitioned) & ClickHouse (Analytics)',
        cache: 'Redis Cluster 7.2 (Sentinel active-active)',
        broker: 'Apache Kafka on Strimzi Kubernetes Operator',
        infra: 'AWS EKS multi-AZ, Terraform, Helm, Cilium eBPF CNI'
      },
      dataModelEntities: 'TenantAccount, CloudIdentity, TelemetryEvent, SecurityFinding, IsolationPolicy, RemediationRun, AuditSnapshot',
      apiDesign: 'Internal: High-throughput gRPC over HTTP/2 with Protobuf contracts.\nExternal: RESTful OpenAPI 3.1 gateway with rate-limiting at 2500 req/min per tenant, OAuth2 Bearer authorization.',
      authSecurity: 'OAuth2 with OIDC federation, fine-grained Casbin RBAC, SPIFFE/SPIRE workload identities, and KMS envelope encryption.',
      dataFlowNotes: 'Ingest workers receive cloud audit logs -> Publish to raw-events Kafka topic -> Stream processing engine evaluates Rego OPA policies -> Emits Alert or Auto-Quarantine event -> Persists to TimescaleDB and ClickHouse.',
      unitTestFramework: 'Go standard testing & Vitest for Web; minimum 85% branch coverage required for CI pass.',
      integrationTests: 'Testcontainers spinning up ephemeral PostgreSQL and Kafka instances per execution suite.',
      e2eScenarios: '1. Simulated rogue S3 public-bucket creation triggers detection in < 3s, quarantine in < 10s.\n2. Partition resilience test: Disconnect ClickHouse cluster, verify Kafka backpressure absorbs telemetry without event loss.',
      cicdQualityGates: 'GitHub Actions running Trivy vulnerability scans, SonarQube static analysis, and zero CVE policy before staging promotion.',
      performanceTesting: 'k6 load test executing 50,000 req/sec telemetry burst for 30 minutes with p99 response time capped at 120ms.',
      deploymentStrategy: 'ArgoCD GitOps Canary deployments (10% -> 25% -> 50% -> 100%) with automated rollbacks on metric anomalies.',
      monitoringAlerting: 'Prometheus metrics + OpenTelemetry distributed tracing into Grafana. Critical P1 alerts trigger PagerDuty if Kafka lag exceeds 10,000 msgs for 3 min.',
      rollbackProcedure: '1. Abort ArgoCD sync rollout.\n2. Run `argocd app rollback <APP_NAME> --to-revision <PREV_STABLE_TAG>`.\n3. Run db-migration verify script to ensure backward compatibility.\n4. Post incident notice to Slack #incidents-prod channel.',
      disasterRecovery: 'RPO < 1 minute, RTO < 15 minutes. Multi-region automated failover executed via `scripts/dr-orchestrator.sh` with Route53 DNS health check failover.',
      incidentEscalation: 'Severity 1 (Data loss or active breach): PagerDuty page to Primary On-Call SRE + VP Engineering within 2 minutes. War room open immediately.'
    }
  }
};

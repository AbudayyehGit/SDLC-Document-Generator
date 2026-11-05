import { GlossaryItem } from '../types';

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'prd',
    term: 'PRD (Product Requirements Document)',
    shortDefinition: 'A blueprint explaining what you are building and why.',
    plainLanguageSummary: 'A shared agreement between product managers, designers, and engineers stating the user problem, target audience, must-have features, and business goals before anyone writes code.',
    analogy: 'The architect’s floor plan for a house before laying the foundation.',
    realWorldExample: 'A document outlining why a rideshare app needs real-time driver tracking and arrival estimates.',
    category: 'Planning'
  },
  {
    id: 'sdd',
    term: 'SDD (System Design Document)',
    shortDefinition: 'The technical blueprint of how the software works internally.',
    plainLanguageSummary: 'An engineering design outlining how servers, databases, third-party services, and user interfaces communicate, store information, and scale.',
    analogy: 'The electrical wiring, plumbing, and structural engineering schematics for a building.',
    realWorldExample: 'Specifying that orders go into PostgreSQL, fast inventory counts stay in Redis, and invoices process via background workers.',
    category: 'Architecture'
  },
  {
    id: 'sla',
    term: 'SLA (Service Level Agreement)',
    shortDefinition: 'A promise of how reliable and fast a service will be.',
    plainLanguageSummary: 'A formal commitment (often expressed as 99.9% uptime or < 100ms response time) defining the minimum acceptable quality and what happens if that standard fails.',
    analogy: 'A pizza shop promising "delivered hot in 30 minutes or your meal is free".',
    realWorldExample: 'Cloud storage guaranteeing 99.99% monthly availability with financial credits if downtime exceeds 4 minutes.',
    category: 'Planning'
  },
  {
    id: 'nfr',
    term: 'NFR (Non-Functional Requirements)',
    shortDefinition: 'How well the system must perform, not just what it does.',
    plainLanguageSummary: 'Quality attributes such as speed, security, scalability, disaster recovery, and accessibility rather than specific user-facing buttons.',
    analogy: 'A car must not only drive (feature), but also get 40 MPG and score 5 stars in crash tests (NFR).',
    realWorldExample: 'Checkout API must respond under 200 milliseconds during Black Friday traffic surges.',
    category: 'Planning'
  },
  {
    id: 'p0-p1-p2',
    term: 'P0 / P1 / P2 (Priority Levels)',
    shortDefinition: 'A ranking system for deciding what gets built or fixed first.',
    plainLanguageSummary: 'P0 means critical/blocker (release cannot ship without it). P1 means high priority (essential for normal launch). P2 means nice-to-have or future enhancement.',
    analogy: 'Emergency room triage: heart attack (P0), broken arm (P1), routine scrape (P2).',
    realWorldExample: 'User login is P0; email invoice generation is P1; dark-mode theme is P2.',
    category: 'Planning'
  },
  {
    id: 'microservices',
    term: 'Microservices',
    shortDefinition: 'Splitting one big app into independent smaller programs.',
    plainLanguageSummary: 'An architectural style where an application consists of small, specialized services running independently and talking via network APIs.',
    analogy: 'A food hall with separate specialized kitchens (tacos, sushi, burgers) rather than a single giant kitchen trying to cook everything.',
    realWorldExample: 'Netflix having separate services for billing, video streaming, user recommendations, and subtitles.',
    category: 'Architecture'
  },
  {
    id: 'cqrs',
    term: 'CQRS (Command Query Responsibility Segregation)',
    shortDefinition: 'Separating the code that saves data from the code that reads data.',
    plainLanguageSummary: 'Using different data models or databases for writing changes (fast, strict) versus reading information (pre-calculated, lightning-fast queries).',
    analogy: 'The bank teller accepting deposit slips (writing) vs. the mobile phone app displaying your current balance snapshot (reading).',
    realWorldExample: 'Saving orders to a relational SQL database, while reading product catalog search results from an Elasticsearch cluster.',
    category: 'Architecture'
  },
  {
    id: 'event-driven',
    term: 'Event-Driven Architecture',
    shortDefinition: 'Programs reacting to things happening in real time.',
    plainLanguageSummary: 'Instead of services calling each other directly and waiting, services announce "Something just happened!" and other services react asynchronously.',
    analogy: 'A factory loudspeaker broadcasting "Flight 102 has landed", so baggage handlers and gate agents take action without waiting on a phone call.',
    realWorldExample: 'When an order is paid, the payment service emits an "OrderPaid" event that triggers email delivery, inventory reduction, and shipping label printing.',
    category: 'Architecture'
  },
  {
    id: 'kafka',
    term: 'Message Broker (Kafka / RabbitMQ)',
    shortDefinition: 'A super-fast digital post office and queue for software messages.',
    plainLanguageSummary: 'A durable system that buffers, organizes, and distributes millions of messages between applications without dropping a single packet.',
    analogy: 'A conveyor belt in a package sorting hub that keeps moving packages even if one delivery truck is momentarily delayed.',
    realWorldExample: 'Streaming continuous GPS telemetry coordinates from thousands of delivery trucks to fleet tracking dashboards.',
    category: 'Architecture'
  },
  {
    id: 'redis',
    term: 'Redis (In-Memory Cache)',
    shortDefinition: 'Superfast short-term memory for web applications.',
    plainLanguageSummary: 'An open-source in-memory data store used as a cache to keep frequently requested data in RAM instead of repeatedly querying slower hard drives.',
    analogy: 'Keeping your favorite recipes on the kitchen counter instead of digging through the basement bookshelf every time.',
    realWorldExample: 'Keeping active user login sessions and shopping cart totals instantly accessible in memory.',
    category: 'Architecture'
  },
  {
    id: 'zero-trust',
    term: 'Zero-Trust Architecture',
    shortDefinition: 'Never automatically trust any computer, user, or device.',
    plainLanguageSummary: 'A security model assuming threats exist both outside and inside the corporate perimeter. Every request must be strictly authenticated, authorized, and encrypted.',
    analogy: 'An airport where you must scan your boarding pass and photo ID at every single door, not just the front entrance.',
    realWorldExample: 'Requiring cryptographic mTLS certificates between every backend microservice even inside a private Kubernetes cluster.',
    category: 'Security'
  },
  {
    id: 'idempotency',
    term: 'Idempotency',
    shortDefinition: 'Performing the same action multiple times has the exact same result.',
    plainLanguageSummary: 'An engineering design guaranteeing that if a user accidentally taps "Pay Now" five times or an API request retries after a network drop, the card is only charged once.',
    analogy: 'Pressing the elevator button 10 times doesn’t call 10 elevators—it just ensures the elevator comes.',
    realWorldExample: 'Including an `Idempotency-Key: uuid` header on payment checkout requests so retry attempts return the same receipt.',
    category: 'Architecture'
  },
  {
    id: 'grpc',
    term: 'gRPC & Protocol Buffers (Protobuf)',
    shortDefinition: 'A lightning-fast, compact way for servers to talk to each other.',
    plainLanguageSummary: 'A binary communication protocol created by Google that replaces bulky JSON text with tiny, pre-compiled binary messages over HTTP/2.',
    analogy: 'Speaking in streamlined Morse code shorthand rather than sending typed handwritten letters back and forth.',
    realWorldExample: 'High-frequency microservices communicating internally in under 2 milliseconds.',
    category: 'Architecture'
  },
  {
    id: 'unit-testing',
    term: 'Unit Testing',
    shortDefinition: 'Automated tests checking small isolated pieces of code.',
    plainLanguageSummary: 'Quick automated checks verifying that individual functions or algorithms calculate expected answers under normal, edge, and error conditions.',
    analogy: 'Testing a single light bulb in a socket to verify it lights up before installing it on a Christmas tree.',
    realWorldExample: 'Verifying that `calculateSalesTax(100, 0.08)` returns exactly `8.00` and throws an error if tax rate is negative.',
    category: 'Testing'
  },
  {
    id: 'integration-testing',
    term: 'Integration Testing',
    shortDefinition: 'Testing how different parts work together.',
    plainLanguageSummary: 'Automated tests that verify code interacting with real or containerized databases, network APIs, queues, and file systems.',
    analogy: 'Connecting the plumbing pipes to the water heater and checking that hot water actually flows through the faucet without leaks.',
    realWorldExample: 'Spins up an ephemeral PostgreSQL database container, inserts a mock user, and tests database queries.',
    category: 'Testing'
  },
  {
    id: 'e2e-testing',
    term: 'End-to-End (E2E) Testing',
    shortDefinition: 'Simulating a real human user journey from start to finish.',
    plainLanguageSummary: 'Automated tests that open a browser, click buttons, fill out forms, and verify that the whole system works seamlessly together.',
    analogy: 'A test driver taking a completed car on a test track to test steering, braking, and cruise control all at once.',
    realWorldExample: 'A robot signing up for a new account, searching for a product, adding it to cart, paying with a test card, and verifying the receipt.',
    category: 'Testing'
  },
  {
    id: 'ci-cd',
    term: 'CI/CD (Continuous Integration / Continuous Delivery)',
    shortDefinition: 'An automated assembly line for testing and shipping software.',
    plainLanguageSummary: 'Every time an engineer pushes code, automated robots check for bugs, run security scans, package the software, and deploy it to cloud servers without human bottlenecks.',
    analogy: 'An automated car wash and quality inspection lane that every vehicle must pass through before leaving the lot.',
    realWorldExample: 'GitHub Actions running tests on pull requests and deploying to AWS production when approved.',
    category: 'Testing'
  },
  {
    id: 'branch-coverage',
    term: 'Branch Coverage (Test Coverage)',
    shortDefinition: 'The percentage of code decision branches executed by tests.',
    plainLanguageSummary: 'A metric indicating whether your automated tests exercise both the `if` and the `else` branches of your business logic.',
    analogy: 'Driving down both the main highway and the detour exit ramp to ensure both roads have working streetlights.',
    realWorldExample: 'Requiring at least 85% branch coverage in CI before pull requests are allowed to merge.',
    category: 'Testing'
  },
  {
    id: 'canary-deployment',
    term: 'Canary Deployment',
    shortDefinition: 'Testing a new software version on a tiny percentage of users first.',
    plainLanguageSummary: 'A rollout technique where new code goes live to 5% or 10% of users while monitoring for errors. If metrics remain healthy, traffic slowly scales to 100%.',
    analogy: 'Miners taking a canary bird into coal mines to detect dangerous gases before miners venture deeper.',
    realWorldExample: 'Releasing version 2.0 to 10% of visitors; seeing error rate rise by 0.2%, and automatically rolling back before anyone notices.',
    category: 'Operations'
  },
  {
    id: 'rollback',
    term: 'Rollback',
    shortDefinition: 'Instantly reverting to the previous working version of software.',
    plainLanguageSummary: 'A predefined, rehearsed emergency procedure that swaps broken production servers or configurations back to the last known healthy state.',
    analogy: 'Hitting "Undo" on a computer document or switching back to the old electrical breaker if a new one sparks.',
    realWorldExample: 'Running `argocd app rollback` to revert a malfunctioning deployment in under 60 seconds.',
    category: 'Operations'
  },
  {
    id: 'rpo',
    term: 'RPO (Recovery Point Objective)',
    shortDefinition: 'How much recent data you can afford to lose in a catastrophe.',
    plainLanguageSummary: 'The maximum allowable age of files or transactions that must be recovered from backup storage after a disaster.',
    analogy: 'If you save your document every 5 minutes, your RPO is 5 minutes. If your laptop dies, you lose at most 5 minutes of typing.',
    realWorldExample: 'A bank demanding RPO = 0 (zero lost transactions), while a video game leaderboard might tolerate RPO = 15 minutes.',
    category: 'Operations'
  },
  {
    id: 'rto',
    term: 'RTO (Recovery Time Objective)',
    shortDefinition: 'How quickly the system must be back up and running after a crash.',
    plainLanguageSummary: 'The target duration of time within which a business process or website must be restored after a server failure or disaster.',
    analogy: 'How long the emergency power generator takes to kick in after a blackout (e.g. within 10 seconds).',
    realWorldExample: 'RTO < 15 minutes means our engineers or automated scripts must have backup servers serving customers within 15 minutes.',
    category: 'Operations'
  },
  {
    id: 'runbook',
    term: 'Runbook (Operations Guide)',
    shortDefinition: 'The step-by-step emergency manual for engineers on duty.',
    plainLanguageSummary: 'A clear, battle-tested checklist explaining how to restart services, handle traffic spikes, diagnose errors, and execute rollbacks during 2:00 AM outages.',
    analogy: 'The printed emergency checklist in an airplane cockpit for handling engine failure or sudden turbulence.',
    realWorldExample: 'A document listing the exact commands to run when customer logins fail or when database storage reaches 95%.',
    category: 'Operations'
  },
  {
    id: 'observability',
    term: 'Observability & Telemetry',
    shortDefinition: 'The instruments and gauges telling you what software is doing inside.',
    plainLanguageSummary: 'Collecting logs, real-time metrics (CPU, requests/second), and distributed traces across servers so engineers can diagnose problems before users complain.',
    analogy: 'The dashboard gauges in an airplane cockpit showing altitude, speed, fuel pressure, and warning lights.',
    realWorldExample: 'Prometheus tracking request latency, sending alerts to Grafana, and paging on-call staff when p99 response time spikes above 200ms.',
    category: 'Operations'
  }
];

export const GLOSSARY_MAP: Record<string, GlossaryItem> = GLOSSARY_ITEMS.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, GlossaryItem>);

// Helper to look up a glossary item by term name or alias
export function findGlossaryItem(query: string): GlossaryItem | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();
  return GLOSSARY_ITEMS.find(item =>
    item.id.toLowerCase() === q ||
    item.term.toLowerCase().includes(q) ||
    q.includes(item.id.toLowerCase())
  );
}

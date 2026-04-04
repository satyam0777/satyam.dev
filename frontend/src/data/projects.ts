export interface Project {
  id: string;
  num: string;
  name: string;
  tagline: string;
  type: 'fullstack' | 'backend' | 'planned';
  status: 'live' | 'building' | 'planned';
  stack: string[];
  description: string;
  githubUrl: string;
  liveUrl?: string;
  highlights: string[];
  architecture: {
    overview: string;
    intuition: string;
    diagram: string; // text-based architecture description
    decisions: { title: string; reasoning: string }[];
    challenges: { problem: string; solution: string }[];
    whatILearned: string[];
    scalingThoughts: string;
  };
}

export const projects: Project[] = [
  {
    id: 'vetcare',
    num: '01',
    name: 'VetCare',
    tagline: 'Veterinary Telemedicine Platform',
    type: 'fullstack',
    status: 'live',
    stack: ['Node.js', 'React', 'MongoDB', 'Socket.IO', 'Razorpay', 'Agora RTC', 'JWT', 'Express'],
    description: 'Production telemedicine platform connecting farmers with veterinary doctors — appointment scheduling, HD video consultations, post-consultation payment with automated commission distribution, and real-time notifications.',
    githubUrl: 'https://github.com/satyam0777',
    highlights: [
      '50+ RESTful APIs with JWT auth and role-based authorization',
      '12 MongoDB schemas with compound indexing — queries dropped from 4.5s to 50ms',
      'Razorpay with HMAC webhook verification + 18% automated commission model',
      'Socket.IO real-time notifications across farmer/vet/admin roles',
      'Agora RTC WebRTC video calling integration',
      'Deployed on Vercel + Render with CI/CD — 99.9% uptime',
    ],
    architecture: {
      overview: 'Three-role system (Farmer, Vet, Admin) with separate API surfaces for each. The core flow is: appointment booking → video consultation → payment release → report delivery. Each step is decoupled so a failure in payment doesn\'t affect the consultation record.',
      intuition: 'The hardest design question was: when should payment be released to the vet? Not at booking (farmer could ghost), not before consultation (vet could ghost), and not manually (trust problem). The answer was a post-consultation webhook — Razorpay confirms payment, our webhook verifies HMAC signature, then automatically splits 82% to vet and 18% platform commission. This makes the money flow trustless and auditable.',
      diagram: `
┌─────────────┐     ┌──────────────────────────────────────────────┐
│   Farmer    │     │              API SERVER (Express.js)           │
│   (React)   │────▶│                                               │
└─────────────┘     │  ┌───────────┐  ┌──────────┐  ┌───────────┐ │
                    │  │   Auth    │  │   Appt   │  │  Payment  │ │
┌─────────────┐     │  │Middleware │  │ Service  │  │  Service  │ │
│     Vet     │────▶│  └───────────┘  └──────────┘  └───────────┘ │
│   (React)   │     │                                               │
└─────────────┘     └───────────────┬──────────────────────────────┘
                                    │
              ┌─────────────────────┼──────────────────────┐
              ▼                     ▼                        ▼
       ┌────────────┐      ┌──────────────┐        ┌────────────────┐
       │  MongoDB   │      │  Socket.IO   │        │   Razorpay     │
       │ (12 schemas│      │  (Real-time  │        │  (Webhooks +   │
       │ + indexes) │      │   events)    │        │   Commission)  │
       └────────────┘      └──────────────┘        └────────────────┘
              │                                             │
              ▼                                             ▼
       ┌────────────┐                             ┌────────────────┐
       │   Agora    │                             │   Nodemailer   │
       │ (WebRTC    │                             │ (Report email  │
       │  Video)    │                             │  delivery)     │
       └────────────┘                             └────────────────┘`,
      decisions: [
        {
          title: 'Compound Indexes on Appointment Queries',
          reasoning: 'Queries filtered by vetId + date + status were running collection scans at 4.5s. Created compound index with ESR rule (Equality → Sort → Range): { vetId: 1, status: 1, date: 1 }. Result: 50ms. The order matters — MongoDB can only use an index from the left prefix forward.',
        },
        {
          title: 'HMAC Webhook Verification for Payments',
          reasoning: 'Razorpay sends a webhook on payment success. Without HMAC verification, anyone could POST a fake "payment success" to our endpoint and get free consultations. We verify the signature using crypto.createHmac with the webhook secret before processing any payment confirmation.',
        },
        {
          title: 'Socket.IO Rooms per Role',
          reasoning: 'Instead of broadcasting all events to all clients, each user joins a room keyed to their userId. This ensures a farmer only receives their own appointment updates, not events for other users. Reduces unnecessary network traffic and prevents data leakage.',
        },
        {
          title: 'Post-Consultation Payment Release',
          reasoning: 'Payment is captured at booking but only released to the vet after consultation completion is confirmed. This protects both parties: farmer knows vet must show up, vet knows payment is secured. The consultation record and payment are reconciled via a webhook handler after Razorpay captures the payment.',
        },
      ],
      challenges: [
        {
          problem: 'Video calls dropping on poor rural internet connections',
          solution: 'Agora RTC handles adaptive bitrate by default, but we added a fallback to audio-only mode when connection quality drops below threshold, keeping consultations functional even on 2G.',
        },
        {
          problem: 'Race condition in commission distribution',
          solution: 'Two webhooks arriving simultaneously could trigger double-distribution. Fixed with MongoDB transactions + an idempotency key on the payment record — if a payment_id was already processed, the webhook handler returns 200 and exits without processing.',
        },
      ],
      whatILearned: [
        'Webhook idempotency is non-negotiable in payment systems',
        'Database indexes are about query patterns, not data size',
        'Socket.IO rooms are the right abstraction for multi-role real-time systems',
        'HMAC verification should be the first line of webhook handlers',
      ],
      scalingThoughts: 'At scale, Socket.IO wouldn\'t work across multiple Node instances without Redis adapter for pub/sub. Razorpay commission logic would move to a dedicated payment microservice. MongoDB would need read replicas for analytics queries. The video layer (Agora) already scales — it\'s a managed service.',
    },
  },
  {
    id: 'studyhelper',
    num: '02',
    name: 'StudyHelper',
    tagline: 'AI-Powered Educational Platform',
    type: 'fullstack',
    status: 'live',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'OpenAI', 'Gemini API', 'JWT', 'PostgreSQL'],
    description: 'AI study assistant with dual AI provider architecture — quiz generation from PDFs, flashcards, and document summarization with intelligent fallback between OpenAI and Google Gemini.',
    githubUrl: 'https://github.com/satyam0777',
    highlights: [
      'Dual AI provider: OpenAI primary + Gemini fallback with intelligent switching',
      'PDF processing pipeline with structured prompt engineering',
      'JSON schema validation on all AI responses for consistency',
      'Rate limiting + caching reduced AI API costs by 40%',
      'JWT auth with protected routes, 98% uptime on Vercel/Render',
    ],
    architecture: {
      overview: 'The core insight: AI APIs are unreliable and expensive. The architecture wraps both OpenAI and Gemini behind a unified AIProvider interface. If OpenAI fails or rate-limits, the request transparently retries with Gemini. All AI responses are validated against a JSON schema before returning to the client.',
      intuition: 'Why validate AI responses with JSON schema? Because AI models hallucinate structure. If you ask GPT-4 to return { questions: [...] } and it decides to add commentary, your frontend crashes. Schema validation at the API boundary means the AI can be non-deterministic internally but the API contract with your frontend stays strict.',
      diagram: `
┌──────────────────────────────────────────────────┐
│                  React + TypeScript               │
└─────────────────────────┬────────────────────────┘
                           │ HTTP
┌──────────────────────────▼────────────────────────┐
│                  Express.js API                    │
│                                                    │
│  ┌─────────────┐   ┌───────────────────────────┐  │
│  │JWT Auth     │   │     AI Provider Layer     │  │
│  │Middleware   │   │                           │  │
│  └─────────────┘   │  ┌─────────┐  ┌────────┐ │  │
│                    │  │ OpenAI  │  │Gemini  │ │  │
│  ┌─────────────┐   │  │(primary)│→ │(fallbk)│ │  │
│  │Rate Limiter │   │  └─────────┘  └────────┘ │  │
│  │(Redis)      │   │         ↓                 │  │
│  └─────────────┘   │  JSON Schema Validation   │  │
│                    └───────────────────────────┘  │
└─────────────────────────┬────────────────────────┘
                           │
              ┌────────────┴─────────────┐
              ▼                          ▼
       ┌────────────┐           ┌──────────────┐
       │ PostgreSQL │           │ PDF Parser   │
       │(user data, │           │(pdf-parse +  │
       │ quiz cache)│           │ chunking)    │
       └────────────┘           └──────────────┘`,
      decisions: [
        {
          title: 'Dual AI Provider with Fallback',
          reasoning: 'Single AI provider = single point of failure. If OpenAI has an outage (it does), the entire app breaks. The AIProvider abstraction lets us swap providers transparently. The fallback decision is made at the infrastructure level, not the business logic level.',
        },
        {
          title: 'Caching AI Responses',
          reasoning: 'Generating a quiz from the same PDF twice costs double the API credits. We cache responses keyed by hash(PDF content + prompt template). Cache TTL is 24 hours. This cut AI costs by 40% in testing.',
        },
        {
          title: 'PDF Chunking Strategy',
          reasoning: 'Large PDFs exceed context windows. We chunk by paragraph boundaries (not fixed character counts) to preserve semantic meaning. Each chunk is processed independently and results merged. Chunking at sentence boundaries was worse — it split concepts mid-explanation.',
        },
      ],
      challenges: [
        {
          problem: 'AI responses not matching expected JSON structure',
          solution: 'Implemented JSON schema validation using Zod. If validation fails, retry with a more explicit prompt that includes a concrete example of expected output format. Max 2 retries before returning 503.',
        },
        {
          problem: 'Rate limiting across OpenAI and Gemini separately',
          solution: 'Each provider has independent rate limit tracking in Redis. When OpenAI hits its limit, fallback to Gemini even if OpenAI is technically available — preserving credits for higher-priority requests.',
        },
      ],
      whatILearned: [
        'AI APIs need the same reliability patterns as any external dependency',
        'JSON schema validation at API boundaries is essential for AI apps',
        'Caching is the most impactful cost optimization for AI workloads',
        'Prompt engineering is an engineering discipline, not a trick',
      ],
      scalingThoughts: 'At scale, PDF processing would move to an async queue (BullMQ + Redis) so large files don\'t block the API. AI responses would be cached in a shared Redis cluster. Each AI provider would have its own rate limit budget tracked globally across all instances.',
    },
  },
  {
    id: 'secondbrain',
    num: '03',
    name: 'SecondBrain',
    tagline: 'Knowledge Management Platform',
    type: 'fullstack',
    status: 'live',
    stack: ['React 19', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Framer Motion', 'Tailwind CSS'],
    description: 'Knowledge management platform with neural network animations, JWT auth with bcrypt, protected route middleware, user data isolation, and optimized multi-content search.',
    githubUrl: 'https://github.com/satyam0777',
    highlights: [
      'JWT auth with bcrypt hashing (12 salt rounds)',
      'User data isolation — every query scoped to userId',
      'MongoDB optimized indexing for full-text multi-content search',
      'React 19 with Framer Motion neural network background animations',
      'Dark mode + responsive design with Tailwind CSS',
    ],
    architecture: {
      overview: 'A personal knowledge base where users store notes, links, and documents. The core security principle: every database query includes a userId filter. There is no way to access another user\'s data — it\'s enforced at the data layer, not just the route layer.',
      intuition: 'Most auth tutorials protect routes. That\'s not enough. If an authenticated user crafts a request with another user\'s contentId, a naive implementation would return that content. The fix: every read/write operation includes the authenticated userId as a mandatory filter. Route protection keeps out unauthenticated users. Query-level scoping keeps authenticated users in their lane.',
      diagram: `
┌────────────────────────────────────────────┐
│            React 19 + Framer Motion        │
└─────────────────────┬──────────────────────┘
                      │
┌─────────────────────▼──────────────────────┐
│              Express.js API                │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  verifyJWT Middleware                │  │
│  │  req.user = decoded JWT payload      │  │
│  └──────────────────────┬───────────────┘  │
│                         │                  │
│  ┌──────────────────────▼───────────────┐  │
│  │  Content Routes                      │  │
│  │  ALL queries: { userId: req.user.id} │  │ ← Data isolation enforced here
│  └──────────────────────┬───────────────┘  │
└─────────────────────────┼──────────────────┘
                          │
              ┌───────────▼───────────┐
              │       MongoDB         │
              │  ┌─────────────────┐  │
              │  │ content index:  │  │
              │  │ { userId: 1,    │  │
              │  │   type: 1,      │  │
              │  │   createdAt:-1} │  │
              │  └─────────────────┘  │
              └───────────────────────┘`,
      decisions: [
        {
          title: 'Data Isolation at Query Level',
          reasoning: 'Route-level auth only verifies "is this user logged in?" It doesn\'t prevent user A from accessing user B\'s content with a crafted request. By including userId in every query filter, even a compromised request can only access the authenticated user\'s data.',
        },
        {
          title: 'bcrypt with 12 Salt Rounds',
          reasoning: '10 rounds is the common recommendation. 12 is deliberately slower — on modern hardware, 12 rounds takes ~300ms per hash. This is imperceptible to users but makes brute-force attacks 4x slower than 10 rounds. Worth the trade-off for a password database.',
        },
      ],
      challenges: [
        {
          problem: 'Full-text search across different content types (notes, links, documents)',
          solution: 'MongoDB text index across multiple fields with weights: { title: 10, content: 5, tags: 3 }. Title matches rank higher than body matches. This is simpler than Elasticsearch for this scale and good enough for personal knowledge bases.',
        },
      ],
      whatILearned: [
        'Auth and authorization are different problems — solve both explicitly',
        'Data isolation must be enforced at the query layer, not just the route layer',
        'bcrypt cost factor is a security vs UX trade-off you should make consciously',
        'MongoDB text indexes with weights are underrated for simple search',
      ],
      scalingThoughts: 'At serious scale, search would move to Elasticsearch or Typesense. User data isolation would be enforced by a data access layer (DAL) that wraps all DB calls, preventing accidental bypasses in future routes.',
    },
  },
  {
    id: 'satyam-auth',
    num: '04',
    name: 'satyam-auth',
    tagline: 'NPM Authentication Middleware Package',
    type: 'backend',
    status: 'live',
    stack: ['Node.js', 'JWT', 'bcrypt', 'Express Middleware', 'NPM'],
    description: 'Published authentication middleware on npm. JWT login/register, protected route middleware, bcrypt encryption. Downloaded by 50+ developers with full documentation.',
    githubUrl: 'https://github.com/satyam0777',
    highlights: [
      'Published on npm — 50+ developer downloads',
      'JWT-based register/login with configurable token expiry',
      'Drop-in Express middleware for protected routes',
      'Comprehensive documentation with usage examples',
      'bcrypt password hashing with configurable salt rounds',
    ],
    architecture: {
      overview: 'A reusable Express middleware package that abstracts the most common auth patterns. The design goal: a developer should be able to add auth to an Express app in under 10 lines of code, without having to understand JWT internals.',
      intuition: 'Open source taught me something about API design that building private apps doesn\'t: your users are other developers. The interface is the product. I spent more time designing the function signatures and config options than writing the actual implementation. The question was always: what does the developer expect this to do, and how do I make the failure modes obvious?',
      diagram: `
┌──────────────────────────────────────────┐
│           satyam-auth (NPM)              │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  createAuthMiddleware(config)       │ │
│  │                                     │ │
│  │  Returns:                           │ │
│  │  ┌─────────────┐ ┌───────────────┐  │ │
│  │  │  register() │ │   login()     │  │ │
│  │  │  POST /reg  │ │   POST /login │  │ │
│  │  └─────────────┘ └───────────────┘  │ │
│  │  ┌──────────────────────────────┐   │ │
│  │  │  protect() middleware        │   │ │
│  │  │  verifies JWT on each req    │   │ │
│  │  │  injects req.user            │   │ │
│  │  └──────────────────────────────┘   │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  Config: { jwtSecret, saltRounds,        │
│            tokenExpiry, userModel }      │
└──────────────────────────────────────────┘`,
      decisions: [
        {
          title: 'Config Object over Environment Variables',
          reasoning: 'Using process.env.JWT_SECRET directly inside the package would mean the developer has no control over the key name. Config object lets developers pass any secret source — env vars, secrets manager, hardcoded (for testing).',
        },
        {
          title: 'Return Functions, Not Route Registration',
          reasoning: 'Early version auto-registered /register and /login routes. Developers hated it — it conflicted with their own route structure. Changed to returning middleware functions that developers wire up themselves. More flexible, less magic.',
        },
      ],
      challenges: [
        {
          problem: 'Supporting different user models (Mongoose, Sequelize, raw SQL)',
          solution: 'Accept a userModel adapter object with find(email) and create(data) methods. The developer implements these two functions for their ORM. The package stays ORM-agnostic.',
        },
      ],
      whatILearned: [
        'API design for other developers is harder than API design for yourself',
        'Magic (auto-configuration) is a bug for library users, not a feature',
        'Documentation is part of the product — incomplete docs = unusable package',
        'Open source forces you to think about edge cases you\'d ignore in private code',
      ],
      scalingThoughts: 'Future versions: support refresh token rotation, OAuth2 integration, and TypeScript generics for the user model type. The package should remain a thin abstraction — not a full auth server.',
    },
  },
  {
    id: 'polyglot-db',
    num: '05',
    name: 'PolyglotDB',
    tagline: 'Multi-Database Deep Dive — Understanding Data Storage From First Principles',
    type: 'backend',
    status: 'building',
    stack: ['Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Cassandra', 'Neo4j', 'InfluxDB', 'Docker Compose'],
    description: 'One application — six databases. A project built specifically to understand when and why you\'d choose each database engine, not just how to use them. Each database handles a different data access pattern from the same domain.',
    githubUrl: 'https://github.com/satyam0777',
    highlights: [
      'PostgreSQL: relational data with ACID transactions (user accounts, orders)',
      'MongoDB: document model for flexible product catalog',
      'Redis: caching layer + session storage + pub/sub',
      'Cassandra: time-series write-heavy data (event logs)',
      'Neo4j: graph relationships (product recommendations)',
      'InfluxDB: metrics and monitoring data',
      'Docker Compose orchestrates all 6 databases locally',
    ],
    architecture: {
      overview: 'An e-commerce domain (users, products, orders, recommendations, events) where each subsystem uses the database best suited to its access pattern. The goal isn\'t to build a real product — it\'s to make the case for each database visible and measurable.',
      intuition: 'Every bootcamp teaches you one database. Real systems use many. But the decision of "which database for what" is rarely taught. This project forces the question: why is Cassandra better than PostgreSQL for event logs? Why is Neo4j better than MongoDB for recommendations? The answer is always: access patterns. The database that matches your read/write pattern wins.',
      diagram: `
┌────────────────────────────────────────────────────────┐
│                   Express.js API                       │
└──────────┬───────────┬──────────┬──────────┬──────────┘
           │           │          │          │
     ┌─────▼───┐ ┌─────▼───┐ ┌───▼────┐ ┌───▼──────┐
     │Postgres │ │ MongoDB │ │ Redis  │ │Cassandra │
     │         │ │         │ │        │ │          │
     │Users    │ │Products │ │Session │ │EventLogs │
     │Orders   │ │Catalog  │ │Cache   │ │(append   │
     │Payments │ │(flex    │ │Pub/Sub │ │ only)    │
     │(ACID)   │ │schema)  │ │        │ │          │
     └─────────┘ └─────────┘ └────────┘ └──────────┘
           │
     ┌─────▼───┐  ┌──────────┐
     │  Neo4j  │  │InfluxDB  │
     │         │  │          │
     │Product  │  │API       │
     │Recom-   │  │Metrics   │
     │mendation│  │Latency   │
     │(graph)  │  │Dashboards│
     └─────────┘  └──────────┘`,
      decisions: [
        {
          title: 'Why Cassandra for Event Logs?',
          reasoning: 'Event logs are append-only, time-ordered, and never updated. Cassandra\'s LSM-tree storage is optimized for sequential writes. Partition key = userId, clustering key = timestamp means all events for a user are stored together and can be read in time order efficiently.',
        },
        {
          title: 'Why Neo4j for Recommendations?',
          reasoning: '"Users who bought X also bought Y" is a graph problem. In PostgreSQL you\'d need a self-join on a relationships table — O(n²) at scale. In Neo4j, graph traversal is O(depth) regardless of total graph size. The data model matches the query pattern.',
        },
        {
          title: 'Why Redis for Sessions over PostgreSQL?',
          reasoning: 'Session lookup happens on every authenticated request. PostgreSQL can do this, but it\'s a query + disk read for data that should expire automatically. Redis is in-memory, has native TTL support, and is 100x faster for this use case.',
        },
      ],
      challenges: [
        {
          problem: 'Keeping data consistent across 6 databases',
          solution: 'Explicit consistency boundaries: PostgreSQL is the source of truth for users and orders. Other databases are derived views. On user update, events publish to Redis pub/sub and subscribers update MongoDB, Cassandra, Neo4j accordingly. Eventual consistency is explicit, not accidental.',
        },
      ],
      whatILearned: [
        'Access patterns — not data format — should drive database choice',
        'Eventual consistency is a design choice that must be made explicitly',
        'Docker Compose is the fastest way to run a polyglot local environment',
        'Each database engine is a set of trade-offs, not a better/worse ranking',
      ],
      scalingThoughts: 'This is already the scaling conversation — this project IS about understanding how different databases scale. Cassandra scales writes horizontally. PostgreSQL scales reads with replicas. Redis scales with clustering. Neo4j scales with sharding (with trade-offs on cross-shard queries).',
    },
  },
  {
    id: 'realtime-comm',
    num: '06',
    name: 'PulseChat',
    tagline: 'Real-Time Communication System — WhatsApp-Scale Architecture Study',
    type: 'backend',
    status: 'building',
    stack: ['Node.js', 'WebSockets', 'Redis', 'Kafka', 'PostgreSQL', 'Socket.IO', 'Docker', 'React'],
    description: 'A real-time messaging system designed with scale in mind from day one. Not just "it works" — but understanding why WhatsApp uses the architecture it does, and implementing those principles at a learnable scale.',
    githubUrl: 'https://github.com/satyam0777',
    highlights: [
      'WebSocket connections managed across multiple Node.js instances via Redis adapter',
      'Kafka for message persistence and fan-out to offline users',
      'Redis pub/sub for real-time delivery to online users',
      'Message delivery receipts (sent → delivered → read)',
      'Presence system (online/offline/last seen)',
      'Horizontal scalability: adding servers doesn\'t break active connections',
    ],
    architecture: {
      overview: 'The fundamental challenge of real-time messaging at scale: user A is connected to server 1, user B is connected to server 2. How does a message from A reach B? The answer is: shared state via Redis pub/sub for online users, and a persistent queue (Kafka) for offline delivery. This is the same pattern WhatsApp, Slack, and Discord use.',
      intuition: 'WebSockets are stateful — a user\'s connection is tied to one server instance. That\'s fine for a single server. But when you scale to multiple servers, a message coming into server 1 needs to reach a user on server 2. This is the core distributed systems problem of real-time messaging. Redis pub/sub lets every server subscribe to every user\'s channel. Kafka ensures no message is lost if the recipient is offline.',
      diagram: `
User A (Server 1)          User B (Server 2)
     │                           ▲
     │ WebSocket                 │ WebSocket
     ▼                           │
┌─────────────┐           ┌──────────────┐
│  Node.js 1  │           │  Node.js 2   │
│  WS Server  │           │  WS Server   │
└──────┬──────┘           └──────▲───────┘
       │                         │
       │   Redis Pub/Sub          │
       └──────────┬──────────────┘
                  │
           ┌──────▼──────┐
           │    Redis    │◄── All servers subscribe to all user channels
           │  (pub/sub + │    Message published → all servers receive it
           │   presence) │    Server with user B's connection delivers it
           └──────┬──────┘
                  │ persist all messages
           ┌──────▼──────┐
           │    Kafka    │◄── Message queue for offline users
           │  (durable   │    Consumer reads on user reconnect
           │   log)      │    Guarantees no message loss
           └──────┬──────┘
                  │
           ┌──────▼──────┐
           │ PostgreSQL  │◄── Message history, user accounts
           │ (message    │    Read receipts, conversation metadata
           │  history)   │
           └─────────────┘`,
      decisions: [
        {
          title: 'Redis Adapter for Multi-Instance Socket.IO',
          reasoning: 'Socket.IO has a Redis adapter that turns the in-memory event bus into a shared pub/sub channel. When any server emits to a room, Redis broadcasts it and all servers receive it. The server with the active WebSocket connection delivers it. This is how you horizontally scale stateful WebSocket servers.',
        },
        {
          title: 'Kafka over Redis Streams for Message Persistence',
          reasoning: 'Redis pub/sub is fire-and-forget — if a subscriber is offline, the message is lost. Kafka is a durable log. Messages are stored until consumed. Offline users have a consumer group that reads their backlog on reconnect. Kafka also gives us message replay for debugging.',
        },
        {
          title: 'Delivery Receipts via Acknowledgment',
          reasoning: 'sent = saved to Kafka. delivered = recipient\'s WebSocket receives it and sends ack. read = recipient opens conversation and sends read event. Each state change is a database write. This is exactly how WhatsApp\'s tick system works.',
        },
      ],
      challenges: [
        {
          problem: 'Presence system accuracy across instances',
          solution: 'Each WebSocket connection sets a Redis key with TTL (userId:presence = "online", TTL 30s). Clients send heartbeats every 25s to refresh TTL. If a server crashes, keys expire naturally. Presence reads from Redis, not from individual servers.',
        },
        {
          problem: 'Message ordering guarantees',
          solution: 'Kafka partitions by conversationId. All messages in a conversation go to the same partition → guaranteed ordering within a conversation. Cross-conversation ordering is unnecessary.',
        },
      ],
      whatILearned: [
        'WebSockets are stateful — horizontal scaling requires shared state layer',
        'Pub/sub (real-time) and message queues (durability) solve different problems',
        'Presence at scale is an eventually-consistent approximation, not a fact',
        'Message ordering is a partition key design problem in Kafka',
        'Every real-time system is really a distributed state synchronization problem',
      ],
      scalingThoughts: 'This architecture scales to millions of connections: add WebSocket servers (stateless via Redis adapter), Kafka scales horizontally by partition, Redis Cluster for high-availability pub/sub, PostgreSQL read replicas for message history queries. This is the actual WhatsApp architecture, simplified.',
    },
  },
];

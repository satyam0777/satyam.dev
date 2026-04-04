const mongoose = require('mongoose');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
require('dotenv').config();

const INITIAL_PROJECTS = [
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
    liveUrl: 'https://vetcare.example.com',
    highlights: [
      '50+ RESTful APIs with JWT auth and role-based authorization',
      '12 MongoDB schemas with compound indexing — queries dropped from 4.5s to 50ms',
      'Razorpay with HMAC webhook verification + 18% automated commission model',
      'Socket.IO real-time notifications across farmer/vet/admin roles',
      'Agora RTC WebRTC video calling integration',
      'Deployed on Vercel + Render with CI/CD — 99.9% uptime',
    ],
    architecture: {
      overview: 'Three-role system (Farmer, Vet, Admin) with separate API surfaces for each.',
      intuition: 'The hardest design question was: when should payment be released to the vet?',
      diagram: 'Architecture diagram here',
      decisions: [
        {
          title: 'Compound Indexes on Appointment Queries',
          reasoning: 'Queries filtered by vetId + date + status were running collection scans at 4.5s.',
        },
      ],
      challenges: [
        {
          problem: 'Video calls dropping on poor rural internet connections',
          solution: 'Agora RTC handles adaptive bitrate by default.',
        },
      ],
      whatILearned: ['Webhook idempotency is non-negotiable in payment systems'],
      scalingThoughts: 'At scale, Socket.IO would need Redis adapter.',
    },
  },
];

const INITIAL_BLOGS = [
  {
    id: '1',
    title: 'What I actually learned when I stopped using callbacks',
    slug: 'event-loop-async-await',
    tag: 'Node.js · Internals',
    excerpt: 'How switching to async/await forced me to understand the event loop — not just use it.',
    content: '# Event Loop Deep Dive\n\nContent here.',
    publishedAt: '2025-04-01',
    readTime: 5,
    published: true,
  },
  {
    id: '2',
    title: 'What I got wrong about MongoDB indexing',
    slug: 'mongodb-indexing-lessons',
    tag: 'Databases · Indexing',
    excerpt: 'A slow query on a small dataset taught me more than any course.',
    content: '# MongoDB Indexing\n\nContent here.',
    publishedAt: '2025-04-05',
    readTime: 6,
    published: true,
  },
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/satyam-portfolio';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('\n✓ Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Blog.deleteMany({});
    console.log('✓ Cleared existing data');

    // Insert initial data
    await Project.insertMany(INITIAL_PROJECTS);
    console.log(`✓ Seeded ${INITIAL_PROJECTS.length} projects`);

    await Blog.insertMany(INITIAL_BLOGS);
    console.log(`✓ Seeded ${INITIAL_BLOGS.length} blogs`);

    console.log('\n✅ Seed completed successfully\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message, '\n');
    process.exit(1);
  }
};

seed();

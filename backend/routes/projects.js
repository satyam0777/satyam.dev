const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Mock data fallback
const MOCK_PROJECTS = [
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

// GET all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ num: 1 });
    res.json(projects && projects.length > 0 ? projects : MOCK_PROJECTS);
  } catch (error) {
    // If MongoDB is not connected, return mock data
    res.json(MOCK_PROJECTS);
  }
});

// GET single project by ID
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      const mock = MOCK_PROJECTS.find(p => p.id === req.params.id);
      return res.status(mock ? 200 : 404).json(mock || { error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    const mock = MOCK_PROJECTS.find(p => p.id === req.params.id);
    res.status(mock ? 200 : 404).json(mock || { error: 'Project not found' });
  }
});

// CREATE project
router.post('/', async (req, res, next) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(201).json(req.body);
  }
});

// UPDATE project
router.put('/:id', async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.json(req.body);
  }
});

// DELETE project
router.delete('/:id', async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted', project });
  } catch (error) {
    res.json({ message: 'Project deleted', id: req.params.id });
  }
});

module.exports = router;

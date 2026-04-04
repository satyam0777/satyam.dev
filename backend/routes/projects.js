const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const adminRoute = require('./admin');

// Validation helper
const validateProject = (data) => {
  const errors = [];
  if (!data.id || typeof data.id !== 'string' || data.id.trim().length === 0) errors.push('id is required and must be a non-empty string');
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) errors.push('name is required and must be a non-empty string');
  if (!data.type || !['fullstack', 'backend', 'planned'].includes(data.type)) errors.push('type must be one of: fullstack, backend, planned');
  if (!data.status || !['live', 'building', 'planned'].includes(data.status)) errors.push('status must be one of: live, building, planned');
  if (data.stack && !Array.isArray(data.stack)) errors.push('stack must be an array');
  if (data.description && typeof data.description !== 'string') errors.push('description must be a string');
  if (data.highlights && !Array.isArray(data.highlights)) errors.push('highlights must be an array');
  return errors;
};

// Auth middleware - use the same token validation as admin
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('❌ [AUTH] No token provided for', req.method, req.path);
    return res.status(401).json({ error: 'Unauthorized: No token' });
  }
  
  const isValid = adminRoute.hasToken(token);
  console.log('🔐 [AUTH] Token validation:', isValid ? '✅ VALID' : '❌ INVALID', 'Token:', token.substring(0, 10) + '...');
  
  if (!isValid) {
    console.log('❌ [AUTH] Invalid token:', token);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  
  req.admin = true;
  next();
};

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
    description: 'Production telemedicine platform connecting farmers with veterinary doctors.',
    githubUrl: 'https://github.com/satyam0777',
    liveUrl: 'https://vetcare.example.com',
    highlights: [
      '50+ RESTful APIs with JWT auth',
      '12 MongoDB schemas with compound indexing',
      'Razorpay integration with webhook verification',
      'Socket.IO real-time notifications',
      'Agora RTC WebRTC video calling',
      'Deployed on Vercel + Render with CI/CD',
    ],
    architecture: {
      overview: 'Three-role system (Farmer, Vet, Admin) with separate API surfaces for each.',
      intuition: 'The hardest design question was: when should payment be released to the vet?',
      diagram: 'Architecture diagram here',
      decisions: [
        { title: 'Compound Indexes on Appointment Queries', reasoning: 'Queries filtered by vetId + date + status were running at 4.5s.' },
      ],
      challenges: [
        { problem: 'Video calls dropping on poor connections', solution: 'Agora RTC handles adaptive bitrate.' },
      ],
      whatILearned: ['Webhook idempotency is non-negotiable'],
      scalingThoughts: 'At scale, Socket.IO would need Redis adapter.',
    },
  },
];

// GET all projects (public)
router.get('/', async (req, res, next) => {
  try {
    console.log('📖 [GET /projects] Fetching all projects from database');
    const projects = await Project.find().sort({ num: 1 });
    console.log(`✅ Found ${projects.length} projects in database`);
    res.json(projects);  // Return actual database data, NOT mock data
  } catch (error) {
    console.log('❌ Error fetching projects:', error.message);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// GET single project by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    console.log('📖 [GET /projects/:id] Fetching project:', req.params.id);
    const project = await Project.findOne({ id: req.params.id });
    
    if (!project) {
      console.log('❌ Project not found in database:', req.params.id);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('✅ Found project:', project.id, project.name);
    res.json(project);
  } catch (error) {
    console.log('❌ Error fetching project:', error.message);
    res.status(500).json({ error: 'Error fetching project' });
  }
});

// CREATE project (admin only)
router.post('/', requireAuth, async (req, res, next) => {
  console.log('\n📝 [POST /projects] Creating project:', req.body.name);
  
  const errors = validateProject(req.body);
  if (errors.length > 0) {
    console.log('❌ Validation errors:', errors);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    console.log('✅ Project saved to DB:', saved.id, saved.name);
    res.status(201).json(saved);
  } catch (error) {
    console.log('❌ Error saving project:', error.message);
    res.status(400).json({ error: 'Failed to create project', details: error.message });
  }
});

// UPDATE project (admin only)
router.put('/:id', requireAuth, async (req, res, next) => {
  const errors = validateProject(req.body);
  if (errors.length > 0) return res.status(400).json({ error: 'Validation failed', details: errors });
  
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update project', details: error.message });
  }
});

// DELETE project (admin only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  console.log('\n🗑️  [DELETE /projects/:id] Deleting project:', req.params.id);
  
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    
    if (!project) {
      console.log('❌ Project not found:', req.params.id);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('✅ Project deleted from DB:', project.id, project.name);
    res.json({ message: 'Project deleted', project });
  } catch (error) {
    console.log('❌ Error deleting project:', error.message);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;

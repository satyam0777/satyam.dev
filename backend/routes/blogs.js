const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const adminRoute = require('./admin');

// Validation helper
const validateBlog = (data) => {
  const errors = [];
  if (!data.id || typeof data.id !== 'string' || data.id.trim().length === 0) errors.push('id is required');
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) errors.push('title is required');
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) errors.push('slug is required');
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) errors.push('content is required');
  if (typeof data.published !== 'boolean') errors.push('published must be a boolean');
  if (typeof data.readTime !== 'number' || data.readTime < 1) errors.push('readTime must be a positive number');
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
const MOCK_BLOGS = [
  {
    id: '1',
    title: 'What I actually learned when I stopped using callbacks',
    slug: 'event-loop-async-await',
    tag: 'Node.js · Internals',
    excerpt: 'How switching to async/await forced me to understand the event loop — not just use it.',
    content: '# Event Loop Deep Dive\n\nWhen I switched to async/await, something clicked about the event loop.',
    publishedAt: '2025-04-01',
    readTime: 5,
    published: true,
  },
  {
    id: '2',
    title: 'What I got wrong about MongoDB indexing (and how I found out)',
    slug: 'mongodb-indexing-lessons',
    tag: 'Databases · Indexing',
    excerpt: 'A slow query on a small dataset taught me more about indexes than any course.',
    content: '# MongoDB Indexing\n\nMy VetCare platform had a query taking 4.5 seconds on 10k documents.',
    publishedAt: '2025-04-05',
    readTime: 6,
    published: true,
  },
  {
    id: '3',
    title: 'How I added rate limiting to my Express API from scratch',
    slug: 'rate-limiting-express',
    tag: 'API Design · Security',
    excerpt: 'Walking through sliding window vs fixed window — and why the choice actually matters.',
    content: '# Rate Limiting\n\nAfter shipping my platform, I realized anyone could hammer the API.',
    publishedAt: '2025-04-10',
    readTime: 7,
    published: true,
  },
];

// GET all blogs (public)
router.get('/', async (req, res, next) => {
  try {
    console.log('📖 [GET /blogs] Fetching all blogs from database');
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    console.log(`✅ Found ${blogs.length} blogs in database`);
    res.json(blogs);  // Return actual database data, NOT mock data
  } catch (error) {
    console.log('❌ Error fetching blogs:', error.message);
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

// GET single blog by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    console.log('📖 [GET /blogs/:id] Fetching blog:', req.params.id);
    const blog = await Blog.findOne({ id: req.params.id });
    
    if (!blog) {
      console.log('❌ Blog not found in database:', req.params.id);
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    console.log('✅ Found blog:', blog.id, blog.title);
    res.json(blog);
  } catch (error) {
    console.log('❌ Error fetching blog:', error.message);
    res.status(500).json({ error: 'Error fetching blog' });
  }
});

// CREATE blog (admin only)
router.post('/', requireAuth, async (req, res, next) => {
  console.log('\n📝 [POST /blogs] Creating blog:', req.body.title);
  
  const errors = validateBlog(req.body);
  if (errors.length > 0) {
    console.log('❌ Validation errors:', errors);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  
  try {
    const blog = new Blog(req.body);
    const saved = await blog.save();
    console.log('✅ Blog saved to DB:', saved.id, saved.title);
    res.status(201).json(saved);
  } catch (error) {
    console.log('❌ Error saving blog:', error.message);
    res.status(400).json({ error: 'Failed to create blog', details: error.message });
  }
});

// UPDATE blog (admin only)
router.put('/:id', requireAuth, async (req, res, next) => {
  const errors = validateBlog(req.body);
  if (errors.length > 0) return res.status(400).json({ error: 'Validation failed', details: errors });
  
  try {
    const blog = await Blog.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update blog', details: error.message });
  }
});

// DELETE blog (admin only)
router.delete('/:id', requireAuth, async (req, res, next) => {
  console.log('\n🗑️  [DELETE /blogs/:id] Deleting blog:', req.params.id);
  
  try {
    const blog = await Blog.findOneAndDelete({ id: req.params.id });
    
    if (!blog) {
      console.log('❌ Blog not found:', req.params.id);
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    console.log('✅ Blog deleted from DB:', blog.id, blog.title);
    res.json({ message: 'Blog deleted', blog });
  } catch (error) {
    console.log('❌ Error deleting blog:', error.message);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;

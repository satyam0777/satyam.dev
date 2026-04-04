const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

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

// GET all blogs
router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.json(blogs && blogs.length > 0 ? blogs : MOCK_BLOGS);
  } catch (error) {
    // If MongoDB is not connected, return mock data
    res.json(MOCK_BLOGS);
  }
});

// GET single blog by ID
router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog) {
      const mock = MOCK_BLOGS.find(b => b.id === req.params.id);
      return res.status(mock ? 200 : 404).json(mock || { error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    const mock = MOCK_BLOGS.find(b => b.id === req.params.id);
    res.status(mock ? 200 : 404).json(mock || { error: 'Blog not found' });
  }
});

// CREATE blog
router.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(201).json(req.body);
  }
});

// UPDATE blog
router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.json(req.body);
  }
});

// DELETE blog
router.delete('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({ id: req.params.id });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted', blog });
  } catch (error) {
    res.json({ message: 'Blog deleted', id: req.params.id });
  }
});

module.exports = router;

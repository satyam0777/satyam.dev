import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  content: string; // markdown
  coverImage?: string;
  publishedAt: string;
  readTime: number;
  published: boolean;
}

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'What I actually learned when I stopped using callbacks',
    slug: 'event-loop-async-await',
    tag: 'Node.js · Internals',
    excerpt: 'How switching to async/await forced me to understand the event loop — not just use it.',
    content: `# What I actually learned when I stopped using callbacks

When I first started writing Node.js, callbacks were just the way things worked. I copied the pattern, it ran, I moved on.

Then I switched to async/await and something clicked — but not the syntax. The **event loop**.

## The Problem With Copying Patterns

Here's the callback version I used to write:

\`\`\`javascript
fs.readFile('data.json', 'utf8', function(err, data) {
  if (err) throw err;
  JSON.parse(data); // synchronous. blocks. I had no idea.
});
\`\`\`

I didn't understand that the callback itself ran on the **main thread**. I thought Node.js was just... magically async everywhere.

## What async/await actually exposed

When I rewrote the same thing:

\`\`\`javascript
async function readData() {
  const data = await fs.promises.readFile('data.json', 'utf8');
  return JSON.parse(data);
}
\`\`\`

I started asking: *what does await actually do?*

The answer changed how I think about Node.js entirely.

> await pauses the function — not the thread. The event loop keeps spinning. Other work happens. Then your function resumes.

## The mental model that finally worked

Think of Node.js as a chef who never stands and waits for water to boil. He starts boiling, goes and chops vegetables, comes back when the timer fires.

That timer firing is the event loop calling back into your suspended async function.

## The practical consequence

This means CPU-heavy synchronous work — even inside an async function — **blocks everything**:

\`\`\`javascript
async function parseHugeFile() {
  const data = await fs.promises.readFile('huge.json', 'utf8');
  const parsed = JSON.parse(data); // <-- this is synchronous. 500ms. Blocks all users.
  return parsed;
}
\`\`\`

The fix? Worker threads. Or streaming. Or chunking.

## What I'd tell my earlier self

Stop copying patterns. Stop when something works and ask *why* it works. The event loop is not magic — it's a queue and a call stack and a few well-defined rules. Once you see it, you can't unsee it.
`,
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
    content: `# What I got wrong about MongoDB indexing

My VetCare platform had a query taking **4.5 seconds**. The dataset had ~10,000 documents. That made no sense to me — it was small.

Then I learned what I'd been doing wrong.

## The wrong mental model

I thought: *indexes are for big datasets. I have 10k records, I don't need them yet.*

Wrong. **Indexes are about query patterns, not data size.** A collection scan on 10k documents doing a regex match on an unindexed string field is slow regardless of dataset size.

## What my query looked like

\`\`\`javascript
// Finding appointments for a specific vet + date range
db.appointments.find({
  vetId: ObjectId("..."),
  date: { $gte: startDate, $lte: endDate },
  status: "confirmed"
});
\`\`\`

No index. MongoDB scanned every document. Every time.

## The fix: compound index with field order

\`\`\`javascript
db.appointments.createIndex({ 
  vetId: 1, 
  date: 1, 
  status: 1 
});
\`\`\`

Field order **matters**. The rule: equality fields first, range fields second, sort fields last. This is called the ESR rule.

Result: query went from **4.5s → 50ms**.

## What I'd missed about explain()

MongoDB has a query planner. I'd never used it:

\`\`\`javascript
db.appointments.find({...}).explain("executionStats")
// COLLSCAN = no index. bad.
// IXSCAN  = using index. good.
\`\`\`

Now I run explain() on every non-trivial query before shipping.

## The compound indexing rules I now follow

1. Put the highest-selectivity field first (most unique values)
2. Range queries go after equality filters
3. Don't index fields you don't query
4. Each write pays the cost of updating every index

Indexes are a trade-off. More indexes = faster reads, slower writes. Now I choose deliberately.
`,
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
    content: `# How I added rate limiting to my Express API from scratch

After shipping the StudyHelper AI platform, I realized I had a problem: anyone could hammer the OpenAI endpoint and blow through my API credits in minutes.

I needed rate limiting. Here's how I thought through it.

## Fixed Window — the naive approach

\`\`\`javascript
const requests = {};

function rateLimiter(req, res, next) {
  const key = req.ip;
  const now = Date.now();
  const windowStart = Math.floor(now / 60000) * 60000; // 1-min window

  if (!requests[key] || requests[key].windowStart !== windowStart) {
    requests[key] = { count: 1, windowStart };
  } else {
    requests[key].count++;
  }

  if (requests[key].count > 10) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
}
\`\`\`

The problem: a user can send 10 requests at 12:00:59 and 10 more at 12:01:01. That's 20 requests in 2 seconds — double the limit.

## Sliding Window — what I actually implemented

Instead of fixed buckets, track *when* each request came in:

\`\`\`javascript
const userRequests = new Map();

function slidingWindowLimiter(limit, windowMs) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    const timestamps = userRequests.get(key) || [];
    const valid = timestamps.filter(t => t > windowStart);

    if (valid.length >= limit) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((valid[0] + windowMs - now) / 1000)
      });
    }

    valid.push(now);
    userRequests.set(key, valid);
    next();
  };
}
\`\`\`

## Using Redis in production

In-memory maps don't work across multiple server instances. For production I moved to Redis:

\`\`\`javascript
async function redisRateLimiter(req, res, next) {
  const key = \`rl:\${req.ip}\`;
  const now = Date.now();
  const window = 60000;

  await redis.zremrangebyscore(key, 0, now - window);
  const count = await redis.zcard(key);

  if (count >= 10) return res.status(429).json({ error: 'Too many requests' });

  await redis.zadd(key, now, now.toString());
  await redis.expire(key, 60);
  next();
}
\`\`\`

Redis sorted sets are perfect for this: score = timestamp, member = unique request ID.

## What I learned

Rate limiting teaches you to think about **state and distribution**. In-memory works on one server. Redis works across a fleet. The question is always: where does the shared state live?
`,
    publishedAt: '2025-04-10',
    readTime: 7,
    published: true,
  },
];

export interface BlogContextType {
  blogs: BlogPost[];
  addBlog: (blog: BlogPost) => Promise<void>;
  updateBlog: (blog: BlogPost) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

const BlogContext = createContext<BlogContextType>({
  blogs: INITIAL_BLOGS,
  addBlog: async () => {},
  updateBlog: async () => {},
  deleteBlog: async () => {},
  loading: false,
  error: null,
});

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data || INITIAL_BLOGS);
        localStorage.setItem('sp-blogs', JSON.stringify(data || INITIAL_BLOGS));
        setError(null);
      } catch (err) {
        console.warn('API unavailable, using localStorage:', err);
        try {
          const saved = localStorage.getItem('sp-blogs');
          setBlogs(saved ? JSON.parse(saved) : INITIAL_BLOGS);
        } catch {
          setBlogs(INITIAL_BLOGS);
        }
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const addBlog = async (blog: BlogPost) => {
    try {
      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });
      if (!response.ok) throw new Error('Failed to add blog');
      const newBlog = await response.json();
      const updated = [...blogs, newBlog];
      setBlogs(updated);
      localStorage.setItem('sp-blogs', JSON.stringify(updated));
    } catch (err) {
      const updated = [...blogs, blog];
      setBlogs(updated);
      localStorage.setItem('sp-blogs', JSON.stringify(updated));
      console.error('Error adding blog:', err);
    }
  };

  const updateBlog = async (blog: BlogPost) => {
    try {
      const response = await fetch(`${API_URL}/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });
      if (!response.ok) throw new Error('Failed to update blog');
      const updated = blogs.map(b => b.id === blog.id ? blog : b);
      setBlogs(updated);
      localStorage.setItem('sp-blogs', JSON.stringify(updated));
    } catch (err) {
      const updated = blogs.map(b => b.id === blog.id ? blog : b);
      setBlogs(updated);
      localStorage.setItem('sp-blogs', JSON.stringify(updated));
      console.error('Error updating blog:', err);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog');
      const updated = blogs.filter(b => b.id !== id);
      setBlogs(updated);
      localStorage.setItem('sp-blogs', JSON.stringify(updated));
    } catch (err) {
      const updated = blogs.filter(b => b.id !== id);
      setBlogs(updated);
      localStorage.setItem('sp-blogs', JSON.stringify(updated));
      console.error('Error deleting blog:', err);
    }
  };

  const value = useMemo(
    () => ({ blogs, addBlog, updateBlog, deleteBlog, loading, error }),
    [blogs, loading, error]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = () => useContext(BlogContext);

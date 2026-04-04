import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useBlog } from '../context/BlogContext';

const BlogPage: React.FC = () => {
  const { blogs } = useBlog();
  const published = blogs.filter(b => b.published);

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>05 — Blog</div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Things I've figured out</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7, marginBottom: '3rem' }}>
          Not tutorials. Actual writeups of things I debugged, misunderstood, or learned the hard way.
        </p>

        {published.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            No posts yet. Check back soon.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {published.map(b => (
              <Link key={b.id} to={`/blog/${b.slug}`} style={{
                display: 'block', background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '1.75rem', textDecoration: 'none', transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>{b.tag}</div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.6rem' }}>{b.title}</h2>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 580 }}>{b.excerpt}</p>
                    <div style={{ display: 'flex', gap: 12, marginTop: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>{b.publishedAt}</span>
                      <span>·</span>
                      <span>{b.readTime} min read</span>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 4 }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;

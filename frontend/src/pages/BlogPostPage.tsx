import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../context/ThemeContext';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogs, refreshBlogs, loading } = useBlog();
  const { theme } = useTheme();

  // Refresh data when page mounts
  useEffect(() => {
    refreshBlogs();
  }, []);

  const post = blogs.find(b => b.slug === slug && b.published);

  // Show loading state while fetching, only redirect if loaded and post not found
  if (loading) return <div style={{ paddingTop: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!post) return <Navigate to="/blog" replace />;

  const idx = blogs.filter(b => b.published).findIndex(b => b.slug === slug);
  const allPublished = blogs.filter(b => b.published);
  const prev = allPublished[idx - 1];
  const next = allPublished[idx + 1];

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
        {/* Back */}
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          <ArrowLeft size={12} /> All Posts
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{post.tag}</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>{post.title}</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: 580 }}>{post.excerpt}</p>
          <div style={{ display: 'flex', gap: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>
            <span>Satyam Prajapati</span>
            <span>·</span>
            <span>{post.publishedAt}</span>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div style={{ marginBottom: '2rem', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={post.coverImage} alt={post.title} style={{ width: '100%', display: 'block' }} />
          </div>
        )}

        {/* Content */}
        <div style={{ maxWidth: 700 }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem', marginTop: '2rem', color: 'var(--text-primary)' }}>{children}</h1>,
              h2: ({ children }) => <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '0.75rem', marginTop: '2rem', color: 'var(--text-primary)' }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)' }}>{children}</h3>,
              p: ({ children }) => <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '1.25rem' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{children}</strong>,
              em: ({ children }) => <em style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>{children}</em>,
              blockquote: ({ children }) => (
                <blockquote style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem', margin: '1.5rem 0', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{children}</ol>,
              li: ({ children }) => <li style={{ marginBottom: '0.3rem', fontSize: 15 }}>{children}</li>,
              code: ({ className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const inline = !match;
                return inline ? (
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85em', background: 'var(--accent-dim)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 3 }} {...props}>
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={theme === 'dark' ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ borderRadius: 8, fontSize: 13, margin: '1.25rem 0', border: '1px solid var(--border)' }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
              hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          {prev ? (
            <Link to={`/blog/${prev.slug}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>← Previous</span>
              <span>{prev.title.substring(0, 40)}...</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link to={`/blog/${next.slug}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Next →</span>
              <span>{next.title.substring(0, 40)}...</span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;

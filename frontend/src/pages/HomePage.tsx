import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, Mail, ExternalLink, Database, Zap, BookOpen, Terminal, Download, Link2, Share2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useBlog } from '../context/BlogContext';
import { Tag, StatusBadge, SectionLabel } from '../components/UI';

const HomePage: React.FC = () => {
  const { projects, refreshProjects } = useProject();
  const { blogs, refreshBlogs } = useBlog();

  // Refresh data when page mounts
  useEffect(() => {
    refreshProjects();
    refreshBlogs();
  }, []);

  const featuredProjects = projects.slice(0, 3);
  const publishedBlogs = blogs.filter(b => b.published).slice(0, 4);

  const skills = [
    { group: 'Languages', items: ['JavaScript', 'TypeScript', 'C++', 'SQL'] },
    { group: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'Prisma ORM', 'Socket.IO'] },
    { group: 'Databases', items: ['MongoDB', 'PostgreSQL', 'Redis', 'Cassandra*', 'Neo4j*'] },
    { group: 'Infrastructure', items: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'Vercel', 'Render'] },
    { group: 'APIs & SDKs', items: ['Razorpay', 'Agora.io', 'OpenAI', 'Gemini', 'JWT'] },
    { group: 'Currently Learning', items: ['System Design', 'Kafka', 'Microservices', 'WebSockets at scale'] },
  ];

  return (
    <div style={{ paddingTop: 60 }}>

      {/* HERO */}
      <section style={{ padding: '6rem 0 4rem', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="fade-up" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 1, background: 'var(--accent)', display: 'block' }} />
            Backend Engineer · India
          </div>

          <h1 className="fade-up delay-1" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            Satyam<br /><span style={{ color: 'var(--accent)' }}>Prajapati</span>
          </h1>

          <div className="fade-up delay-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--accent)' }}>&gt;_</span> Full Stack → Backend Specialist · Learning from first principles
          </div>

         <p className="fade-up delay-3" style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Built <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>real-world applications</strong> integrating payments, real-time communication, and AI APIs.
         Now focused on <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>databases, distributed systems, and real-time infrastructure</strong>.
         One goal: understand how things <em>actually</em> work at scale.
      </p>

          <div className="fade-up delay-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '11px 22px', background: 'var(--accent)', color: '#000', fontWeight: 600, borderRadius: 6, letterSpacing: '0.04em' }}>
              View Projects <ArrowRight size={14} />
            </Link>
            <a href="https://github.com/satyam0777" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '10px 22px', border: '1px solid var(--border-bright)', color: 'var(--text-secondary)', borderRadius: 6 }}>
              <GitBranch size={14} /> GitHub
            </a>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '10px 22px', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 6 }}>
              <Mail size={14} /> Contact
            </Link>
          </div>


        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionLabel num="01" label="About" />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '2rem' }}>
            The person behind the code
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }} className="about-grid">
            <div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Hey, I'm <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Satyam</strong> from India. I started with the MERN stack and built real production apps — telemedicine platforms, AI tools, knowledge bases. But what kept me hooked was the backend: how data moves, how services scale, how systems stay up.
              </p>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                I'm now going deep on <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>databases, distributed systems, and real-time communication</strong> — not just using them, but understanding the decisions that shaped them.
              </p>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                Every project here comes with architecture decisions and the reasoning behind them. Because the best engineers can explain what they built and <em>why</em>.
              </p>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Contact & Links</div>
              {[
                { icon: <Mail size={14} />, label: 'officialsatyam0777@gmail.com', href: 'mailto:officialsatyam0777@gmail.com' },
                { icon: <GitBranch size={14} />, label: 'github.com/satyam0777', href: 'https://github.com/satyam0777' },
                { icon: <Link2 size={14} />, label: 'LinkedIn Profile', href: 'https://www.linkedin.com/in/satyam-prajapati-13a690256/' },
                { icon: <Share2 size={14} />, label: 'Twitter / X', href: 'https://x.com/Satyam9352' },
                { icon: <Terminal size={14} />, label: '+91 7985792091', href: 'tel:+917985792091' },
                { icon: <BookOpen size={14} />, label: 'LeetCode: Problems', href: 'https://leetcode.com/u/satyam0777/' },
                { icon: <Download size={14} />, label: 'Download Resume', href: '/resume.pdf', download: true },
              ].map(item => (
                <a key={item.label} href={item.href} target={(item as any).download ? undefined : item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" download={(item as any).download} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13, transition: 'color 0.15s' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                  {item.href.startsWith('http') && <ExternalLink size={10} style={{ marginLeft: 'auto', opacity: 0.4 }} />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionLabel num="02" label="Skills" />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>What I actually know</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: '2rem' }}>* = currently learning in depth</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {skills.map(sg => (
              <div key={sg.group} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{sg.group}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {sg.items.map(i => <Tag key={i}>{i}</Tag>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionLabel num="03" label="Projects" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Things I've built</h2>
            <Link to="/projects" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
              All {projects.length} projects <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {featuredProjects.map((p) => (
              <div key={p.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.75rem', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>{p.num}</span>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 700 }}>{p.name}</h3>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '2px 8px', background: p.type === 'backend' ? 'var(--accent-dim)' : 'var(--bg-surface2)', color: p.type === 'backend' ? 'var(--accent)' : 'var(--text-muted)', borderRadius: 4 }}>{p.type}</span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem', maxWidth: 620 }}>{p.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                  {p.stack.slice(0, 6).map(s => <Tag key={s}>{s}</Tag>)}
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to={`/projects/${p.id}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Architecture & Details <ArrowRight size={12} />
                  </Link>
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <GitBranch size={12} /> GitHub
                  </a>
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING NOW */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionLabel num="04" label="Learning" />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>What I'm learning right now</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: '2rem' }}>Transparent progress. Updated as I go deeper.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { icon: <Database size={18} />, topic: 'Polyglot Databases', sub: 'Postgres · Mongo · Redis · Cassandra · Neo4j', pct: 35 },
              { icon: <Zap size={18} />, topic: 'Real-Time at Scale', sub: 'WebSockets · Kafka · Redis Pub/Sub', pct: 25 },
              { icon: <Terminal size={18} />, topic: 'Docker & Containers', sub: 'Docker Compose · Multi-container apps', pct: 55 },
              { icon: <BookOpen size={18} />, topic: 'System Design', sub: 'CAP theorem · Consistency · Availability', pct: 30 },
            ].map(item => (
              <div key={item.topic} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem' }}>
                <div style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '0.25rem' }}>{item.topic}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', marginBottom: '1rem' }}>{item.sub}</div>
                <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>{item.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionLabel num="05" label="Blog" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Things I've figured out</h2>
            <Link to="/blog" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              All posts <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {publishedBlogs.map(b => (
              <Link key={b.id} to={`/blog/${b.slug}`} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.5rem', display: 'block', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--accent)', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>{b.tag}</div>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: '0.6rem', fontFamily: "'Syne', sans-serif" }}>{b.title}</div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{b.excerpt}</p>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', marginTop: '1rem', display: 'flex', gap: 12 }}>
                  <span>{b.publishedAt}</span>
                  <span>{b.readTime} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>
            © 2025 <span style={{ color: 'var(--accent)' }}>Satyam Prajapati</span> · Built while learning, shipped with intent.
          </div>
          <a href="https://github.com/satyam0777" target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <GitBranch size={13} /> github.com/satyam0777
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

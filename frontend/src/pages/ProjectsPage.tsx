import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '3px 10px', background: 'var(--tag-bg)', color: 'var(--tag-color)', borderRadius: 4 }}>{children}</span>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    live:     { bg: 'rgba(0,200,100,0.1)',   color: '#00c864', label: '● Live' },
    building: { bg: 'rgba(255,165,0,0.1)',   color: '#ffa500', label: '⚡ Building' },
    planned:  { bg: 'rgba(100,100,255,0.1)', color: '#8888ff', label: '◦ Planned' },
  };
  const c = map[status] || map.planned;
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '3px 10px', background: c.bg, color: c.color, borderRadius: 4, letterSpacing: '0.06em' }}>{c.label}</span>;
};

type Filter = 'all' | 'fullstack' | 'backend';

const ProjectsPage: React.FC = () => {
  const { projects } = useProject();
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = filter === 'all' ? projects : projects.filter(p => p.type === filter);

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>03 — Projects</div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Everything I've built</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Each project targets a specific engineering concept. Architecture decisions and intuition documented for every one.
        </p>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
          {(['all', 'fullstack', 'backend'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              padding: '6px 16px', borderRadius: 6, cursor: 'pointer',
              background: filter === f ? 'var(--accent)' : 'transparent',
              color: filter === f ? '#000' : 'var(--text-secondary)',
              border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
              letterSpacing: '0.06em', fontWeight: filter === f ? 600 : 400,
              transition: 'all 0.15s',
            }}>{f === 'all' ? `All (${projects.length})` : f === 'fullstack' ? 'Full Stack' : 'Backend / OSS'}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map(p => (
            <div key={p.id} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '2rem', position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>

              {/* accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: p.type === 'backend' ? 'var(--accent)' : 'var(--border)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>{p.num}</span>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.35rem', fontWeight: 700 }}>{p.name}</h2>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '2px 8px', background: p.type === 'backend' ? 'var(--accent-dim)' : 'var(--bg-surface2)', color: p.type === 'backend' ? 'var(--accent)' : 'var(--text-muted)', borderRadius: 4 }}>
                    {p.type}
                  </span>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>{p.tagline}</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: 680 }}>{p.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
                {p.stack.map(s => <Tag key={s}>{s}</Tag>)}
              </div>

              <ul style={{ listStyle: 'none', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {p.highlights.slice(0, 3).map(h => (
                  <li key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>{h}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to={`/projects/${p.id}`} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  padding: '8px 18px', background: 'var(--accent)', color: '#000',
                  borderRadius: 5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  Architecture & Details <ArrowRight size={12} />
                </Link>
                <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GitBranch size={12} /> GitHub
                </a>
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

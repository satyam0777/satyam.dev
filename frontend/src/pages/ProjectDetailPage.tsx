import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, GitBranch, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Tag, Section } from '../components/UI';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, refreshProjects } = useProject();
  const [expandedDecision, setExpandedDecision] = useState<number | null>(null);

  // Refresh data when page mounts
  useEffect(() => {
    refreshProjects();
  }, []);

  const project = projects.find(p => p.id === id);

  if (!project) return <Navigate to="/projects" replace />;

  const { architecture: arch } = project;
  const currentIdx = projects.findIndex(p => p.id === id);
  const nextProject = projects[currentIdx + 1];
  const prevProject = projects[currentIdx - 1];

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '3rem 2rem 5rem' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2.5rem' }}>
          <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>
            <ArrowLeft size={12} /> Projects
          </Link>
          <span style={{ color: 'var(--border-bright)' }}>/</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-secondary)' }}>{project.name}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>{project.num}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '2px 8px', background: 'var(--accent-dim)', color: 'var(--accent)', borderRadius: 4 }}>{project.type}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '2px 8px', background: project.status === 'live' ? 'rgba(0,200,100,0.1)' : project.status === 'building' ? 'rgba(255,165,0,0.1)' : 'rgba(100,100,255,0.1)', color: project.status === 'live' ? '#00c864' : project.status === 'building' ? '#ffa500' : '#8888ff', borderRadius: 4 }}>
              {project.status}
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{project.name}</h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{project.tagline}</p>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 680, marginBottom: '1.5rem' }}>{project.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.5rem' }}>
            {project.stack.map(s => <Tag key={s}>{s}</Tag>)}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: '8px 18px', background: 'var(--accent)', color: '#000', borderRadius: 5, fontWeight: 600 }}>
              <GitBranch size={13} /> View on GitHub
            </a>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: '7px 18px', border: '1px solid var(--border-bright)', color: 'var(--text-secondary)', borderRadius: 5 }}>
                <ExternalLink size={12} /> Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Project Details */}
        <Section title="Project Details">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Project #</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{project.num}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Type</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', textTransform: 'capitalize' }}>{project.type}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Status</div>
              <div style={{ fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 4, background: project.status === 'live' ? 'rgba(0,200,100,0.1)' : project.status === 'building' ? 'rgba(255,165,0,0.1)' : 'rgba(100,100,255,0.1)', color: project.status === 'live' ? '#00c864' : project.status === 'building' ? '#ffa500' : '#8888ff' }}>
                {project.status === 'live' ? '●' : project.status === 'building' ? '⚡' : '◦'} {project.status}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>GitHub</div>
              <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', wordBreak: 'break-all' }}>
                {project.githubUrl.replace('https://github.com/', '')}
              </a>
            </div>
            {project.liveUrl && (
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Live Link</div>
                <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', wordBreak: 'break-all' }}>
                  {project.liveUrl.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
          </div>
        </Section>

        {/* Highlights */}
        <Section title="Key Highlights">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {project.highlights.map(h => (
              <li key={h} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace', flexShrink: 0", marginTop: 1 }}>→</span>
                {h}
              </li>
            ))}
          </ul>
        </Section>

        {/* Overview + Intuition */}
        <Section title="System Overview" accent>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{arch.overview}</p>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>THE CORE INTUITION</div>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.75, fontStyle: 'italic' }}>{arch.intuition}</p>
          </div>
        </Section>

        {/* Architecture Diagram */}
        <Section title="Architecture Diagram">
          <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.65, color: 'var(--text-secondary)', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '1.5rem', overflowX: 'auto', whiteSpace: 'pre' }}>
            {arch.diagram}
          </pre>
        </Section>

        {/* Key Decisions */}
        <Section title="Key Engineering Decisions">
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1rem' }}>Click each decision to see the reasoning behind it.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(arch.decisions || []).length > 0 ? (arch.decisions || []).map((d, i) => {
              const decision = typeof d === 'string' ? { title: d.split('|')[0]?.trim() || d, reasoning: d.split('|')[1]?.trim() || '' } : d;
              return (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', background: 'var(--bg-primary)' }}>
                  <button onClick={() => setExpandedDecision(expandedDecision === i ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left' }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{decision.title || 'Decision'}</span>
                    {expandedDecision === i ? <ChevronUp size={14} color="var(--accent)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                  </button>
                  {expandedDecision === i && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginTop: '1rem' }}>{decision.reasoning || 'No reasoning provided'}</p>
                    </div>
                  )}
                </div>
              );
            }) : <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No decisions documented yet.</p>}
          </div>
        </Section>

        {/* Challenges */}
        <Section title="Challenges & Solutions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(arch.challenges || []).length > 0 ? (arch.challenges || []).map((c, i) => {
              const challenge = typeof c === 'string' ? { problem: c.split('|')[0]?.trim() || c, solution: c.split('|')[1]?.trim() || '' } : c;
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="challenge-grid">
                  <div style={{ background: 'rgba(255,60,60,0.05)', border: '1px solid rgba(255,60,60,0.15)', borderRadius: 6, padding: '1rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#ff6060', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>PROBLEM</div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{challenge.problem || 'No problem documented'}</p>
                  </div>
                  <div style={{ background: 'var(--accent-dim)', border: '1px solid rgba(0,255,148,0.15)', borderRadius: 6, padding: '1rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>SOLUTION</div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{challenge.solution || 'No solution documented'}</p>
                  </div>
                </div>
              );
            }) : <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No challenges documented yet.</p>}
          </div>
        </Section>

        {/* What I learned */}
        <Section title="What I Learned">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(arch.whatILearned || []).length > 0 ? (arch.whatILearned || []).map((l, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
                {l}
              </li>
            )) : <li style={{ fontSize: 14, color: 'var(--text-muted)' }}>Nothing learned yet - add some lessons!</li>}
          </ul>
        </Section>

        {/* Scaling thoughts */}
        {arch.scalingThoughts && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '2rem', marginBottom: '3rem' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Scaling Thoughts</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>{arch.scalingThoughts}</p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          {prevProject ? (
            <Link to={`/projects/${prevProject.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>
              <ArrowLeft size={12} /> {prevProject.name}
            </Link>
          ) : <div />}
          {nextProject ? (
            <Link to={`/projects/${nextProject.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent)' }}>
              {nextProject.name} →
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

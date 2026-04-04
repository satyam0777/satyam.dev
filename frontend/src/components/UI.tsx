import React from 'react';

/**
 * Tag Component - Display for tech stack items
 * Used in: HomePage, ProjectsPage, ProjectDetailPage
 */
export const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    padding: '3px 10px',
    background: 'var(--tag-bg)',
    color: 'var(--tag-color)',
    borderRadius: 4,
    letterSpacing: '0.04em'
  }}>
    {children}
  </span>
);

/**
 * StatusBadge Component - Display for project status (Live, Building, Planned)
 * Used in: HomePage, ProjectsPage, ProjectDetailPage
 */
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, { bg: string; color: string; label: string }> = {
    live: { bg: 'rgba(0,200,100,0.1)', color: '#00c864', label: '● Live' },
    building: { bg: 'rgba(255,165,0,0.1)', color: '#ffa500', label: '⚡ Building' },
    planned: { bg: 'rgba(100,100,255,0.1)', color: '#8888ff', label: '◦ Planned' },
  };
  const c = colors[status] || colors.planned;
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10,
      padding: '3px 10px',
      background: c.bg,
      color: c.color,
      borderRadius: 4,
      letterSpacing: '0.06em',
      textTransform: 'uppercase'
    }}>
      {c.label}
    </span>
  );
};

/**
 * SectionLabel Component - Section header with number and label
 * Used in: HomePage
 */
export const SectionLabel: React.FC<{ num: string; label: string }> = ({ num, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.6rem' }}>
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      color: 'var(--accent)',
      letterSpacing: '0.12em'
    }}>
      {num}
    </span>
    <span style={{ height: 1, width: 32, background: 'var(--border-bright)', display: 'block' }} />
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      color: 'var(--text-muted)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }}>
      {label}
    </span>
  </div>
);

/**
 * Section Component - Wrapper with optional accent border
 * Used in: ProjectDetailPage
 */
export const Section: React.FC<{ title: string; children: React.ReactNode; accent?: boolean }> = ({
  title,
  children,
  accent
}) => (
  <div style={{
    background: 'var(--bg-surface)',
    border: `1px solid ${accent ? 'rgba(0,255,148,0.2)' : 'var(--border)'}`,
    borderRadius: 10,
    padding: '2rem',
    marginBottom: '1.25rem'
  }}>
    <h3 style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: '1.1rem',
      fontWeight: 700,
      marginBottom: '1.25rem',
      color: accent ? 'var(--accent)' : 'var(--text-primary)'
    }}>
      {title}
    </h3>
    {children}
  </div>
);

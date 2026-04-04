/* eslint-disable */
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useBlog, BlogPost } from '../../context/BlogContext';
import { useProject, Project } from '../../context/ProjectContext';

const generateId = () => Math.random().toString(36).slice(2, 10);
const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);

// ===== BLOG LIST COMPONENT =====
interface BlogListProps {
  blogs: BlogPost[];
  onEdit: (b: BlogPost) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onTabChange: (tab: 'blog' | 'projects') => void;
}
const BlogList = React.memo(({ blogs, onEdit, onDelete, onNew, onTabChange }: BlogListProps) => (
  <div style={{ paddingTop: 80 }}>
    <div className="container-wide" style={{ padding: '3rem 2rem 5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button onClick={() => onTabChange('blog')} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--accent)', borderBottom: '2px solid var(--accent)', cursor: 'pointer', fontWeight: 600 }}> Blog Manager</button>
        <button onClick={() => onTabChange('projects')} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', borderBottom: 'none', cursor: 'pointer', fontWeight: 400 }}> Project Manager</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>Admin Dashboard</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800 }}>Blog Manager</h1></div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><ArrowLeft size={12} /> Portfolio</Link>
          <button onClick={onNew} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '9px 18px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}><Plus size={14} /> New Blog</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[{ label: 'Total Blogs', num: blogs.length }, { label: 'Published', num: blogs.filter(b => b.published).length }, { label: 'Drafts', num: blogs.filter(b => !b.published).length }].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.num}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {blogs.map(b => (
          <div key={b.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '2px 8px', background: b.published ? 'rgba(0,200,100,0.1)' : 'var(--bg-surface2)', color: b.published ? '#00c864' : 'var(--text-muted)', borderRadius: 4 }}>{b.published ? '● Published' : '◦ Draft'}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)' }}>{b.publishedAt}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: '0.25rem' }}>{b.title || '(Untitled)'}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>/blog/{b.slug}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => onEdit(b)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', background: 'none', cursor: 'pointer' }}><Edit2 size={12} /> Edit</button>
              <button onClick={() => onDelete(b.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '6px 12px', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 5, color: '#ff6060', background: 'none', cursor: 'pointer' }}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

interface ProjectListProps {
  projects: Project[];
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onTabChange: (tab: 'blog' | 'projects') => void;
}
const ProjectList = React.memo(({ projects, onEdit, onDelete, onNew, onTabChange }: ProjectListProps) => (
  <div style={{ paddingTop: 80 }}>
    <div className="container-wide" style={{ padding: '3rem 2rem 5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button onClick={() => onTabChange('blog')} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', borderBottom: 'none', cursor: 'pointer', fontWeight: 400 }}> Blog Manager</button>
        <button onClick={() => onTabChange('projects')} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--accent)', borderBottom: '2px solid var(--accent)', cursor: 'pointer', fontWeight: 600 }}> Project Manager</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>Admin Dashboard</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800 }}>Project Manager</h1></div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><ArrowLeft size={12} /> Portfolio</Link>
          <button onClick={onNew} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '9px 18px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}><Plus size={14} /> New Project</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[{ label: 'Total Projects', num: projects.length }, { label: 'Live', num: projects.filter(p => p.status === 'live').length }, { label: 'Building', num: projects.filter(p => p.status === 'building').length }].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.num}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '2px 8px', background: p.status === 'live' ? 'rgba(0,200,100,0.1)' : p.status === 'building' ? 'rgba(255,165,0,0.1)' : 'rgba(100,100,255,0.1)', color: p.status === 'live' ? '#00c864' : p.status === 'building' ? '#ffa500' : '#8888ff', borderRadius: 4 }}>{p.status === 'live' ? '● Live' : p.status === 'building' ? '⚡ Building' : '◦ Planned'}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)' }}>{p.type}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: '0.25rem' }}>{p.name}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>{p.tagline}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => onEdit(p)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', background: 'none', cursor: 'pointer' }}><Edit2 size={12} /> Edit</button>
              <button onClick={() => onDelete(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '6px 12px', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 5, color: '#ff6060', background: 'none', cursor: 'pointer' }}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

interface BlogEditorProps {
  blog: BlogPost;
  onChange: (blog: BlogPost) => void;
  onSave: (publish: boolean) => void;
  onCancel: () => void;
}
const BlogEditor = React.memo(({ blog, onChange, onSave, onCancel }: BlogEditorProps) => {
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleFieldChange = useCallback((field: string, value: any) => {
    const updates: any = { [field]: value };
    if (field === 'title') updates.slug = generateSlug(value);
    onChange({ ...blog, ...updates });
  }, [blog, onChange]);
  const handleSave = useCallback((publish: boolean) => {
    if (!blog.title.trim()) {
      alert('Blog title cannot be empty');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave(publish);
  }, [blog.title, onSave]);

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container-wide" style={{ padding: '2rem 2rem 5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={12} /> All Blogs</button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-secondary)' }}>{blog.title || 'New Blog'}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={() => setPreview(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', background: 'none', cursor: 'pointer' }}>{preview ? <><EyeOff size={12} /> Edit</> : <><Eye size={12} /> Preview</>}</button>
            <button onClick={() => handleSave(false)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', background: 'none', cursor: 'pointer' }}>Save Draft</button>
            <button onClick={() => handleSave(true)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: '7px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 5, fontWeight: 700, cursor: 'pointer' }}>Publish →</button>
          </div>
        </div>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {[{ label: 'Title', field: 'title' }, { label: 'Tag', field: 'tag' }, { label: 'Excerpt', field: 'excerpt' }, { label: 'Slug', field: 'slug' }, { label: 'Read Time', field: 'readTime', type: 'number' }].map(f => (
            <div key={f.field}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input type={f.type || 'text'} value={(blog as any)[f.field]} onChange={e => handleFieldChange(f.field, f.type === 'number' ? Number(e.target.value) : e.target.value)} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            </div>
          ))}
        </div>
        {!preview ? (
          <textarea value={blog.content} onChange={e => onChange({ ...blog, content: e.target.value })} style={{ width: '100%', minHeight: 520, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.25rem', color: 'var(--text-primary)', fontSize: 14, fontFamily: "'JetBrains Mono', monospace", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        ) : (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '2rem', minHeight: 520 }}>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{blog.content}</pre>
          </div>
        )}
        {saved && <div style={{ background: 'rgba(0,200,100,0.1)', color: '#00c864', padding: '0.75rem 1rem', borderRadius: 6, marginTop: '1rem', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: 'center' }}>✓ Saved</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button onClick={() => handleSave(false)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-secondary)', background: 'none', cursor: 'pointer' }}>Save Draft</button>
          <button onClick={() => handleSave(true)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '10px 22px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Publish →</button>
        </div>
      </div>
    </div>
  );
});

interface ProjectEditorProps {
  project: Project;
  onChange: (project: Project) => void;
  onSave: () => void;
  onCancel: () => void;
}
const ProjectEditor = React.memo(({ project, onChange, onSave, onCancel }: ProjectEditorProps) => {
  const [saved, setSaved] = useState(false);
  const handleFieldChange = useCallback((field: string, value: any) => {
    onChange({ ...project, [field]: value });
  }, [project, onChange]);
  const handleSave = useCallback(() => {
    if (!project.name.trim()) {
      alert('Project name cannot be empty');
      return;
    }
    if (!project.num.trim()) {
      alert('Project number cannot be empty');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave();
  }, [project.name, project.num, onSave]);

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container-wide" style={{ padding: '2rem 2rem 5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={12} /> All Projects</button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-secondary)' }}>{project.name || 'New Project'}</span>
          </div>
          {saved && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#00c864' }}>✓ Saved</span>}
          <button onClick={handleSave} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: '7px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 5, fontWeight: 700, cursor: 'pointer' }}>Save →</button>
        </div>
        
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {[{ label: 'Project #', field: 'num' }, { label: 'Name', field: 'name' }, { label: 'Tagline', field: 'tagline' }, { label: 'GitHub URL', field: 'githubUrl' }, { label: 'Live URL (optional)', field: 'liveUrl' }].map(f => (
            <div key={f.field}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input type="text" value={(project as any)[f.field] || ''} onChange={e => handleFieldChange(f.field, e.target.value)} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            </div>
          ))}
          <div>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Type</label>
            <select value={project.type} onChange={e => handleFieldChange('type', e.target.value)} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
              <option value="fullstack">Fullstack</option>
              <option value="backend">Backend</option>
              <option value="planned">Planned</option>
            </select>
          </div>
          <div>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Status</label>
            <select value={project.status} onChange={e => handleFieldChange('status', e.target.value)} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
              <option value="live">● Live</option>
              <option value="building">⚡ Building</option>
              <option value="planned">◦ Planned</option>
            </select>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', marginBottom: '1rem' }}>Description</div>
          <textarea value={project.description} onChange={e => handleFieldChange('description', e.target.value)} style={{ width: '100%', minHeight: 200, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', marginBottom: '1rem' }}>Stack (comma-separated)</div>
          <input type="text" value={project.stack?.join(', ') || ''} onChange={e => handleFieldChange('stack', e.target.value.split(',').map(s => s.trim()).filter(s => s))} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '10px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', marginBottom: '1rem' }}>Highlights (comma-separated)</div>
          <input type="text" value={project.highlights?.join(', ') || ''} onChange={e => handleFieldChange('highlights', e.target.value.split(',').map(s => s.trim()).filter(s => s))} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '10px 12px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', marginBottom: '1rem' }}>Architecture</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {[{ label: 'Overview', field: 'overview' }, { label: 'Intuition', field: 'intuition' }, { label: 'Diagram', field: 'diagram' }, { label: 'Scaling Thoughts', field: 'scalingThoughts' }].map(f => (
              <div key={f.field}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                <textarea value={(project.architecture as any)[f.field] || ''} onChange={e => handleFieldChange('architecture', { ...project.architecture, [f.field]: e.target.value })} style={{ width: '100%', minHeight: 80, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px', color: 'var(--text-primary)', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>What I Learned (one per line)</label>
              <textarea value={(project.architecture.whatILearned || []).join('\n')} onChange={e => handleFieldChange('architecture', { ...project.architecture, whatILearned: e.target.value.split('\n').map(s => s.trim()).filter(s => s) })} style={{ width: '100%', minHeight: 120, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px', color: 'var(--text-primary)', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Key Engineering Decisions (title | reasoning, one per line)</label>
              <textarea value={(project.architecture.decisions || []).map(d => typeof d === 'string' ? d : `${d.title} | ${d.reasoning}`).join('\n')} onChange={e => handleFieldChange('architecture', { ...project.architecture, decisions: e.target.value.split('\n').map(s => s.trim()).filter(s => s).map(line => { const [title, reasoning] = line.split('|').map(p => p.trim()); return { title, reasoning }; }) })} style={{ width: '100%', minHeight: 120, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px', color: 'var(--text-primary)', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Challenges & Solutions (problem | solution, one per line)</label>
              <textarea value={(project.architecture.challenges || []).map(c => typeof c === 'string' ? c : `${c.problem} | ${c.solution}`).join('\n')} onChange={e => handleFieldChange('architecture', { ...project.architecture, challenges: e.target.value.split('\n').map(s => s.trim()).filter(s => s).map(line => { const [problem, solution] = line.split('|').map(p => p.trim()); return { problem, solution }; }) })} style={{ width: '100%', minHeight: 120, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px', color: 'var(--text-primary)', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onCancel} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-secondary)', background: 'none', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '10px 22px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Save →</button>
        </div>
      </div>
    </div>
  );
});

type View = 'list' | 'editor';
type Tab = 'blog' | 'projects';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminPage: React.FC = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlog();
  const { projects, addProject, updateProject, deleteProject } = useProject();
  
  const [tab, setTab] = useState<Tab>('blog');
  const [view, setView] = useState<View>('list');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('sp-admin-token') !== null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      setLoginError('PIN required');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch(`${API_URL}/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('sp-admin-token', data.token);
        setAuthenticated(true);
        setPassword('');
      } else {
        setLoginError(data.error || 'Invalid PIN');
      }
    } catch (error) {
      setLoginError('Server error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '2.5rem', width: 340, textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, color: 'var(--accent)', marginBottom: '0.5rem' }}>SP.dev</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)', marginBottom: '2rem' }}>Admin</div>
          <input 
            type="password" 
            value={password} 
            onChange={e => { setPassword(e.target.value); setLoginError(''); }} 
            onKeyDown={e => { if (e.key === 'Enter' && !isLoading) handleLogin(); }} 
            placeholder="PIN" 
            disabled={isLoading}
            style={{ width: '100%', background: 'var(--bg-primary)', border: `1px solid ${loginError ? '#ff6060' : 'var(--border)'}`, borderRadius: 6, padding: '10px', marginBottom: '1rem', textAlign: 'center', fontSize: 14, outline: 'none' }} 
          />
          {loginError && <div style={{ color: '#ff6060', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.75rem', textAlign: 'left' }}>❌ {loginError}</div>}
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            style={{ width: '100%', padding: '10px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 6, fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}>
            {isLoading ? 'Verifying...' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  const handleNewBlog = useCallback(() => { setEditingBlog({ id: generateId(), title: '', slug: '', tag: '', excerpt: '', content: '', publishedAt: new Date().toISOString().split('T')[0], readTime: 5, published: false }); setView('editor'); }, []);
  const handleEditBlog = useCallback((b: BlogPost) => { setEditingBlog(b); setView('editor'); }, []);
  const handleSaveBlog = useCallback(async (publish: boolean) => { if (editingBlog) { const post = { ...editingBlog, published: publish, slug: editingBlog.slug || generateSlug(editingBlog.title) }; if (blogs.find(b => b.id === post.id)) await updateBlog(post); else await addBlog(post); setView('list'); setEditingBlog(null); } }, [editingBlog, blogs, updateBlog, addBlog]);
  const handleDeleteBlog = useCallback(async (id: string) => { if (window.confirm('Delete?')) await deleteBlog(id); }, [deleteBlog]);

  const handleNewProject = useCallback(() => { setEditingProject({ id: generateId(), num: '99', name: '', tagline: '', type: 'fullstack', status: 'planned', stack: [], description: '', githubUrl: '', highlights: [], architecture: { overview: '', intuition: '', diagram: '', decisions: [], challenges: [], whatILearned: [], scalingThoughts: '' } }); setView('editor'); }, []);
  const handleEditProject = useCallback((p: Project) => { setEditingProject(p); setView('editor'); }, []);
  const handleSaveProject = useCallback(async () => { if (editingProject) { if (projects.find(p => p.id === editingProject.id)) await updateProject(editingProject); else await addProject(editingProject); setView('list'); setEditingProject(null); } }, [editingProject, projects, updateProject, addProject]);
  const handleDeleteProject = useCallback(async (id: string) => { if (window.confirm('Delete?')) await deleteProject(id); }, [deleteProject]);

  if (view === 'list' && tab === 'blog') return <BlogList blogs={blogs} onEdit={handleEditBlog} onDelete={handleDeleteBlog} onNew={handleNewBlog} onTabChange={setTab} />;
  if (view === 'list' && tab === 'projects') return <ProjectList projects={projects} onEdit={handleEditProject} onDelete={handleDeleteProject} onNew={handleNewProject} onTabChange={setTab} />;
  if (view === 'editor' && tab === 'blog' && editingBlog) return <BlogEditor blog={editingBlog} onChange={setEditingBlog} onSave={handleSaveBlog} onCancel={() => { setView('list'); setEditingBlog(null); }} />;
  if (view === 'editor' && tab === 'projects' && editingProject) return <ProjectEditor project={editingProject} onChange={setEditingProject} onSave={handleSaveProject} onCancel={() => { setView('list'); setEditingProject(null); }} />;

  return null;
};

export default React.memo(AdminPage);

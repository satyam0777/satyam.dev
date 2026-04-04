import React from 'react';
import { Mail, GitBranch, Terminal, BookOpen } from 'lucide-react';

const ContactPage: React.FC = () => (
  <div style={{ paddingTop: 80 }}>
    <div className="container" style={{ padding: '3rem 2rem 5rem' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>06 — Contact</div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Let's talk</h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7, marginBottom: '3rem' }}>
        Open to internships, collaborations, mentorship, and good conversations about backend engineering, databases, and distributed systems.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }} className="contact-grid">
        <div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
            If you're building something interesting and need a backend engineer who genuinely cares about how the system is designed — not just whether it runs — I'd love to hear about it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: <Mail size={15} />, label: 'officialsatyam0777@gmail.com', href: 'mailto:officialsatyam0777@gmail.com' },
              { icon: <GitBranch size={15} />, label: 'github.com/satyam0777', href: 'https://github.com/satyam0777' },
              { icon: <Terminal size={15} />, label: '+91 7985792091', href: 'tel:+917985792091' },
              { icon: <BookOpen size={15} />, label: 'LeetCode —  Problems', href: 'https://leetcode.com/u/satyam0777/' },
              
            ].map(item => (
              <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--text-secondary)', transition: 'border-color 0.15s, color 0.15s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '2rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>SEND A MESSAGE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Your Name', type: 'text', placeholder: 'Your name' },
              { label: 'Email', type: 'email', placeholder: 'your@company.com' },
              { label: 'Subject', type: 'text', placeholder: 'Internship opportunity / Collaboration / ...' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            ))}
            <div>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Message</label>
              <textarea rows={5} placeholder="Tell me what you're building..." style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <a href="mailto:officialsatyam0777@gmail.com" style={{ display: 'block', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: '11px 0', background: 'var(--accent)', color: '#000', borderRadius: 6, fontWeight: 600, letterSpacing: '0.04em' }}>
              Send Message →
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;

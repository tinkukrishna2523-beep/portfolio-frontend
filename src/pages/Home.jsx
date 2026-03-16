import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import './Home.css';

const DEFAULT_SKILLS = [
  { icon: '⚡', label: 'JavaScript / TS' },
  { icon: '⚛', label: 'React & Next.js' },
  { icon: '🤖', label: 'AI Prompting' },
  { icon: '🔧', label: 'Node.js & NoSQL' },
  { icon: '🎨', label: 'Tailwind CSS' },
  { icon: '☁️', label: 'AWS & Vercel' },
  { icon: '✏️', label: 'UI/UX Design' },
  { icon: '🧠', label: 'LLM Integration' },
];

const BACKEND = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Home = () => {
  const [about, setAbout] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    api.get('/about').then(r => setAbout(r.data?.data || null)).catch(() => {});
    api.get('/projects').then(r => {
      setFeatured((r.data?.data || []).filter(p => p.featured).slice(0, 2));
    }).catch(() => {});
    api.get('/certifications').then(r => {
      setCerts(r.data?.data || []);
    }).catch(() => {});
  }, []);

  return (
    <main className="home page-enter">

      {/* ── HERO ─────────────────────────────── */}
      <section className="hero section">
        <div className="container hero__grid">
          <div className="hero__left">
            {(about?.available !== false) && (
              <div className="available-dot" style={{ marginBottom: '28px' }}>
                Available for Projects
              </div>
            )}
            <h1 className="hero__name">{about?.name || 'Tinku Krishna AR'}</h1>
            <h2 className="hero__title">
              <span className="text-blue">{about?.focusArea?.split(' ')[0] || 'AI Web'}</span>{' '}
              {about?.focusSub?.split(' ')[0] || 'Developer'}
            </h2>
            <p className="hero__desc">
              {about?.bio || 'Building the future with code and intelligence. Passionate about LLMs, automation, and creating seamless user experiences.'}
            </p>
            <div className="hero__cta">
              <Link to="/projects" className="btn btn-primary">View My Work</Link>
              <Link to="/about" className="btn btn-outline">Read Bio</Link>
            </div>
          </div>
          <div className="hero__right">
            <div className="hero__card">
              {about?.photo ? (
                <img
                  src={about.photo.startsWith('http') ? about.photo : `${BACKEND}${about.photo}`}
                  alt={about?.name || 'Profile'}
                  className="hero__photo"
                />
              ) : (
                <div className="hero__card-inner">
                  <div className="hero__card-icon">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <rect width="56" height="56" rx="16" fill="#0066FF" opacity="0.1"/>
                      <path d="M20 28C20 23.6 23.6 20 28 20s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" stroke="#0066FF" strokeWidth="2.5" fill="none"/>
                      <path d="M28 24v4l3 3" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="28" cy="28" r="20" stroke="#0066FF" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4"/>
                    </svg>
                  </div>
                  <div className="hero__status">
                    <span className="mono-text">status: building_future...</span>
                    <div className="hero__cursor">▍</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT STRIP ──────────────────────── */}
      <section className="about-strip section">
        <div className="container about-strip__grid">
          <div className="about-strip__left">
            <div className="section-label">About Me</div>
          </div>
          <div className="about-strip__right">
            {about?.journey
              ? about.journey.split('\n\n').slice(0, 2).map((p, i) => <p key={i}>{p}</p>)
              : (
                <>
                  <p>I am a passionate college student and developer specializing in bridging the gap between traditional web development and Artificial Intelligence.</p>
                  <p>By integrating AI into the development workflow, I build high-performance, intelligent web applications that solve real-world problems.</p>
                </>
              )
            }
            <div className="about-strip__tags">
              <div className="about-strip__tag">
                <span className="text-blue" style={{ fontWeight: 600 }}>Education</span>
                <p>{about?.education || 'Computer Science Engineering'}</p>
                <small>{about?.educationSub || 'Undergraduate Student'}</small>
              </div>
              <div className="about-strip__tag">
                <span className="text-blue" style={{ fontWeight: 600 }}>Focus Area</span>
                <p>{about?.focusArea || 'AI Integration & Web Apps'}</p>
                <small>{about?.focusSub || 'Full Stack Development'}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────── */}
      <section className="skills section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">Technical Arsenal</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>
              Tools and technologies I use to bring ideas to life
            </p>
          </div>
          <div className="skills__grid">
            {(about?.skills?.length ? about.skills : DEFAULT_SKILLS).map((s, i) => (
              <div key={i} className="skill-card">
                <span className="skill-card__icon">{s.icon}</span>
                <span className="skill-card__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ────────────────── */}
      <section className="featured section">
        <div className="container">
          <div className="featured__header">
            <div>
              <h2 className="section-title">Featured Projects</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>
                Innovative solutions built with code and intelligence
              </p>
            </div>
            <Link to="/projects" className="view-all-link">View All →</Link>
          </div>

          {featured.length === 0 ? (
            <div className="featured__empty">
              <p>Projects will appear here once added via the admin panel.</p>
              <Link to="/projects" className="btn btn-outline" style={{ marginTop: '12px' }}>
                View All Projects
              </Link>
            </div>
          ) : (
            <div className="featured__grid">
              {featured.map(p => (
                <div key={p.id} className="project-card card">
                  <div className="project-card__img project-card__img--dark">
                    <span>{p.title}</span>
                  </div>
                  <div className="project-card__body">
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {p.tech?.slice(0,3).map(t => (
                        <span key={t} className="tag">{t.toUpperCase()}</span>
                      ))}
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="project-card__links">
                      {p.liveDemo && <a href={p.liveDemo} target="_blank" rel="noreferrer" className="project-link">⚡ Live Demo</a>}
                      {p.source   && <a href={p.source}   target="_blank" rel="noreferrer" className="project-link">⌥ Source</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GITHUB ACTIVITY ──────────────────── */}
      <section className="github section">
        <div className="container">
          <div className="github__card">
            <div className="github__left">
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#0066FF">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3>GitHub Activity</h3>
              <p>I am an active open-source contributor. Checkout my latest repositories and contributions on GitHub.</p>
              <a href="https://github.com/tinkukrishna" target="_blank" rel="noreferrer"
                 className="btn btn-primary" style={{ marginTop: '16px' }}>
                View GitHub →
              </a>
            </div>
            <div className="github__right">
              <div className="github__placeholder">
                <div className="github__bar-row">
                  {[60,80,40,90,50,70,85,45,60,75,55,80].map((h,i) => (
                    <div key={i} className="github__bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="mono-text" style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '8px' }}>COMMIT GRAPH</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ───────────────────── */}
      {certs.length > 0 && (
        <section className="certs section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 className="section-title">Certifications</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>
                Validated skills and continuous learning
              </p>
            </div>
            <div className="certs__grid">
              {certs.map(c => (
                <div key={c.id} className="cert-card">
                  <span className="cert-card__check">✅</span>
                  <div>
                    <p className="cert-card__title">{c.title}</p>
                    <p className="cert-card__org">{c.org}{c.date ? ` · ${c.date}` : ''}</p>
                  </div>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer"
                       className="cert-card__link" title="View Credential">→</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
};

export default Home;

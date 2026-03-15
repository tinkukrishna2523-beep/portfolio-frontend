import React, { useState, useEffect } from 'react';
import api from '../api/client';
import './About.css';

const BACKEND = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/about').then(r => setAbout(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <main style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container section">
        {[1,2,3].map(i => (
          <div key={i} style={{
            height: '120px', borderRadius: '12px', marginBottom: '16px',
            background: 'linear-gradient(90deg, #f1f3f5 25%, #f8f9fa 50%, #f1f3f5 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'
          }} />
        ))}
      </div>
    </main>
  );

  const milestones = about?.milestones || [];
  const hobbies    = about?.hobbies    || [];
  const photoSrc   = about?.photo
    ? (about.photo.startsWith('http') ? about.photo : `${BACKEND}${about.photo}`)
    : null;

  return (
    <main className="about page-enter">
      <div className="container">

        {/* ── PROFILE CARD ─────────────────── */}
        <section className="profile-card section">
          <div className="profile-card__inner">
            <div className="profile-card__avatar">
              {photoSrc ? (
                <img src={photoSrc} alt={about?.name} className="profile-card__avatar-img profile-card__avatar-img--photo" />
              ) : (
                <div className="profile-card__avatar-img">
                  {about?.name?.charAt(0) || 'T'}
                </div>
              )}
              <div className="profile-card__avatar-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="9" height="9" rx="2" fill="#0066FF"/>
                  <rect x="13" y="2" width="9" height="9" rx="2" fill="#0066FF" opacity="0.4"/>
                  <rect x="2" y="13" width="9" height="9" rx="2" fill="#0066FF" opacity="0.4"/>
                  <rect x="13" y="13" width="9" height="9" rx="2" fill="#0066FF"/>
                </svg>
              </div>
            </div>
            <div className="profile-card__info">
              <h1>{about?.name || 'Tinku Krishna AR'}</h1>
              <p className="profile-card__subtitle">{about?.subtitle || 'Student Developer & AI Enthusiast'}</p>
              <p className="profile-card__bio">{about?.bio}</p>
              <div className="profile-card__actions">
                {about?.resumeUrl && (
                  <a href={about.resumeUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
                    ↓ Resume
                  </a>
                )}
                <a href={`mailto:${about?.email || 'hello@tinkukrishna.com'}`} className="btn btn-outline">
                  ✉ Contact
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── JOURNEY ──────────────────────── */}
        {about?.journey && (
          <section className="journey section">
            <div className="section-label">The Journey So Far</div>
            <h2>THE JOURNEY SO FAR</h2>
            <div className="journey__text">
              {about.journey.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* ── PHILOSOPHY ───────────────────── */}
        {about?.philosophy && (
          <section className="philosophy section">
            <div className="philosophy__grid">
              <div className="philosophy__left">
                <div className="section-label">My Philosophy</div>
                <h2>PHILOSOPHY ON AI-POWERED DEVELOPMENT</h2>
                <p>{about.philosophy}</p>
                {about.philosophyQuote && (
                  <blockquote className="philosophy__quote">
                    "{about.philosophyQuote}"
                  </blockquote>
                )}
              </div>
              <div className="philosophy__right">
                <div className="philosophy__terminal">
                  <div className="terminal__dots">
                    <span style={{ background: '#ff5f57' }}/>
                    <span style={{ background: '#febc2e' }}/>
                    <span style={{ background: '#28c840' }}/>
                  </div>
                  <div className="terminal__code">
                    <p><span className="t-key">AI_COLLAB_MODE</span><span className="t-eq"> = </span><span className="t-val">"ENHANCED"</span></p>
                    <p><span className="t-key">status</span><span className="t-eq">: </span><span className="t-val">building_future...</span></p>
                    <p className="t-cursor">▍</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── MILESTONES ───────────────────── */}
        {milestones.length > 0 && (
          <section className="milestones section">
            <div className="section-label">Key Moments</div>
            <h2>MILESTONES</h2>
            <div className="milestones__list">
              {milestones.map((m) => (
                <div key={m.id} className={`milestone ${m.active ? 'milestone--active' : ''}`}>
                  <div className="milestone__dot" />
                  <div className="milestone__year">{m.year}</div>
                  <div className="milestone__content">
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── BEYOND SCREEN ────────────────── */}
        {hobbies.length > 0 && (
          <section className="beyond section">
            <div className="section-label">Personal Life</div>
            <h2>BEYOND THE SCREEN</h2>
            <div className="beyond__grid">
              {hobbies.map((h) => (
                <div key={h.id} className="hobby-card card">
                  <div className="hobby-card__icon">{h.icon}</div>
                  <h3>{h.title}</h3>
                  <p>{h.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
};

export default About;

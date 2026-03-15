import React, { useState, useEffect } from 'react';
import api from '../api/client';
import './Contact.css';

const Contact = () => {
  const [about, setAbout] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  });

  useEffect(() => {
    api.get('/about').then(r => setAbout(r.data.data)).catch(() => {});
  }, []);
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err.response?.data?.error || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <main className="contact-page page-enter">
      <div className="container">

        {/* ── HERO ─────────────────────────── */}
        <section className="contact-hero section">
          <div className="available-dot" style={{ marginBottom: '24px' }}>
            Available for New Projects
          </div>
          <h1 className="contact-title">
            Let's build something <span className="text-blue">remarkable.</span>
          </h1>
          <p className="contact-subtitle">
            Whether you have a specific project in mind or just want to say hi,
            I'd love to hear from you.
          </p>
        </section>

        {/* ── MAIN CONTENT ─────────────────── */}
        <div className="contact-grid">

          {/* Form */}
          <div className="contact-form-wrap">
            <h2>Send a Message</h2>

            {status === 'success' ? (
              <div className="contact-success">
                <div className="contact-success__icon">✅</div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. I'll get back to you within 24–48 hours.
                </p>
                <button
                  className="btn btn-outline"
                  style={{ marginTop: '16px' }}
                  onClick={() => setStatus(null)}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    disabled={status === 'sending'}
                  />
                </div>
                <div className="form-field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'sending'}
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    minLength={3}
                    disabled={status === 'sending'}
                  />
                </div>
                <div className="form-field">
                  <textarea
                    name="message"
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    minLength={10}
                    rows={5}
                    disabled={status === 'sending'}
                  />
                </div>

                {status === 'error' && (
                  <div className="form-error">{errorMsg}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary contact-submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <span className="spinner" />
                      Sending...
                    </>
                  ) : (
                    <>Send Message →</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-info-item__icon">@</div>
              <div>
                <h3>Email Me</h3>
                <a href={`mailto:${about?.email || 'hello@tinkukrishna.com'}`}>
                  {about?.email || 'hello@tinkukrishna.com'}
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-item__icon">📍</div>
              <div>
                <h3>Based In</h3>
                <p>{about?.location || 'Bengaluru, India'}</p>
              </div>
            </div>

            <div className="contact-socials">
              <h3>Social Profiles</h3>
              <div className="contact-socials__list">
                <a href={about?.github || 'https://github.com'} target="_blank" rel="noreferrer"
                   className="social-btn" title="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href={about?.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer"
                   className="social-btn" title="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href={`mailto:${about?.email || 'hello@tinkukrishna.com'}`}
                   className="social-btn" title="Email">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ────────────────────── */}
        <section className="contact-bottom">
          <div className="contact-bottom__inner">
            <div>
              <h3>Have a vision for a project?</h3>
              <p>Let's collaborate and build something remarkable together.</p>
            </div>
            <div className="contact-bottom__btns">
              <a href="/contact" className="btn btn-primary">Start a Project</a>
              <a href="/projects" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.3)', color: 'white' }}>
                View Portfolio
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Contact;

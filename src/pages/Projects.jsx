import React, { useState, useEffect } from 'react';
import api from '../api/client';
import './Projects.css';

const CATEGORIES = ['All', 'React', 'Next.js', 'AI & LLM', 'Mobile', 'Full Stack'];
const BACKEND = 'https://portfolio-backend-production-4203.up.railway.app';

const getImgSrc = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${BACKEND}${img}`;
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { imgs, idx }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data?.data || []);
        setFiltered(res.data?.data || []);
      } catch (err) {
        setError('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') setFiltered(projects);
    else setFiltered(projects.filter(p => p.category === category));
  };

  // Gather all images for a project (cover + screenshots)
  const getProjectImages = (p) => {
    const imgs = [];
    if (p.image) imgs.push(getImgSrc(p.image));
    if (Array.isArray(p.screenshots)) {
      p.screenshots.forEach(s => { if (s) imgs.push(getImgSrc(s)); });
    }
    return imgs;
  };

  return (
    <main className="projects-page page-enter">
      <div className="container">
        <section className="projects-hero section">
          <div className="section-label" style={{ justifyContent: 'flex-start' }}>
            Portfolio 2024
          </div>
          <h1 className="projects-title">Project Gallery</h1>
          <p className="projects-subtitle">
            Exploring the frontier of AI integration and modern web performance.
          </p>
        </section>

        {/* Category filter */}
        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button key={cat}
              className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
              onClick={() => handleFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="projects__grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="project-skeleton" />)}
          </div>
        ) : error ? (
          <div className="projects__error">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="projects__grid">
            {filtered.map(p => {
              const imgs = getProjectImages(p);
              const coverImg = imgs[0] || null;
              return (
                <article key={p.id} className="proj-card card">
                  {/* Cover image */}
                  <div className="proj-card__img"
                    onClick={() => imgs.length > 0 && setLightbox({ imgs, idx: 0 })}
                    style={{ cursor: imgs.length > 0 ? 'zoom-in' : 'default' }}>
                    {coverImg ? (
                      <>
                        <img src={coverImg} alt={p.title} />
                        {imgs.length > 1 && (
                          <div className="proj-card__img-count">+{imgs.length - 1} more</div>
                        )}
                      </>
                    ) : (
                      <div className="proj-card__placeholder">
                        <div className="proj-card__placeholder-icon">◈</div>
                      </div>
                    )}
                  </div>

                  {/* Screenshots strip */}
                  {imgs.length > 1 && (
                    <div className="proj-card__screenshots">
                      {imgs.map((img, i) => (
                        <div key={i} className="proj-card__thumb"
                          onClick={() => setLightbox({ imgs, idx: i })}>
                          <img src={img} alt={`Screenshot ${i + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="proj-card__body">
                    <div className="proj-card__tags">
                      {p.tech?.slice(0,3).map(t => (
                        <span key={t} className="tag">{t.toUpperCase()}</span>
                      ))}
                    </div>
                    <h3 className="proj-card__title">{p.title}</h3>
                    <p className="proj-card__desc">{p.description}</p>
                    <div className="proj-card__footer">
                      <span className="proj-link">View Details →</span>
                      <div className="proj-card__actions">
                        {p.liveDemo && (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer"
                            className="proj-icon-btn" title="Live Demo">⚡</a>
                        )}
                        {p.source && (
                          <a href={p.source} target="_blank" rel="noreferrer"
                            className="proj-icon-btn" title="Source Code">⌥</a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Coming soon placeholder */}
            <div className="proj-card card proj-card--next">
              <div className="proj-card__img">
                <div className="proj-card__coming-soon">
                  <span>+</span>
                  <p>Next Project Loading...</p>
                </div>
              </div>
              <div className="proj-card__body">
                <div className="proj-card__tags">
                  <span className="tag">COMING SOON</span>
                </div>
                <h3 className="proj-card__title">Coming Soon</h3>
                <p className="proj-card__desc">Something exciting is in the works. Stay tuned.</p>
              </div>
            </div>
          </div>
        )}

        <section className="projects__cta">
          <h3>Have a project in mind?</h3>
          <p>I'm always open to discussing new opportunities and collaborations.</p>
          <a href="/contact" className="btn btn-outline">Start a Conversation →</a>
        </section>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lightbox__prev"
            onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: (l.idx - 1 + l.imgs.length) % l.imgs.length })); }}
            style={{ display: lightbox.imgs.length > 1 ? 'flex' : 'none' }}>‹</button>
          <div className="lightbox__img" onClick={e => e.stopPropagation()}>
            <img src={lightbox.imgs[lightbox.idx]} alt="Project screenshot" />
            {lightbox.imgs.length > 1 && (
              <div className="lightbox__counter">{lightbox.idx + 1} / {lightbox.imgs.length}</div>
            )}
          </div>
          <button className="lightbox__next"
            onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: (l.idx + 1) % l.imgs.length })); }}
            style={{ display: lightbox.imgs.length > 1 ? 'flex' : 'none' }}>›</button>
        </div>
      )}
    </main>
  );
};

export default Projects;

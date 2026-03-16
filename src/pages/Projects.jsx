import React, { useState, useEffect } from 'react';
import api from '../api/client';
import './Projects.css';

const CATEGORIES = ['All', 'React', 'Next.js', 'AI & LLM', 'Mobile'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (category === 'All') {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter(p => p.category === category));
    }
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
            Exploring the frontier of AI integration and modern web performance. A collection of
            experimental tools and production-ready applications.
          </p>
        </section>

        {/* Category filter */}
        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="projects__loading">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="project-skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="projects__error">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : (
          <div className="projects__grid">
            {filtered.map((p) => (
              <article key={p.id} className="proj-card card">
                <div className="proj-card__img">
                  {p.image ? (
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <div className="proj-card__placeholder">
                      <div className="proj-card__placeholder-icon">◈</div>
                    </div>
                  )}
                </div>
                <div className="proj-card__body">
                  <div className="proj-card__tags">
                    {p.tech.slice(0, 3).map(t => (
                      <span key={t} className="tag">{t.toUpperCase()}</span>
                    ))}
                  </div>
                  <h3 className="proj-card__title">{p.title}</h3>
                  <p className="proj-card__desc">{p.description}</p>
                  <div className="proj-card__footer">
                    <a href={p.liveDemo} className="proj-link" target="_blank" rel="noreferrer">
                      View Details →
                    </a>
                    <div className="proj-card__actions">
                      <a href={p.liveDemo} target="_blank" rel="noreferrer" title="Live Demo" className="proj-icon-btn">
                        ⚡
                      </a>
                      <a href={p.source} target="_blank" rel="noreferrer" title="Source Code" className="proj-icon-btn">
                        ⌥
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Placeholder card */}
            <div className="proj-card card proj-card--next">
              <div className="proj-card__img">
                <div className="proj-card__coming-soon">
                  <span>+</span>
                  <p>Next Project Loading...</p>
                </div>
              </div>
              <div className="proj-card__body">
                <div className="proj-card__tags">
                  <span className="tag">REACT</span>
                  <span className="tag">NEXT.JS</span>
                </div>
                <h3 className="proj-card__title">Coming Soon</h3>
                <p className="proj-card__desc">Something exciting is in the works. Stay tuned.</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <section className="projects__cta">
          <h3>Have a project in mind?</h3>
          <p>I'm always open to discussing new opportunities and collaborations.</p>
          <a href="/contact" className="btn btn-outline">Start a Conversation →</a>
        </section>
      </div>
    </main>
  );
};

export default Projects;

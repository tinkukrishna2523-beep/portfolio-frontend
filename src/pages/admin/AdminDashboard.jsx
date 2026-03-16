import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import AdminAbout from './AdminAbout';
import AdminMessages from './AdminMessages';
import './AdminDashboard.css';
import './AdminAbout.css';
import './AdminMessages.css';

// ─── Reusable Modal ──────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal__header">
        <h3>{title}</h3>
        <button className="modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="modal__body">{children}</div>
    </div>
  </div>
);

// ─── Project Form ────────────────────────────────
const BACKEND = 'https://portfolio-backend-production-4203.up.railway.app';

const ProjectForm = ({ initial = {}, onSave, onCancel, saving, onImageUpload, onImageRemove }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    tech: Array.isArray(initial.tech) ? initial.tech.join(', ') : (initial.tech || ''),
    category: initial.category || 'React',
    liveDemo: initial.liveDemo || '',
    source: initial.source || '',
    featured: initial.featured || false,
  });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [currentImage, setCurrentImage] = useState(initial.image || '');
  const imgInputRef = useRef();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !initial.id) return;
    setUploadingImg(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await api.post(`/projects/${initial.id}/image`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCurrentImage(res.data.imageUrl);
      onImageUpload && onImageUpload(initial.id, res.data.imageUrl);
    } catch (err) {
      alert(err.response?.data?.error || 'Image upload failed');
    } finally {
      setUploadingImg(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!initial.id) return;
    if (!window.confirm('Remove this project image?')) return;
    try {
      await api.delete(`/projects/${initial.id}/image`);
      setCurrentImage('');
      onImageRemove && onImageRemove(initial.id);
    } catch {
      alert('Failed to remove image');
    }
  };

  const imgSrc = currentImage
    ? (currentImage.startsWith('http') ? currentImage : `${BACKEND}${currentImage}`)
    : null;

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Project Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. AI Chatbot" required />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {['React', 'Next.js', 'AI & LLM', 'Mobile', 'Full Stack', 'Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="What does this project do? What problem does it solve?" rows={3} required />
      </div>

      <div className="form-group">
        <label>Tech Stack <span>(comma separated)</span></label>
        <input value={form.tech} onChange={e => set('tech', e.target.value)}
          placeholder="e.g. React, Node.js, OpenAI, MongoDB" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Live Demo URL</label>
          <input value={form.liveDemo} onChange={e => set('liveDemo', e.target.value)}
            placeholder="https://..." type="url" />
        </div>
        <div className="form-group">
          <label>Source Code URL</label>
          <input value={form.source} onChange={e => set('source', e.target.value)}
            placeholder="https://github.com/..." type="url" />
        </div>
      </div>

      {/* Project Image Upload — only for existing projects */}
      {initial.id && (
        <div className="proj-img-upload">
          <label>Project Image</label>
          <div className="proj-img-area">
            {imgSrc ? (
              <div className="proj-img-preview">
                <img src={imgSrc} alt="Project" />
                <button type="button" className="proj-img-remove" onClick={handleRemoveImage}>✕</button>
              </div>
            ) : (
              <div className="proj-img-placeholder" onClick={() => imgInputRef.current?.click()}>
                {uploadingImg ? <span className="spin-lg" /> : <><span>📷</span><p>Click to upload image</p><small>JPG, PNG, WebP — max 5MB</small></>}
              </div>
            )}
            {!imgSrc && !uploadingImg && (
              <button type="button" className="btn-admin-outline btn-sm"
                onClick={() => imgInputRef.current?.click()} style={{ marginTop: '8px' }}>
                📤 Upload Image
              </button>
            )}
            <input ref={imgInputRef} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={handleImageUpload} />
          </div>
          <small style={{ color: 'var(--gray-400)', fontSize: '12px' }}>
            💡 Save the project first, then upload an image
          </small>
        </div>
      )}

      {!initial.id && (
        <div className="proj-img-note">
          💡 <strong>Tip:</strong> Add the project first, then edit it to upload an image.
        </div>
      )}

      <label className="checkbox-label">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
        <span>Feature this project on the Home page</span>
      </label>

      <div className="form-actions">
        <button type="button" className="btn-admin-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-admin-primary" disabled={saving}>
          {saving ? <><span className="spin"/> Saving...</> : (initial.id ? 'Update Project' : 'Add Project')}
        </button>
      </div>
    </form>
  );
};

// ─── Cert Form ───────────────────────────────────
const CertForm = ({ initial = {}, onSave, onCancel, saving }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    org: initial.org || '',
    date: initial.date || '',
    credentialUrl: initial.credentialUrl || '',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Certification Title *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="e.g. AWS Cloud Practitioner" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Issuing Organization *</label>
          <input value={form.org} onChange={e => set('org', e.target.value)}
            placeholder="e.g. Amazon Web Services" required />
        </div>
        <div className="form-group">
          <label>Date Issued</label>
          <input value={form.date} onChange={e => set('date', e.target.value)}
            placeholder="e.g. Jan 2024" />
        </div>
      </div>
      <div className="form-group">
        <label>Credential URL</label>
        <input value={form.credentialUrl} onChange={e => set('credentialUrl', e.target.value)}
          placeholder="https://..." type="url" />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-admin-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-admin-primary" disabled={saving}>
          {saving ? <><span className="spin"/> Saving...</> : (initial.id ? 'Update Cert' : 'Add Certification')}
        </button>
      </div>
    </form>
  );
};

// ─── Main Dashboard ──────────────────────────────
const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('projects');

  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals
  const [projectModal, setProjectModal] = useState(null); // null | 'add' | project object
  const [certModal, setCertModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type, id, title }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/projects'),
        api.get('/certifications'),
      ]);
      setProjects(pRes.data.data);
      setCerts(cRes.data.data);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Project handlers ──
  const handleSaveProject = async (form) => {
    setSaving(true);
    try {
      if (projectModal?.id) {
        const res = await api.put(`/projects/${projectModal.id}`, form);
        setProjects(p => p.map(x => x.id === projectModal.id ? res.data.data : x));
        showToast('Project updated!');
      } else {
        const res = await api.post('/projects', form);
        setProjects(p => [...p, res.data.data]);
        showToast('Project added!');
      }
      setProjectModal(null);
    } catch (err) {
      showToast(err.response?.data?.error || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(p => p.filter(x => x.id !== id));
      showToast('Project deleted.');
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ── Cert handlers ──
  const handleSaveCert = async (form) => {
    setSaving(true);
    try {
      if (certModal?.id) {
        const res = await api.put(`/certifications/${certModal.id}`, form);
        setCerts(c => c.map(x => x.id === certModal.id ? res.data.data : x));
        showToast('Certification updated!');
      } else {
        const res = await api.post('/certifications', form);
        setCerts(c => [...c, res.data.data]);
        showToast('Certification added!');
      }
      setCertModal(null);
    } catch (err) {
      showToast(err.response?.data?.error || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCert = async (id) => {
    try {
      await api.delete(`/certifications/${id}`);
      setCerts(c => c.filter(x => x.id !== id));
      showToast('Certification deleted.');
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-dash">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" fill="#0066FF"/>
            <rect x="13" y="2" width="9" height="9" rx="2" fill="#0066FF" opacity="0.4"/>
            <rect x="2" y="13" width="9" height="9" rx="2" fill="#0066FF" opacity="0.4"/>
            <rect x="13" y="13" width="9" height="9" rx="2" fill="#0066FF"/>
          </svg>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          <button className={`admin-nav__item ${tab === 'about' ? 'active' : ''}`}
            onClick={() => setTab('about')}>
            <span>👤</span> About Me
          </button>
          <button className={`admin-nav__item ${tab === 'projects' ? 'active' : ''}`}
            onClick={() => setTab('projects')}>
            <span>🗂</span> Projects
            <span className="admin-nav__badge">{projects.length}</span>
          </button>
          <button className={`admin-nav__item ${tab === 'certs' ? 'active' : ''}`}
            onClick={() => setTab('certs')}>
            <span>🏅</span> Certifications
            <span className="admin-nav__badge">{certs.length}</span>
          </button>
          <button className={`admin-nav__item ${tab === 'messages' ? 'active' : ''}`}
            onClick={() => setTab('messages')}>
            <span>✉️</span> Messages
            {unreadCount > 0 && (
              <span className="admin-nav__badge admin-nav__badge--unread">{unreadCount}</span>
            )}
          </button>
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-sidebar__link">
            👁 View Portfolio
          </a>
          <button onClick={handleLogout} className="admin-sidebar__logout">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>{tab === 'about' ? 'About Me' : tab === 'projects' ? 'Projects' : tab === 'certs' ? 'Certifications' : 'Messages'}</h1>
            <p>{tab === 'about'
              ? 'Edit your profile, photo, bio, milestones, hobbies and skills'
              : tab === 'projects'
              ? `${projects.length} project${projects.length !== 1 ? 's' : ''} — visible to recruiters on the Projects page`
              : tab === 'certs'
              ? `${certs.length} certification${certs.length !== 1 ? 's' : ''} — visible on the Home page`
              : `Contact form submissions — ${unreadCount} unread`}
            </p>
          </div>
          {(tab === 'projects' || tab === 'certs') && (
            <button
              className="btn-admin-primary"
              onClick={() => tab === 'projects' ? setProjectModal('add') : setCertModal('add')}
            >
              + Add {tab === 'projects' ? 'Project' : 'Certification'}
            </button>
          )}
        </div>

        {/* About tab */}
        {tab === 'about' && <AdminAbout showToast={showToast} />}

        {/* Messages tab */}
        {tab === 'messages' && (
          <AdminMessages showToast={showToast} onUnreadChange={setUnreadCount} />
        )}

        {loading ? (
          <div className="admin-loading">
            {[1,2,3].map(i => <div key={i} className="admin-skeleton" />)}
          </div>
        ) : tab === 'projects' ? (
          // ── Projects list ──
          projects.length === 0 ? (
            <div className="admin-empty">
              <span>🗂</span>
              <p>No projects yet. Add your first project!</p>
              <button className="btn-admin-primary" onClick={() => setProjectModal('add')}>
                + Add Project
              </button>
            </div>
          ) : (
            <div className="admin-list">
              {projects.map(p => (
                <div key={p.id} className="admin-card">
                  {p.image && (
                    <div className="admin-card__thumb">
                      <img
                        src={p.image.startsWith('http') ? p.image : `${BACKEND}${p.image}`}
                        alt={p.title}
                      />
                    </div>
                  )}
                  <div className="admin-card__left">
                    <div className="admin-card__info">
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <div className="admin-card__meta">
                        <span className="admin-tag">{p.category}</span>
                        {p.featured && <span className="admin-tag admin-tag--blue">⭐ Featured</span>}
                        {p.tech?.slice(0,3).map(t => (
                          <span key={t} className="admin-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="admin-card__actions">
                    {p.liveDemo && (
                      <a href={p.liveDemo} target="_blank" rel="noreferrer" className="admin-icon-btn" title="Live Demo">🔗</a>
                    )}
                    {p.source && (
                      <a href={p.source} target="_blank" rel="noreferrer" className="admin-icon-btn" title="Source">⌥</a>
                    )}
                    <button className="admin-icon-btn" title="Edit" onClick={() => setProjectModal(p)}>✏️</button>
                    <button className="admin-icon-btn admin-icon-btn--danger" title="Delete"
                      onClick={() => setDeleteConfirm({ type: 'project', id: p.id, title: p.title })}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // ── Certs list ──
          certs.length === 0 ? (
            <div className="admin-empty">
              <span>🏅</span>
              <p>No certifications yet. Add your first one!</p>
              <button className="btn-admin-primary" onClick={() => setCertModal('add')}>
                + Add Certification
              </button>
            </div>
          ) : (
            <div className="admin-list">
              {certs.map(c => (
                <div key={c.id} className="admin-card">
                  <div className="admin-card__left">
                    <div className="admin-card__info">
                      <h3>{c.title}</h3>
                      <p>{c.org}{c.date ? ` · ${c.date}` : ''}</p>
                      {c.credentialUrl && (
                        <a href={c.credentialUrl} target="_blank" rel="noreferrer"
                          className="admin-cert-link">View Credential →</a>
                      )}
                    </div>
                  </div>
                  <div className="admin-card__actions">
                    <button className="admin-icon-btn" title="Edit" onClick={() => setCertModal(c)}>✏️</button>
                    <button className="admin-icon-btn admin-icon-btn--danger" title="Delete"
                      onClick={() => setDeleteConfirm({ type: 'cert', id: c.id, title: c.title })}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* ── Project Modal ── */}
      {projectModal && (
        <Modal
          title={projectModal === 'add' ? 'Add New Project' : `Edit: ${projectModal.title}`}
          onClose={() => setProjectModal(null)}
        >
          <ProjectForm
            initial={projectModal === 'add' ? {} : projectModal}
            onSave={handleSaveProject}
            onCancel={() => setProjectModal(null)}
            saving={saving}
            onImageUpload={(id, imageUrl) => {
              setProjects(p => p.map(x => x.id === id ? { ...x, image: imageUrl } : x));
              showToast('Image uploaded!');
            }}
            onImageRemove={(id) => {
              setProjects(p => p.map(x => x.id === id ? { ...x, image: '' } : x));
              showToast('Image removed.');
            }}
          />
        </Modal>
      )}

      {/* ── Cert Modal ── */}
      {certModal && (
        <Modal
          title={certModal === 'add' ? 'Add Certification' : `Edit: ${certModal.title}`}
          onClose={() => setCertModal(null)}
        >
          <CertForm
            initial={certModal === 'add' ? {} : certModal}
            onSave={handleSaveCert}
            onCancel={() => setCertModal(null)}
            saving={saving}
          />
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <div className="delete-confirm">
            <p>Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This cannot be undone.</p>
            <div className="form-actions">
              <button className="btn-admin-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-admin-danger" onClick={() =>
                deleteConfirm.type === 'project'
                  ? handleDeleteProject(deleteConfirm.id)
                  : handleDeleteCert(deleteConfirm.id)
              }>
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`admin-toast ${toast.type === 'error' ? 'admin-toast--error' : ''}`}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

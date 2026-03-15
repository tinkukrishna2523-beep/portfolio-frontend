import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/client';
import './AdminAbout.css';

const BACKEND = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminAbout = ({ showToast }) => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [milestones, setMilestones] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [skills, setSkills] = useState([]);
  const photoInputRef = useRef();

  useEffect(() => {
    api.get('/about').then(r => {
      const data = r.data.data;
      setAbout(data);
      setMilestones(data.milestones || []);
      setHobbies(data.hobbies || []);
      setSkills(data.skills || []);
    }).catch(() => showToast('Failed to load about data', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setAbout(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/about', { ...about, milestones, hobbies, skills });
      showToast('About page updated!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append('photo', file);
    try {
      const res = await api.post('/about/photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set('photo', res.data.photoUrl);
      showToast('Photo uploaded!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Upload failed', 'error');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Remove your profile photo?')) return;
    try {
      await api.delete('/about/photo');
      set('photo', '');
      showToast('Photo removed.');
    } catch {
      showToast('Failed to remove photo', 'error');
    }
  };

  // Milestone helpers
  const addMilestone = () => setMilestones(m => [...m, {
    id: `m${Date.now()}`, year: '', title: '', desc: '', active: false
  }]);
  const updateMilestone = (id, k, v) =>
    setMilestones(m => m.map(x => x.id === id ? { ...x, [k]: v } : x));
  const deleteMilestone = (id) => setMilestones(m => m.filter(x => x.id !== id));
  const setActiveM = (id) =>
    setMilestones(m => m.map(x => ({ ...x, active: x.id === id })));

  // Hobby helpers
  const addHobby = () => setHobbies(h => [...h, {
    id: `h${Date.now()}`, icon: '⭐', title: '', desc: ''
  }]);
  const updateHobby = (id, k, v) =>
    setHobbies(h => h.map(x => x.id === id ? { ...x, [k]: v } : x));
  const deleteHobby = (id) => setHobbies(h => h.filter(x => x.id !== id));

  // Skill helpers
  const addSkill = () => setSkills(s => [...s, { icon: '💡', label: '' }]);
  const updateSkill = (i, k, v) =>
    setSkills(s => s.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const deleteSkill = (i) => setSkills(s => s.filter((_, idx) => idx !== i));

  const sections = [
    { id: 'profile',     label: '👤 Profile & Photo' },
    { id: 'info',        label: '📋 Info & Links' },
    { id: 'journey',     label: '📖 Journey & Philosophy' },
    { id: 'milestones',  label: '🏁 Milestones' },
    { id: 'hobbies',     label: '🎯 Hobbies' },
    { id: 'skills',      label: '⚡ Skills' },
  ];

  if (loading) return (
    <div className="about-loading">
      {[1,2,3].map(i => <div key={i} className="admin-skeleton" />)}
    </div>
  );

  return (
    <div className="about-editor">
      {/* Section tabs */}
      <div className="about-tabs">
        {sections.map(s => (
          <button key={s.id}
            className={`about-tab ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="about-panel">

        {/* ── PROFILE & PHOTO ── */}
        {activeSection === 'profile' && (
          <div className="about-section">
            <h3 className="about-section__title">Profile & Photo</h3>

            {/* Photo upload */}
            <div className="photo-upload">
              <div className="photo-preview">
                {about?.photo ? (
                  <img
                    src={about.photo.startsWith('http') ? about.photo : `${BACKEND}${about.photo}`}
                    alt="Profile"
                  />
                ) : (
                  <div className="photo-placeholder">
                    {about?.name?.charAt(0) || 'T'}
                  </div>
                )}
                {uploadingPhoto && <div className="photo-overlay"><span className="spin-lg" /></div>}
              </div>

              <div className="photo-actions">
                <h4>Profile Photo</h4>
                <p>Upload a photo for your portfolio. Recommended: square image, at least 300×300px.</p>
                <div className="photo-btns">
                  <button className="btn-admin-primary" onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}>
                    {uploadingPhoto ? '⏳ Uploading...' : '📤 Upload Photo'}
                  </button>
                  {about?.photo && (
                    <button className="btn-admin-outline btn-danger-soft" onClick={handleRemovePhoto}>
                      🗑 Remove
                    </button>
                  )}
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input value={about?.name || ''} onChange={e => set('name', e.target.value)}
                  placeholder="Tinku Krishna AR" />
              </div>
              <div className="form-group">
                <label>Subtitle / Role</label>
                <input value={about?.subtitle || ''} onChange={e => set('subtitle', e.target.value)}
                  placeholder="Student Developer & AI Enthusiast" />
              </div>
            </div>

            <div className="form-group">
              <label>Bio <span>(shown on About page card)</span></label>
              <textarea value={about?.bio || ''} onChange={e => set('bio', e.target.value)}
                rows={3} placeholder="Building the future with code and intelligence..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Education</label>
                <input value={about?.education || ''} onChange={e => set('education', e.target.value)}
                  placeholder="Computer Science Engineering" />
              </div>
              <div className="form-group">
                <label>Education Sub-label</label>
                <input value={about?.educationSub || ''} onChange={e => set('educationSub', e.target.value)}
                  placeholder="Undergraduate Student" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Focus Area</label>
                <input value={about?.focusArea || ''} onChange={e => set('focusArea', e.target.value)}
                  placeholder="AI Integration & Web Apps" />
              </div>
              <div className="form-group">
                <label>Focus Sub-label</label>
                <input value={about?.focusSub || ''} onChange={e => set('focusSub', e.target.value)}
                  placeholder="Full Stack Development" />
              </div>
            </div>

            <label className="checkbox-label">
              <input type="checkbox" checked={about?.available || false}
                onChange={e => set('available', e.target.checked)} />
              <span>Show "Available for Projects" badge on homepage</span>
            </label>
          </div>
        )}

        {/* ── INFO & LINKS ── */}
        {activeSection === 'info' && (
          <div className="about-section">
            <h3 className="about-section__title">Contact Info & Links</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input value={about?.email || ''} onChange={e => set('email', e.target.value)}
                  placeholder="hello@tinkukrishna.com" type="email" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={about?.location || ''} onChange={e => set('location', e.target.value)}
                  placeholder="Bengaluru, India" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>GitHub URL</label>
                <input value={about?.github || ''} onChange={e => set('github', e.target.value)}
                  placeholder="https://github.com/yourhandle" type="url" />
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input value={about?.linkedin || ''} onChange={e => set('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourhandle" type="url" />
              </div>
            </div>
            <div className="form-group">
              <label>Resume URL <span>(direct link to PDF)</span></label>
              <input value={about?.resumeUrl || ''} onChange={e => set('resumeUrl', e.target.value)}
                placeholder="https://drive.google.com/file/..." type="url" />
            </div>
          </div>
        )}

        {/* ── JOURNEY & PHILOSOPHY ── */}
        {activeSection === 'journey' && (
          <div className="about-section">
            <h3 className="about-section__title">Journey & Philosophy</h3>
            <div className="form-group">
              <label>The Journey So Far <span>(supports line breaks)</span></label>
              <textarea value={about?.journey || ''} onChange={e => set('journey', e.target.value)}
                rows={7} placeholder="My journey into technology began..." />
            </div>
            <div className="form-group">
              <label>Philosophy on AI-Powered Development</label>
              <textarea value={about?.philosophy || ''} onChange={e => set('philosophy', e.target.value)}
                rows={4} placeholder="I believe AI should be an extension of human creativity..." />
            </div>
            <div className="form-group">
              <label>Philosophy Quote <span>(shown in blockquote)</span></label>
              <textarea value={about?.philosophyQuote || ''} onChange={e => set('philosophyQuote', e.target.value)}
                rows={2} placeholder="The goal isn't just to write code faster..." />
            </div>
          </div>
        )}

        {/* ── MILESTONES ── */}
        {activeSection === 'milestones' && (
          <div className="about-section">
            <div className="about-section__header">
              <h3 className="about-section__title">Milestones Timeline</h3>
              <button className="btn-admin-primary btn-sm" onClick={addMilestone}>+ Add Milestone</button>
            </div>
            <p className="about-section__hint">These appear as a timeline on the About page.</p>

            {milestones.length === 0 && (
              <div className="admin-empty" style={{ padding: '32px' }}>
                <span>🏁</span><p>No milestones yet.</p>
              </div>
            )}

            {milestones.map((m, i) => (
              <div key={m.id} className="milestone-card">
                <div className="milestone-card__top">
                  <span className="milestone-idx">#{i + 1}</span>
                  {m.active && <span className="admin-tag admin-tag--blue">● Active</span>}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                    {!m.active && (
                      <button className="btn-admin-outline btn-sm" onClick={() => setActiveM(m.id)}>
                        Set Active
                      </button>
                    )}
                    <button className="admin-icon-btn admin-icon-btn--danger"
                      onClick={() => deleteMilestone(m.id)}>🗑</button>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Year / Period</label>
                    <input value={m.year} onChange={e => updateMilestone(m.id, 'year', e.target.value)}
                      placeholder="2024 — Present" />
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input value={m.title} onChange={e => updateMilestone(m.id, 'title', e.target.value)}
                      placeholder="Specialization in AI & ML" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={m.desc} onChange={e => updateMilestone(m.id, 'desc', e.target.value)}
                    rows={2} placeholder="What happened during this period..." />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── HOBBIES ── */}
        {activeSection === 'hobbies' && (
          <div className="about-section">
            <div className="about-section__header">
              <h3 className="about-section__title">Beyond the Screen</h3>
              <button className="btn-admin-primary btn-sm" onClick={addHobby}>+ Add Hobby</button>
            </div>
            <p className="about-section__hint">These appear as cards in the "Beyond the Screen" section.</p>

            {hobbies.length === 0 && (
              <div className="admin-empty" style={{ padding: '32px' }}>
                <span>🎯</span><p>No hobbies added yet.</p>
              </div>
            )}

            <div className="hobbies-grid">
              {hobbies.map((h) => (
                <div key={h.id} className="hobby-edit-card">
                  <div className="hobby-edit-card__top">
                    <button className="admin-icon-btn admin-icon-btn--danger"
                      onClick={() => deleteHobby(h.id)}>🗑</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: '0 0 80px' }}>
                      <label>Icon</label>
                      <input value={h.icon} onChange={e => updateHobby(h.id, 'icon', e.target.value)}
                        placeholder="📚" style={{ textAlign: 'center', fontSize: '22px' }} />
                    </div>
                    <div className="form-group">
                      <label>Title</label>
                      <input value={h.title} onChange={e => updateHobby(h.id, 'title', e.target.value)}
                        placeholder="Sci-Fi Enthusiast" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={h.desc} onChange={e => updateHobby(h.id, 'desc', e.target.value)}
                      rows={2} placeholder="Tell visitors about this hobby..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {activeSection === 'skills' && (
          <div className="about-section">
            <div className="about-section__header">
              <h3 className="about-section__title">Technical Skills</h3>
              <button className="btn-admin-primary btn-sm" onClick={addSkill}>+ Add Skill</button>
            </div>
            <p className="about-section__hint">These appear as cards in the "Technical Arsenal" section on the Home page.</p>

            <div className="skills-edit-grid">
              {skills.map((s, i) => (
                <div key={i} className="skill-edit-card">
                  <div className="form-row" style={{ gap: '8px' }}>
                    <div className="form-group" style={{ flex: '0 0 68px' }}>
                      <label>Icon</label>
                      <input value={s.icon} onChange={e => updateSkill(i, 'icon', e.target.value)}
                        style={{ textAlign: 'center', fontSize: '20px' }} />
                    </div>
                    <div className="form-group">
                      <label>Label</label>
                      <input value={s.label} onChange={e => updateSkill(i, 'label', e.target.value)}
                        placeholder="React & Next.js" />
                    </div>
                    <button className="admin-icon-btn admin-icon-btn--danger skill-del"
                      onClick={() => deleteSkill(i)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save button - always visible */}
        <div className="about-save-bar">
          <p>Changes are saved to your live portfolio immediately after clicking Save.</p>
          <button className="btn-admin-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spin" /> Saving...</> : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;

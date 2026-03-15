import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/client';
import './AdminMessages.css';

const AdminMessages = ({ showToast, onUnreadChange }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.data);
      onUnreadChange && onUnreadChange(res.data.unread);
    } catch {
      showToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await api.patch(`/messages/${msg.id}/read`);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
        onUnreadChange && onUnreadChange(
          messages.filter(m => !m.read && m.id !== msg.id).length
        );
      } catch {}
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/messages/read-all');
      setMessages(prev => prev.map(m => ({ ...m, read: true })));
      onUnreadChange && onUnreadChange(0);
      showToast('All marked as read');
    } catch {
      showToast('Failed to mark all read', 'error');
    }
  };

  const deleteMessage = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated);
      if (selected?.id === id) setSelected(null);
      onUnreadChange && onUnreadChange(updated.filter(m => !m.read).length);
      showToast('Message deleted.');
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) return (
    <div className="msg-loading">
      {[1,2,3,4].map(i => <div key={i} className="admin-skeleton" />)}
    </div>
  );

  return (
    <div className="msg-inbox">
      {/* Left: message list */}
      <div className="msg-list">
        <div className="msg-list__header">
          <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
          {unreadCount > 0 && (
            <button className="msg-mark-all" onClick={markAllRead}>
              Mark all read
            </button>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="msg-empty">
            <span>📭</span>
            <p>No messages yet.</p>
            <small>Messages from the contact form will appear here.</small>
          </div>
        ) : (
          messages.map(m => (
            <div
              key={m.id}
              className={`msg-item ${!m.read ? 'msg-item--unread' : ''} ${selected?.id === m.id ? 'msg-item--active' : ''}`}
              onClick={() => openMessage(m)}
            >
              <div className="msg-item__top">
                <span className="msg-item__name">{m.name}</span>
                <span className="msg-item__date">{formatDate(m.receivedAt)}</span>
              </div>
              <div className="msg-item__subject">{m.subject}</div>
              <div className="msg-item__preview">{m.message}</div>
              {!m.read && <div className="msg-item__dot" />}
            </div>
          ))
        )}
      </div>

      {/* Right: message detail */}
      <div className="msg-detail">
        {!selected ? (
          <div className="msg-detail__empty">
            <span>✉️</span>
            <p>Select a message to read it</p>
          </div>
        ) : (
          <div className="msg-detail__content">
            <div className="msg-detail__header">
              <div>
                <h3>{selected.subject}</h3>
                <div className="msg-detail__meta">
                  <strong>{selected.name}</strong>
                  <span>·</span>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  <span>·</span>
                  <span>{new Date(selected.receivedAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="msg-detail__actions">
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="btn-admin-primary btn-sm" target="_blank" rel="noreferrer">
                  ↩ Reply
                </a>
                <button
                  className="admin-icon-btn admin-icon-btn--danger"
                  onClick={() => setDeleteConfirm(selected.id)}
                  title="Delete"
                >🗑</button>
              </div>
            </div>

            <div className="msg-detail__body">
              {selected.message.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Delete Message</h3>
              <button className="modal__close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="modal__body">
              <div className="delete-confirm">
                <p>Are you sure you want to delete this message? This cannot be undone.</p>
                <div className="form-actions">
                  <button className="btn-admin-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  <button className="btn-admin-danger" onClick={() => deleteMessage(deleteConfirm)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;

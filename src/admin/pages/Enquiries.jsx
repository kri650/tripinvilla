import { useState, useEffect } from 'react';
import { Calendar, Filter, Search, ChevronDown, MessageSquare, X, Clock, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Reply modal state
  const [replyModal, setReplyModal] = useState(null); // holds the enquiry object
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const getToken = () => localStorage.getItem('admin_token');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/enquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setEnquiries(data);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !replyModal) return;
    setReplySubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/enquiries/${replyModal._id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyText })
      });
      if (res.ok) {
        setReplyModal(null);
        setReplyText('');
        fetchEnquiries(); // refresh list
      } else {
        alert('Failed to send reply.');
      }
    } catch (err) {
      alert('Error sending reply.');
    } finally {
      setReplySubmitting(false);
    }
  };

  const filtered = enquiries.filter(e => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const search = searchText.toLowerCase();
    const matchesSearch = !search ||
      (e.user_name || '').toLowerCase().includes(search) ||
      (e.email || '').toLowerCase().includes(search) ||
      (e.query || e.message || '').toLowerCase().includes(search) ||
      (e.propertyName || '').toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });

  const statusBadge = (status) => {
    const styles = {
      Open: { background: '#FEF3C7', color: '#92400E' },
      Replied: { background: '#D1FAE5', color: '#065F46' },
      Closed: { background: '#F3F4F6', color: '#374151' }
    };
    const s = styles[status] || styles.Open;
    return (
      <span style={{
        padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
        fontWeight: 600, ...s
      }}>
        {status || 'Open'}
      </span>
    );
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ margin: '0 40px 12px' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          User Access &gt; <span style={{ color: '#111827', fontWeight: 600 }}>Enquiries</span>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2 className="admin-table-title">Enquiries</h2>
          <div className="admin-table-toolbar">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="admin-toolbar-btn"
              style={{ paddingRight: '12px', cursor: 'pointer' }}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Replied">Replied</option>
              <option value="Closed">Closed</option>
            </select>

            <button className="admin-toolbar-btn filter" onClick={fetchEnquiries}>
              <Filter size={14} /> Refresh
            </button>

            <div className="admin-toolbar-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search by name, email, query..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Enquiry No <ChevronDown size={12} /></th>
                <th>Date & Time <ChevronDown size={12} /></th>
                <th>User Name <ChevronDown size={12} /></th>
                <th>Phone No <ChevronDown size={12} /></th>
                <th>Email Address <ChevronDown size={12} /></th>
                <th>Property <ChevronDown size={12} /></th>
                <th>Query</th>
                <th>Status</th>
                <th>Reply</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>
                    Loading enquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>
                    No enquiries found
                  </td>
                </tr>
              ) : (
                filtered.map((e, idx) => (
                  <tr key={e._id || idx}>
                    <td><span className="admin-id-link">{e.enquiryNo || `ENQ-${4000 + idx}`}</span></td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                    </td>
                    <td style={{ color: '#111827', fontWeight: 500 }}>{e.user_name || e.name || '—'}</td>
                    <td>{e.phone || '—'}</td>
                    <td>{e.email || '—'}</td>
                    <td style={{ maxWidth: '120px', fontSize: '12px', color: '#4B5563' }}>{e.propertyName || '—'}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'normal', lineHeight: '1.4', fontSize: '13px' }}>
                      {e.query || e.message || '—'}
                      {e.reply && (
                        <div style={{ marginTop: '6px', padding: '6px 10px', background: '#F0FDF4', borderLeft: '3px solid #22c55e', borderRadius: '4px', fontSize: '12px', color: '#166534' }}>
                          <strong>Your reply:</strong> {e.reply}
                        </div>
                      )}
                    </td>
                    <td>{statusBadge(e.status)}</td>
                    <td>
                      <button
                        onClick={() => { setReplyModal(e); setReplyText(e.reply || ''); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                          fontWeight: 600, cursor: 'pointer', border: 'none',
                          background: e.status === 'Replied' ? '#F3F4F6' : '#2563EB',
                          color: e.status === 'Replied' ? '#374151' : '#FFFFFF'
                        }}
                      >
                        {e.status === 'Replied' ? <CheckCircle size={13} /> : <MessageSquare size={13} />}
                        {e.status === 'Replied' ? 'Edit Reply' : 'Reply'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setReplyModal(null)}
        >
          <div
            style={{
              background: '#FFFFFF', borderRadius: '16px', padding: '32px',
              width: '520px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                Reply to Enquiry
              </h3>
              <button
                onClick={() => setReplyModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} color="#6B7280" />
              </button>
            </div>

            {/* Enquiry summary */}
            <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                From: {replyModal.user_name || replyModal.name} ({replyModal.email})
              </p>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6B7280' }}>
                Property: {replyModal.propertyName || '—'}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', fontStyle: 'italic' }}>
                "{replyModal.query || replyModal.message}"
              </p>
            </div>

            {/* Reply textarea */}
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'block' }}>
              Your Reply *
            </label>
            <textarea
              rows={5}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type your reply to the guest here..."
              style={{
                width: '100%', padding: '12px', fontSize: '14px',
                border: '1px solid #D1D5DB', borderRadius: '8px',
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                fontFamily: 'inherit', color: '#111827'
              }}
            />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setReplyModal(null)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', fontSize: '14px',
                  border: '1px solid #D1D5DB', background: '#FFFFFF',
                  cursor: 'pointer', color: '#374151', fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={replySubmitting || !replyText.trim()}
                style={{
                  padding: '10px 24px', borderRadius: '8px', fontSize: '14px',
                  border: 'none', background: '#2563EB', color: '#FFFFFF',
                  cursor: replySubmitting || !replyText.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 600, opacity: replySubmitting || !replyText.trim() ? 0.6 : 1
                }}
              >
                {replySubmitting ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

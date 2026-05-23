import React, { useEffect, useState } from 'react';
import { Search, Filter as FilterIcon, Calendar, ChevronDown, MoreVertical } from 'lucide-react';
import { enquiryService } from '../services/api';

export default function Enquiries() {
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Reply States
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const openReplyModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setReplyText(enquiry.reply || '');
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a response.');
      return;
    }
    setSubmittingReply(true);
    try {
      await enquiryService.reply(selectedEnquiry.id, replyText);
      alert('Reply sent successfully!');
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const fetchEnquiries = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const params = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (propertyType && propertyType !== 'All') params.property_type = propertyType;
      if (location) params.location = location;
      if (searchTerm) params.search = searchTerm;

      const res = await enquiryService.getFiltered(params);
      const rows = (res.data || []).map((e) => {
        const d = new Date(e.createdAt || Date.now());
        return {
          id: e._id || 'N/A',
          enquiryNo: e.enquiryNo || String(e._id || '').substring(0, 8),
          dates: d.toLocaleString(),
          name: e.user_name || e.name || 'Guest',
          phone: e.phone || 'N/A',
          email: e.email || 'N/A',
          query: e.query || e.message || 'Enquiry',
          status: e.status || 'Open',
          reply: e.reply || '',
          repliedAt: e.repliedAt,
          propertyName: e.propertyName || 'Property'
        };
      });
      setEnquiriesList(rows);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();

    // Poll every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchEnquiries(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [dateFrom, dateTo, propertyType, location, searchTerm]);

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Enquiries &gt; <span>Inbox</span>
      </div>

      {/* ══ Main Section ══ */}
      <div className="dash-section" style={{ marginBottom: 24, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Card 1: Toolbar Filters */}
        <div className="chart-card" style={{ padding: '16px 20px', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div className="props-table-toolbar" style={{ margin: 0, borderBottom: 'none' }}>
            <div className="props-table-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              Enquiries Inbox
            </div>

            <div className="props-table-actions" style={{ gap: '10px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Date From */}
              <div className="props-filter-select" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>From:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '11.5px', color: '#374151' }}
                />
              </div>

              {/* Date To */}
              <div className="props-filter-select" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>To:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '11.5px', color: '#374151' }}
                />
              </div>

              {/* Property Type Dropdown */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="props-filter-select"
                style={{ border: '1px solid #E5E7EB', outline: 'none', fontSize: '12px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: '#ffffff' }}
              >
                <option value="All">All Categories</option>
                <option value="Homestay">Homestay</option>
                <option value="Hotel">Hotel</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Cottage">Cottage</option>
              </select>

              {/* Location Input */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    width: '110px',
                    background: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => fetchEnquiries()}
                className="props-btn-filter"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <FilterIcon size={13} style={{ color: '#58A429' }} /> Filter
              </button>

              {/* Search Bar */}
              <div className="props-search-wrap">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search name/email/query..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Table List */}
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  {['Enquiry No.', 'Property', 'Dates & Time', 'Guest Name', 'Query', 'Status', 'Actions'].map((h, i) => (
                    <th key={i} style={{ color: '#9CA3AF', fontWeight: 500, padding: '14px 16px' }}>
                      <span className="th-inner">
                        {h}
                        {h && h !== 'Actions' && <ChevronDown size={10} style={{ color: '#CBD5E1', marginLeft: 4 }} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ padding: '14px 16px', color: '#6B7280' }}>Loading enquiries...</td></tr>
                ) : enquiriesList.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '14px 16px', color: '#6B7280' }}>No guest enquiries found in inbox.</td></tr>
                ) : enquiriesList.map((e) => (
                  <tr key={e.id}>
                    <td style={{ color: '#58A429', fontWeight: 600, padding: '14px 16px' }}>{e.enquiryNo}</td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>{e.propertyName}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{e.dates}</td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>
                      <div>{e.name}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 400 }}>{e.phone}</div>
                    </td>
                    <td style={{ color: '#6B7280', padding: '14px 16px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '280px' }}>{e.query}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: e.status === 'Replied' ? '#D1FAE5' : '#FEF3C7',
                        color: e.status === 'Replied' ? '#065F46' : '#92400E'
                      }}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => openReplyModal(e)}
                        style={{
                          background: '#58A429',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ══ Reply Modal Overlay ══ */}
      {selectedEnquiry && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            width: '600px',
            maxWidth: '90%',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            fontFamily: '"Outfit", sans-serif'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                Enquiry Details - {selectedEnquiry.enquiryNo}
              </h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF' }}
              >
                &times;
              </button>
            </div>

            {/* Content Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#4B5563', marginBottom: '20px' }}>
              <div style={{ display: 'flex', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 600, width: '120px', color: '#374151' }}>Property:</span>
                <span>{selectedEnquiry.propertyName}</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 600, width: '120px', color: '#374151' }}>Guest Name:</span>
                <span>{selectedEnquiry.name}</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 600, width: '120px', color: '#374151' }}>Contact Info:</span>
                <span>{selectedEnquiry.email} / {selectedEnquiry.phone}</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px dashed #F3F4F6', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 600, width: '120px', color: '#374151' }}>Date & Time:</span>
                <span>{selectedEnquiry.dates}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', background: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #58A429' }}>
                <span style={{ fontWeight: 600, color: '#374151', fontSize: '12px', marginBottom: '4px' }}>Query Message:</span>
                <span style={{ fontStyle: 'italic', fontSize: '13px' }}>"{selectedEnquiry.query}"</span>
              </div>
            </div>

            {/* Reply Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>Your Reply to Guest:</label>
              <textarea
                rows="4"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the guest here..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  outline: 'none',
                  fontSize: '13px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{
                  background: '#F3F4F6',
                  color: '#4B5563',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={submittingReply}
                style={{
                  background: '#58A429',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: submittingReply ? 0.7 : 1
                }}
              >
                {submittingReply ? 'Sending...' : selectedEnquiry.reply ? 'Update Reply' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

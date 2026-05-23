import { useState, useEffect } from 'react';
import { Calendar, Filter, Search, MoreVertical, ChevronDown } from 'lucide-react';

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/admins');
      const data = await res.json();
      if (Array.isArray(data)) setAdmins(data);
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ margin: '0 40px 12px' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          User Access &gt; <span style={{ color: '#111827', fontWeight: 600 }}>Admin List</span>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2 className="admin-table-title">Admin List</h2>
          <div className="admin-table-toolbar">
            <button className="admin-toolbar-btn">
              <Calendar size={14} /> Date From <ChevronDown size={14} />
            </button>
            <button className="admin-toolbar-btn">
              <Calendar size={14} /> Date To <ChevronDown size={14} />
            </button>
            <button className="admin-toolbar-btn filter">
              <Filter size={14} /> Filter
            </button>
            <div className="admin-toolbar-search">
              <Search size={14} />
              <input type="text" placeholder="Search" />
            </div>
            <button className="admin-toolbar-btn add" onClick={() => setShowAddModal(true)}>
              Add
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Added On <ChevronDown size={12} /></th>
                <th>User Name <ChevronDown size={12} /></th>
                <th>Role <ChevronDown size={12} /></th>
                <th>Email <ChevronDown size={12} /></th>
                <th>Contact Number <ChevronDown size={12} /></th>
                <th>Status <ChevronDown size={12} /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>Loading administrators...</td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>No admins found</td>
                </tr>
              ) : (
                admins.map((a, i) => (
                  <tr key={a._id || a.id || i}>
                    <td style={{ color: '#58A429', fontWeight: 500 }}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}) + ' - 12 PM' : '20 May - 12 PM'}
                    </td>
                    <td style={{ color: '#111827', fontWeight: 500 }}>{a.name || 'Rahul Sharma'}</td>
                    <td style={{ color: '#0C6DC4', fontWeight: 500 }}>{a.role || 'Admin'}</td>
                    <td>{a.email || 'rahul22@gmail.com'}</td>
                    <td>{a.phone || '998877665'}</td>
                    <td>
                      {a.status === 'In-Active' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: 500 }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span> In-Active
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#58A429', fontWeight: 500 }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#58A429' }}></span> Active
                        </span>
                      )}
                    </td>
                    <td>
                      <button className="admin-action-dots">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="admin-table-card" style={{ width: '800px', margin: 0, border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>User Details</h3>
               <button className="admin-toolbar-btn add" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>User Name*</label>
                  <input type="text" placeholder="Namrata Joshi" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Phone Number*</label>
                  <input type="text" placeholder="+91 98765 43210" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Email*</label>
                  <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#6B7280' }}>
                    <option>namrata@gmail.com</option>
                  </select>
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Password*</label>
                  <input type="password" placeholder="••••••••••" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Access Type*</label>
                  <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#6B7280' }}>
                    <option>Full</option>
                  </select>
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Role*</label>
                  <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827' }}>
                    <option>Admin</option>
                  </select>
               </div>
            </div>

            <div style={{ background: '#F8FAF9', borderRadius: '12px', padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Access List</h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <div className="admin-toolbar-search">
                        <Search size={14} />
                        <input type="text" placeholder="Search" style={{ width: '140px', background: '#fff' }} />
                     </div>
                     <button className="admin-toolbar-btn filter"><Filter size={14} /> Filters</button>
                  </div>
               </div>
               <table className="admin-table" style={{ background: 'transparent' }}>
                 <thead>
                   <tr>
                     <th style={{ background: 'transparent' }}>Access</th>
                     <th style={{ background: 'transparent' }}>View</th>
                     <th style={{ background: 'transparent' }}>Add</th>
                     <th style={{ background: 'transparent' }}>Edit</th>
                     <th style={{ background: 'transparent' }}>Delete</th>
                     <th style={{ background: 'transparent' }}></th>
                   </tr>
                 </thead>
                 <tbody>
                   {['Property Management', 'Masters', 'Bookings', 'Content Management', 'User Access'].map((acc, idx) => (
                     <tr key={idx}>
                       <td style={{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB' }}>{acc}</td>
                       <td style={{ borderBottom: '1px solid #E5E7EB' }}><input type="checkbox" defaultChecked={idx < 4} style={{ accentColor: '#0C6DC4' }} /></td>
                       <td style={{ borderBottom: '1px solid #E5E7EB' }}><input type="checkbox" defaultChecked={idx < 4} style={{ accentColor: '#0C6DC4' }} /></td>
                       <td style={{ borderBottom: '1px solid #E5E7EB' }}><input type="checkbox" defaultChecked={idx < 4} style={{ accentColor: '#0C6DC4' }} /></td>
                       <td style={{ borderBottom: '1px solid #E5E7EB' }}><input type="checkbox" defaultChecked={idx < 4} style={{ accentColor: '#0C6DC4' }} /></td>
                       <td style={{ borderBottom: '1px solid #E5E7EB' }}><button className="admin-action-dots"><MoreVertical size={16}/></button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

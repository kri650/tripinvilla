import { useState, useEffect } from 'react';
import { Calendar, Filter, Search, MoreVertical, ChevronDown } from 'lucide-react';
import Pagination from '../../components/Pagination';
import ReadMore from '../../components/ReadMore';

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const itemsPerPage = 10;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    accessType: 'Full',
    role: 'admin'
  });
  
  // Permissions State (Checkboxes)
  const [permissions, setPermissions] = useState({
    'Property Management': { view: true, add: true, edit: true, delete: true },
    'Masters': { view: true, add: true, edit: true, delete: true },
    'Bookings': { view: true, add: true, edit: true, delete: true },
    'Content Management': { view: true, add: true, edit: true, delete: true },
    'User Access': { view: false, add: false, edit: false, delete: false },
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/admins`);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module, action, checked) => {
    setPermissions(prev => ({
      ...prev,
      [module]: { ...prev[module], [action]: checked }
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Name, Email, and Password are required.");
      return;
    }
    
    // Flatten permissions object into array of strings like "Property Management:add"
    const permsArray = [];
    Object.entries(permissions).forEach(([mod, actions]) => {
      if (actions.view) permsArray.push(`${mod}:view`);
      if (actions.add) permsArray.push(`${mod}:add`);
      if (actions.edit) permsArray.push(`${mod}:edit`);
      if (actions.delete) permsArray.push(`${mod}:delete`);
    });

    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          permissions: permsArray
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Admin added successfully!");
        setShowAddModal(false);
        setFormData({ name: '', phone: '', email: '', password: '', accessType: 'Full', role: 'admin' });
        fetchAdmins();
      } else {
        alert(data.message || "Failed to add admin");
      }
    } catch (err) {
      console.error("Error adding admin:", err);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = (admin) => {
    setFormData({
      name: admin.name || '',
      phone: admin.phone || '',
      email: admin.email || '',
      password: '',
      accessType: admin.accessType || 'Full',
      role: admin.role || 'admin'
    });
    
    const newPerms = {
      'Property Management': { view: false, add: false, edit: false, delete: false },
      'Masters': { view: false, add: false, edit: false, delete: false },
      'Bookings': { view: false, add: false, edit: false, delete: false },
      'Content Management': { view: false, add: false, edit: false, delete: false },
      'User Access': { view: false, add: false, edit: false, delete: false },
    };
    
    if (admin.permissions && Array.isArray(admin.permissions)) {
      admin.permissions.forEach(p => {
        const [mod, action] = p.split(':');
        if (newPerms[mod] && newPerms[mod][action] !== undefined) {
          newPerms[mod][action] = true;
        }
      });
    }
    
    setPermissions(newPerms);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/admins/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAdmins();
    } catch (err) {
      console.error("Error deleting admin:", err);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ margin: '0 40px 12px' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          User Access &gt; <span style={{ color: '#111827', fontWeight: 600 }}>Admin List</span>
        </div>
      </div>

      {!showAddModal ? (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2 className="admin-table-title">Admin List</h2>
            <div className="admin-table-toolbar">
              <div className="admin-toolbar-btn" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> 
                <input 
                  type="date" 
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                />
              </div>
              <div className="admin-toolbar-btn" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> 
                <input 
                  type="date" 
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                />
              </div>
              <button className="admin-toolbar-btn filter">
                <Filter size={14} /> Filter
              </button>
              <div className="admin-toolbar-search">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search name, email..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
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
              ) : (() => {
                const filtered = admins.filter(a => {
                  const s = searchTerm.toLowerCase();
                  const matchSearch = !s || (a.name || '').toLowerCase().includes(s) || (a.email || '').toLowerCase().includes(s) || (a.role || '').toLowerCase().includes(s);
                  
                  let matchDate = true;
                  if (dateFrom || dateTo) {
                    const aDate = new Date(a.createdAt || new Date('2026-05-16')); // Fallback for mock
                    aDate.setHours(0,0,0,0);
                    if (dateFrom) {
                      const fd = new Date(dateFrom);
                      fd.setHours(0,0,0,0);
                      if (aDate < fd) matchDate = false;
                    }
                    if (dateTo) {
                      const td = new Date(dateTo);
                      td.setHours(23,59,59,999);
                      if (aDate > td) matchDate = false;
                    }
                  }
                  
                  return matchSearch && matchDate;
                });
                
                const totalItems = filtered.length;
                const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                
                return (
                  <>
                    {paginated.map((a, i) => (
                      <tr key={a._id || a.id || i}>
                        <td style={{ color: '#58A429', fontWeight: 500 }}>
                          {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}) + ' - 12 PM' : '20 May - 12 PM'}
                        </td>
                        <td style={{ color: '#111827', fontWeight: 500 }}><ReadMore maxWords={4}>{a.name || 'Rahul Sharma'}</ReadMore></td>
                        <td style={{ color: '#0C6DC4', fontWeight: 500 }}>{a.role || 'Admin'}</td>
                        <td><ReadMore maxWords={4}>{a.email || 'rahul22@gmail.com'}</ReadMore></td>
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
                        <td style={{ position: 'relative' }}>
                          <button className="admin-action-dots" onClick={() => setActiveDropdown(activeDropdown === a._id ? null : a._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <MoreVertical size={16} color="#9CA3AF" />
                          </button>
                          {activeDropdown === a._id && (
                            <div style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', background: '#FFFFFF', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', borderRadius: '8px', padding: '8px 0', minWidth: '120px', zIndex: 10, border: '1px solid #E5E7EB' }}>
                              <button onClick={() => { handleView(a); setActiveDropdown(null); }} style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', color: '#374151', fontSize: '13px', cursor: 'pointer', display: 'block' }}>View</button>
                              <button onClick={() => { handleDelete(a._id || a.id); setActiveDropdown(null); }} style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', color: '#EF4444', fontSize: '13px', cursor: 'pointer', display: 'block' }}>Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                );
              })()}
            </tbody>
          </table>
          {(() => {
            const filtered = admins.filter(a => {
              const s = searchTerm.toLowerCase();
              const matchSearch = !s || (a.name || '').toLowerCase().includes(s) || (a.email || '').toLowerCase().includes(s) || (a.role || '').toLowerCase().includes(s);
              let matchDate = true;
              if (dateFrom || dateTo) {
                const aDate = new Date(a.createdAt || new Date('2026-05-16'));
                aDate.setHours(0,0,0,0);
                if (dateFrom) {
                  const fd = new Date(dateFrom); fd.setHours(0,0,0,0);
                  if (aDate < fd) matchDate = false;
                }
                if (dateTo) {
                  const td = new Date(dateTo); td.setHours(23,59,59,999);
                  if (aDate > td) matchDate = false;
                }
              }
              return matchSearch && matchDate;
            });
            return (
              <Pagination 
                currentPage={currentPage} 
                totalItems={filtered.length} 
                itemsPerPage={itemsPerPage} 
                onPageChange={setCurrentPage} 
              />
            );
          })()}
        </div>
        </div>
      ) : (
        <div className="admin-table-card" style={{ padding: '32px', background: '#FFFFFF', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
             <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827' }}>User Details</h3>
             <div style={{ display: 'flex', gap: '12px' }}>
               <button onClick={() => setShowAddModal(false)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '10px 24px', borderRadius: '24px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
               <button className="btn-solid-green" onClick={handleSubmit} disabled={submitting} style={{ padding: '10px 32px', borderRadius: '24px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                 {submitting ? 'Adding...' : 'Add'}
               </button>
             </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '28px', marginBottom: '48px' }}>
             <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>User Name*</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Namrata Joshi" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box', color: '#111827', fontSize: '14px' }} />
             </div>
             <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Phone Number*</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box', color: '#111827', fontSize: '14px' }} />
             </div>
             <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Email*</label>
                <div style={{ position: 'relative' }}>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="namrata@gmail.com" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box', color: '#111827', fontSize: '14px' }} />
                </div>
             </div>
             <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Password*</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••••" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box', color: '#111827', fontSize: '14px', letterSpacing: '2px' }} />
             </div>
             <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Access Type*</label>
                <div style={{ position: 'relative' }}>
                  <select name="accessType" value={formData.accessType} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827', fontSize: '14px', appearance: 'none', boxSizing: 'border-box' }}>
                    <option value="Full">Full</option>
                    <option value="Limited">Limited</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '16px', top: '14px', color: '#6B7280', pointerEvents: 'none' }} />
                </div>
             </div>
             <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Role*</label>
                <div style={{ position: 'relative' }}>
                  <select name="role" value={formData.role} onChange={handleInputChange} style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827', fontSize: '14px', appearance: 'none', boxSizing: 'border-box' }}>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '16px', top: '14px', color: '#6B7280', pointerEvents: 'none' }} />
                </div>
             </div>
          </div>

          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827' }}>Access List</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="admin-toolbar-search" style={{ width: '240px', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '8px 16px', borderRadius: '24px' }}>
                    <input type="text" placeholder="Search" style={{ fontSize: '13px' }} />
                    <Search size={14} color="#9CA3AF" />
                  </div>
                  <button className="admin-toolbar-btn" style={{ padding: '8px 16px', borderRadius: '24px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                    Filters <Filter size={14} />
                  </button>
                </div>
             </div>
             <table className="admin-table" style={{ border: 'none' }}>
               <thead>
                 <tr>
                   <th style={{ color: '#6B7280', fontWeight: 500, padding: '16px 24px', borderBottom: '1px solid #F3F4F6', fontSize: '12px' }}>Access</th>
                   <th style={{ color: '#6B7280', fontWeight: 500, padding: '16px 24px', borderBottom: '1px solid #F3F4F6', fontSize: '12px', width: '120px' }}>View</th>
                   <th style={{ color: '#6B7280', fontWeight: 500, padding: '16px 24px', borderBottom: '1px solid #F3F4F6', fontSize: '12px', width: '120px' }}>Add</th>
                   <th style={{ color: '#6B7280', fontWeight: 500, padding: '16px 24px', borderBottom: '1px solid #F3F4F6', fontSize: '12px', width: '120px' }}>Edit</th>
                   <th style={{ color: '#6B7280', fontWeight: 500, padding: '16px 24px', borderBottom: '1px solid #F3F4F6', fontSize: '12px', width: '120px' }}>Delete</th>
                   <th style={{ borderBottom: '1px solid #F3F4F6', width: '40px' }}></th>
                 </tr>
               </thead>
               <tbody>
                 {Object.keys(permissions).map((moduleName, idx) => (
                   <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                     <td style={{ color: moduleName === 'User Access' ? '#9CA3AF' : '#4B5563', fontSize: '13px', padding: '16px 24px', fontWeight: 500 }}>{moduleName}</td>
                     {['view', 'add', 'edit', 'delete'].map(action => (
                       <td key={action} style={{ padding: '16px 24px' }}>
                         <input 
                           type="checkbox" 
                           checked={permissions[moduleName][action]}
                           onChange={(e) => handlePermissionChange(moduleName, action, e.target.checked)}
                           disabled={moduleName === 'User Access'}
                           style={{ accentColor: '#0C6DC4', cursor: moduleName === 'User Access' ? 'not-allowed' : 'pointer', width: '16px', height: '16px', opacity: moduleName === 'User Access' ? 0.3 : 1 }} 
                         />
                       </td>
                     ))}
                     <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                       <MoreVertical size={16} color="#9CA3AF" style={{ cursor: 'pointer' }} />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
}

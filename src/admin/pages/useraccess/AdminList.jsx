import { useState, useEffect } from 'react';
import { Calendar, Filter, Search, MoreVertical, ChevronDown } from 'lucide-react';

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
              ) : admins.filter(a => {
                  const s = searchTerm.toLowerCase();
                  return !s || (a.name || '').toLowerCase().includes(s) || (a.email || '').toLowerCase().includes(s) || (a.role || '').toLowerCase().includes(s);
                }).map((a, i) => (
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
                      <button className="admin-action-dots" onClick={() => handleDelete(a._id || a.id)}>
                        <span style={{color: '#EF4444', fontSize: '13px', fontWeight: 500, cursor: 'pointer'}}>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '40px 20px' }}>
          <div style={{ width: '860px', maxWidth: '100%', background: '#FFFFFF', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>User Details</h3>
               <button className="admin-toolbar-btn add" onClick={() => setShowAddModal(false)} style={{ background: '#F3F4F6', color: '#374151', border: 'none' }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>User Name*</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Namrata Joshi" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Phone Number*</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Email*</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="namrata@gmail.com" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Password*</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••••" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Access Type*</label>
                  <select name="accessType" value={formData.accessType} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827', boxSizing: 'border-box' }}>
                    <option value="Full">Full</option>
                    <option value="Limited">Limited</option>
                  </select>
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Role*</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827', boxSizing: 'border-box' }}>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
               </div>
            </div>

            <div style={{ background: '#F8FAF9', borderRadius: '12px', padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Access List</h4>
               </div>
               <table className="admin-table" style={{ background: 'transparent' }}>
                 <thead>
                   <tr>
                     <th style={{ background: 'transparent' }}>Access</th>
                     <th style={{ background: 'transparent' }}>View</th>
                     <th style={{ background: 'transparent' }}>Add</th>
                     <th style={{ background: 'transparent' }}>Edit</th>
                     <th style={{ background: 'transparent' }}>Delete</th>
                   </tr>
                 </thead>
                 <tbody>
                   {Object.keys(permissions).map((moduleName, idx) => (
                     <tr key={idx}>
                       <td style={{ color: '#6B7280', fontSize: '13px', borderBottom: '1px solid #E5E7EB' }}>{moduleName}</td>
                       {['view', 'add', 'edit', 'delete'].map(action => (
                         <td key={action} style={{ borderBottom: '1px solid #E5E7EB' }}>
                           <input 
                             type="checkbox" 
                             checked={permissions[moduleName][action]}
                             onChange={(e) => handlePermissionChange(moduleName, action, e.target.checked)}
                             style={{ accentColor: '#0C6DC4', cursor: 'pointer' }} 
                           />
                         </td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
               <button 
                 onClick={handleSubmit}
                 disabled={submitting}
                 className="btn-solid-green" 
                 style={{ cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
               >
                 {submitting ? 'Saving...' : 'Save User Access'}
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

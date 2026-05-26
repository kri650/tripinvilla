import { useState, useEffect } from 'react';
import { Sparkles, Edit2, Trash2, Search, AlertTriangle, Home, TreePine, Anchor, Palmtree, Mountain, Dog, Castle } from 'lucide-react';

const availableIcons = [
  { name: 'TreePine', icon: TreePine },
  { name: 'Palmtree', icon: Palmtree },
  { name: 'Mountain', icon: Mountain },
  { name: 'Castle', icon: Castle },
  { name: 'Dog', icon: Dog },
  { name: 'Home', icon: Home },
  { name: 'Anchor', icon: Anchor }
];

export default function UniqueExperienceMaster() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    experienceName: '',
    representingIcon: 'TreePine',
    description: '',
    themeCoverImageUrl: '',
    status: 'Active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/experiences`);
      const data = await res.json();
      if (Array.isArray(data)) setExperiences(data);
    } catch (err) {
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    const backendHost = import.meta.env.VITE_API_BASE.replace('/api', '');
    return `${backendHost}${url}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.experienceName || !formData.description) {
      alert('Please fill out Name and Description.');
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append('experienceName', formData.experienceName);
      dataToSend.append('representingIcon', formData.representingIcon);
      dataToSend.append('description', formData.description);
      dataToSend.append('status', formData.status);

      if (selectedFile) {
        dataToSend.append('themeCoverImage', selectedFile);
      } else {
        dataToSend.append('themeCoverImageUrl', formData.themeCoverImageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80');
      }

      if (isEditing) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/experiences/${formData.id}`, {
          method: 'PUT',
          body: dataToSend
        });
        if (res.ok) {
          fetchExperiences();
          setIsEditing(false);
        } else {
          const err = await res.json();
          alert('Error updating experience: ' + (err.message || 'Unknown error'));
          return;
        }
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/experiences`, {
          method: 'POST',
          body: dataToSend
        });
        if (res.ok) {
          fetchExperiences();
        } else {
          const err = await res.json();
          alert('Error adding experience: ' + (err.message || 'Unknown error'));
          return;
        }
      }

      setFormData({
        id: '',
        experienceName: '',
        representingIcon: 'TreePine',
        description: '',
        themeCoverImageUrl: '',
        status: 'Active'
      });
      setSelectedFile(null);
      setFilePreviewUrl('');
    } catch (err) {
      console.error('Error submitting experience:', err);
    }
  };

  const handleEdit = (expObj) => {
    setFormData({
      id: expObj._id,
      experienceName: expObj.experienceName || expObj.name || '',
      representingIcon: expObj.representingIcon || expObj.icon || 'TreePine',
      description: expObj.description || '',
      themeCoverImageUrl: expObj.themeCoverImageUrl || '',
      status: expObj.status || 'Active'
    });
    setSelectedFile(null);
    setFilePreviewUrl(expObj.themeCoverImageUrl || '');
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/experiences/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) fetchExperiences();
    } catch (err) {
      console.error('Error deleting experience:', err);
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  const getIconComponent = (iconName) => {
    const found = availableIcons.find(i => i.name === iconName);
    const Comp = found ? found.icon : Sparkles;
    return <Comp size={16} className="text-emerald-700" style={{ color: 'var(--primary)' }} />;
  };

  const filteredExperiences = experiences.filter(exp => 
    ((exp.experienceName || exp.name) || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      {/* Breadcrumbs */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Unique Experience Master</span>
      </div>

      {/* Form Container */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              {isEditing ? 'Modify Unique Experience' : 'Add New Unique Experience'}
            </div>
            <div className="master-form-actions">
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer' }}>
                {isEditing ? 'Update Experience' : 'Add Experience'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Experience Name*</label>
              <input 
                type="text" 
                name="experienceName"
                value={formData.experienceName}
                onChange={handleChange}
                placeholder="e.g. Treehouse Stay" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Representing Icon*</label>
              <select 
                name="representingIcon"
                value={formData.representingIcon}
                onChange={handleChange}
                className="form-select"
              >
                {availableIcons.map(i => (
                  <option key={i.name} value={i.name}>{i.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status*</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">
                Theme Cover Image <span style={{ color: '#6B7280', fontSize: 11, fontWeight: 400, marginLeft: 4 }}>(Upload image or paste URL)</span>
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="file-upload-wrapper" style={{ flex: 1 }}>
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size must be less than 5MB.');
                        e.target.value = '';
                        return;
                      }
                      setSelectedFile(file);
                      setFilePreviewUrl(URL.createObjectURL(file));
                    }}
                    className="file-upload-input" 
                    style={{ padding: '8px' }}
                  />
                </div>
                <input 
                  type="text" 
                  name="themeCoverImageUrl"
                  value={formData.themeCoverImageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) {
                      setSelectedFile(null);
                      setFilePreviewUrl(e.target.value);
                    }
                  }}
                  placeholder="Or paste image URL..." 
                  className="form-input"
                  style={{ flex: 1 }}
                />
              </div>
              {filePreviewUrl && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={getFullImageUrl(filePreviewUrl)} alt="preview" style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid #E5E7EB' }} />
                  <span style={{ fontSize: 11, color: '#6B7280' }}>Image Preview</span>
                </div>
              )}
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="form-label">Experience Description*</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a stunning outline description for this specialty experience theme..." 
                className="form-textarea"
                style={{ flex: 1, minHeight: 46, resize: 'none' }}
                required
              />
            </div>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ id: '', experienceName: '', representingIcon: 'TreePine', description: '', themeCoverImageUrl: '', status: 'Active' });
                }}
                className="btn-outline-green"
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 12 }}
              >
                Cancel Edit
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <div className="table-header">
          <div className="table-title">Existing Vacation Experience Themes ({filteredExperiences.length})</div>
          <div className="table-header-right">
            <div className="props-search-wrap">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search theme, description..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '64px', textAlign: 'center' }}>Icon</th>
                <th>Experience Theme</th>
                <th>Description Brief</th>
                <th style={{ width: '80px' }}>Cover Preview</th>
                <th style={{ textAlign: 'center' }}>Properties Count</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>Loading experiences...</td></tr>
              ) : filteredExperiences.length > 0 ? (
                filteredExperiences.map((exp) => (
                  <tr key={exp._id}>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                        {getIconComponent(exp.representingIcon || exp.icon)}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#111827' }}>{exp.experienceName || exp.name}</td>
                    <td style={{ fontSize: '11.5px', color: '#6B7280', whiteSpace: 'normal', maxW: '240px', lineHeight: 1.4 }}>{exp.description}</td>
                    <td>
                      <div style={{ width: 44, height: 32, borderRadius: 4, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                        <img src={getFullImageUrl(exp.themeCoverImageUrl)} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>{exp.propertiesCount ?? 0}</td>
                    <td>
                      <span className={`status-pill ${exp.status ? exp.status.toLowerCase() : 'active'}`}>
                        {exp.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button 
                          onClick={() => handleEdit(exp)}
                          title="Edit Experience"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => triggerDelete(exp._id)}
                          title="Delete Experience"
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>
                    No unique experiences found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', items: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', margin: 'auto' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: '#FEE2E2', borderRadius: '50%', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Delete Experience Theme</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: 1.5 }}>
                  Are you absolutely sure you want to delete this experience theme? This will sever associated listing catalog links.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn-outline-green"
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 13 }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ cursor: 'pointer', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Star, Edit2, Trash2, Search, AlertTriangle,
  Wifi, Tv, Wind, Car, Utensils, Waves, Trees,
  ShieldCheck, Flame, ChefHat, Coffee, Dumbbell,
  Bath, Music, Zap, Package, Info
} from 'lucide-react';
import Pagination from '../../components/Pagination';
import ReadMore from '../../components/ReadMore';

const ICON_MAP = {
  Wifi, Tv, Wind, Car, Utensils, Waves, Trees,
  ShieldCheck, Flame, ChefHat, Coffee, Dumbbell,
  Bath, Music, Zap, Package
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const CATEGORIES = [
  'Basic', 'Kitchen', 'Outdoor', 'Safety', 'Luxury',
  'View', 'Fine & Dining', 'Recreation', 'Wellness', 'Business'
];

const CATEGORY_ICON_MAP = {
  'Basic':       'Wifi',
  'Kitchen':     'ChefHat',
  'Outdoor':     'Trees',
  'Safety':      'ShieldCheck',
  'Luxury':      'Star',
  'View':        'Trees',
  'Fine & Dining': 'Utensils',
  'Recreation':  'Waves',
  'Wellness':    'Bath',
  'Business':    'Tv',
};

const BLANK_FORM = {
  id: '',
  amenitiesName: '',
  amenitiesCategory: 'Basic',
  icon: 'Wifi',
  iconType: 'standard', // 'standard' or 'custom'
  status: 'Active'
};

const getIconUrl = (iconName) => {
  if (!iconName) return '';
  if (iconName.startsWith('http') || iconName.startsWith('data:')) return iconName;
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:8000/api').replace('/api', '');
  if (iconName.startsWith('/uploads/')) return `${base}${iconName}`;
  return `${base}/uploads/${iconName}`;
};

function getIconComp(iconName, cat, size = 15) {
  const name = iconName || CATEGORY_ICON_MAP[cat] || 'Wifi';
  if (name.startsWith('/') || name.startsWith('http')) {
    return (
      <img 
        src={getIconUrl(name)} 
        style={{ width: size, height: size, objectFit: 'contain', display: 'block' }} 
        alt="" 
      />
    );
  }
  const Comp = ICON_MAP[name] || Wifi;
  return <Comp size={size} style={{ color: 'var(--primary)' }} />;
}

const API = `${import.meta.env.VITE_API_BASE}/admin/amenities`;

export default function AmenitiesMaster() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({ ...BLANK_FORM });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toast, setToast] = useState(null);

  /* ─── helpers ─────────────────────────────────────── */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (Array.isArray(data)) setAmenities(data);
    } catch (err) {
      console.error('Error fetching amenities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAmenities(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* auto-suggest icon when category changes */
  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    const suggestedIcon = CATEGORY_ICON_MAP[cat] || formData.icon;
    setFormData(prev => ({ ...prev, amenitiesCategory: cat, icon: suggestedIcon }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amenitiesName.trim()) {
      showToast('Amenity name is required.', 'error');
      return;
    }

    const data = new FormData();
    data.append('amenitiesName', formData.amenitiesName.trim());
    data.append('amenitiesCategory', formData.amenitiesCategory);
    data.append('status', formData.status);

    if (formData.iconType === 'custom') {
      if (uploadedFile) {
        data.append('iconFile', uploadedFile);
      } else {
        data.append('icon', formData.icon);
      }
    } else {
      data.append('icon', formData.icon);
    }

    try {
      if (isEditing) {
        await fetch(`${API}/${formData.id}`, {
          method: 'PUT',
          body: data
        });
        showToast('Amenity updated successfully!');
        setIsEditing(false);
      } else {
        await fetch(API, {
          method: 'POST',
          body: data
        });
        showToast('Amenity added successfully!');
      }
      setFormData({ ...BLANK_FORM });
      setUploadedFile(null);
      fetchAmenities();
    } catch (err) {
      showToast('Error saving amenity.', 'error');
    }
  };

  const handleEdit = (am) => {
    const isCustom = am.icon && (am.icon.startsWith('/') || am.icon.startsWith('http'));
    setFormData({
      id: am._id,
      amenitiesName: am.amenitiesName,
      amenitiesCategory: am.amenitiesCategory || 'Basic',
      icon: am.icon || CATEGORY_ICON_MAP[am.amenitiesCategory] || 'Wifi',
      iconType: isCustom ? 'custom' : 'standard',
      status: am.status || 'Active'
    });
    setUploadedFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({ ...BLANK_FORM });
    setUploadedFile(null);
  };

  const triggerDelete = (id) => { setDeleteTargetId(id); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    try {
      await fetch(`${API}/${deleteTargetId}`, { method: 'DELETE' });
      showToast('Amenity deleted.');
      fetchAmenities();
    } catch (err) {
      showToast('Error deleting amenity.', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  /* ─── filtered list ───────────────────────────────── */
    useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredAmenities = amenities.filter(am => {
    const matchCat = activeCategoryFilter === 'All' || am.amenitiesCategory === activeCategoryFilter;
    const matchSearch = (am.amenitiesName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });


    const totalItems = filteredAmenities.length;
  const paginated = filteredAmenities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="fade-in">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'error' ? '#FEE2E2' : '#DCFCE7',
          color: toast.type === 'error' ? '#DC2626' : '#166534',
          border: `1px solid ${toast.type === 'error' ? '#FECACA' : '#BBF7D0'}`,
          borderRadius: 10, padding: '12px 20px', fontWeight: 600,
          fontSize: 13, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Info size={16} /> {toast.msg}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Amenities Master</span>
      </div>

      {/* ─── Form Card ─────────────────────────────── */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={18} style={{ color: 'var(--primary)' }} />
              {isEditing ? 'Modify Amenity' : 'Add New Amenity'}
            </div>
            <div className="master-form-actions" style={{ display: 'flex', gap: 8 }}>
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="btn-outline-green"
                  style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 12 }}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer' }}>
                {isEditing ? 'Update Amenity' : 'Add Amenity'}
              </button>
            </div>
          </div>

          {/* Form Row */}
          <div className="amenities-form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.8fr 1fr', gap: 16, marginBottom: 0 }}>
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Amenity Name *</label>
              <input
                type="text" name="amenitiesName"
                value={formData.amenitiesName} onChange={handleChange}
                placeholder="e.g. Private Heated Pool"
                className="form-input" required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="amenitiesCategory" value={formData.amenitiesCategory}
                onChange={handleCategoryChange} className="form-select">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Icon */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Icon *</span>
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>
                  <span 
                    onClick={() => setFormData(p => ({ ...p, iconType: 'standard' }))} 
                    style={{ cursor: 'pointer', fontWeight: formData.iconType === 'standard' ? 'bold' : 'normal', color: formData.iconType === 'standard' ? 'var(--primary)' : '#9CA3AF', marginRight: 6 }}
                  >
                    Standard
                  </span>
                  |
                  <span 
                    onClick={() => setFormData(p => ({ ...p, iconType: 'custom' }))} 
                    style={{ cursor: 'pointer', fontWeight: formData.iconType === 'custom' ? 'bold' : 'normal', color: formData.iconType === 'custom' ? 'var(--primary)' : '#9CA3AF', marginLeft: 6 }}
                  >
                    Upload SVG
                  </span>
                </span>
              </label>
              {formData.iconType === 'standard' ? (
                <select name="icon" value={formData.icon}
                  onChange={handleChange} className="form-select">
                  {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              ) : (
                <div className="file-upload-wrapper" style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={uploadedFile ? uploadedFile.name : (formData.icon.startsWith('/') || formData.icon.startsWith('http') ? 'Keep Existing SVG' : 'Choose SVG...')} 
                    readOnly 
                    style={{ border: 'none', background: 'transparent', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }} 
                  />
                  <input 
                    type="file" 
                    accept=".svg,image/svg+xml" 
                    onChange={e => setUploadedFile(e.target.files[0])} 
                    style={{ position: 'absolute', opacity: 0, top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }} 
                  />
                  <button className="btn-browse" type="button">Browse</button>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status *</label>
              <select name="status" value={formData.status}
                onChange={handleChange} className="form-select">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* ─── Category Filter Tabs ──────────────────── */}
      <div className="amenities-tabs-wrapper" style={{
        margin: '0 39px 16px',
        display: 'flex', flexWrap: 'wrap', gap: 6,
        background: '#fff', padding: '8px 12px',
        borderRadius: 12, border: '1px solid #E5E7EB',
        width: 'max-content', maxWidth: '100%'
      }}>
        {['All', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setActiveCategoryFilter(cat)}
            style={{
              padding: '5px 12px', fontSize: 11.5, fontWeight: 600,
              border: 'none', borderRadius: 8, cursor: 'pointer',
              background: activeCategoryFilter === cat ? 'var(--primary)' : 'transparent',
              color: activeCategoryFilter === cat ? '#fff' : '#6B7280',
              transition: 'all 0.15s ease'
            }}>
            {cat === 'All' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* ─── Table ────────────────────────────────── */}
      <div className="table-section">
        <div className="table-header">
          <div className="table-title">
            Amenities
            <span style={{
              marginLeft: 8, background: 'var(--primary-light)',
              color: 'var(--primary)', borderRadius: 20, padding: '2px 10px',
              fontSize: 12, fontWeight: 700
            }}>{filteredAmenities.length}</span>
          </div>
          <div className="table-header-right">
            <div className="props-search-wrap">
              <Search size={15} />
              <input
                type="text" placeholder="Search amenity..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 56, textAlign: 'center' }}>Icon</th>
                <th>Amenity Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Properties Using This</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: 24 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#9CA3AF' }}>
                  Loading amenities...
                </td></tr>
              ) : filteredAmenities.length > 0 ? (
                paginated.map(am => (
                  <tr key={am._id}>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--primary-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: 'auto'
                      }}>
                        {getIconComp(am.icon, am.amenitiesCategory)}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#111827' }}>{am.amenitiesName}</td>
                    <td>
                      <span className="category-pill" style={{ textTransform: 'capitalize' }}>
                        {am.amenitiesCategory || 'Basic'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                        fontSize: 12, fontWeight: 700,
                        background: 'var(--primary-light)', color: 'var(--primary)'
                      }}>
                        {am.propertiesCount ?? 0} properties
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${(am.status || 'active').toLowerCase()}`}>
                        {am.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button onClick={() => handleEdit(am)} title="Edit"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => triggerDelete(am._id)} title="Delete"
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#9CA3AF' }}>
                  No amenities found. Add your first amenity above.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalItems={totalItems} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {/* ─── Delete Modal ──────────────────────────── */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, maxWidth: 400, width: '100%',
            padding: 28, boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                padding: 10, background: '#FEE2E2', borderRadius: '50%',
                color: '#EF4444', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Delete Amenity</h3>
                <p style={{ fontSize: 13, color: '#6B7280', marginTop: 8, lineHeight: 1.6 }}>
                  This will remove the amenity from the platform. Owner forms and guest filters will no longer show it.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowDeleteModal(false)}
                className="btn-outline-green"
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={confirmDelete}
                style={{
                  cursor: 'pointer', background: '#EF4444', color: '#fff',
                  border: 'none', borderRadius: 8, padding: '8px 18px',
                  fontSize: 13, fontWeight: 600
                }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

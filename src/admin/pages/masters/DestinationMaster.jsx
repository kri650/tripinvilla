import ReadMore from '../../components/ReadMore';
import { useState, useEffect } from 'react';
import { Compass, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';

import Pagination from '../../components/Pagination';
export default function DestinationMaster() {
  const [destinations, setDestinations] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState({
    id: '',
    destinationName: '',
    stateId: '',
    countryId: '',
    coverImageUrl: '',
    propertyTypesOffered: ['Villa'],
    propertiesCount: 0,
    description: '',
    status: 'Active'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [destRes, statesRes, countriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE}/master/destinations`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/admin/states/active`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/admin/countries/active`).then(r => r.json())
      ]);
      if (Array.isArray(destRes)) setDestinations(destRes);
      if (Array.isArray(statesRes)) {
        setStates(statesRes);
        if (statesRes.length > 0 && !formData.stateId) {
          setFormData(prev => ({ ...prev, stateId: statesRes[0]._id }));
        }
      }
      if (Array.isArray(countriesRes)) {
        setCountries(countriesRes);
        if (countriesRes.length > 0 && !formData.countryId) {
          setFormData(prev => ({ ...prev, countryId: countriesRes[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching destination master data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleCheckboxChange = (type) => {
    setFormData(prev => {
      const currentTypes = [...prev.propertyTypesOffered];
      if (currentTypes.includes(type)) {
        return { ...prev, propertyTypesOffered: currentTypes.filter(t => t !== type) };
      } else {
        return { ...prev, propertyTypesOffered: [...currentTypes, type] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destinationName || !formData.description) {
      alert('Please fill out Name and Description.');
      return;
    }
    if (formData.propertyTypesOffered.length === 0) {
      alert('Please select at least one property type.');
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append('destinationName', formData.destinationName);
      if (formData.stateId) dataToSend.append('stateId', formData.stateId);
      if (formData.countryId) dataToSend.append('countryId', formData.countryId);
      dataToSend.append('description', formData.description);
      dataToSend.append('status', formData.status);
      dataToSend.append('propertiesCount', formData.propertiesCount);
      dataToSend.append('propertyTypesOffered', JSON.stringify(formData.propertyTypesOffered));

      if (selectedFile) {
        dataToSend.append('coverImage', selectedFile);
      } else {
        dataToSend.append('coverImageUrl', formData.coverImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80');
      }

      if (isEditing) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/destinations/${formData.id}`, {
          method: 'PUT',
          body: dataToSend
        });
        if (res.ok) {
          fetchData();
          setIsEditing(false);
        } else {
          const err = await res.json();
          alert('Error updating destination: ' + (err.message || 'Unknown error'));
          return;
        }
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/destinations`, {
          method: 'POST',
          body: dataToSend
        });
        if (res.ok) {
          fetchData();
        } else {
          const err = await res.json();
          alert('Error adding destination: ' + (err.message || 'Unknown error'));
          return;
        }
      }

      setFormData({
        id: '',
        destinationName: '',
        stateId: states.length > 0 ? states[0]._id : '',
        countryId: countries.length > 0 ? countries[0]._id : '',
        coverImageUrl: '',
        propertyTypesOffered: ['Villa'],
        propertiesCount: 0,
        description: '',
        status: 'Active'
      });
      setSelectedFile(null);
      setFilePreviewUrl('');
    } catch (err) {
      console.error('Error submitting destination:', err);
    }
  };

  const handleEdit = (destObj) => {
    setFormData({
      id: destObj._id,
      destinationName: destObj.destinationName,
      stateId: destObj.stateId?._id || destObj.stateId || (states.length > 0 ? states[0]._id : ''),
      countryId: destObj.countryId?._id || destObj.countryId || (countries.length > 0 ? countries[0]._id : ''),
      coverImageUrl: destObj.coverImageUrl || '',
      propertyTypesOffered: destObj.propertyTypesOffered || ['Villa'],
      propertiesCount: destObj.propertiesCount || 0,
      description: destObj.description || '',
      status: destObj.status || 'Active'
    });
    setSelectedFile(null);
    setFilePreviewUrl(destObj.coverImageUrl || '');
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/destinations/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error deleting destination:', err);
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  const getStateName = (sObj) => sObj?.stateName || states.find(s => s._id === sObj)?.stateName || 'Maharashtra';
  const getCountryName = (cObj) => cObj?.countryName || countries.find(c => c._id === cObj)?.countryName || 'India';

    useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredDestinations = destinations.filter(d => 
    (d.destinationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

    const totalItems = filteredDestinations.length;
  const paginated = filteredDestinations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="fade-in">
      {/* Breadcrumbs */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Destination Master</span>
      </div>

      {/* Form Container */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={18} style={{ color: 'var(--primary)' }} />
              {isEditing ? 'Modify Destination' : 'Add New Destination Profile'}
            </div>
            <div className="master-form-actions">
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer' }}>
                {isEditing ? 'Update Destination' : 'Add Destination'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Destination Name*</label>
              <input 
                type="text" 
                name="destinationName"
                value={formData.destinationName}
                onChange={handleChange}
                placeholder="e.g. Goa" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State*</label>
              <select 
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                className="form-select"
              >
                {states.map(s => (
                  <option key={s._id} value={s._id}>{s.stateName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Country*</label>
              <select 
                name="countryId"
                value={formData.countryId}
                onChange={handleChange}
                className="form-select"
              >
                {countries.map(c => (
                  <option key={c._id} value={c._id}>{c.countryName}</option>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">
                Cover Image <span style={{ color: '#6B7280', fontSize: 11, fontWeight: 400, marginLeft: 4 }}>(Upload image or paste URL)</span>
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
                  name="coverImageUrl"
                  value={formData.coverImageUrl}
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

            <div className="form-group">
              <label className="form-label">Property Types Offered*</label>
              <div style={{ display: 'flex', gap: '20px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '11px 16px', alignItems: 'center', height: '46px' }}>
                {['Villa', 'Hotel', 'Homestay'].map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4B5563', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.propertyTypesOffered.includes(type)}
                      onChange={() => handleCheckboxChange(type)}
                      style={{ cursor: 'pointer', accentColor: 'var(--primary)', width: 15, height: 15 }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: 20 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Total Properties Count*</label>
              <input
                type="number"
                name="propertiesCount"
                value={formData.propertiesCount}
                onChange={handleChange}
                placeholder="e.g. 15"
                min="0"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Destination Description*</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Beaches, vibrant shacks, and rich heritage." 
              className="form-textarea"
              style={{ minHeight: 46 }}
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
                  setFormData({ id: '', destinationName: '', stateId: states.length > 0 ? states[0]._id : '', countryId: countries.length > 0 ? countries[0]._id : '', coverImageUrl: '', propertyTypesOffered: ['Villa'], propertiesCount: 0, description: '', status: 'Active' });
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

      {/* Grid Cards & Table toggler Row */}
      <div style={{ margin: '24px 39px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Destination Catalog ({filteredDestinations.length})</h3>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '4px', display: 'flex', gap: '4px' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', background: viewMode === 'grid' ? 'var(--primary)' : 'transparent', color: viewMode === 'grid' ? '#fff' : '#6B7280' }}
            >
              Grid View
            </button>
            <button 
              onClick={() => setViewMode('table')}
              style={{ padding: '6px 12px', fontSize: '11.5px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', background: viewMode === 'table' ? 'var(--primary)' : 'transparent', color: viewMode === 'table' ? '#fff' : '#6B7280' }}
            >
              List View
            </button>
          </div>

          <div className="props-search-wrap">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search destination..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 180 }}
            />
          </div>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div style={{ margin: '0 39px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6B7280' }}>Loading destinations...</div>
          ) : filteredDestinations.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6B7280' }}>No destinations found</div>
          ) : (
            paginated.map(dest => (
              <div key={dest._id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #EAEAEA', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', height: 320 }}>
                <div style={{ height: 160, position: 'relative', background: '#FAFAFA' }}>
                  <img src={dest.coverImageUrl} alt={dest.destinationName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  <span className={`status-pill ${dest.status ? dest.status.toLowerCase() : 'active'}`} style={{ position: 'absolute', top: 12, right: 12, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {dest.status || 'Active'}
                  </span>

                  <span style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: 6 }}>
                    {dest.propertiesCount ?? 0} Properties
                  </span>
                </div>

                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{dest.destinationName}</h4>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, margin: '0 0 10px' }}>{getStateName(dest.stateId)}, {getCountryName(dest.countryId)}</p>
                    <p style={{ fontSize: '12px', color: '#4B5563', margin: 0, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>{dest.description}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #FAFAFA', paddingTop: 12, marginTop: 12 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(dest.propertyTypesOffered || []).map(t => (
                        <span key={t} style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(dest)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}>
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => triggerDelete(dest._id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List Table Mode */
        <>
          <div className="table-section">
            <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Image</th>
                <th>Destination Name</th>
                <th>State / Country</th>
                <th>Offered Types</th>
                <th>Short Description</th>
                <th style={{ textAlign: 'center' }}>Count</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>Loading destinations...</td></tr>
              ) : paginated.map(dest => (
                <tr key={dest._id}>
                  <td>
                    <div style={{ width: 44, height: 32, borderRadius: 4, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                      <img src={getFullImageUrl(dest.coverImageUrl)} alt={dest.destinationName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#111827' }}>{dest.destinationName}</td>
                  <td style={{ fontWeight: 500, fontSize: '11.5px' }}>{getStateName(dest.stateId)}, {getCountryName(dest.countryId)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(dest.propertyTypesOffered || []).map(t => (
                        <span key={t} style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: '11.5px', color: '#6B7280', maxW: '180px', whiteSpace: 'normal' }}><ReadMore maxWords={2}>{dest.description}</ReadMore></td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>{dest.propertiesCount ?? 0}</td>
                  <td>
                    <span className={`status-pill ${dest.status ? dest.status.toLowerCase() : 'active'}`}>
                      {dest.status || 'Active'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button onClick={() => handleEdit(dest)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => triggerDelete(dest._id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalItems={totalItems} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', items: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', margin: 'auto' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: '#FEE2E2', borderRadius: '50%', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Delete Destination</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: 1.5 }}>
                  Are you absolutely sure you want to delete this destination profile card?
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

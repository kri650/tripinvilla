import { ChevronDown, Edit2, Trash2, MoreVertical } from 'lucide-react';

const locationsList = Array(3).fill(null).map(() => ({
  name: 'Goa',
  type: 'Country',
  parent: 'Candolim -> North Goa -> \nGoa -> India',
  landmark: 'Anjuna Flea Market',
  popularity: 'Tourist Popular',
  about: 'Goa is one of the best \nbeach of India.',
  status: 'Active'
}));

export default function LocationMakers() {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Location Masters</span>
      </div>

      {/* Form Section */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <div className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title">Location Masters</div>
            <div className="master-form-actions">
              <button className="btn-solid-green">Add</button>
            </div>
          </div>

          {/* Row 1: 3 cols */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Location Name*</label>
              <input type="text" className="form-input" defaultValue="Goa, India" />
            </div>
            <div className="form-group">
              <label className="form-label">Location Type*</label>
              <div style={{ position: 'relative' }}>
                <select className="form-select" style={{ appearance: 'none' }} defaultValue="Country">
                  <option>Country</option>
                  <option>State</option>
                  <option>City</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Parent Location*</label>
              <input type="text" className="form-input" defaultValue="Candolim -> North Goa -> Goa -> India" />
            </div>
          </div>

          {/* Row 2: 3 cols */}
          <div className="form-grid-3" style={{ marginBottom: 12 }}>
            <div className="form-group">
              <label className="form-label">Key Landmarks*</label>
              <input type="text" className="form-input" defaultValue="Anjuna Flea Market" />
            </div>
            <div className="form-group">
              <label className="form-label">Landmark Popularity*</label>
              <input type="text" className="form-input" defaultValue="Tourist Popular" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Landmark Images*</span>
                <span style={{ color: '#EF4444', fontSize: 11, fontWeight: 400 }}>Supported File: jpg / max. 5mb</span>
              </label>
              <div className="file-upload-wrapper">
                <input type="text" className="form-input" defaultValue="Image.jpg Image.jpg" readOnly style={{ border: 'none', background: 'transparent' }} />
                <button className="btn-browse">Browse</button>
              </div>
            </div>
          </div>

          {/* Add Landmark Button row */}
          <div style={{ marginBottom: 24 }}>
            <button style={{ border: '1px solid #58A429', color: '#58A429', background: 'transparent', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Add Landmark
            </button>
          </div>

          {/* Row 4: Status (1 col width in a 3 col grid) */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Status*</label>
              <div style={{ position: 'relative' }}>
                <select className="form-select" style={{ appearance: 'none' }} defaultValue="Active">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Row 5: Full width */}
          <div className="form-grid-1" style={{ marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">About Location*</label>
              <textarea className="form-textarea" style={{ minHeight: '80px' }} defaultValue="Goa is one of the best beach of India."></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Location Name <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Location Type <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Parent Location <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Key Landmarks <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Landmark Popularity <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Landmark Image <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>About <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Status <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {locationsList.map((loc, i) => (
                  <tr key={i}>
                    <td style={{ color: '#58A429', fontWeight: 600 }}>{loc.name}</td>
                    <td style={{ color: '#6B7280' }}>{loc.type}</td>
                    <td style={{ color: '#9CA3AF', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{loc.parent}</td>
                    <td style={{ color: '#6B7280' }}>{loc.landmark}</td>
                    <td style={{ color: '#6B7280' }}>{loc.popularity}</td>
                    <td>
                      <div style={{ width: 40, height: 30, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                        <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=100&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="landmark" />
                      </div>
                    </td>
                    <td style={{ color: '#9CA3AF', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{loc.about}</td>
                    <td>
                      <span className="status-pill active">{loc.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Edit2 size={15} strokeWidth={2} /></button>
                        <button style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Trash2 size={15} strokeWidth={2} /></button>
                        <button className="action-dots"><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

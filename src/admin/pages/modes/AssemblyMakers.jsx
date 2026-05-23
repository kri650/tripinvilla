import { ChevronDown, MoreVertical } from 'lucide-react';

const amenitiesList = Array(4).fill(null).map(() => ({
  name: 'Barbeque',
  category: 'Fine & Dining',
  scope: 'Homestay',
  check: '12:00 PM -\n12:00 PM',
  offer: '20% Off',
  status: 'Active'
}));

export default function AssemblyMakers() {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Amenities Master</span>
      </div>

      {/* Form Section */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <div className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title">Amenities Master</div>
            <div className="master-form-actions">
              <button className="btn-solid-green">Add</button>
            </div>
          </div>

          {/* Row 1: 3 cols */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Amenities Name*</label>
              <input type="text" className="form-input" defaultValue="Barbeque" />
            </div>
            <div className="form-group">
              <label className="form-label">Amenities Category*</label>
              <input type="text" className="form-input" defaultValue="Fine & Dining" />
            </div>
            <div className="form-group">
              <label className="form-label">Availability Scope*</label>
              <input type="text" className="form-input" defaultValue="Homestay" />
            </div>
          </div>

          {/* Row 2: 3 cols */}
          <div className="form-grid-3" style={{ marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">Check-in*</label>
              <div style={{ position: 'relative' }}>
                <select className="form-select" style={{ appearance: 'none' }} defaultValue="9:00 AM">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Check Out*</label>
              <input type="text" className="form-input" defaultValue="12:00 PM" />
            </div>
            <div className="form-group">
              <label className="form-label">Offer*</label>
              <input type="text" className="form-input" defaultValue="20% Off" />
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
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Amenities Name <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Category <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Availability Scope <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Check-in &amp; Check Out <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Offer <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Status <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {amenitiesList.map((a, i) => (
                  <tr key={i}>
                    <td style={{ color: '#58A429', fontWeight: 600 }}>{a.name}</td>
                    <td style={{ color: '#6B7280' }}>{a.category}</td>
                    <td style={{ color: '#6B7280' }}>{a.scope}</td>
                    <td style={{ color: '#9CA3AF', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{a.check}</td>
                    <td style={{ color: '#6B7280' }}>{a.offer}</td>
                    <td>
                      <span className="status-pill active">{a.status}</span>
                    </td>
                    <td>
                      <button className="action-dots"><MoreVertical size={14} /></button>
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

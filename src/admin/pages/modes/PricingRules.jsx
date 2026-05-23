import { ChevronDown, Edit2, Trash2, MoreVertical } from 'lucide-react';

const rulesList = Array(5).fill(null).map(() => ({
  id: '1020251',
  name: 'Aparthotel Stare Miasto, Deluxe',
  category: 'Home Stay',
  roomType: 'Deluxe Room 1...',
  bedType: 'King Size 1',
  amenities: 'Barbeque, Pub & 2\nothers',
  price: '₹1,233 per night',
  rules: 'Must Read Rules...\nPrimary Guest should be\natleast 18 years of age.',
  check: '12:00 PM -\n12:00 PM',
  offer: '20% Off',
  status: 'Active'
}));

export default function PricingRules() {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Pricing &amp; Rules Masters</span>
      </div>

      {/* Form Section */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <div className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title">Add Pricing &amp; Rules</div>
            <div className="master-form-actions">
              <button className="btn-solid-green">Add</button>
            </div>
          </div>

          {/* Row 1: 3 cols */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Name*</label>
              <input type="text" className="form-input" defaultValue="Aparthotel Stare Miasto, Deluxe" />
            </div>
            <div className="form-group">
              <label className="form-label">Category*</label>
              <input type="text" className="form-input" defaultValue="Homestay" />
            </div>
            <div className="form-group">
              <label className="form-label">Room Type*</label>
              <div style={{ position: 'relative' }}>
                <select className="form-select" style={{ appearance: 'none' }} defaultValue="Deluxe Room 1, Semi Deluxe 2">
                  <option>Deluxe Room 1, Semi Deluxe 2</option>
                  <option>Suite</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Row 2: 3 cols */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Bed Type*</label>
              <div style={{ position: 'relative' }}>
                <select className="form-select" style={{ appearance: 'none' }} defaultValue="King Size 1">
                  <option>King Size 1</option>
                  <option>Queen Size 2</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Amenities Types*</label>
              <input type="text" className="form-input" defaultValue="Barbeque, Pub & 2 others" />
            </div>
            <div className="form-group">
              <label className="form-label">Price for Room*</label>
              <input type="text" className="form-input" defaultValue="₹1,233 per night" />
            </div>
          </div>

          {/* Row 3: 3 cols */}
          <div className="form-grid-3">
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
              <div style={{ position: 'relative' }}>
                <select className="form-select" style={{ appearance: 'none' }} defaultValue="12:00 PM">
                  <option>12:00 PM</option>
                  <option>11:00 AM</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Offer*</label>
              <input type="text" className="form-input" defaultValue="20% Off" />
            </div>
          </div>

          {/* Row 4: Full width Textarea */}
          <div className="form-grid-1" style={{ marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">Rules &amp; Regulations*</label>
              <textarea 
                className="form-textarea" 
                style={{ minHeight: '120px', lineHeight: '1.6' }}
                defaultValue={"Must Read Rules\n• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)"}
              ></textarea>
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
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Property Name <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Category <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Room Type* <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Bed Type <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Amenities Types <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Price for Room <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Rules <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Check-in &amp; <br/>Check Out <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Offer <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Status <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rulesList.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: '#58A429', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: '#6B7280' }}>{p.category}</td>
                    <td style={{ color: '#6B7280' }}>{p.roomType}</td>
                    <td style={{ color: '#6B7280' }}>{p.bedType}</td>
                    <td style={{ color: '#6B7280', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{p.amenities}</td>
                    <td style={{ color: '#6B7280' }}>{p.price}</td>
                    <td style={{ color: '#9CA3AF', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{p.rules}</td>
                    <td style={{ color: '#9CA3AF', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{p.check}</td>
                    <td style={{ color: '#6B7280' }}>{p.offer}</td>
                    <td>
                      <span className="status-pill active">{p.status}</span>
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

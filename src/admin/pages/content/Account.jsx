export default function Account() {
  return (
    <div className="fade-in">
      <div className="page-header" style={{ margin: '0 40px 12px' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
           <span style={{ color: '#111827', fontWeight: 600 }}>My Profile</span>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header" style={{ marginBottom: '32px' }}>
          <h2 className="admin-table-title">My Profile</h2>
          <button className="admin-toolbar-btn add" style={{ padding: '10px 32px' }}>
            Update
          </button>
        </div>

        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>First Name*</label>
            <input type="text" defaultValue="Rahul" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Last Name*</label>
            <input type="text" defaultValue="Rahul" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          <div style={{ gridRow: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Image*</label>
            <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
               <input type="text" defaultValue="Image.jpg" style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none' }} />
               <button type="button" style={{ padding: '0 20px', background: '#F3F4F6', border: 'none', borderLeft: '1px solid #E5E7EB', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>Browse</button>
            </div>
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>Supported File: .jpg / max. 5mb</p>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Contact Number*</label>
            <input type="text" defaultValue="999888333777" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Email Address*</label>
            <input type="email" defaultValue="rahul@gmail.com" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          
          <div style={{ gridColumn: '3' }}>
             <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Location*</label>
             <input type="text" defaultValue="Mumbai" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
        </form>
      </div>
    </div>
  );
}

const SectionLabel = ({ text }) => (
  <div style={{ marginBottom: 24, marginTop: 12 }}>
    <span style={{ padding: '6px 20px', border: '1px solid #58A429', color: '#58A429', borderRadius: '4px', fontSize: '13px', fontWeight: 500, display: 'inline-block' }}>
      {text}
    </span>
  </div>
);

const FileUpload = ({ label }) => (
  <div className="form-group" style={{ marginBottom: 0 }}>
    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{label}</span>
      <span style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 400 }}>Supported File: .jpg / max. 5mb</span>
    </label>
    <div className="file-upload-wrapper">
      <input type="text" className="form-input" defaultValue="Image.jpg" readOnly style={{ border: 'none', background: 'transparent', flex: 1 }} />
      <button className="btn-browse">Browse</button>
    </div>
  </div>
);

export default function Contacts() {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Content Management &gt; <span>Contacts</span>
      </div>

      {/* Form Card */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header" style={{ marginBottom: 24 }}>
            <div className="master-form-title">Contacts</div>
            <div className="master-form-actions">
              <button className="btn-solid-green">Update</button>
            </div>
          </div>
          
          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Banner */}
          <SectionLabel text="Banner" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="Pioneering the Future of Pharma CRDMO with AI" />
            </div>
            <FileUpload label="Image*" />
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 1 */}
          <SectionLabel text="Section 1" />
          
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="Contact Us" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Subtext*</label>
              <input type="text" className="form-input" defaultValue="Fill out the form below & our team of expert will reach out to you as soon as possible." />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title 2*</label>
              <input type="text" className="form-input" defaultValue="Contact Us" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Subtext 2*</label>
              <input type="text" className="form-input" defaultValue="You can call us or contact us directly" />
            </div>
          </div>

          {/* Address Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 1*</label>
              <input type="text" className="form-input" defaultValue="Address" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="Esc. 135 Cuesta Adan Grijalva, Elda Nav 11777" />
            </div>
            <FileUpload label="Highlight 1 Icon*" />
          </div>

          {/* Email Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 1*</label>
              <input type="text" className="form-input" defaultValue="Email Us" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="contact@econwise.com" />
            </div>
            <FileUpload label="Highlight 1 Icon*" />
          </div>

          {/* Call Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 0 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 1*</label>
              <input type="text" className="form-input" defaultValue="Call Us" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="+91 98765 43210" />
            </div>
            <FileUpload label="Highlight 1 Icon*" />
          </div>
        </div>
      </div>
    </div>
  );
}

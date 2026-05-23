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

export default function AboutUs() {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Content Management &gt; <span>About Us</span>
      </div>

      {/* Form Card */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header" style={{ marginBottom: 24 }}>
            <div className="master-form-title">About Us</div>
            <div className="master-form-actions">
              <button className="btn-solid-green">Update</button>
            </div>
          </div>
          
          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 2 */}
          <SectionLabel text="Section 2" />
          
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="Verified & Trusted Stays Get genuine and good stays" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" defaultValue="Every property is carefully verified to ensure quality, safety, and comfort you can rely on." />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="24/7 Support, Always There" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" defaultValue="From booking to checkout, our support team is available anytime to help you." />
            </div>
          </div>

          {/* Row 3 (3 cols) */}
          <div className="form-grid-3" style={{ marginBottom: 24 }}>
            <FileUpload label="Image 1*" />
            <FileUpload label="Icon 1*" />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="Secure Payments" />
            </div>
          </div>

          {/* Row 4 (Image 3 spanning full 3 cols) */}
          <div style={{ marginBottom: 24 }}>
            <FileUpload label="Image 3*" />
          </div>

          {/* Row 5 (3 cols) */}
          <div className="form-grid-3" style={{ marginBottom: 0 }}>
            <FileUpload label="Image 2*" />
            <FileUpload label="Icon 2*" />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="Best Price Guarantee" />
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '24px -32px 24px -32px' }} />

          {/* Section 3: Testimonials */}
          <SectionLabel text="Section 3" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" defaultValue="Our Testimonials" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" defaultValue="Check what our customers says about us" />
            </div>
          </div>

          {Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: i === 3 ? 0 : 24 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Testimonial {i + 1}*</label>
                <input type="text" className="form-input" defaultValue="Working with this..." />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Customer Name *</label>
                <input type="text" className="form-input" defaultValue="Jessy Roy" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Designation*</label>
                <input type="text" className="form-input" defaultValue="Director Of Operations" />
              </div>
              <FileUpload label={`Image ${i + 1}*`} />
              <FileUpload label={`Video ${i + 1}*`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

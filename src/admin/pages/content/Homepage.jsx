import React, { useState, useEffect } from 'react';

const SectionLabel = ({ text }) => (
  <div style={{ marginBottom: 24, marginTop: 12 }}>
    <span style={{ padding: '6px 20px', border: '1px solid #58A429', color: '#58A429', borderRadius: '4px', fontSize: '13px', fontWeight: 500, display: 'inline-block' }}>
      {text}
    </span>
  </div>
);

const FileUpload = ({ label, name, onChange, fileValue }) => (
  <div className="form-group" style={{ marginBottom: 0 }}>
    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{label}</span>
      <span style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 400 }}>Supported File: .jpg / max. 5mb</span>
    </label>
    <div className="file-upload-wrapper" style={{ position: 'relative' }}>
      <input type="text" className="form-input" value={fileValue || 'Choose a file...'} readOnly style={{ border: 'none', background: 'transparent', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }} />
      <input type="file" name={name} onChange={onChange} style={{ position: 'absolute', opacity: 0, top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }} />
      <button className="btn-browse" type="button">Browse</button>
    </div>
  </div>
);

export default function Homepage() {
  const [formData, setFormData] = useState({
    banner: { title: 'Find Your Perfect Stay', image: '' },
    section1: { title: 'Best Villas around you', subText: 'Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.' },
    section2: { title: 'Curated properties', subText: 'Carefully selected stays that meet our standards for comfort, quality, and location.' },
    section3: { title: 'Top Destinations around you', subText: 'Choose the next destination for you' },
    section4: { title: 'Popular Offers of Property', subText: 'Carefully selected stays that meet our standards for comfort, quality, and location.' },
    section5: {
      title: 'Why Choose Our *Services*',
      subText: 'Choose the next destination for you',
      row1: { title: 'Verified & Trusted Stays', subText: 'Get genuine and good stays' },
      row1Desc: 'Every property is carefully verified to ensure quality, safety, and comfort you can rely on.',
      row2: { title: '24/7 Support, Always There', subText: 'All type of support' },
      row2Desc: 'From booking to checkout, our support team is available anytime to help you.',
      features: [
        { title: 'Secure Payments', image: '', icon: '' },
        { title: 'Best Price Guarantee', image: '', icon: '' },
        { title: 'Fast Booking', image: '', icon: '' }
      ],
      image3: ''
    },
    section6: {
      title: 'Our Testimonials', subText: 'Check what our customers says about us',
      testimonials: Array(4).fill({ text: 'Working with this...', name: 'Jessy Rey', designation: 'Director Of Operations', image: '', video: '' })
    },
    section7: {
      point1: 'Curated & Verified Stays', point2: 'Seamless Booking Experience',
      highlights: [
        { title: 'Our Mission', subText: 'Our mission is to connect travelers ...', icon: '' },
        { title: 'Our Mission', subText: 'Our mission is to connect travelers ...', icon: '' }
      ],
      experience: { title: '40+', subText: 'Years of Experience That Drive Results' },
      mainImage: ''
    }
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/content/homepage`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data && Object.keys(data.data).length > 0) {
          setFormData(prev => ({ ...prev, ...data.data }));
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e, path) => {
    const value = e.target.value;
    setFormData(prev => {
      const keys = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleFileChange = (e, fieldname) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [fieldname]: e.target.files[0] }));
    }
  };

  const getFileDisplay = (fieldname) => {
    if (files[fieldname]) return files[fieldname].name;
    const keys = fieldname.split('.');
    let current = formData;
    for (const key of keys) {
      if (!current) break;
      current = current[key];
    }
    if (current && typeof current === 'string' && current.startsWith('http')) {
      return current.split('/').pop();
    }
    return '';
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('contentData', JSON.stringify(formData));
      Object.keys(files).forEach(key => {
        fd.append(key, files[key]);
      });
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/content/homepage`, {
        method: 'PUT',
        body: fd
      });
      if (res.ok) {
        alert('Homepage content updated successfully!');
      } else {
        alert('Failed to update homepage content.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating homepage content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Content Management &gt; <span>Homepage</span>
      </div>

      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header" style={{ marginBottom: 24 }}>
            <div className="master-form-title">Homepage</div>
            <div className="master-form-actions">
              <button className="btn-solid-green" onClick={handleUpdate} disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
          
          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Banner */}
          <SectionLabel text="Banner" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title* <span style={{fontSize: 10, color: "#9CA3AF", fontWeight: "normal"}}>(Wrap word in *asterisks* to highlight)</span></label>
              <input type="text" className="form-input" value={formData.banner.title} onChange={e => handleChange(e, 'banner.title')} />
            </div>
            <FileUpload label="Upload Image*" name="banner.image" onChange={e => handleFileChange(e, 'banner.image')} fileValue={getFileDisplay('banner.image')} />
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 1 */}
          <SectionLabel text="Section 1" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title* <span style={{fontSize: 10, color: "#9CA3AF", fontWeight: "normal"}}>(Wrap word in *asterisks* to highlight)</span></label>
              <input type="text" className="form-input" value={formData.section1.title} onChange={e => handleChange(e, 'section1.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section1.subText} onChange={e => handleChange(e, 'section1.subText')} />
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 2 */}
          <SectionLabel text="Section 2" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title* <span style={{fontSize: 10, color: "#9CA3AF", fontWeight: "normal"}}>(Wrap word in *asterisks* to highlight)</span></label>
              <input type="text" className="form-input" value={formData.section2.title} onChange={e => handleChange(e, 'section2.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section2.subText} onChange={e => handleChange(e, 'section2.subText')} />
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 3 */}
          <SectionLabel text="Section 3" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title* <span style={{fontSize: 10, color: "#9CA3AF", fontWeight: "normal"}}>(Wrap word in *asterisks* to highlight)</span></label>
              <input type="text" className="form-input" value={formData.section3.title} onChange={e => handleChange(e, 'section3.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section3.subText} onChange={e => handleChange(e, 'section3.subText')} />
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 4 */}
          <SectionLabel text="Section 4" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title* <span style={{fontSize: 10, color: "#9CA3AF", fontWeight: "normal"}}>(Wrap word in *asterisks* to highlight)</span></label>
              <input type="text" className="form-input" value={formData.section4.title} onChange={e => handleChange(e, 'section4.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section4.subText} onChange={e => handleChange(e, 'section4.subText')} />
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 5 */}
                    <SectionLabel text="Section 5" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Main Title*</label>
              <input type="text" className="form-input" value={formData.section5.title || ''} onChange={e => handleChange(e, 'section5.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Main Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section5.subText || ''} onChange={e => handleChange(e, 'section5.subText')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 1 Title*</label>
              <input type="text" className="form-input" value={formData.section5.row1.title} onChange={e => handleChange(e, 'section5.row1.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 1 Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section5.row1.subText} onChange={e => handleChange(e, 'section5.row1.subText')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 1 Description*</label>
              <input type="text" className="form-input" value={formData.section5.row1Desc || ''} onChange={e => handleChange(e, 'section5.row1Desc')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 2 Title*</label>
              <input type="text" className="form-input" value={formData.section5.row2.title} onChange={e => handleChange(e, 'section5.row2.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 2 Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section5.row2.subText} onChange={e => handleChange(e, 'section5.row2.subText')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Row 2 Description*</label>
              <input type="text" className="form-input" value={formData.section5.row2Desc || ''} onChange={e => handleChange(e, 'section5.row2Desc')} />
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: 24 }}>
            <FileUpload label="Image 1*" name="section5.features.0.image" onChange={e => handleFileChange(e, 'section5.features.0.image')} fileValue={getFileDisplay('section5.features.0.image')} />
            <FileUpload label="Icon 1*" name="section5.features.0.icon" onChange={e => handleFileChange(e, 'section5.features.0.icon')} fileValue={getFileDisplay('section5.features.0.icon')} />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Feature 1 Title*</label>
              <input type="text" className="form-input" value={formData.section5.features[0].title} onChange={e => handleChange(e, 'section5.features.0.title')} />
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: 24 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <FileUpload label="Image 3 (Center)*" name="section5.image3" onChange={e => handleFileChange(e, 'section5.image3')} fileValue={getFileDisplay('section5.image3')} />
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: 0 }}>
            <FileUpload label="Image 2*" name="section5.features.1.image" onChange={e => handleFileChange(e, 'section5.features.1.image')} fileValue={getFileDisplay('section5.features.1.image')} />
            <FileUpload label="Icon 2*" name="section5.features.1.icon" onChange={e => handleFileChange(e, 'section5.features.1.icon')} fileValue={getFileDisplay('section5.features.1.icon')} />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Feature 2 Title*</label>
              <input type="text" className="form-input" value={formData.section5.features[1].title} onChange={e => handleChange(e, 'section5.features.1.title')} />
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '24px -32px 24px -32px' }} />

          {/* Section 6 */}
          <SectionLabel text="Section 6 (Testimonials)" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title* <span style={{fontSize: 10, color: "#9CA3AF", fontWeight: "normal"}}>(Wrap word in *asterisks* to highlight)</span></label>
              <input type="text" className="form-input" value={formData.section6.title} onChange={e => handleChange(e, 'section6.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section6.subText} onChange={e => handleChange(e, 'section6.subText')} />
            </div>
          </div>
          {formData.section6.testimonials.map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: i === 3 ? 0 : 24 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Text {i + 1}*</label>
                <input type="text" className="form-input" value={t.text} onChange={e => handleChange(e, `section6.testimonials.${i}.text`)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Name*</label>
                <input type="text" className="form-input" value={t.name} onChange={e => handleChange(e, `section6.testimonials.${i}.name`)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Designation*</label>
                <input type="text" className="form-input" value={t.designation} onChange={e => handleChange(e, `section6.testimonials.${i}.designation`)} />
              </div>
              <FileUpload label={`Image ${i + 1}`} name={`section6.testimonials.${i}.image`} onChange={e => handleFileChange(e, `section6.testimonials.${i}.image`)} fileValue={getFileDisplay(`section6.testimonials.${i}.image`)} />
              <FileUpload label={`Video ${i + 1}`} name={`section6.testimonials.${i}.video`} onChange={e => handleFileChange(e, `section6.testimonials.${i}.video`)} fileValue={getFileDisplay(`section6.testimonials.${i}.video`)} />
            </div>
          ))}

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '24px -32px 24px -32px' }} />

          {/* Section 7 */}
          <SectionLabel text="Section 7 (Highlights)" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Point 1*</label>
              <input type="text" className="form-input" value={formData.section7.point1} onChange={e => handleChange(e, 'section7.point1')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Point 2*</label>
              <input type="text" className="form-input" value={formData.section7.point2} onChange={e => handleChange(e, 'section7.point2')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 1 Title*</label>
              <input type="text" className="form-input" value={formData.section7.highlights[0].title} onChange={e => handleChange(e, 'section7.highlights.0.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 1 Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section7.highlights[0].subText} onChange={e => handleChange(e, 'section7.highlights.0.subText')} />
            </div>
            <FileUpload label="Highlight 1 Icon*" name="section7.highlights.0.icon" onChange={e => handleFileChange(e, 'section7.highlights.0.icon')} fileValue={getFileDisplay('section7.highlights.0.icon')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 2 Title*</label>
              <input type="text" className="form-input" value={formData.section7.highlights[1].title} onChange={e => handleChange(e, 'section7.highlights.1.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 2 Sub-Text*</label>
              <input type="text" className="form-input" value={formData.section7.highlights[1].subText} onChange={e => handleChange(e, 'section7.highlights.1.subText')} />
            </div>
            <FileUpload label="Highlight 2 Icon*" name="section7.highlights.1.icon" onChange={e => handleFileChange(e, 'section7.highlights.1.icon')} fileValue={getFileDisplay('section7.highlights.1.icon')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Experience Title*</label>
              <input type="text" className="form-input" value={formData.section7.experience.title} onChange={e => handleChange(e, 'section7.experience.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Experience Sub-text*</label>
              <input type="text" className="form-input" value={formData.section7.experience.subText} onChange={e => handleChange(e, 'section7.experience.subText')} />
            </div>
          </div>

          <div className="form-grid-1" style={{ marginBottom: 0 }}>
            <FileUpload label="Main Image*" name="section7.mainImage" onChange={e => handleFileChange(e, 'section7.mainImage')} fileValue={getFileDisplay('section7.mainImage')} />
          </div>

        </div>
      </div>
    </div>
  );
}

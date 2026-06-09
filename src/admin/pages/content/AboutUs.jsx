import React, { useState, useEffect, useRef } from 'react';

const SectionLabel = ({ text }) => (
  <div style={{ marginBottom: 24, marginTop: 12 }}>
    <span style={{ padding: '6px 20px', border: '1px solid #58A429', color: '#58A429', borderRadius: '4px', fontSize: '13px', fontWeight: 500, display: 'inline-block' }}>
      {text}
    </span>
  </div>
);

const FileUpload = ({ label, name, onChange, fileData, accept }) => {
  const [preview, setPreview] = useState(false);
  const previewRef = React.useRef(null);
  const isIcon = label.toLowerCase().includes('icon') || label.toLowerCase().includes('svg');
  const isVideo = label.toLowerCase().includes('video');
  
  const isFile = fileData instanceof File;
  const filename = isFile ? fileData.name : (fileData ? fileData.split('/').pop() : '');
  const previewUrl = isFile ? URL.createObjectURL(fileData) : fileData;

  const handleTogglePreview = () => {
    setPreview(!preview);
    if (!preview) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const getAcceptType = () => {
    if (accept) return accept;
    if (isIcon) return '.svg,image/svg+xml';
    if (isVideo) return 'video/mp4,video/quicktime,video/x-m4v,video/webm';
    return 'image/*';
  };

  return (
    <div className="form-group" style={{ marginBottom: preview ? 24 : 0 }}>
      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
      </label>
      
      <div className="file-upload-wrapper" style={{ display: 'flex', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
        <input type="text" className="form-input" value={filename || 'Choose a file...'} readOnly style={{ border: 'none', background: 'transparent', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', padding: '12px 16px' }} />
        
        <div style={{ position: 'relative' }}>
          <input type="file" name={name} accept={getAcceptType()} onChange={onChange} style={{ position: 'absolute', opacity: 0, top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }} />
          <button className="btn-browse" type="button" style={{ border: 'none', borderLeft: '1px solid #E5E7EB', background: '#F3F4F6', height: '100%', padding: '0 20px', cursor: 'pointer', color: '#374151', fontSize: '13px', fontWeight: 500 }}>Browse</button>
        </div>
        
        {previewUrl && (
          <button
            type="button"
            onClick={handleTogglePreview}
            style={{
              border: 'none', borderLeft: '1px solid #E5E7EB', background: preview ? '#E5E7EB' : '#F9FAFB',
              padding: '0 20px', cursor: 'pointer', color: '#111827', fontSize: '13px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
            }}
          >
            {preview ? 'Hide' : 'View'}
          </button>
        )}
      </div>

      <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 400, marginTop: '4px' }}>
        {isIcon ? 'Supported File: .svg / max. 5mb' : isVideo ? 'Supported File: .mp4 / max. 50mb' : 'Supported File: .jpg / max. 5mb'}
      </div>

      {preview && previewUrl && (
        <div ref={previewRef} style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#FAFAFA', padding: '16px', display: 'flex', justifyContent: 'center' }}>
          {previewUrl.endsWith('.mp4') || previewUrl.endsWith('.webm') || previewUrl.endsWith('.mov') || previewUrl.endsWith('.m4v') ? (
             <video src={previewUrl} controls autoPlay style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          ) : (
             <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'block', objectFit: 'contain' }} />
          )}
        </div>
      )}
    </div>
  );
};

export default function AboutUs() {
  const [formData, setFormData] = useState({
    banner: { title: 'About Us', image: '' },
    section1: {
      title: 'Redefining the Way You *Experience Stays*',
      subText: 'We bring together handpicked hotels and private villas that combine comfort, quality, and reliability. Every property on our platform is carefully verified to ensure high standards of hospitality, transparent pricing, and a seamless booking experience.',
      point1: 'Curated & Verified Stays',
      point2: 'Seamless Booking Experience',
      highlights: [
        { title: 'Our Mission', subText: 'Our mission is to connect travelers with high-quality stays through a user-friendly platform.', icon: '' },
        { title: 'Our Vision', subText: 'To become a trusted travel platform that redefines how people discover and experience hotels and villas.', icon: '' }
      ],
      experience: { title: '40+', subText: 'Years of Experience That Drive Results' },
      mainImage: ''
    },
    section2: {
      title: 'Why Choose Our *Services*',
      subText: 'Choose the next destination for you',
      row1: { title: 'Verified & Trusted Stays', subText: 'Get genuine and good stays' },
      row1Desc: 'Every property is carefully verified.',
      row2: { title: '24/7 Support, Always There', subText: 'All type of support' },
      row2Desc: 'From booking to checkout, our support team is available anytime to help you.',
      features: [
        { title: 'Secure Payments', image: '', icon: '' },
        { title: 'Best Price Guarantee', image: '', icon: '' },
      ],
      imageCenter: ''
    },
    section3: {
      title: 'Our *Testimonials*',
      subText: 'Check what our customers says about us',
      testimonials: [
        { name: 'Jessy Roy', designation: 'Director of Operations, Enterprise Client', text: '"Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth."', image: '', video: '' },
        { name: 'Jeremy Renner', designation: 'Project Manager, Corporate Solutions Firm', text: '"From initial consultation to final delivery, the team demonstrated exceptional professionalism."', image: '', video: '' },
        { name: 'Winona Ryder', designation: 'CEO, Growing Tech Company', text: '"They didn\'t just deliver a solution—they delivered confidence and long-term value."', image: '', video: '' },
        { name: 'David Campbell', designation: 'Head of Digital Transformation', text: '', image: '', video: '' }
      ]
    }
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/content/aboutUs`)
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
    if (files[fieldname]) return files[fieldname];
    const keys = fieldname.split('.');
    let current = formData;
    for (const key of keys) {
      if (!current) break;
      current = current[key];
    }
    if (current && typeof current === 'string' && current.startsWith('http')) {
      return current;
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/content/aboutUs`, {
        method: 'PUT',
        body: fd
      });
      if (res.ok) {
        const result = await res.json();
        if (result?.data) {
          setFormData(prev => ({ ...prev, ...result.data }));
        }
        setFiles({});
        alert('About Us content updated successfully!');
      } else {
        alert('Failed to update About Us content.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating About Us content.');
    } finally {
      setLoading(false);
    }
  };

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
              <button className="btn-solid-green" onClick={handleUpdate} disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
          
          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Banner */}
          <SectionLabel text="Banner" />
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Banner Title*</label>
              <input type="text" className="form-input" placeholder="Enter banner title..." value={formData.banner.title} onChange={e => handleChange(e, 'banner.title')} />
            </div>
            <FileUpload label="Banner Image*" name="banner.image" onChange={e => handleFileChange(e, 'banner.image')} fileData={getFileDisplay('banner.image')} />
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 1 — Intro block on About Us page */}
          <SectionLabel text="Section 1 — Intro (Mission, Vision & Experience)" />
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title* <span style={{fontSize: 10, color: "#9CA3AF", fontWeight: "normal"}}>(Wrap word in *asterisks* to highlight)</span></label>
              <input type="text" className="form-input" placeholder="Enter section title..." value={formData.section1.title} onChange={e => handleChange(e, 'section1.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" placeholder="Enter sub-text..." value={formData.section1.subText} onChange={e => handleChange(e, 'section1.subText')} />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Point 1*</label>
              <input type="text" className="form-input" placeholder="Enter point 1..." value={formData.section1.point1} onChange={e => handleChange(e, 'section1.point1')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Point 2*</label>
              <input type="text" className="form-input" placeholder="Enter point 2..." value={formData.section1.point2} onChange={e => handleChange(e, 'section1.point2')} />
            </div>
          </div>
          <div className="form-grid-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mission Title*</label>
              <input type="text" className="form-input" placeholder="Enter mission title..." value={formData.section1.highlights[0].title} onChange={e => handleChange(e, 'section1.highlights.0.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mission Sub-Text*</label>
              <input type="text" className="form-input" placeholder="Enter mission sub-text..." value={formData.section1.highlights[0].subText} onChange={e => handleChange(e, 'section1.highlights.0.subText')} />
            </div>
            <FileUpload label="Upload SVG (Mission Icon)*" name="section1.highlights.0.icon" onChange={e => handleFileChange(e, 'section1.highlights.0.icon')} fileData={getFileDisplay('section1.highlights.0.icon')} />
          </div>
          <div className="form-grid-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Vision Title*</label>
              <input type="text" className="form-input" placeholder="Enter vision title..." value={formData.section1.highlights[1].title} onChange={e => handleChange(e, 'section1.highlights.1.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Vision Sub-Text*</label>
              <input type="text" className="form-input" placeholder="Enter vision sub-text..." value={formData.section1.highlights[1].subText} onChange={e => handleChange(e, 'section1.highlights.1.subText')} />
            </div>
            <FileUpload label="Upload SVG (Vision Icon)*" name="section1.highlights.1.icon" onChange={e => handleFileChange(e, 'section1.highlights.1.icon')} fileData={getFileDisplay('section1.highlights.1.icon')} />
          </div>
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Experience Title*</label>
              <input type="text" className="form-input" placeholder="Enter experience title..." value={formData.section1.experience.title} onChange={e => handleChange(e, 'section1.experience.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Experience Sub-text*</label>
              <input type="text" className="form-input" placeholder="Enter experience sub-text..." value={formData.section1.experience.subText} onChange={e => handleChange(e, 'section1.experience.subText')} />
            </div>
          </div>
          <div className="form-grid-1" style={{ marginBottom: 24 }}>
            <FileUpload label="Main Image*" name="section1.mainImage" onChange={e => handleFileChange(e, 'section1.mainImage')} fileData={getFileDisplay('section1.mainImage')} />
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 3: Testimonials */}
          <SectionLabel text="Section 3 — Testimonials (shown on About Us page)" />
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title* <span style={{fontSize: 10, color: "#9CA3AF", fontWeight: "normal"}}>(Wrap word in *asterisks* to highlight)</span></label>
              <input type="text" className="form-input" placeholder="Enter section title..." value={formData.section3.title} onChange={e => handleChange(e, 'section3.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Text*</label>
              <input type="text" className="form-input" placeholder="Enter sub-text..." value={formData.section3.subText} onChange={e => handleChange(e, 'section3.subText')} />
            </div>
          </div>

          {formData.section3.testimonials.map((t, i) => (
            <div key={i} className="testimonial-form-row" style={{ marginBottom: i === 3 ? 0 : 24 }}>
              {i !== 3 ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Text {i + 1}*</label>
                    <input type="text" className="form-input" placeholder="Enter testimonial text..." value={t.text} onChange={e => handleChange(e, `section3.testimonials.${i}.text`)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name*</label>
                    <input type="text" className="form-input" placeholder="Enter person's name..." value={t.name} onChange={e => handleChange(e, `section3.testimonials.${i}.name`)} />
                  </div>
                  <FileUpload label={`Image ${i + 1}`} name={`section3.testimonials.${i}.image`} onChange={e => handleFileChange(e, `section3.testimonials.${i}.image`)} fileData={getFileDisplay(`section3.testimonials.${i}.image`)} />
                  <div className="form-group">
                    <label className="form-label">Designation*</label>
                    <input type="text" className="form-input" placeholder="Enter designation and company..." value={t.designation} onChange={e => handleChange(e, `section3.testimonials.${i}.designation`)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Name*</label>
                    <input type="text" className="form-input" placeholder="Enter person's name..." value={t.name} onChange={e => handleChange(e, `section3.testimonials.${i}.name`)} />
                  </div>
                  <FileUpload label={`Video ${i + 1}`} name={`section3.testimonials.${i}.video`} onChange={e => handleFileChange(e, `section3.testimonials.${i}.video`)} fileData={getFileDisplay(`section3.testimonials.${i}.video`)} />
                  <div className="form-group">
                    <label className="form-label">Designation*</label>
                    <input type="text" className="form-input" placeholder="Enter designation and company..." value={t.designation} onChange={e => handleChange(e, `section3.testimonials.${i}.designation`)} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="video-only-badge">📹 Video Only</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

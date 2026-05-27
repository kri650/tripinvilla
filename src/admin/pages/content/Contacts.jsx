import { useState, useEffect } from 'react';

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

export default function Contacts() {
  const [formData, setFormData] = useState({
    banner: { title: 'Contact Us', image: '' },
    section1: {
      title: 'Contact Us',
      subText: 'Fill out the form below & our team of expert will reach out to you as soon as possible.',
      title2: 'Contact Us',
      subText2: 'You can call us or contact us directly',
      address: { highlight: 'Address', title: 'Esc. 135 Cuesta Adan Grijalva, Elda Nav 11777', icon: '' },
      email: { highlight: 'Email Us', title: 'contact@econwise.com', icon: '' },
      call: { highlight: 'Call Us', title: '+91 98765 43210', icon: '' }
    }
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/content/contacts`)
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/content/contacts`, {
        method: 'PUT',
        body: fd
      });
      if (res.ok) {
        alert('Contacts content updated successfully!');
      } else {
        alert('Failed to update contacts content.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating contacts content.');
    } finally {
      setLoading(false);
    }
  };

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
              <button className="btn-solid-green" onClick={handleUpdate} disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
          
          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Banner */}
          <SectionLabel text="Banner" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" value={formData.banner.title} onChange={e => handleChange(e, 'banner.title')} />
            </div>
            <FileUpload label="Image*" name="banner.image" onChange={e => handleFileChange(e, 'banner.image')} fileValue={getFileDisplay('banner.image')} />
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #E5E7EB', margin: '0 -32px 24px -32px' }} />

          {/* Section 1 */}
          <SectionLabel text="Section 1" />
          
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" value={formData.section1.title} onChange={e => handleChange(e, 'section1.title')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Subtext*</label>
              <input type="text" className="form-input" value={formData.section1.subText} onChange={e => handleChange(e, 'section1.subText')} />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title 2*</label>
              <input type="text" className="form-input" value={formData.section1.title2} onChange={e => handleChange(e, 'section1.title2')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Subtext 2*</label>
              <input type="text" className="form-input" value={formData.section1.subText2} onChange={e => handleChange(e, 'section1.subText2')} />
            </div>
          </div>

          {/* Address Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 1*</label>
              <input type="text" className="form-input" value={formData.section1.address.highlight} onChange={e => handleChange(e, 'section1.address.highlight')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" value={formData.section1.address.title} onChange={e => handleChange(e, 'section1.address.title')} />
            </div>
            <FileUpload label="Highlight 1 Icon*" name="section1.address.icon" onChange={e => handleFileChange(e, 'section1.address.icon')} fileValue={getFileDisplay('section1.address.icon')} />
          </div>

          {/* Email Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 2*</label>
              <input type="text" className="form-input" value={formData.section1.email.highlight} onChange={e => handleChange(e, 'section1.email.highlight')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" value={formData.section1.email.title} onChange={e => handleChange(e, 'section1.email.title')} />
            </div>
            <FileUpload label="Highlight 2 Icon*" name="section1.email.icon" onChange={e => handleFileChange(e, 'section1.email.icon')} fileValue={getFileDisplay('section1.email.icon')} />
          </div>

          {/* Call Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 0 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Highlight 3*</label>
              <input type="text" className="form-input" value={formData.section1.call.highlight} onChange={e => handleChange(e, 'section1.call.highlight')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title*</label>
              <input type="text" className="form-input" value={formData.section1.call.title} onChange={e => handleChange(e, 'section1.call.title')} />
            </div>
            <FileUpload label="Highlight 3 Icon*" name="section1.call.icon" onChange={e => handleFileChange(e, 'section1.call.icon')} fileValue={getFileDisplay('section1.call.icon')} />
          </div>
        </div>
      </div>
    </div>
  );
}

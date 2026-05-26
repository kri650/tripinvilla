import { useState, useEffect } from 'react';
import { 
  ChevronDown, Bold, Underline, Highlighter, Type, 
  List, ListOrdered, AlignLeft, AlignRight, Link, 
  Image, Table, Eraser, Code, CheckCircle
} from 'lucide-react';

const defaultOverview = `This Privacy Policy describes how TripinVilla collects, uses, discloses, and protects your personal information. By using our website and services, you agree to the collection and use of information in accordance with this policy.`;
const defaultCollect = `When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some cookies installed on your device.`;
const defaultUse = `TripinVilla uses the collected information for various purposes, including processing transactions, providing customer support, improving our website, and communicating with you about orders, updates, or promotional offers.`;
const defaultSharing = `TripinVilla does not sell, rent, or trade your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in operating our website.`;
const defaultSecurity = `TripinVilla takes reasonable precautions and follows industry best practices to protect your personal information from loss, misuse, unauthorized access, disclosure, alteration, or destruction.`;
const defaultCookies = `TripinVilla uses cookies and similar tracking technologies to improve your browsing experience, analyze website traffic, and understand user behavior.`;
const defaultRights = `You have the right to access, update, or delete your personal information. You may contact us if you wish to review or correct any personal information we hold about you.`;

// Rich Text Editor Simulation Component
function RichTextEditor({ label, value, onChange }) {
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isHighlighter, setIsHighlighter] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Label */}
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: 10, fontFamily: 'inherit' }}>
        {label}
      </div>

      {/* Editor Container */}
      <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <div style={{ 
          background: '#F9FAFB', 
          borderBottom: '1px solid #E5E7EB', 
          padding: '6px 12px', 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 6 
        }}>
          {/* Format Dropdown */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '4px 8px', 
            background: '#FFF', 
            border: '1px solid #E5E7EB', 
            borderRadius: 4, 
            fontSize: 12, 
            fontWeight: 500, 
            color: '#374151',
            cursor: 'pointer'
          }}>
            <span>Paragraph</span>
            <ChevronDown size={12} />
          </div>

          <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 4px' }} />

          {/* Bold Button */}
          <button 
            type="button"
            onClick={() => setIsBold(!isBold)}
            style={{ 
              background: isBold ? '#E5E7EB' : 'transparent', 
              border: 'none', 
              borderRadius: 4, 
              padding: '6px', 
              cursor: 'pointer', 
              color: isBold ? '#111827' : '#4B5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s'
            }}
          >
            <Bold size={14} strokeWidth={2.5} />
          </button>

          {/* Underline Button */}
          <button 
            type="button"
            onClick={() => setIsUnderline(!isUnderline)}
            style={{ 
              background: isUnderline ? '#E5E7EB' : 'transparent', 
              border: 'none', 
              borderRadius: 4, 
              padding: '6px', 
              cursor: 'pointer', 
              color: isUnderline ? '#111827' : '#4B5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s'
            }}
          >
            <Underline size={14} strokeWidth={2.5} />
          </button>

          {/* Highlighter Tool */}
          <button 
            type="button"
            onClick={() => setIsHighlighter(!isHighlighter)}
            style={{ 
              background: isHighlighter ? '#FEF08A' : 'transparent', 
              border: 'none', 
              borderRadius: 4, 
              padding: '6px', 
              cursor: 'pointer', 
              color: '#4B5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Highlighter size={14} />
            <div style={{ position: 'absolute', bottom: 3, left: '20%', width: '60%', height: 2, background: '#FACC15' }} />
          </button>

          {/* Text Color Tool */}
          <button 
            type="button"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              borderRadius: 4, 
              padding: '6px', 
              cursor: 'pointer', 
              color: '#4B5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Type size={14} />
            <div style={{ position: 'absolute', bottom: 3, left: '20%', width: '60%', height: 2, background: '#EF4444' }} />
          </button>

          <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 4px' }} />

          {/* Bullet List */}
          <button type="button" className="editor-btn" style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#4B5563' }}>
            <List size={14} />
          </button>

          {/* Ordered List */}
          <button type="button" className="editor-btn" style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#4B5563' }}>
            <ListOrdered size={14} />
          </button>

          {/* Alignment */}
          <button type="button" className="editor-btn" style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#4B5563' }}>
            <AlignLeft size={14} />
          </button>
          <button type="button" className="editor-btn" style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#4B5563' }}>
            <AlignRight size={14} />
          </button>

          <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 4px' }} />

          {/* Link */}
          <button type="button" className="editor-btn" style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#4B5563' }}>
            <Link size={14} />
          </button>

          {/* Image */}
          <button type="button" className="editor-btn" style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#4B5563' }}>
            <Image size={14} />
          </button>

          {/* Table */}
          <button type="button" className="editor-btn" style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#4B5563' }}>
            <Table size={14} />
          </button>

          {/* Eraser */}
          <button type="button" className="editor-btn" style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: '#4B5563' }}>
            <Eraser size={14} />
          </button>

          {/* Code Mode */}
          <button 
            type="button"
            onClick={() => setIsCodeMode(!isCodeMode)}
            style={{ 
              background: isCodeMode ? '#E5E7EB' : 'transparent', 
              border: 'none', 
              borderRadius: 4, 
              padding: '6px', 
              cursor: 'pointer', 
              color: isCodeMode ? '#111827' : '#4B5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Code size={14} />
          </button>
        </div>

        {/* Textarea Area */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            padding: '16px',
            fontSize: '13.5px',
            color: '#1F2937',
            lineHeight: '1.65',
            fontFamily: isCodeMode ? 'monospace' : 'inherit',
            fontWeight: isBold ? 'bold' : 'normal',
            textDecoration: isUnderline ? 'underline' : 'none',
            background: isHighlighter ? '#FFFDE7' : '#FFF',
            minHeight: '160px',
            resize: 'vertical',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  const [overview, setOverview] = useState(defaultOverview);
  const [collect, setCollect] = useState(defaultCollect);
  const [use, setUse] = useState(defaultUse);
  const [sharing, setSharing] = useState(defaultSharing);
  const [security, setSecurity] = useState(defaultSecurity);
  const [cookies, setCookies] = useState(defaultCookies);
  const [rights, setRights] = useState(defaultRights);

  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/content/privacyPolicy`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          if (data.data.overview) setOverview(data.data.overview);
          if (data.data.collect) setCollect(data.data.collect);
          if (data.data.use) setUse(data.data.use);
          if (data.data.sharing) setSharing(data.data.sharing);
          if (data.data.security) setSecurity(data.data.security);
          if (data.data.cookies) setCookies(data.data.cookies);
          if (data.data.rights) setRights(data.data.rights);
        }
      })
      .catch(err => console.error("Error loading Privacy Policy content", err));
  }, []);

  const handleUpdate = async () => {
    const payload = {
      overview,
      collect,
      use,
      sharing,
      security,
      cookies,
      rights
    };

    const formData = new FormData();
    formData.append("contentData", JSON.stringify(payload));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/content/privacyPolicy`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
      } else {
        alert("Failed to update privacy policy");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving privacy policy");
    }
  };

  return (
    <div className="fade-in">
      {/* Toast Notification */}
      {toastVisible && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#10B981',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '14px',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <CheckCircle size={18} />
          <span>Privacy Policy updated successfully!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Content Management &gt; <span>Privacy Policy</span>
      </div>

      {/* Form Container (Green dash-section box wrapper) */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="master-form-card" style={{ margin: 0, padding: '32px' }}>
          
          {/* Header */}
          <div className="master-form-header" style={{ marginBottom: 24 }}>
            <div className="master-form-title" style={{ fontSize: '20px', fontWeight: 700 }}>Privacy Policy</div>
            <div className="master-form-actions">
              <button className="btn-solid-green" onClick={handleUpdate} style={{ cursor: 'pointer' }}>
                Update
              </button>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #F3F4F6', margin: '0 -32px 32px -32px' }} />

          {/* Editors List */}
          <RichTextEditor 
            label="Overview*" 
            value={overview} 
            onChange={setOverview} 
          />

          <RichTextEditor 
            label="Information we collect*" 
            value={collect} 
            onChange={setCollect} 
          />

          <RichTextEditor 
            label="How We Use Your Information*" 
            value={use} 
            onChange={setUse} 
          />

          <RichTextEditor 
            label="Sharing your personal information*" 
            value={sharing} 
            onChange={setSharing} 
          />

          <RichTextEditor 
            label="Data Security*" 
            value={security} 
            onChange={setSecurity} 
          />

          <RichTextEditor 
            label="Cookies and tracking technologies*" 
            value={cookies} 
            onChange={setCookies} 
          />

          <RichTextEditor 
            label="Your rights*" 
            value={rights} 
            onChange={setRights} 
          />

        </div>
      </div>
    </div>
  );
}

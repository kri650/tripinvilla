import { useState } from 'react';
import { 
  ChevronDown, Bold, Underline, Highlighter, Type, 
  List, ListOrdered, AlignLeft, AlignRight, Link, 
  Image, Table, Eraser, Code, CheckCircle
} from 'lucide-react';

const initialOverview = `This Privacy Policy describes how Tripinvilla collects, uses, discloses, and protects your personal information when you visit or make a purchase from our website. By using our website and services, you agree to the collection and use of information in accordance with this policy.

Tripinvilla is committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. We comply with applicable data protection laws and take reasonable measures to protect your data from unauthorized access, misuse, or disclosure.`;

const initialCollect = `When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some cookies installed on your device.

Additionally, when you make a purchase or attempt to make a purchase through the website, we collect certain personal information from you, including your name, billing address, shipping address, payment information, email address, and phone number. We may also collect additional information if you contact customer support or interact with our services.`;

const initialUse = `Tripinvilla uses the collected information for various purposes, including processing transactions, providing customer support, improving our website, and communicating with you about orders, updates, or promotional offers.

We may also use your information to screen orders for potential risk or fraud and to improve and optimize our website experience. Your information helps us better understand customer preferences and improve our service quality.`;

const initialSharing = `Tripinvilla does not sell, rent, or trade your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or servicing you.

We may also disclose your information when required by law, legal process, or governmental request, or to protect our legal rights and prevent fraud or security issues.`;

const initialSecurity = `Prices for our services and products are subject to change without notice. Tripinvilla reserves the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.

Tripinvilla shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service. We continuously strive to improve our services and may introduce, remove, or modify features based on operational, technical, or business requirements.`;

const initialCookies = `Tripinvilla uses cookies and similar tracking technologies to improve your browsing experience, analyze website traffic, and understand user behavior.

You can choose to disable cookies through your browser settings. However, disabling cookies may affect certain features and functionality of our website.`;

const initialThirdParty = `Our website may contain links to third-party websites or services. Tripinvilla is not responsible for the privacy practices or content of third-party websites. We encourage users to review the privacy policies of any third-party websites they visit.`;

const initialRights = `Tripinvilla uses cookies and similar tracking technologies to improve your browsing experience, analyze website traffic, and understand user behavior.

You can choose to disable cookies through your browser settings. However, disabling cookies may affect certain features and functionality of our website.`;

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
  const [overview, setOverview] = useState(initialOverview);
  const [collect, setCollect] = useState(initialCollect);
  const [use, setUse] = useState(initialUse);
  const [sharing, setSharing] = useState(initialSharing);
  const [security, setSecurity] = useState(initialSecurity);
  const [cookies, setCookies] = useState(initialCookies);
  const [thirdParty, setThirdParty] = useState(initialThirdParty);
  const [rights, setRights] = useState(initialRights);

  const [toastVisible, setToastVisible] = useState(false);

  const handleUpdate = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
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
            label="Third-party services*" 
            value={thirdParty} 
            onChange={setThirdParty} 
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

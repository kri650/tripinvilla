import { useState } from 'react';
import { 
  ChevronDown, Bold, Underline, Highlighter, Type, 
  List, ListOrdered, AlignLeft, AlignRight, Link, 
  Image, Table, Eraser, Code, CheckCircle, HelpCircle
} from 'lucide-react';

const initialOverview = `The website is operated by Tripinvilla. Throughout the site, the terms "we", "us" and "our" refer to Tripinvilla. Tripinvilla offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including additional terms and policies referenced here and/or available via hyperlink. These Terms of Service apply to all users of the site, including without limitation browsers, vendors, customers, merchants, and/or contributors of content.
Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms are considered an offer, acceptance is expressly limited to these Terms.
Any new features or tools added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms at any time on this page. We reserve the right to update, change, modify, or replace any part of these Terms by posting updates and/or changes on our website from time to time. It is your responsibility to check this page periodically for changes. Continued use of or access to the website following any changes constitutes acceptance of those changes.`;

const initialStoreTerms = `By agreeing to these Terms of Service, you represent that you are at least the age of majority and in good health in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.

You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).

You must not transmit any worms or viruses or any code of a destructive nature in the site.
A breach or violation of any of the Terms will result in an immediate termination of your Services and you may be liable for legal consequences.`;

const initialGeneral = `We reserve the right to refuse service to anyone for any reason at any time.

You understand that your content (not including credit card information), may be transferred encrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.`;

const initialAccuracy = `Tripinvilla is not responsible if information made available on this site is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete, or more timely sources of information. Any reliance on the material on this site is at your own risk.

This website may contain certain historical information. Historical information is not necessarily current and is provided for your reference only. Tripinvilla reserves the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site and review updated content regularly to stay informed of any modifications.`;

const initialModification = `Prices for our services and products are subject to change without notice. Tripinvilla reserves the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.

Tripinvilla shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service. We continuously strive to improve our services and may introduce, remove, or modify features based on operational, technical, or business requirements.`;

const initialBilling = `Tripinvilla reserves the right to refuse any order you place with us. We may limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed under the same customer account, credit card, and/or orders that use the same billing and/or shipping address.

You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and payment details, so that we can complete your transactions and contact you as needed.`;

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

export default function TermsConditions() {
  const [overview, setOverview] = useState(initialOverview);
  const [storeTerms, setStoreTerms] = useState(initialStoreTerms);
  const [general, setGeneral] = useState(initialGeneral);
  const [accuracy, setAccuracy] = useState(initialAccuracy);
  const [modification, setModification] = useState(initialModification);
  const [billing, setBilling] = useState(initialBilling);

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
          <span>Terms &amp; Conditions updated successfully!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Content Management &gt; <span>Terms &amp; Conditions</span>
      </div>

      {/* Form Container (Green dash-section box wrapper) */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="master-form-card" style={{ margin: 0, padding: '32px' }}>
          
          {/* Header */}
          <div className="master-form-header" style={{ marginBottom: 24 }}>
            <div className="master-form-title" style={{ fontSize: '20px', fontWeight: 700 }}>Terms &amp; Conditions</div>
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
            label="Online Store Terms*" 
            value={storeTerms} 
            onChange={setStoreTerms} 
          />

          <RichTextEditor 
            label="General conditions*" 
            value={general} 
            onChange={setGeneral} 
          />

          <RichTextEditor 
            label="Accuracy, completeness and timeliness of information*" 
            value={accuracy} 
            onChange={setAccuracy} 
          />

          <RichTextEditor 
            label="Modification to service and prices*" 
            value={modification} 
            onChange={setModification} 
          />

          <RichTextEditor 
            label="Billing and account information*" 
            value={billing} 
            onChange={setBilling} 
          />

        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { contactAddressIcon, contactBgShapeImg, contactCallIcon, contactEmailIcon, contactHeroImg } from '../../../assets';
import './ContactUsPage.css';

export default function ContactUsPage(props) {
  const { contactName, setContactName, contactPhone, setContactPhone, contactEmail, setContactEmail, contactMessage, setContactMessage, contactAgreed, setContactAgreed } = props;

  const [content, setContent] = useState({
    banner: { title: 'Contact Us', image: contactHeroImg },
    section1: {
      title: 'Contact Us',
      subText: 'Fill out the form below & our team of expert will reach out to you as soon as possible.',
      title2: 'Contact Details',
      subText2: 'You can call us or contact us directly',
      address: { highlight: 'Address', title: 'Esc. 135 Cuesta Adan Grijalva, Elda Nav 11777', icon: contactAddressIcon },
      email: { highlight: 'Email Us', title: 'contact@econwise.com', icon: contactEmailIcon },
      call: { highlight: 'Call Us', title: '+91 98765 43210', icon: contactCallIcon }
    }
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/content/contacts`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setContent(prev => ({
            banner: { ...prev.banner, ...data.data.banner },
            section1: {
              ...prev.section1,
              ...data.data.section1,
              address: { ...prev.section1.address, ...data.data.section1?.address },
              email: { ...prev.section1.email, ...data.data.section1?.email },
              call: { ...prev.section1.call, ...data.data.section1?.call }
            }
          }));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="contact-page-wrapper fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${content.banner.image.startsWith('http') || content.banner.image.startsWith('/uploads') ? content.banner.image : contactHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>{content.banner.title}</h1>
      </div>

      <div className="contact-main-row">
        <div className="contact-image-panel"><img src={contactBgShapeImg} alt="Professional hotel frontdesk receptionists" /></div>
        <div className="contact-form-panel">
          <h2 className="contact-form-title">{content.section1.title}</h2>
          <p className="contact-form-sub">{content.section1.subText}</p>
          <div className="contact-form-grid">
            <div className="contact-input-row">
              <div className="contact-field-group">
                <label className="contact-field-label">Name</label>
                <input type="text" className="contact-text-input" placeholder="Enter your name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div className="contact-field-group">
                <label className="contact-field-label">Phone Number</label>
                <input type="text" className="contact-text-input" placeholder="Enter your phone number" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
            </div>
            <div className="contact-field-group">
              <label className="contact-field-label">Email Address</label>
              <input type="email" className="contact-text-input" placeholder="Enter your email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div className="contact-field-group">
              <label className="contact-field-label">Message</label>
              <textarea className="contact-textarea" placeholder="Enter your message" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} />
            </div>
            <div className="contact-agreement-row" onClick={() => setContactAgreed(!contactAgreed)}>
              <div className={`contact-radio-indicator ${contactAgreed ? 'checked' : ''}`}>{contactAgreed && <div className="contact-radio-dot" />}</div>
              <span className="contact-agreement-text">Agreed to the terms & conditions</span>
            </div>
            <button className="btn-send-message-green" onClick={() => {
              if (!contactAgreed) { alert('Please agree to the terms & conditions first!'); return; }
              alert(`Thank you ${contactName || 'Valued Guest'}! Your message has been sent to our corporate desks successfully!`);
              setContactName(''); setContactPhone(''); setContactEmail(''); setContactMessage(''); setContactAgreed(false);
            }}>
              <span>Send us a message</span><ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="contact-details-wrapper">
        <div className="details-left-side"><h2 className="details-main-title">{content.section1.title2}</h2><p className="details-sub-title">{content.section1.subText2}</p></div>
        <div className="details-cards-stack">
          {[
            content.section1.address,
            content.section1.email,
            content.section1.call,
          ].map((item, i) => (
            <div key={i} className="details-pill-card">
              <div className="details-icon-avatar"><img src={(item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/uploads'))) ? item.icon : [contactAddressIcon, contactEmailIcon, contactCallIcon][i]} alt={item.highlight} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
              <div className="details-texts-col"><span className="details-card-lbl">{item.highlight}</span><span className="details-card-val">{item.title}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

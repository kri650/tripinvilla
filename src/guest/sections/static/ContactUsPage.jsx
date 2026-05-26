import { ChevronRight } from 'lucide-react';
import { contactAddressIcon, contactBgShapeImg, contactCallIcon, contactEmailIcon, contactHeroImg } from '../../../assets';
import './ContactUsPage.css';

export default function ContactUsPage(props) {
  const { contactName, setContactName, contactPhone, setContactPhone, contactEmail, setContactEmail, contactMessage, setContactMessage, contactAgreed, setContactAgreed } = props;

  return (
    <div className="contact-page-wrapper fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${contactHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Contact Us</h1>
      </div>

      <div className="contact-main-row">
        <div className="contact-image-panel"><img src={contactBgShapeImg} alt="Professional hotel frontdesk receptionists" /></div>
        <div className="contact-form-panel">
          <h2 className="contact-form-title">Contact Us</h2>
          <p className="contact-form-sub">Fill out the form below & our team of expert will reach out to you as soon as possible.</p>
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
        <div className="details-left-side"><h2 className="details-main-title">Contact Details</h2><p className="details-sub-title">You can call us or contact us directly</p></div>
        <div className="details-cards-stack">
          {[
            { icon: contactAddressIcon, label: 'Address', val: 'Esc. 135 Cuesta Adan Grijalva, Elda Nav 11777' },
            { icon: contactEmailIcon, label: 'Email Us', val: 'contact@econwise.com' },
            { icon: contactCallIcon, label: 'Call Us', val: '+91 98765 43210' },
          ].map((item, i) => (
            <div key={i} className="details-pill-card">
              <div className="details-icon-avatar"><img src={item.icon} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
              <div className="details-texts-col"><span className="details-card-lbl">{item.label}</span><span className="details-card-val">{item.val}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

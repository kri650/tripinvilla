import { ChevronDown, CreditCard, Percent } from 'lucide-react';
import { listPlaceHeroImg, rect32Img, rect33Img, rect35Img, stepIcon1, stepIcon2, stepIcon3, stepIcon4 } from '../../../assets';
import './ListYourPlacePage.css';

const FAQ_ITEMS = [
  { q: 'How can I enquire about a villa?', a: 'You can submit your enquiry through our online enquiry form available on each villa detail page.' },
  { q: 'Is there any fee to submit an enquiry?', a: 'No, submitting an enquiry is completely free. You will only pay when you finalize and book a property.' },
  { q: 'How soon will I receive a response?', a: 'Our travel experts typically respond within 2 to 4 hours during business days.' },
  { q: 'Can I schedule a site visit before booking?', a: 'Yes, we can organize virtual or physical site visits for long-term villa rentals upon request.' },
  { q: 'Are the villas available for short-term stays?', a: 'Absolutely! We support both short-term weekend getaways and long-term stays.' },
  { q: 'What amenities are included in the villa?', a: 'Most of our villas include high-speed Wi-Fi, fully equipped kitchens, private pools, housekeepers, and gated security.' },
];

export default function ListYourPlacePage({ token, user, setAuthMode, setAuthModalOpen, activeFaq, setActiveFaq, homepageContent }) {
  return (
    <div className="list-property-page-wrapper fade-in">
      <div className="dashboard-hero-banner list-hero-custom" style={{ backgroundImage: `url("${listPlaceHeroImg}")` }}>
        <h1 className="dashboard-hero-title">List Your Property</h1>
        <button className="btn-hero-green" onClick={() => {
          if (!token || !user) { setAuthMode('login'); setAuthModalOpen(true); }
          else { window.location.href = `/owner/register?token=${token}`; }
        }}>List Property</button>
      </div>

      <div className="list-steps-container">
        <div className="list-section-title-wrap">
          <h2 className="list-section-headline">All You Have <span className="highlight-sharp-blue-box">To Do</span></h2>
          <p className="list-section-subline">Do The Following Steps To List Your Property With Us</p>
        </div>
        <div className="list-four-steps-grid">
          {[{ icon: stepIcon1, text: 'Sign In Or Sign Up As A Property Owner' }, { icon: stepIcon2, text: 'Upload Your Property Details And Photos' }, { icon: stepIcon3, text: 'Set Your Prices And Available Dates' }, { icon: stepIcon4, text: 'See Your Property Go Live In Front Of Millions Of Travelers' }].map((step, i) => (
            <div key={i} className="list-step-card">
              <div className="list-step-icon-avatar"><img src={step.icon} alt={`Step ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
              <p className="list-step-card-text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Our Services */}
      <div className="services-section" style={{ marginBottom: 0 }}>
        <div className="services-inner-container">
          <div className="section-title-wrap">
            <h2 className="section-main-headline">{homepageContent?.section5?.row1?.title || <span>Why Choose Our <span className="highlight-sharp-blue-box">Services</span></span>}</h2>
            <p className="section-sub-headline" style={{ color: '#4B5563' }}>{homepageContent?.section5?.row1?.subText || 'Choose the next destination for you'}</p>
          </div>
          <div className="services-grid-asym">
            <div className="services-col">
              <div className="service-text-card white-bg">
                <p className="service-card-desc">{homepageContent?.section5?.row1?.subText || 'Every property is carefully verified.'}</p>
                <h3 className="service-card-accent-title">{homepageContent?.section5?.row1?.title || 'Verified & Trusted Stays'}</h3>
                <p className="service-card-subtext">{homepageContent?.section5?.row1?.subText || 'Get genuine and good stays'}</p>
              </div>
              <div className="service-image-card">
                <img src={rect35Img} alt="Secure Payments" />
                <div className="service-overlay-badge-bottom"><div className="service-icon-circle-overlay"><CreditCard size={18} color="#FFFFFF" /></div><span>{homepageContent?.section5?.features?.[0]?.title || 'Secure Payments'}</span></div>
              </div>
            </div>
            <div className="services-col-center"><div className="service-tall-card"><img src={homepageContent?.section5?.image3 || rect32Img} alt="Traveler with suitcase" /></div></div>
            <div className="services-col">
              <div className="service-image-card">
                <img src={homepageContent?.section5?.features?.[1]?.image || rect33Img} alt="Best Price Guarantee" />
                <div className="service-overlay-badge-bottom"><div className="service-icon-circle-overlay"><Percent size={18} color="#FFFFFF" /></div><span>{homepageContent?.section5?.features?.[1]?.title || 'Best Price Guarantee'}</span></div>
              </div>
              <div className="service-text-card transparent-bg">
                <div className="service-card-top-group">
                  <h3 className="service-card-accent-title">{homepageContent?.section5?.row2?.title || '24/7 Support, Always There'}</h3>
                  <p className="service-card-bold-sub">{homepageContent?.section5?.row2?.subText || 'All type of support'}</p>
                </div>
                <p className="service-card-desc-light">From booking to checkout, our support team is available anytime to help you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="list-faq-container">
        <div className="list-section-title-wrap">
          <h2 className="list-section-headline">Frequently Asked <span className="highlight-sharp-blue-box">Questions</span></h2>
          <p className="list-section-subline">You Can Ask Anything You Want</p>
        </div>
        <div className="faq-accordion-stack">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={`faq-accordion-item ${isOpen ? 'expanded' : ''}`} onClick={() => setActiveFaq(isOpen ? null : idx)}>
                <div className="faq-header-trigger">
                  <div className="faq-question-col"><div className="faq-badge-num">{idx + 1}</div><span className="faq-question-text">{faq.q}</span></div>
                  <ChevronDown size={18} className={`faq-arrow-indicator ${isOpen ? 'rotated' : ''}`} />
                </div>
                <div className="faq-content-slider"><p className="faq-answer-text">{faq.a}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

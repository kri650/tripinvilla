import { useState, useEffect } from 'react';
import { CheckCircle, CreditCard, Percent, Play } from 'lucide-react';
import { aboutHeroImg, missionIcon, rect32Img, rect33Img, rect35Img, visionIcon } from '../../../assets';
import './AboutUsPage.css';

export default function AboutUsPage({ homepageContent, renderTitle }) {
  const [aboutUsContent, setAboutUsContent] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/content/aboutUs`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setAboutUsContent(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const s1 = aboutUsContent?.section1;
  const s2 = aboutUsContent?.section2 || homepageContent?.section5;
  const s3 = aboutUsContent?.section3 || homepageContent?.section6;

  return (
    <div className="about-page-layout fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${aboutUsContent?.banner?.image || aboutHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>{aboutUsContent?.banner?.title || 'About Us'}</h1>
      </div>

      <div className="about-main-wrapper">
        <div className="about-split-grid">
          <div className="about-left-col">
            <h2 className="about-main-hdr">
              {renderTitle(s1?.title, <>Redefining the Way You <span className="highlight-sharp-blue-box" style={{ borderRadius: 0, padding: '4px 10px' }}>Experience Stays</span></>, "Experience Stays")}
            </h2>
            <p className="about-desc-p">
              {s1?.subText || "We bring together handpicked hotels and private villas that combine comfort, quality, and reliability. Every property on our platform is carefully verified to ensure high standards of hospitality, transparent pricing, and a seamless booking experience."}
            </p>
            <div className="about-bullets-row">
              <div className="about-bullet-item"><CheckCircle size={16} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" /><span>{s1?.point1 || 'Curated & Verified Stays'}</span></div>
              <div className="about-bullet-item"><CheckCircle size={16} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" /><span>{s1?.point2 || 'Seamless Booking Experience'}</span></div>
            </div>
            <div className="about-mission-block">
              <div className="green-square-icon-wrap"><img src={s1?.highlights?.[0]?.icon || missionIcon} alt="Our Mission Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
              <div className="mission-texts"><h5>{s1?.highlights?.[0]?.title || 'Our Mission'}</h5><p>{s1?.highlights?.[0]?.subText || 'Our mission is to connect travelers with high-quality stays through a user-friendly platform.'}</p></div>
            </div>
            <div className="about-mission-block">
              <div className="green-square-icon-wrap"><img src={s1?.highlights?.[1]?.icon || visionIcon} alt="Our Vision Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
              <div className="mission-texts"><h5>{s1?.highlights?.[1]?.title || 'Our Vision'}</h5><p>{s1?.highlights?.[1]?.subText || 'To become a trusted travel platform that redefines how people discover and experience hotels and villas.'}</p></div>
            </div>
          </div>
          <div className="about-vertical-line"></div>
          <div className="about-right-col">
            <div className="about-master-image-box">
              <img src={s1?.mainImage || "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80"} alt="Sunny alpine mountain chalet" />
            </div>
            <div className="about-blue-badge-card">
              <span className="about-badge-title">{s1?.experience?.title || '40+'}</span>
              <div className="about-badge-divider"></div>
              <span className="about-badge-sub">{s1?.experience?.subText || 'Years of Experience That Drive Results'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Our Services */}
      <div className="services-section" style={{ background: '#EBFDF2', padding: '60px 0', margin: '80px 0 0 0' }}>
        <div className="services-inner-container">
          <div className="section-title-wrap">
            <h2 className="section-main-headline">
              {renderTitle(s2?.title, <span>Why Choose Our <span className="highlight-sharp-blue-box">Services</span></span>, "Services")}
            </h2>
            <p className="section-sub-headline" style={{ color: '#4B5563' }}>{s2?.subText || 'Choose the next destination for you'}</p>
          </div>
          <div className="services-grid-asym">
            <div className="services-col">
              <div className="service-text-card white-bg">
                <p className="service-card-desc">{s2?.row1Desc || 'Every property is carefully verified.'}</p>
                <h3 className="service-card-accent-title">{s2?.row1?.title || 'Verified & Trusted Stays'}</h3>
                <p className="service-card-subtext">{s2?.row1?.subText || 'Get genuine and good stays'}</p>
              </div>
              <div className="service-image-card">
                <img src={s2?.features?.[0]?.image || rect35Img} alt="Secure Payments" />
                <div className="service-overlay-badge-bottom"><div className="service-icon-circle-overlay"><CreditCard size={18} color="#FFFFFF" /></div><span>{s2?.features?.[0]?.title || 'Secure Payments'}</span></div>
              </div>
            </div>
            <div className="services-col-center">
              <div className="service-tall-card"><img src={s2?.imageCenter || s2?.image3 || rect32Img} alt="Traveler center image" /></div>
            </div>
            <div className="services-col">
              <div className="service-image-card">
                <img src={s2?.features?.[1]?.image || rect33Img} alt="Best Price" />
                <div className="service-overlay-badge-bottom"><div className="service-icon-circle-overlay"><Percent size={18} color="#FFFFFF" /></div><span>{s2?.features?.[1]?.title || 'Best Price Guarantee'}</span></div>
              </div>
              <div className="service-text-card transparent-bg">
                <div className="service-card-top-group">
                  <h3 className="service-card-accent-title">{s2?.row2?.title || '24/7 Support, Always There'}</h3>
                  <p className="service-card-bold-sub">{s2?.row2?.subText || 'All type of support'}</p>
                </div>
                <p className="service-card-desc-light">{s2?.row2Desc || 'From booking to checkout, our support team is available anytime to help you.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="about-main-wrapper" style={{ marginTop: 0 }}>
        <div className="our-testimonials-section" style={{ margin: '80px 0 20px 0' }}>
          <div className="section-title-wrap">
            <h2 className="section-main-headline">{renderTitle(s3?.title, <span>Our <span className="highlight-sharp-blue-box">Testimonials</span></span>, "Testimonials")}</h2>
            <p className="section-sub-headline">{s3?.subText || 'Check what our customers say about us'}</p>
          </div>
          <div className="testimonials-horizontal-cards-row">
            {(s3?.testimonials?.slice(0, 3) || [
              { name: 'Jessy Roy', designation: 'Director of Operations, Enterprise Client', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', text: '"Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth."' },
              { name: 'Jeremy Renner', designation: 'Project Manager, Corporate Solutions Firm', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', text: '"From initial consultation to final delivery, the team demonstrated exceptional professionalism."' },
              { name: 'Winona Ryder', designation: 'CEO, Growing Tech Company', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', text: '"They didn\'t just deliver a solution—they delivered confidence and long-term value."' },
            ]).map((t, i) => (
              <div key={i} className="testimonial-card-item">
                <div className="testimonial-author-avatar-top"><img src={t.image || t.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} alt={t.name} /></div>
                <p className="testimonial-card-quote">{t.text || t.quote}</p>
                <div className="testimonial-footer-info"><h5 className="author-name-signature">{t.name}</h5><span className="author-role-text">{t.designation || t.role}</span></div>
              </div>
            ))}
            {(() => {
              const mainT = (s3?.testimonials && s3.testimonials[3]) ? s3.testimonials[3] : { name: 'David Campbell', designation: 'Head of Digital Transformation', image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80" };
              return (
                <div className="testimonial-card-item image-cover-mode">
                  <img src={mainT.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"} alt={mainT.name} />
                  <div className="image-cover-tint-overlay">
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FFFFFF' }}>
                      <img src={mainT.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"} alt={mainT.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {mainT.video && <div className="play-btn-circle-large"><Play size={20} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '3px' }} /></div>}
                    {!mainT.video && <div className="play-btn-circle-large"><Play size={20} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '3px' }} /></div>}
                    <div><h5 className="cover-mode-signature-title">{mainT.name}</h5><span className="cover-mode-signature-role">{mainT.designation}</span></div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { CheckCircle, CreditCard, Percent, Play } from 'lucide-react';
import { aboutHeroImg, missionIcon, rect32Img, rect33Img, rect35Img, visionIcon } from '../../../assets';
import './AboutUsPage.css';

export default function AboutUsPage({ renderTitle, activeMenu }) {
  const [aboutUsContent, setAboutUsContent] = useState(null);
  const [homepageContent, setHomepageContent] = useState(null);

  useEffect(() => {
    if (activeMenu !== 'About Us') return;

    // Fetch both AboutUs content and Homepage content (for shared section5/services)
    Promise.all([
      fetch(`${import.meta.env.VITE_API_BASE}/content/aboutUs`)
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            setAboutUsContent(data.data);
          }
        }),
      fetch(`${import.meta.env.VITE_API_BASE}/content/homepage`)
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
            setHomepageContent(data.data);
            console.log('✅ Homepage section5 synced to AboutUs:', data.data.section5);
          }
        })
    ]).catch(console.error);
  }, [activeMenu]);

  const s1 = aboutUsContent?.section1;
  // Use section5 from homepage (synced/shared data)
  const s2 = homepageContent?.section5 || aboutUsContent?.section2;
  const s3 = aboutUsContent?.section3;

  return (
    <div className="bg-[#FCF9EA] pb-5 fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${aboutUsContent?.banner?.image || aboutHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>{aboutUsContent?.banner?.title || 'About Us'}</h1>
      </div>

      <div className="w-[1280px] max-w-[calc(100%-160px)] mx-auto mt-20 max-[1200px]:max-w-[calc(100%-80px)] max-[900px]:max-w-[calc(100%-40px)] max-[900px]:mt-10 max-[640px]:max-w-[calc(100%-32px)] max-[640px]:mt-8 max-[480px]:max-w-[calc(100%-24px)] max-[480px]:mt-6 max-[360px]:max-w-[calc(100%-16px)]">
        <div className="grid grid-cols-[1.15fr_50px_1fr] gap-5 items-center max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[640px]:gap-[30px] max-[640px]:gap-6">
          <div className="flex flex-col gap-7 max-[768px]:gap-5">
            <h2 className="font-['Lato'] text-[40px] font-bold text-[#111827] leading-[1.25] m-0 max-[1200px]:text-4xl max-[900px]:text-[32px] max-[768px]:text-[28px] max-[640px]:text-2xl max-[640px]:leading-[1.3] max-[480px]:text-xl max-[360px]:text-lg">
              {renderTitle(s1?.title, <>Redefining the Way You <span className="highlight-sharp-blue-box" style={{ borderRadius: 0, padding: '4px 10px' }}>Experience Stays</span></>, "Experience Stays")}
            </h2>
            <p className="font-['Lato'] text-[15px] text-[#4B5563] leading-[1.7] m-0 max-[768px]:text-[13px] max-[768px]:leading-[1.6] max-[640px]:text-sm max-[480px]:text-[13px] max-[360px]:text-xs">
              {s1?.subText || "We bring together handpicked hotels and private villas that combine comfort, quality, and reliability. Every property on our platform is carefully verified to ensure high standards of hospitality, transparent pricing, and a seamless booking experience."}
            </p>
            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center gap-[10px] font-['Lato'] text-[15px] font-semibold text-[#111827] max-[768px]:text-sm max-[640px]:text-[13px] max-[640px]:gap-2 max-[480px]:text-xs max-[360px]:text-[11px]"><CheckCircle size={16} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" className="max-[640px]:w-[14px] max-[640px]:h-[14px]" /><span>{s1?.point1 || 'Curated & Verified Stays'}</span></div>
              <div className="flex items-center gap-[10px] font-['Lato'] text-[15px] font-semibold text-[#111827] max-[768px]:text-sm max-[640px]:text-[13px] max-[640px]:gap-2 max-[480px]:text-xs max-[360px]:text-[11px]"><CheckCircle size={16} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" className="max-[640px]:w-[14px] max-[640px]:h-[14px]" /><span>{s1?.point2 || 'Seamless Booking Experience'}</span></div>
            </div>
            <div className="flex gap-[18px] bg-white rounded-[18px] p-5 border border-[#E5E7EB] shadow-[0_4px_14px_rgba(0,0,0,0.01)] max-[768px]:p-4 max-[768px]:gap-[10px] max-[640px]:p-4 max-[640px]:rounded-2xl max-[480px]:p-[14px] max-[360px]:p-3 max-[900px]:flex-col max-[900px]:gap-3 max-[900px]:text-center">
              <div className="w-[46px] h-[46px] rounded-full bg-[#EBFDF2] flex items-center justify-center flex-shrink-0 max-[768px]:w-10 max-[768px]:h-10 max-[480px]:w-9 max-[480px]:h-9 max-[360px]:w-8 max-[360px]:h-8"><img src={s1?.highlights?.[0]?.icon || missionIcon} alt="Our Mission Icon" className="w-full h-full object-contain" /></div>
              <div className="flex flex-col gap-1"><h5 className="font-['Lato'] text-base font-bold text-[#111827] m-0 max-[768px]:text-[15px] max-[480px]:text-sm max-[360px]:text-[13px]">{s1?.highlights?.[0]?.title || 'Our Mission'}</h5><p className="font-['Lato'] text-sm text-[#6B7280] leading-[1.5] m-0 max-[768px]:text-[13px] max-[480px]:text-xs max-[360px]:text-[11px]">{s1?.highlights?.[0]?.subText || 'Our mission is to connect travelers with high-quality stays through a user-friendly platform.'}</p></div>
            </div>
            <div className="flex gap-[18px] bg-white rounded-[18px] p-5 border border-[#E5E7EB] shadow-[0_4px_14px_rgba(0,0,0,0.01)] max-[768px]:p-4 max-[768px]:gap-[10px] max-[640px]:p-4 max-[640px]:rounded-2xl max-[480px]:p-[14px] max-[360px]:p-3 max-[900px]:flex-col max-[900px]:gap-3 max-[900px]:text-center">
              <div className="w-[46px] h-[46px] rounded-full bg-[#EBFDF2] flex items-center justify-center flex-shrink-0 max-[768px]:w-10 max-[768px]:h-10 max-[480px]:w-9 max-[480px]:h-9 max-[360px]:w-8 max-[360px]:h-8"><img src={s1?.highlights?.[1]?.icon || visionIcon} alt="Our Vision Icon" className="w-full h-full object-contain" /></div>
              <div className="flex flex-col gap-1"><h5 className="font-['Lato'] text-base font-bold text-[#111827] m-0 max-[768px]:text-[15px] max-[480px]:text-sm max-[360px]:text-[13px]">{s1?.highlights?.[1]?.title || 'Our Vision'}</h5><p className="font-['Lato'] text-sm text-[#6B7280] leading-[1.5] m-0 max-[768px]:text-[13px] max-[480px]:text-xs max-[360px]:text-[11px]">{s1?.highlights?.[1]?.subText || 'To become a trusted travel platform that redefines how people discover and experience hotels and villas.'}</p></div>
            </div>
          </div>
          <div className="w-[17.45px] h-[210.18px] bg-[#0C6DC4] justify-self-center self-start mt-[10px] max-[900px]:hidden"></div>
          <div className="relative w-full max-w-[525px] max-[900px]:max-w-full max-[900px]:order-[-1]">
            <div className="w-full max-w-[525px] h-[672px] rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-[0_15px_35px_rgba(0,0,0,0.04)] max-[1200px]:h-[500px] max-[900px]:h-[400px] max-[900px]:max-w-full max-[768px]:h-[350px] max-[768px]:rounded-[20px] max-[640px]:h-[300px] max-[640px]:rounded-[18px] max-[480px]:h-[260px] max-[360px]:h-[220px]">
              <img src={s1?.mainImage || "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80"} alt="Sunny alpine mountain chalet" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-[50px] left-[-40px] w-[250px] h-[230px] bg-[var(--primary-blue)] p-8 text-white flex flex-col justify-center gap-3 z-[5] rounded-xl shadow-[0_15px_35px_rgba(12,109,196,0.35)] max-[1200px]:w-[220px] max-[1200px]:h-[200px] max-[1200px]:p-6 max-[900px]:static max-[900px]:w-full max-[900px]:max-w-[300px] max-[900px]:h-auto max-[900px]:mx-auto max-[900px]:mt-5 max-[768px]:max-w-[280px] max-[768px]:p-[18px] max-[640px]:p-4 max-[640px]:rounded-[14px] max-[480px]:p-[14px] max-[480px]:max-w-[250px] max-[360px]:p-3 max-[360px]:max-w-[220px]">
              <span className="font-['Lato'] font-extrabold text-[52px] leading-none tracking-[-1.5px] m-0 max-[1200px]:text-[44px] max-[900px]:text-[40px] max-[768px]:text-4xl max-[640px]:text-[32px] max-[640px]:tracking-[-1px] max-[480px]:text-[28px] max-[360px]:text-2xl">{s1?.experience?.title || '40+'}</span>
              <div className="about-badge-divider"></div>
              <span className="font-['Lato'] font-semibold text-[14.5px] leading-[145%] text-white m-0 max-[900px]:text-[13px] max-[768px]:text-xs max-[768px]:leading-[1.4] max-[640px]:text-xs max-[480px]:text-[11px] max-[360px]:text-[10px]">{s1?.experience?.subText || 'Years of Experience That Drive Results'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Our Services */}
      <div className="bg-[#EBFDF2] py-[60px] mt-20 m-0 max-[768px]:py-10 max-[768px]:mt-[60px] max-[640px]:py-8 max-[640px]:mt-10 max-[480px]:py-6">
        <div className="services-inner-container max-[768px]:px-5 max-[640px]:px-4 max-[480px]:px-3 max-[360px]:px-2">
          <div className="section-title-wrap max-[640px]:text-center max-[640px]:mb-[30px]">
            <h2 className="section-main-headline max-[640px]:text-2xl max-[480px]:text-xl max-[360px]:text-lg">
              {renderTitle(s2?.title, <span>Why Choose Our <span className="highlight-sharp-blue-box">Services</span></span>, "Services")}
            </h2>
            <p className="section-sub-headline text-[#4B5563] max-[640px]:text-sm max-[480px]:text-[13px] max-[360px]:text-xs">{s2?.subText || 'Choose the next destination for you'}</p>
          </div>
          <div className="services-grid-asym max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[640px]:gap-5">
            <div className="services-col max-[900px]:order-0">
              <div className="service-text-card white-bg max-[768px]:p-5 max-[640px]:p-[18px] max-[640px]:rounded-2xl max-[480px]:p-4">
                <p className="service-card-desc max-[640px]:text-[13px] max-[480px]:text-xs max-[360px]:text-[11px]">{s2?.row1Desc || 'Every property is carefully verified.'}</p>
                <h3 className="service-card-accent-title max-[640px]:text-lg max-[480px]:text-base max-[360px]:text-[15px]">{s2?.row1?.title || 'Verified & Trusted Stays'}</h3>
                <p className="service-card-subtext max-[640px]:text-[13px] max-[480px]:text-xs max-[360px]:text-[11px]">{s2?.row1?.subText || 'Get genuine and good stays'}</p>
              </div>
              <div className="service-image-card max-[768px]:h-[200px] max-[640px]:h-[180px] max-[640px]:rounded-2xl max-[480px]:h-[160px] max-[360px]:h-[140px]">
                <img src={s2?.features?.[0]?.image || rect35Img} alt="Secure Payments" />
                <div className="service-overlay-badge-bottom max-[640px]:p-3 max-[640px]:text-xs max-[480px]:p-[10px] max-[480px]:text-[11px]"><div className="service-icon-circle-overlay max-[640px]:w-8 max-[640px]:h-8"><CreditCard size={18} color="#FFFFFF" /></div><span>{s2?.features?.[0]?.title || 'Secure Payments'}</span></div>
              </div>
            </div>
            <div className="services-col-center max-[900px]:order-1">
              <div className="service-tall-card max-[900px]:h-[300px] max-[768px]:h-[250px] max-[640px]:h-[220px] max-[640px]:rounded-2xl max-[480px]:h-[200px] max-[360px]:h-[180px]"><img src={s2?.imageCenter || s2?.image3 || rect32Img} alt="Traveler center image" /></div>
            </div>
            <div className="services-col max-[900px]:order-2">
              <div className="service-image-card max-[768px]:h-[200px] max-[640px]:h-[180px] max-[640px]:rounded-2xl max-[480px]:h-[160px] max-[360px]:h-[140px]">
                <img src={s2?.features?.[1]?.image || rect33Img} alt="Best Price" />
                <div className="service-overlay-badge-bottom max-[640px]:p-3 max-[640px]:text-xs max-[480px]:p-[10px] max-[480px]:text-[11px]"><div className="service-icon-circle-overlay max-[640px]:w-8 max-[640px]:h-8"><Percent size={18} color="#FFFFFF" /></div><span>{s2?.features?.[1]?.title || 'Best Price Guarantee'}</span></div>
              </div>
              <div className="service-text-card transparent-bg max-[768px]:p-5 max-[640px]:p-[18px] max-[640px]:rounded-2xl max-[480px]:p-4">
                <div className="service-card-top-group">
                  <h3 className="service-card-accent-title max-[640px]:text-lg max-[480px]:text-base max-[360px]:text-[15px]">{s2?.row2?.title || '24/7 Support, Always There'}</h3>
                  <p className="service-card-bold-sub max-[640px]:text-[13px] max-[480px]:text-xs max-[360px]:text-[11px]">{s2?.row2?.subText || 'All type of support'}</p>
                </div>
                <p className="service-card-desc-light max-[640px]:text-[13px] max-[480px]:text-xs max-[360px]:text-[11px]">{s2?.row2Desc || 'From booking to checkout, our support team is available anytime to help you.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="w-[1280px] max-w-[calc(100%-160px)] mx-auto mt-0 max-[1200px]:max-w-[calc(100%-80px)] max-[900px]:max-w-[calc(100%-40px)] max-[900px]:mt-10 max-[640px]:max-w-[calc(100%-32px)] max-[640px]:mt-8 max-[480px]:max-w-[calc(100%-24px)] max-[480px]:mt-6 max-[360px]:max-w-[calc(100%-16px)]">
        <div className="our-testimonials-section my-20 mb-5 max-[640px]:!my-[60px] max-[640px]:!mb-5">
          <div className="section-title-wrap max-[640px]:text-center max-[640px]:mb-[30px]">
            <h2 className="section-main-headline max-[640px]:text-2xl max-[480px]:text-xl max-[360px]:text-lg">{renderTitle(s3?.title, <span>Our <span className="highlight-sharp-blue-box">Testimonials</span></span>, "Testimonials")}</h2>
            <p className="section-sub-headline max-[640px]:text-sm max-[480px]:text-[13px] max-[360px]:text-xs">{s3?.subText || 'Check what our customers say about us'}</p>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-10 max-[1200px]:gap-5 max-[900px]:grid-cols-2 max-[900px]:gap-5 max-[768px]:gap-4 max-[640px]:!grid-cols-1 max-[640px]:!gap-4 max-[480px]:gap-[14px] max-[360px]:gap-3">
            {(s3?.testimonials?.slice(0, 3) || [
              { name: 'Jessy Roy', designation: 'Director of Operations, Enterprise Client', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', text: '"Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth."' },
              { name: 'Jeremy Renner', designation: 'Project Manager, Corporate Solutions Firm', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', text: '"From initial consultation to final delivery, the team demonstrated exceptional professionalism."' },
              { name: 'Winona Ryder', designation: 'CEO, Growing Tech Company', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', text: '"They didn\'t just deliver a solution—they delivered confidence and long-term value."' },
            ]).map((t, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-3xl p-8 flex flex-col justify-between items-start h-[440px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_10px_30px_rgba(0,0,0,0.015)] hover:translate-y-[-6px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] box-border max-[1200px]:h-[380px] max-[1200px]:p-6 max-[900px]:h-[350px] max-[900px]:p-5 max-[768px]:p-5 max-[640px]:!h-auto max-[640px]:!min-h-[280px] max-[640px]:!p-5 max-[640px]:!rounded-[20px] max-[480px]:p-4 max-[480px]:min-h-[260px] max-[360px]:p-[14px] max-[360px]:min-h-[240px] max-[640px]:cursor-pointer">
                <div className="w-14 h-14 rounded-full overflow-hidden mb-6 border border-[#E5E7EB] shadow-[0_4px_10px_rgba(0,0,0,0.05)] flex-shrink-0 max-[900px]:w-12 max-[900px]:h-12 max-[640px]:w-11 max-[640px]:h-11 max-[640px]:mb-4 max-[480px]:w-10 max-[480px]:h-10 max-[480px]:mb-[14px] max-[360px]:w-9 max-[360px]:h-9 max-[360px]:mb-3"><img src={t.image || t.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} alt={t.name} className="w-full h-full object-cover" /></div>
                <p className="font-['Lato'] text-[14.5px] text-[#4B5563] leading-[165%] m-0 mb-6 flex-grow max-[900px]:text-[13px] max-[768px]:text-xs max-[768px]:mb-4 max-[640px]:!text-[13px] max-[640px]:!leading-[1.5] max-[640px]:!mb-4 max-[480px]:text-xs max-[480px]:mb-[14px] max-[360px]:text-[11px] max-[360px]:mb-3">{t.text || t.quote}</p>
                <div className="flex flex-col gap-1 items-start w-full border-t border-[#F3F4F6] pt-[18px] max-[640px]:pt-4 max-[480px]:pt-4 max-[360px]:pt-4"><h5 className="font-['Dancing_Script'] text-[25px] font-bold text-[#111827] m-0 tracking-[0.2px] max-[900px]:text-xl max-[640px]:!text-xl max-[480px]:text-lg max-[360px]:text-base">{t.name}</h5><span className="font-['Lato'] text-[11.5px] font-semibold text-[#9CA3AF] m-0 leading-[1.3] max-[900px]:text-[10px] max-[640px]:!text-[11px] max-[480px]:text-[10px] max-[360px]:text-[9px]">{t.designation || t.role}</span></div>
              </div>
            ))}
            {(() => {
              const mainT = (s3?.testimonials && s3.testimonials[3]) ? s3.testimonials[3] : { name: 'David Campbell', designation: 'Head of Digital Transformation', image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80" };
              return (
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-0 flex flex-col justify-between items-start h-[440px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_10px_30px_rgba(0,0,0,0.015)] hover:translate-y-[-6px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] box-border relative overflow-hidden bg-black max-[1200px]:h-[380px] max-[900px]:h-[350px] max-[640px]:!h-[300px] max-[640px]:!rounded-[20px] max-[480px]:h-[280px] max-[360px]:h-[260px] max-[640px]:cursor-pointer">
                  {mainT.video ? (
                    <video 
                      src={mainT.video} 
                      className="w-full h-full object-cover block"
                      poster={mainT.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"}
                    />
                  ) : (
                    <img src={mainT.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"} alt={mainT.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.85))] flex flex-col justify-between p-8 z-[2] box-border max-[1200px]:p-6 max-[900px]:p-5 max-[640px]:p-5 max-[480px]:p-4 max-[360px]:p-[14px]">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white max-[640px]:w-11 max-[640px]:h-11 max-[480px]:w-10 max-[480px]:h-10 max-[360px]:w-9 max-[360px]:h-9">
                      <img src={mainT.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"} alt={mainT.name} className="w-full h-full object-cover" />
                    </div>
                    {mainT.video && <div className="w-14 h-14 rounded-full bg-[rgba(255,255,255,0.25)] backdrop-blur-[8px] flex items-center justify-center m-auto cursor-pointer transition-all duration-200 ease-in-out border border-[rgba(255,255,255,0.3)] hover:scale-110 hover:bg-[rgba(255,255,255,0.4)] max-[640px]:w-12 max-[640px]:h-12 max-[480px]:w-11 max-[480px]:h-11 max-[360px]:w-10 max-[360px]:h-10"><Play size={20} fill="#FFFFFF" color="#FFFFFF" className="ml-[3px]" /></div>}
                    <div><h5 className="font-['Dancing_Script'] text-[28px] font-bold text-white m-0 tracking-[0.5px] max-[640px]:text-2xl max-[480px]:text-xl max-[360px]:text-lg">{mainT.name}</h5><span className="font-['Lato'] text-xs font-medium text-[rgba(255,255,255,0.8)] mt-1 mx-0 mb-0 leading-[1.3] max-[640px]:text-[11px] max-[480px]:text-[10px] max-[360px]:text-[9px]">{mainT.designation}</span></div>
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

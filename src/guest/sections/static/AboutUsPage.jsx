import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { aboutHeroImg, missionIcon, visionIcon } from '../../../assets';
import './AboutUsPage.css';
import WhyChooseUs from '../../components/WhyChooseUs';
import TestimonialsSlider from '../../components/TestimonialsSlider';

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
           <div className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm transition-all hover:shadow-md sm:gap-5 md:gap-6 md:p-6 lg:gap-[18px] lg:rounded-[18px] max-sm:flex-col max-sm:text-center max-sm:items-center max-sm:p-4 max-xs:p-3">
  <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 sm:w-12 sm:h-12 md:w-[46px] md:h-[46px] max-sm:mx-auto">
    <img 
      src={s1?.highlights?.[0]?.icon || missionIcon} 
      alt="Our Mission Icon" 
      className="w-6 h-6 object-contain sm:w-7 sm:h-7 md:w-8 md:h-8" 
    />
  </div>
  <div className="flex flex-col gap-1 max-sm:items-center max-sm:text-center">
    <h5 className="font-lato text-base font-bold text-gray-900 m-0 sm:text-lg md:text-base">
      {s1?.highlights?.[0]?.title || 'Our Mission'}
    </h5>
    <p className="font-lato text-sm text-gray-600 leading-relaxed m-0 sm:text-base md:text-sm">
      {s1?.highlights?.[0]?.subText || 'Our mission is to connect travelers with high-quality stays through a user-friendly platform.'}
    </p>
  </div>
</div>

<div className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm transition-all hover:shadow-md sm:gap-5 md:gap-6 md:p-6 lg:gap-[18px] lg:rounded-[18px] max-sm:flex-col max-sm:text-center max-sm:items-center max-sm:p-4 max-xs:p-3">
  <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 sm:w-12 sm:h-12 md:w-[46px] md:h-[46px] max-sm:mx-auto">
    <img 
      src={s1?.highlights?.[1]?.icon || visionIcon} 
      alt="Our Vision Icon" 
      className="w-6 h-6 object-contain sm:w-7 sm:h-7 md:w-8 md:h-8" 
    />
  </div>
  <div className="flex flex-col gap-1 max-sm:items-center max-sm:text-center">
    <h5 className="font-lato text-base font-bold text-gray-900 m-0 sm:text-lg md:text-base">
      {s1?.highlights?.[1]?.title || 'Our Vision'}
    </h5>
    <p className="font-lato text-sm text-gray-600 leading-relaxed m-0 sm:text-base md:text-sm">
      {s1?.highlights?.[1]?.subText || 'To become a trusted travel platform that redefines how people discover and experience hotels and villas.'}
    </p>
  </div>
</div>

          </div>
          <div className="w-[17.45px] h-[210.18px] bg-[#0C6DC4] justify-self-center self-start mt-[10px] max-[900px]:hidden"></div>
          
          {/* RECONFIGURED IMAGE CONTAINER FOR TABLET RESPONSIVENESS */}
          <div className="relative w-full max-w-[525px] max-[900px]:max-w-full max-[900px]:order-[-1]">
            <div className="w-full max-w-[525px] h-[672px] rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-[0_15px_35px_rgba(0,0,0,0.04)] max-[1200px]:h-[500px] max-[900px]:h-[450px] max-[900px]:max-w-full max-[768px]:h-[380px] max-[768px]:rounded-[20px] max-[640px]:h-[300px] max-[640px]:rounded-[18px] max-[480px]:h-[260px] max-[360px]:h-[220px]">
              <img src={s1?.mainImage || "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80"} alt="Sunny alpine mountain chalet" className="w-full h-full object-cover" />
            </div>
            
            {/* UPDATED BLUE CARD CLEANED FOR MD/TABLET PIXEL PERFECTION */}
            <div className="absolute bg-[rgba(12,109,196,0.95)] backdrop-blur-md text-white flex flex-col justify-center z-[5] rounded-xl shadow-[0_15px_35px_rgba(12,109,196,0.35)] 
              bottom-[40px] left-[-40px] w-[250px] h-[230px] p-8 /* Desktop Defaults */
              max-[1200px]:w-[220px] max-[1200px]:h-[200px] max-[1200px]:p-6 max-[1200px]:left-[-20px] max-[1200px]:bottom-[30px]
              max-[900px]:left-5 max-[900px]:bottom-5 max-[900px]:w-[210px] max-[900px]:h-[180px] max-[900px]:p-5 /* Perfect Tablet Layout */
              max-[640px]:w-[180px] max-[640px]:h-[140px] max-[640px]:p-4 max-[640px]:left-4 max-[640px]:bottom-4 max-[640px]:rounded-[14px]
              max-[480px]:w-[150px] max-[480px]:h-[120px] max-[480px]:p-3 max-[480px]:left-3 max-[480px]:bottom-3 
              max-[360px]:w-[130px] max-[360px]:h-[105px] max-[360px]:p-2.5 max-[360px]:left-2 max-[360px]:bottom-2">
              
              <span className="font-['Lato'] font-extrabold text-[52px] leading-none tracking-[-1.5px] m-0 max-[1200px]:text-[40px] max-[900px]:text-[36px] max-[640px]:text-[28px] max-[480px]:text-[22px] max-[360px]:text-[18px]">
                {s1?.experience?.title || '40+'}
              </span>
              <div className="about-badge-divider my-2 opacity-50 border-t border-white max-[640px]:my-1.5 max-[480px]:my-1"></div>
              <span className="font-['Lato'] font-semibold text-[14.5px] leading-[145%] text-white m-0 max-[1200px]:text-[12.5px] max-[900px]:text-[12px] max-[640px]:text-[10px] max-[480px]:text-[9px] max-[480px]:leading-tight max-[360px]:text-[8px]">
                {s1?.experience?.subText || 'Years of Experience That Drive Results'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Our Services */}
      <WhyChooseUs homepageContent={homepageContent} />

      {/* Testimonials */}
      <TestimonialsSlider 
        title={s3?.title}
        subtitle={s3?.subText}
        testimonials={s3?.testimonials}
        renderTitle={renderTitle}
      />

    </div>
  );
}
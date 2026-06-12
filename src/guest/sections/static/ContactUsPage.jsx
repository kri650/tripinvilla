import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { contactAddressIcon, contactBgShapeImg, contactCallIcon, contactEmailIcon, contactHeroImg } from '../../../assets';

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
    <div className="bg-[#FCF9EA] pt-0 pb-4 fade-in">
      {/* Hero Banner */}
      <div 
        className="dashboard-hero-banner" 
        style={{ backgroundImage: `url("${content.banner.image.startsWith('http') || content.banner.image.startsWith('/uploads') ? content.banner.image : contactHeroImg}")` }}
      >
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>{content.banner.title}</h1>
      </div>

      {/* Main Form Section */}
      <div className="w-full max-w-[1280px] mx-auto px-20 my-12 grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-10 items-start max-lg:px-8 max-md:px-4 max-md:my-6">
        {/* Image Panel */}
        <div className="w-full h-full min-h-[450px] max-md:min-h-[250px] max-md:order-2 max-sm:min-h-[200px]">
          <img src={contactBgShapeImg} alt="Professional hotel frontdesk receptionists" className="w-full h-full object-cover block" />
        </div>

        {/* Form Panel */}
        <div className="flex flex-col gap-[18px] max-md:order-1 max-md:gap-4 max-sm:gap-3.5">
          <h2 className="font-sans text-[28px] font-bold text-gray-900 m-0 max-lg:text-[26px] max-md:text-[22px] max-sm:text-xl max-sm:leading-tight">{content.section1.title}</h2>
          <p className="font-sans text-[14.5px] text-gray-500 leading-6 m-0 max-sm:text-sm max-sm:leading-snug max-sm:mb-1.5">{content.section1.subText}</p>
          
          <div className="flex flex-col gap-4 max-sm:gap-3">
            {/* Name and Phone Row */}
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-3.5">
              <div className="flex flex-col gap-1.5 max-sm:gap-[5px]">
                <label className="font-sans font-bold text-[13.5px] text-gray-900 max-sm:text-[13px]">Name</label>
                <input 
                  type="text" 
                  className="font-sans text-sm px-4 py-3 border border-gray-200 rounded-lg outline-none bg-white text-gray-900 transition-colors duration-200 focus:border-[var(--primary-blue)] max-sm:px-3 max-sm:py-2.5" 
                  placeholder="Enter your name" 
                  value={contactName} 
                  onChange={(e) => setContactName(e.target.value)} 
                />
              </div>
              <div className="flex flex-col gap-1.5 max-sm:gap-[5px]">
                <label className="font-sans font-bold text-[13.5px] text-gray-900 max-sm:text-[13px]">Phone Number</label>
                <input 
                  type="text" 
                  className="font-sans text-sm px-4 py-3 border border-gray-200 rounded-lg outline-none bg-white text-gray-900 transition-colors duration-200 focus:border-[var(--primary-blue)] max-sm:px-3 max-sm:py-2.5" 
                  placeholder="Enter your phone number" 
                  value={contactPhone} 
                  onChange={(e) => setContactPhone(e.target.value)} 
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 max-sm:gap-[5px]">
              <label className="font-sans font-bold text-[13.5px] text-gray-900 max-sm:text-[13px]">Email Address</label>
              <input 
                type="email" 
                className="font-sans text-sm px-4 py-3 border border-gray-200 rounded-lg outline-none bg-white text-gray-900 transition-colors duration-200 focus:border-[var(--primary-blue)] max-sm:px-3 max-sm:py-2.5" 
                placeholder="Enter your email" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)} 
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5 max-sm:gap-[5px]">
              <label className="font-sans font-bold text-[13.5px] text-gray-900 max-sm:text-[13px]">Message</label>
              <textarea 
                className="font-sans text-sm px-4 py-3 border border-gray-200 rounded-lg outline-none bg-white text-gray-900 transition-colors duration-200 focus:border-[var(--primary-blue)] h-[110px] resize-none max-sm:px-3 max-sm:py-2.5 max-sm:h-[100px]" 
                placeholder="Enter your message" 
                value={contactMessage} 
                onChange={(e) => setContactMessage(e.target.value)} 
              />
            </div>

            {/* Agreement Checkbox */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer my-1.5 select-none max-sm:gap-2 max-sm:items-start max-sm:py-0.5" 
              onClick={() => setContactAgreed(!contactAgreed)}
            >
              <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ease-in-out bg-white ${contactAgreed ? 'border-[#58A429] bg-[#58A429]' : 'border-gray-300'}`}>
                {contactAgreed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="font-sans text-sm text-gray-500 max-sm:text-xs max-sm:leading-snug">Agreed to the terms & conditions</span>
            </div>

            {/* Submit Button */}
            <button 
              className="flex items-center justify-center gap-2 bg-[#58A429] text-white font-sans text-[15px] font-bold px-7 py-3.5 border-none rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#38A169] active:scale-[0.98] w-fit max-sm:px-5 max-sm:py-3 max-sm:text-sm max-sm:w-full max-sm:justify-center"
              onClick={() => {
                if (!contactAgreed) { alert('Please agree to the terms & conditions first!'); return; }
                alert(`Thank you ${contactName || 'Valued Guest'}! Your message has been sent to our corporate desks successfully!`);
                setContactName(''); setContactPhone(''); setContactEmail(''); setContactMessage(''); setContactAgreed(false);
              }}
            >
              <span>Send us a message</span><ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="w-full max-w-[1280px] mx-auto px-20 mt-5 mb-0 grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-5 items-start relative max-lg:px-8 max-md:px-4 max-sm:px-3">
        <div className="flex flex-col gap-2.5 relative z-[1] max-sm:gap-1.5">
          <h2 className="font-sans text-[28px] font-bold text-gray-900 m-0 max-lg:text-[26px] max-md:text-[22px] max-sm:text-lg max-sm:leading-tight">{content.section1.title2}</h2>
          <p className="font-sans text-sm text-gray-500 m-0 max-sm:text-[13px] max-sm:leading-snug">{content.section1.subText2}</p>
        </div>

        <div className="flex flex-col gap-4 relative z-[1] max-sm:gap-3">
          {[
            content.section1.address,
            content.section1.email,
            content.section1.call,
          ].map((item, i) => {
            const isEmail = item.highlight?.toLowerCase().includes('email');
            const isCall = item.highlight?.toLowerCase().includes('call');
            let href = null;
            if (isEmail) href = `mailto:${item.title}`;
            if (isCall) href = `tel:${item.title.replace(/[^\d+]/g, '')}`;

            const CardTag = href ? 'a' : 'div';
            const extraProps = href ? { href, style: { textDecoration: 'none', color: 'inherit', cursor: 'pointer' } } : {};

            return (
              <CardTag 
                key={i} 
                className="flex items-center gap-4 bg-[#EBFFDE] rounded-xl p-[18px] transition-transform duration-200 ease-in-out hover:translate-x-1 max-md:p-4 max-md:gap-3.5 max-sm:p-3.5 max-sm:gap-2.5 max-sm:flex-col max-sm:items-start" 
                {...extraProps}
              >
                <div className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_10px_rgba(72,187,120,0.06)] max-md:w-9 max-md:h-9 max-sm:w-8 max-sm:h-8 max-sm:self-start">
                  <img 
                    src={(item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/uploads'))) ? item.icon : [contactAddressIcon, contactEmailIcon, contactCallIcon][i]} 
                    alt={item.highlight} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-bold text-[13px] text-gray-500 uppercase tracking-[0.5px] max-sm:text-[11px]">{item.highlight}</span>
                  <span className="font-sans font-bold text-[15px] text-gray-900 leading-[1.4] max-sm:text-[13px] max-sm:break-all">{item.title}</span>
                </div>
              </CardTag>
            );
          })}
        </div>
      </div>
    </div>
  );
}

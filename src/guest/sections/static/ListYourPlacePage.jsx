import { ChevronDown, CreditCard, Percent } from 'lucide-react';
import { listPlaceHeroImg, rect32Img, rect33Img, rect35Img, stepIcon1, stepIcon2, stepIcon3, stepIcon4 } from '../../../assets';

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
    <div className="bg-[#FCF9EA] pt-0 pb-4 fade-in">
      {/* Hero Banner */}
      <div className="dashboard-hero-banner list-hero-custom" style={{ backgroundImage: `url("${listPlaceHeroImg}")` }}>
        <h1 className="dashboard-hero-title">List Your Property</h1>
        <button 
          className="flex items-center justify-center gap-2 bg-[#58A429] text-white font-sans text-[15px] font-bold px-7 py-3.5 border-none rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#38A169] active:scale-[0.98]" 
          onClick={() => {
            if (!token || !user) { setAuthMode('login'); setAuthModalOpen(true); }
            else { window.location.href = `/owner/register?token=${token}`; }
          }}
        >
          List Property
        </button>
      </div>

      {/* Steps Section */}
      <div className="w-full max-w-[1280px] mx-auto px-20 my-16 max-lg:px-8 max-md:px-5 max-md:my-10 max-sm:px-4 max-sm:my-8">
        <div className="text-center mb-10 max-md:mb-8 max-sm:mb-6">
          <h2 className="font-sans text-[32px] font-bold text-[#111827] mb-2.5 max-lg:text-[28px] max-md:text-2xl max-sm:text-[19px] max-sm:leading-tight">
            All You Have <span className="highlight-sharp-blue-box">To Do</span>
          </h2>
          <p className="font-sans text-[14.5px] text-[#6B7280] m-0 max-md:text-sm max-sm:text-[13px] max-sm:px-2">Do The Following Steps To List Your Property With Us</p>
        </div>
        
        <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-lg:gap-4 max-md:grid-cols-2 max-md:gap-3.5 max-[480px]:grid-cols-1 max-[480px]:gap-3">
          {[
            { icon: stepIcon1, text: 'Sign In Or Sign Up As A Property Owner' }, 
            { icon: stepIcon2, text: 'Upload Your Property Details And Photos' }, 
            { icon: stepIcon3, text: 'Set Your Prices And Available Dates' }, 
            { icon: stepIcon4, text: 'See Your Property Go Live In Front Of Millions Of Travelers' }
          ].map((step, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col items-center gap-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] max-md:p-[18px] max-md:gap-3.5 max-md:rounded-xl max-[480px]:flex-row max-[480px]:items-center max-[480px]:text-left max-[480px]:p-4">
              <div className="w-14 h-14 rounded-full bg-[#EBFDF2] flex items-center justify-center flex-shrink-0 max-md:w-12 max-md:h-12 max-[480px]:w-11 max-[480px]:h-11">
                <img src={step.icon} alt={`Step ${i + 1}`} className="w-3/5 h-3/5 object-contain max-[480px]:w-full max-[480px]:h-full max-[480px]:p-2" />
              </div>
              <p className="font-sans text-sm font-bold text-[#111827] text-center leading-[1.5] m-0 max-md:text-[13px] max-md:leading-[1.4] max-[480px]:text-left max-[480px]:font-semibold max-[480px]:text-xs">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Our Services */}
      <div className="w-full bg-[#EBFADE] py-16 pb-24 overflow-hidden max-md:py-12 max-md:pb-16 max-sm:py-10 max-sm:pb-12" style={{ marginBottom: 0 }}>
        <div className="w-full max-w-[1440px] mx-auto px-20 max-lg:px-8 max-md:px-4 max-sm:px-3">
          <div className="text-center mb-10 max-md:mb-8 max-sm:mb-6">
            <h2 className="font-sans text-[32px] font-bold text-gray-900 mb-3 max-lg:text-[28px] max-md:text-2xl max-sm:text-[19px] max-sm:leading-tight max-sm:mb-2 max-sm:px-2">
              {homepageContent?.section5?.row1?.title || <span>Why Choose Our <span className="highlight-sharp-blue-box">Services</span></span>}
            </h2>
            <p className="font-sans text-base text-gray-600 max-md:text-sm max-sm:text-[13px] max-sm:px-2">{homepageContent?.section5?.row1?.subText || 'Choose the next destination for you'}</p>
          </div>
          
          {/* Service Grid with Full Image Visibility */}
          <div className="grid grid-cols-3 gap-6 min-h-[500px] max-lg:grid-cols-1 max-lg:gap-5 max-md:gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-6 max-md:gap-4">
              <div className="bg-white border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[23.49px] p-6 flex flex-col justify-start gap-4 h-auto min-h-0 box-border overflow-hidden max-sm:p-5 max-sm:rounded-2xl max-sm:gap-3">
                <p className="font-sans text-base text-gray-600 leading-6 m-0 max-sm:text-sm max-sm:leading-relaxed">{homepageContent?.section5?.row1Desc || 'Every property is carefully verified.'}</p>
                <h3 className="font-sans text-xl font-bold text-[#E65100] m-0 mb-1 max-sm:text-lg">{homepageContent?.section5?.row1?.title || 'Verified & Trusted Stays'}</h3>
                <p className="font-sans text-[15px] font-semibold text-gray-900 m-0 max-sm:text-sm">{homepageContent?.section5?.row1?.subText || 'Get genuine and good stays'}</p>
              </div>
              <div className="relative rounded-[23.49px] overflow-hidden bg-white flex items-center justify-center min-h-[250px] max-sm:rounded-2xl max-sm:min-h-[200px]">
                <img src={rect35Img} alt="Secure Payments" className="w-full h-full object-contain max-lg:object-cover" />
                <div className="absolute bottom-6 left-6 bg-[rgba(17,24,39,0.7)] backdrop-blur-[8px] px-[18px] py-2 rounded-[100px] flex items-center gap-2.5 text-white font-sans text-[15px] font-semibold max-sm:bottom-3 max-sm:left-3 max-sm:text-xs max-sm:px-3 max-sm:py-1.5">
                  <div className="w-7 h-7 rounded-full bg-[var(--primary-blue)] flex items-center justify-center max-sm:w-6 max-sm:h-6"><CreditCard size={14} color="#FFFFFF" /></div>
                  <span>{homepageContent?.section5?.features?.[0]?.title || 'Secure Payments'}</span>
                </div>
              </div>
            </div>
            
            {/* Center Column - Tall Image */}
            <div className="flex items-center justify-center">
              <div className="w-full rounded-[23.49px] overflow-hidden bg-white max-sm:rounded-2xl">
                <img src={homepageContent?.section5?.image3 || rect32Img} alt="Traveler with suitcase" className="w-full h-auto object-contain max-w-full" />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="flex flex-col gap-6 max-md:gap-4">
              <div className="relative rounded-[23.49px] overflow-hidden bg-white flex items-center justify-center min-h-[250px] max-sm:rounded-2xl max-sm:min-h-[200px]">
                <img src={homepageContent?.section5?.features?.[1]?.image || rect33Img} alt="Best Price Guarantee" className="w-full h-full object-contain max-lg:object-cover" />
                <div className="absolute bottom-6 left-6 bg-[rgba(17,24,39,0.7)] backdrop-blur-[8px] px-[18px] py-2 rounded-[100px] flex items-center gap-2.5 text-white font-sans text-[15px] font-semibold max-sm:bottom-3 max-sm:left-3 max-sm:text-xs max-sm:px-3 max-sm:py-1.5">
                  <div className="w-7 h-7 rounded-full bg-[var(--primary-blue)] flex items-center justify-center max-sm:w-6 max-sm:h-6"><Percent size={14} color="#FFFFFF" /></div>
                  <span>{homepageContent?.section5?.features?.[1]?.title || 'Best Price Guarantee'}</span>
                </div>
              </div>
              <div className="bg-transparent rounded-[23.49px] p-6 flex flex-col justify-start gap-3 h-auto min-h-0 box-border overflow-hidden max-sm:p-5 max-sm:pl-2 max-sm:rounded-2xl max-sm:gap-2.5">
                <div className="flex flex-col gap-3 max-sm:gap-2">
                  <h3 className="font-sans text-xl font-bold text-[#E65100] m-0 max-sm:text-lg">{homepageContent?.section5?.row2?.title || '24/7 Support, Always There'}</h3>
                  <p className="font-sans text-base font-semibold text-gray-900 m-0 mb-3 max-sm:text-sm max-sm:mb-2">{homepageContent?.section5?.row2?.subText || 'All type of support'}</p>
                </div>
                <p className="font-sans text-[15px] text-gray-600 leading-6 m-0 max-sm:text-sm max-sm:leading-relaxed">{homepageContent?.section5?.row2Desc || 'From booking to checkout, our support team is available anytime to help you.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="w-full max-w-[1242px] mx-auto px-20 my-16 mb-10 max-lg:px-8 max-md:px-5 max-md:my-10 max-sm:px-4 max-sm:my-8 max-sm:mb-6">
        <div className="text-center mb-10 max-md:mb-8 max-sm:mb-6">
          <h2 className="font-sans text-[32px] font-bold text-[#111827] mb-2.5 max-lg:text-[28px] max-md:text-2xl max-sm:text-[19px] max-sm:leading-tight max-sm:px-2">
            Frequently Asked <span className="highlight-sharp-blue-box">Questions</span>
          </h2>
          <p className="font-sans text-[14.5px] text-[#6B7280] m-0 max-md:text-sm max-sm:text-[13px] max-sm:px-2">You Can Ask Anything You Want</p>
        </div>
        
        <div className="flex flex-col gap-4 max-sm:gap-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white border rounded-xl overflow-hidden cursor-pointer transition-all duration-[250ms] ease-in-out max-sm:rounded-lg ${isOpen ? 'border-[#58A429] shadow-[0_4px_15px_rgba(72,187,120,0.05)]' : 'border-[#E5E7EB] hover:border-[#58A429]'}`}
                onClick={() => setActiveFaq(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between px-6 py-5 max-md:px-5 max-md:py-4 max-sm:px-4 max-sm:py-3.5">
                  <div className="flex items-center gap-4 flex-1 max-sm:gap-3">
                    <div className="w-[26px] h-[26px] rounded-full bg-[#58A429] text-white flex items-center justify-center font-sans text-xs font-bold flex-shrink-0 max-sm:w-6 max-sm:h-6 max-sm:text-[10px]">
                      {idx + 1}
                    </div>
                    <span className="font-sans text-[14.5px] font-bold text-[#111827] leading-snug max-md:text-[13.5px] max-sm:text-[12.5px] max-sm:leading-tight">{faq.q}</span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`flex-shrink-0 transition-all duration-[250ms] ease-in-out max-sm:w-4 max-sm:h-4 ${isOpen ? 'rotate-180 text-[#58A429]' : 'text-[#9CA3AF]'}`} 
                  />
                </div>
                <div 
                  className={`transition-all duration-[250ms] ease-out overflow-hidden ${isOpen ? 'max-h-[200px] border-t border-[#F3F4F6]' : 'max-h-0'}`}
                >
                  <p className="font-sans text-sm text-[#4B5563] leading-[1.6] px-6 py-5 m-0 max-md:px-5 max-md:py-4 max-sm:px-4 max-sm:py-3.5 max-sm:text-xs max-sm:leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

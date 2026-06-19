import { ChevronDown } from 'lucide-react';
import { listPlaceHeroImg, stepIcon1, stepIcon2, stepIcon3, stepIcon4 } from '../../../assets';
import WhyChooseUs from '../../components/WhyChooseUs';

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
      <WhyChooseUs homepageContent={homepageContent} />

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

import { CreditCard, Percent } from 'lucide-react';
import { rect32Img, rect33Img, rect35Img } from '../../assets';
import { renderTitle } from '../utils/renderTitle';

export default function WhyChooseUs({ homepageContent }) {
  const section5 = homepageContent?.section5;

  return (
    <div className="w-full bg-[#EBFADE] py-16 pb-24 overflow-hidden max-md:py-12 max-md:pb-16 max-sm:py-10 max-sm:pb-12" style={{ marginBottom: 0 }}>
      <div className="w-full max-w-[1440px] mx-auto px-20 max-lg:px-8 max-md:px-4 max-sm:px-3">
        <div className="text-center mb-10 max-md:mb-8 max-sm:mb-6">
          <h2 className="font-sans text-[32px] font-bold text-gray-900 mb-3 max-lg:text-[28px] max-md:text-2xl max-sm:text-[19px] max-sm:leading-tight max-sm:mb-2 max-sm:px-2">
            {renderTitle(section5?.title, <span>Why Choose Our <span className="highlight-sharp-blue-box">Services</span></span>, "Services")}
          </h2>
          <p className="font-sans text-base text-gray-600 max-md:text-sm max-sm:text-[13px] max-sm:px-2">
            {section5?.subText || 'Choose the next destination for you'}
          </p>
        </div>
        
        {/* Service Grid with Full Image Visibility */}
        <div className="grid grid-cols-3 gap-6 min-h-[500px] max-lg:grid-cols-1 max-lg:gap-5 max-md:gap-4">
          {/* Left Column */}
          <div className="flex flex-col gap-6 max-md:gap-4">
            <div className="bg-white border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[23.49px] p-6 flex flex-col justify-start gap-4 h-auto min-h-0 box-border overflow-hidden max-sm:p-5 max-sm:rounded-2xl max-sm:gap-3">
              <p className="font-sans text-base text-gray-600 leading-6 m-0 max-sm:text-sm max-sm:leading-relaxed">
                {section5?.row1Desc || 'Every property is carefully verified.'}
              </p>
              <h3 className="font-sans text-xl font-bold text-[#E65100] m-0 mb-1 max-sm:text-lg">
                {section5?.row1?.title || 'Verified & Trusted Stays'}
              </h3>
              <p className="font-sans text-[15px] font-semibold text-gray-900 m-0 max-sm:text-sm">
                {section5?.row1?.subText || 'Get genuine and good stays'}
              </p>
            </div>
            <div className="relative rounded-[23.49px] overflow-hidden bg-white flex items-center justify-center min-h-[250px] max-sm:rounded-2xl max-sm:min-h-[200px]">
              <img src={section5?.features?.[0]?.image || rect35Img} alt={section5?.features?.[0]?.title || 'Secure Payments'} className="w-full h-full object-contain max-lg:object-cover" />
              <div className="absolute bottom-6 left-6 bg-[rgba(17,24,39,0.7)] backdrop-blur-[8px] px-[18px] py-2 rounded-[100px] flex items-center gap-2.5 text-white font-sans text-[15px] font-semibold max-sm:bottom-3 max-sm:left-3 max-sm:text-xs max-sm:px-3 max-sm:py-1.5">
                <div className="w-7 h-7 rounded-full bg-[var(--primary-blue)] flex items-center justify-center max-sm:w-6 max-sm:h-6">
                  <CreditCard size={14} color="#FFFFFF" />
                </div>
                <span>{section5?.features?.[0]?.title || 'Secure Payments'}</span>
              </div>
            </div>
          </div>
          
          {/* Center Column - Tall Image */}
          <div className="flex items-center justify-center">
            <div className="w-full rounded-[23.49px] overflow-hidden bg-white max-sm:rounded-2xl">
              <img src={section5?.image3 || rect32Img} alt="Traveler center image" className="w-full h-auto object-contain max-w-full" />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-6 max-md:gap-4">
            <div className="relative rounded-[23.49px] overflow-hidden bg-white flex items-center justify-center min-h-[250px] max-sm:rounded-2xl max-sm:min-h-[200px]">
              <img src={section5?.features?.[1]?.image || rect33Img} alt={section5?.features?.[1]?.title || 'Best Price Guarantee'} className="w-full h-full object-contain max-lg:object-cover" />
              <div className="absolute bottom-6 left-6 bg-[rgba(17,24,39,0.7)] backdrop-blur-[8px] px-[18px] py-2 rounded-[100px] flex items-center gap-2.5 text-white font-sans text-[15px] font-semibold max-sm:bottom-3 max-sm:left-3 max-sm:text-xs max-sm:px-3 max-sm:py-1.5">
                <div className="w-7 h-7 rounded-full bg-[var(--primary-blue)] flex items-center justify-center max-sm:w-6 max-sm:h-6">
                  <Percent size={14} color="#FFFFFF" />
                </div>
                <span>{section5?.features?.[1]?.title || 'Best Price Guarantee'}</span>
              </div>
            </div>
            <div className="bg-transparent rounded-[23.49px] p-6 flex flex-col justify-start gap-3 h-auto min-h-0 box-border overflow-hidden max-sm:p-5 max-sm:pl-2 max-sm:rounded-2xl max-sm:gap-2.5">
              <div className="flex flex-col gap-3 max-sm:gap-2">
                <h3 className="font-sans text-xl font-bold text-[#E65100] m-0 max-sm:text-lg">
                  {section5?.row2?.title || '24/7 Support, Always There'}
                </h3>
                <p className="font-sans text-base font-semibold text-gray-900 m-0 mb-3 max-sm:text-sm max-sm:mb-2">
                  {section5?.row2?.subText || 'All type of support'}
                </p>
              </div>
              <p className="font-sans text-[15px] text-gray-600 leading-6 m-0 max-sm:text-sm max-sm:leading-relaxed">
                {section5?.row2Desc || 'From booking to checkout, our support team is available anytime to help you.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

export default function TestimonialsSlider({ 
  title, 
  subtitle, 
  testimonials = [], 
  renderTitle 
}) {
  const defaultTestimonials = [
    { 
      name: 'Jessy Roy', 
      designation: 'Director of Operations, Enterprise Client', 
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', 
      text: '"Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth."' 
    },
    { 
      name: 'Jeremy Renner', 
      designation: 'Project Manager, Corporate Solutions Firm', 
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', 
      text: '"From initial consultation to final delivery, the team demonstrated exceptional professionalism."' 
    },
    { 
      name: 'Winona Ryder', 
      designation: 'CEO, Growing Tech Company', 
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', 
      text: '"They didn\'t just deliver a solution—they delivered confidence and long-term value."' 
    }
  ];

  const testimonialsData = testimonials?.slice(0, 3) || defaultTestimonials;
  const videoTestimonial = testimonials?.[3] || { 
    name: 'David Campbell', 
    designation: 'Head of Digital Transformation', 
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80" 
  };

  const handleScroll = (direction) => {
    const container = document.getElementById('testimonials-scroll-container');
    if (!container) return;

    const firstCard = container.firstElementChild;
    if (firstCard) {
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
      
      container.scrollBy({ 
        left: direction * (cardWidth + gap), 
        behavior: 'smooth' 
      });
    }
  };

  const handlePlayButtonClick = (event) => {
    const playButton = event.currentTarget;
    playButton.style.transform = 'scale(0.9)';
    setTimeout(() => { playButton.style.transform = 'scale(1.1)'; }, 100);
    setTimeout(() => { playButton.style.transform = 'scale(1)'; }, 200);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 mt-0 max-[900px]:mt-10 max-[640px]:mt-8 max-[480px]:mt-6">
      <div className="our-testimonials-section my-20 mb-5 pt-8 max-[640px]:!my-[60px] max-[640px]:!mb-5 max-[640px]:pt-6 max-[480px]:pt-5 max-[360px]:pt-4">
        
        {/* Section Title */}
        <div className="section-title-wrap max-[640px]:text-center mb-[30px]">
          <h2 className="section-main-headline max-[640px]:text-2xl max-[480px]:text-xl max-[360px]:text-lg">
            {renderTitle ? 
              renderTitle(title, <span>Our <span className="highlight-sharp-blue-box">Testimonials</span></span>, "Testimonials") :
              title || <span>Our <span className="highlight-sharp-blue-box">Testimonials</span></span>
            }
          </h2>
          <p className="section-sub-headline max-[640px]:text-sm max-[480px]:text-[13px] max-[360px]:text-xs">
            {subtitle || 'Check what our customers say about us'}
          </p>
        </div>
        
        {/* Slider Wrapper */}
        <div className="relative mt-10 px-6 sm:px-10 pt-6 pb-4 overflow-hidden">
          
          {/* Left Arrow */}
          <button
            onClick={() => handleScroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95 animate-[fadeInLeft_0.6s_ease-out] max-[640px]:w-8 max-[640px]:h-8"
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={20} className="text-gray-700 max-[640px]:w-4 max-[640px]:h-4" />
          </button>

          {/* Scrollable Container */}
          <div
            id="testimonials-scroll-container"
            className="flex overflow-x-auto scroll-smooth w-full gap-4 md:gap-5 lg:gap-6"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
          >
            {/* Testimonial Cards */}
            {testimonialsData.map((t, i) => (
              <div 
                key={i} 
                className="bg-white border border-[#E5E7EB] rounded-3xl p-6 flex flex-col justify-between items-start flex-shrink-0 h-[380px] md:h-[400px] lg:h-[420px] shadow-[0_10px_30px_rgba(0,0,0,0.015)] animate-[slideInUp_0.6s_ease-out]
                           w-full 
                           md:w-[calc((100%-1.25rem)/2)] 
                           lg:w-[calc((100%-2*1.5rem)/3)]"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationFillMode: 'backwards',
                  scrollSnapAlign: 'start'
                }}
              >
                {/* Profile Image */}
                <div 
                  className="w-12 h-12 rounded-full overflow-hidden mb-4 border border-[#E5E7EB] shadow-[0_4px_10px_rgba(0,0,0,0.05)] flex-shrink-0 animate-[bounceIn_0.8s_ease-out] lg:w-14 lg:h-14 lg:mb-6"
                  style={{
                    animationDelay: `${i * 150 + 200}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <img 
                    src={t.image || t.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                    alt={t.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0 w-full">
                  <p 
                    className="font-['Lato'] text-[13px] md:text-[14px] lg:text-[15px] text-[#4B5563] leading-[1.5] lg:leading-[1.6] m-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent animate-[fadeInUp_0.7s_ease-out]"
                    style={{
                      animationDelay: `${i * 150 + 400}ms`,
                      animationFillMode: 'backwards',
                      maxHeight: '140px'
                    }}
                  >
                    {t.text || t.quote}
                  </p>
                </div>

                {/* Footer */}
                <div 
                  className="flex flex-col gap-0.5 items-start w-full border-t border-[#F3F4F6] pt-3 mt-3 lg:pt-4 lg:mt-4 animate-[slideInLeft_0.6s_ease-out]"
                  style={{
                    animationDelay: `${i * 150 + 600}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <h5 className="font-['Dancing_Script'] text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#111827] m-0 tracking-[0.2px]">
                    {t.name}
                  </h5>
                  <span className="font-['Lato'] text-[10px] lg:text-[12px] font-semibold text-[#9CA3AF] m-0 leading-[1.3]">
                    {t.designation || t.role}
                  </span>
                </div>
              </div>
            ))}

            {/* Featured Video/Image Card */}
            <div 
              className="bg-black border border-[#E5E7EB] rounded-3xl p-0 flex flex-col justify-between items-start flex-shrink-0 h-[380px] md:h-[400px] lg:h-[420px] shadow-[0_10px_30px_rgba(0,0,0,0.015)] relative overflow-hidden animate-[slideInRight_0.8s_ease-out]
                         w-full 
                         md:w-[calc((100%-1.25rem)/2)] 
                         lg:w-[calc((100%-2*1.5rem)/3)]"
              style={{
                animationDelay: '450ms',
                animationFillMode: 'backwards',
                scrollSnapAlign: 'start'
              }}
            >
              {videoTestimonial.video ? (
                <video 
                  src={videoTestimonial.video} 
                  className="w-full h-full object-cover block"
                  poster={videoTestimonial.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"}
                />
              ) : (
                <img 
                  src={videoTestimonial.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"} 
                  alt={videoTestimonial.name} 
                  className="w-full h-full object-cover" 
                />
              )}
              
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.85))] flex flex-col justify-between p-6 lg:p-8 z-[2]">
                <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-white">
                  <img 
                    src={videoTestimonial.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"} 
                    alt={videoTestimonial.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {videoTestimonial.video && (
                  <div 
                    className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[rgba(255,255,255,0.25)] backdrop-blur-[8px] flex items-center justify-center m-auto cursor-pointer border border-[rgba(255,255,255,0.3)]"
                    onClick={handlePlayButtonClick}
                  >
                    <Play size={20} fill="#FFFFFF" color="#FFFFFF" className="ml-[3px] lg:w-6 lg:h-6" />
                  </div>
                )}
                
                <div>
                  <h5 className="font-['Dancing_Script'] text-[24px] lg:text-[32px] font-bold text-white m-0 tracking-[0.5px]">
                    {videoTestimonial.name}
                  </h5>
                  <span className="font-['Lato'] text-[11px] lg:text-sm font-medium text-[rgba(255,255,255,0.8)] mt-1 mx-0 mb-0 leading-[1.3]">
                    {videoTestimonial.designation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => handleScroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95 animate-[fadeInRight_0.6s_ease-out] max-[640px]:w-8 max-[640px]:h-8"
            aria-label="Next testimonials"
          >
            <ChevronRight size={20} className="text-gray-700 max-[640px]:w-4 max-[640px]:h-4" />
          </button>
        </div>
      </div>

      {/* Hide Scrollbar CSS */}
      <style jsx>{`
        #testimonials-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 0.375rem;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
    </div>
  );
}
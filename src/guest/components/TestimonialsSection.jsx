// import { useRef } from 'react';
// import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

// export default function TestimonialsSection({ 
//   title = 'Our Testimonials', 
//   subtitle = 'Check what our customers say about us',
//   testimonials = [],
//   className = ''
// }) {
//   const scrollRef = useRef(null);

//   const defaultTestimonials = [
//     { 
//       name: 'Jessy Roy', 
//       designation: 'Director of Operations, Enterprise Client', 
//       image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', 
//       text: '"Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth."' 
//     },
//     { 
//       name: 'Jeremy Renner', 
//       designation: 'Project Manager, Corporate Solutions Firm', 
//       image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', 
//       text: '"From initial consultation to final delivery, the team demonstrated exceptional professionalism."' 
//     },
//     { 
//       name: 'Winona Ryder', 
//       designation: 'CEO, Growing Tech Company', 
//       image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', 
//       text: '"They didn\'t just deliver a solution—they delivered confidence and long-term value."' 
//     },
//   ];

//   const displayTestimonials = testimonials.length > 0 ? testimonials.slice(0, 3) : defaultTestimonials;

//   const featuredTestimonial = testimonials.length > 3 ? testimonials[3] : {
//     name: 'David Campbell', 
//     designation: 'Head of Digital Transformation', 
//     image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80",
//     video: null
//   };

//   const handleScroll = (direction) => {
//     const container = scrollRef.current;
//     if (!container) return;

//     const firstCard = container.querySelector('[data-card]');
//     const gap = 16; 
    
//     let scrollDistance;
//     if (firstCard) {
//       scrollDistance = firstCard.getBoundingClientRect().width + gap;
//     } else {
//       scrollDistance = container.clientWidth;
//     }

//     const currentScroll = container.scrollLeft;
//     const targetScroll = direction === 'left' 
//       ? currentScroll - scrollDistance 
//       : currentScroll + scrollDistance;

//     container.scrollTo({
//       left: targetScroll,
//       behavior: 'smooth'
//     });
//   };

//   const handlePlayClick = (event) => {
//     const btn = event.currentTarget;
//     btn.style.transform = 'scale(0.9)';
//     setTimeout(() => { btn.style.transform = 'scale(1.1)'; }, 100);
//     setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
//   };

//   return (
//     <div className={`w-full overflow-hidden ${className}`}>
//       <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
//         <div className="py-8 sm:py-14 md:py-16 lg:py-20">

//           {/* Section Header */}
//           <div className="mb-6 sm:mb-10 text-center sm:text-left">
//             <h2 className="font-['Lato'] text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-bold text-gray-900 mb-3">
//               {title.includes('Testimonials') ? (
//                 <span>
//                   Our{' '}
//                   <span className="relative inline-block">
//                     <span className="relative z-10 bg-gradient-to-r from-[#0C6DC4] to-[#58A429] bg-clip-text text-transparent font-bold">
//                       Testimonials
//                     </span>
//                     <span className="absolute inset-0 bg-[#0C6DC4] opacity-10 rounded-lg transform -skew-x-12"></span>
//                   </span>
//                 </span>
//               ) : title}
//             </h2>
//             <p className="font-['Lato'] text-xs sm:text-sm md:text-[15px] text-gray-600 leading-relaxed">
//               {subtitle}
//             </p>
//           </div>

//           {/* Carousel Wrapper */}
//           <div className="relative">

//             {/* Nav Left */}
//             <button
//               onClick={() => handleScroll('left')}
//               className="
//                 hidden sm:flex
//                 absolute -left-4 md:-left-6 lg:-left-10 top-1/2 -translate-y-1/2 z-20
//                 w-8 h-8 md:w-10 md:h-10
//                 rounded-full bg-white
//                 shadow-[0_4px_12px_rgba(0,0,0,0.15)]
//                 items-center justify-center
//                 transition-all duration-300
//                 hover:bg-gray-50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95
//               "
//               aria-label="Previous testimonials"
//             >
//               <ChevronLeft size={18} className="text-gray-700" />
//             </button>

//             {/* Nav Right */}
//             <button
//               onClick={() => handleScroll('right')}
//               className="
//                 hidden sm:flex
//                 absolute -right-4 md:-right-6 lg:-right-10 top-1/2 -translate-y-1/2 z-20
//                 w-8 h-8 md:w-10 md:h-10
//                 rounded-full bg-white
//                 shadow-[0_4px_12px_rgba(0,0,0,0.15)]
//                 items-center justify-center
//                 transition-all duration-300
//                 hover:bg-gray-50 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95
//               "
//               aria-label="Next testimonials"
//             >
//               <ChevronRight size={18} className="text-gray-700" />
//             </button>

//             {/* Scroll Container - switched snap strategy to center for 1-card presentation */}
//             <div
//               ref={scrollRef}
//               id="testimonials-scroll-container"
//               className="
//                 flex gap-4 overflow-x-auto scroll-smooth
//                 py-4 snap-x snap-mandatory
//               "
//               style={{ 
//                 scrollbarWidth: 'none', 
//                 msOverflowStyle: 'none',
//                 WebkitOverflowScrolling: 'touch',
//               }}
//             >
//               {displayTestimonials.map((testimonial, index) => (
//                 <div 
//                   key={index}
//                   data-card
//                   className="
//                     testimonial-card snap-center sm:snap-start
//                     group relative
//                     bg-gradient-to-br from-white to-gray-50
//                     border border-gray-200 rounded-3xl
//                     flex flex-col justify-between items-start
//                     flex-shrink-0 overflow-hidden
//                     transition-all duration-500 ease-out cursor-pointer will-change-transform
//                     hover:from-white hover:to-green-50 hover:border-[#58A429]
//                     hover:shadow-[0_25px_50px_rgba(88,164,41,0.15),0_10px_30px_rgba(0,0,0,0.08)]
//                     hover:-translate-y-3 hover:scale-[1.03]
//                     shadow-[0_10px_30px_rgba(0,0,0,0.015)]
//                     p-5 sm:p-5 md:p-6 lg:p-8
//                     h-[260px] sm:h-[280px] md:h-[320px] lg:h-[380px] xl:h-[440px]
//                   "
//                   style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'backwards' }}
//                 >
//                   <div className="absolute inset-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-green-50/30 to-transparent transition-all duration-700 group-hover:left-full pointer-events-none" />

//                   <div className="relative z-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] group-hover:border-[#58A429] mb-3 sm:mb-4 md:mb-5 lg:mb-6 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
//                     <img 
//                       src={testimonial.image || testimonial.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
//                       alt={testimonial.name} 
//                       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
//                     />
//                   </div>

//                   <p className="relative z-10 font-['Lato'] text-gray-600 leading-[165%] flex-grow text-xs sm:text-xs md:text-[13px] lg:text-[14.5px] mb-3 sm:mb-4 md:mb-5 lg:mb-6 line-clamp-5 sm:line-clamp-6">
//                     {testimonial.text || testimonial.quote}
//                   </p>

//                   <div className="relative z-10 flex flex-col gap-0.5 items-start w-full border-t border-gray-100 pt-3 sm:pt-4">
//                     <h5 className="font-['Dancing_Script'] font-bold text-gray-900 m-0 tracking-[0.2px] text-base sm:text-lg md:text-xl lg:text-[25px]">
//                       {testimonial.name}
//                     </h5>
//                     <span className="font-['Lato'] font-semibold text-gray-400 m-0 leading-[1.3] text-[10px] sm:text-[10px] md:text-[11px] lg:text-[11.5px]">
//                       {testimonial.designation || testimonial.role}
//                     </span>
//                   </div>
//                 </div>
//               ))}

//               {/* Featured Card */}
//               <div 
//                 data-card
//                 className="
//                   testimonial-card snap-center sm:snap-start
//                   group relative bg-black rounded-3xl
//                   flex flex-col justify-between items-start
//                   flex-shrink-0 overflow-hidden cursor-pointer will-change-transform
//                   transition-all duration-500 ease-out
//                   hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:scale-[1.03]
//                   h-[260px] sm:h-[280px] md:h-[320px] lg:h-[380px] xl:h-[440px]
//                 "
//                 style={{ animationDelay: '450ms', animationFillMode: 'backwards' }}
//               >
//                 {featuredTestimonial.video ? (
//                   <video 
//                     src={featuredTestimonial.video} 
//                     className="absolute inset-0 w-full h-full object-cover"
//                     poster={featuredTestimonial.image}
//                   />
//                 ) : (
//                   <img 
//                     src={featuredTestimonial.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"} 
//                     alt={featuredTestimonial.name} 
//                     className="absolute inset-0 w-full h-full object-cover" 
//                   />
//                 )}

//                 <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/85 flex flex-col justify-between z-[2] p-4 sm:p-5 md:p-5 lg:p-6 xl:p-8">
//                   <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
//                     <img 
//                       src={featuredTestimonial.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"} 
//                       alt={featuredTestimonial.name} 
//                       className="w-full h-full object-cover" 
//                     />
//                   </div>

//                   {featuredTestimonial.video && (
//                     <div 
//                       className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/25 backdrop-blur-[8px] flex items-center justify-center m-auto cursor-pointer border border-white/30 transition-all duration-300 hover:scale-110 hover:bg-white/40 active:scale-95 animate-pulse"
//                       onClick={handlePlayClick}
//                     >
//                       <Play size={18} fill="#FFFFFF" color="#FFFFFF" className="ml-[3px]" />
//                     </div>
//                   )}

//                   <div>
//                     <h5 className="font-['Dancing_Script'] font-bold text-white m-0 tracking-[0.5px] text-lg sm:text-xl md:text-2xl lg:text-[28px]">
//                       {featuredTestimonial.name}
//                     </h5>
//                     <span className="font-['Lato'] font-medium text-white/80 leading-[1.3] text-[10px] sm:text-[10px] md:text-[11px] lg:text-xs">
//                       {featuredTestimonial.designation}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Swipe Hint */}
//             <p className="sm:hidden text-center text-[11px] text-gray-400 mt-2 select-none">
//               Swipe to see more →
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         #testimonials-scroll-container {
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }
//         #testimonials-scroll-container::-webkit-scrollbar {
//           display: none;
//         }

//         /* 1 Card layout logic for Small Mobile viewports (<640px) */
//         .testimonial-card {
//           width: 100%;
//           min-width: 100%;
//         }

//         /* 2 Cards for Tablets/Small Laptops */
//         @media (min-width: 640px) {
//           .testimonial-card {
//             width: calc(50% - 8px);
//             min-width: calc(50% - 8px);
//           }
//         }

//         /* 3 Cards for Large Displays */
//         @media (min-width: 900px) {
//           .testimonial-card {
//             width: calc(33.333% - 11px);
//             min-width: calc(33.333% - 11px);
//           }
//         }

//         /* Desktop bounds constraint */
//         @media (min-width: 1200px) {
//           .testimonial-card {
//             width: 275px !important;
//             min-width: 275px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
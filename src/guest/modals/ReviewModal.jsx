import { Star } from 'lucide-react';

export default function ReviewModal(props) {
  const {
    reviewModalOpen,
    setReviewModalOpen,
    reviewRating,
    setReviewRating,
    reviewText,
    setReviewText,
    reviewName,
    setReviewName,
    handleReviewFormSubmit,
  } = props;

  if (!reviewModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10020] p-2 xs:p-4 sm:p-8" 
      onClick={() => setReviewModalOpen(false)}
    >
      <div 
        className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-[420px] p-5 min-[1200px]:max-w-[380px] min-[1024px]:max-w-[400px] max-[768px]:max-w-[480px] max-[640px]:w-[calc(100vw-16px)] max-[640px]:max-w-[calc(100vw-16px)] max-[640px]:p-4 max-[640px]:rounded-xl max-[480px]:w-[calc(100vw-8px)] max-[480px]:max-w-[calc(100vw-8px)] max-[480px]:p-3 max-[480px]:rounded-lg max-[360px]:w-[calc(100vw-4px)] max-[360px]:max-w-[calc(100vw-4px)] max-[360px]:p-2" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl font-normal leading-none bg-transparent border-none cursor-pointer transition-colors min-[1024px]:top-2.5 min-[1024px]:right-2.5 min-[1024px]:w-6 min-[1024px]:h-6 min-[1024px]:text-lg max-[640px]:top-2 max-[640px]:right-2 max-[640px]:w-6 max-[640px]:h-6 max-[640px]:text-lg max-[360px]:top-1 max-[360px]:right-1 max-[360px]:w-5 max-[360px]:h-5 max-[360px]:text-base" 
          onClick={() => setReviewModalOpen(false)}
        >
          &times;
        </button>
        
        <div className="flex flex-col items-center w-full animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-5 min-[1024px]:text-lg min-[1024px]:mb-4 max-[768px]:text-2xl max-[640px]:text-xl max-[640px]:mb-4 max-[480px]:text-lg max-[480px]:mb-3 max-[360px]:text-base max-[360px]:mb-2">
            Share Your <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded font-bold min-[1024px]:px-2 max-[640px]:px-3 max-[640px]:py-1">Experience</span>
          </h2>
          
          {/* Interactive Star Row */}
          <div className="flex justify-center gap-1.5 mb-5 min-[1024px]:gap-1 min-[1024px]:mb-4 max-[768px]:gap-2 max-[768px]:mb-6 max-[640px]:gap-1.5 max-[640px]:mb-5 max-[480px]:gap-1 max-[480px]:mb-4 max-[360px]:gap-0.5 max-[360px]:mb-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <button 
                key={num}
                type="button"
                className="bg-transparent border-none cursor-pointer outline-none transition-transform duration-100 hover:scale-110 p-0.5 min-[1024px]:p-0 max-[768px]:p-1 max-[640px]:p-0.5 max-[480px]:p-0.5 max-[360px]:p-0"
                onClick={() => setReviewRating(num)}
              >
                <Star 
                  size={28} 
                  fill={num <= reviewRating ? "var(--accent-orange)" : "none"} 
                  color={num <= reviewRating ? "var(--accent-orange)" : "#D1D5DB"} 
                  strokeWidth={2}
                  className="w-7 h-7 min-[1024px]:w-6 min-[1024px]:h-6 max-[768px]:w-8 max-[768px]:h-8 max-[640px]:w-7 max-[640px]:h-7 max-[480px]:w-6 max-[480px]:h-6 max-[360px]:w-5 max-[360px]:h-5"
                />
              </button>
            ))}
          </div>

          <form onSubmit={handleReviewFormSubmit} className="w-full flex flex-col">
            
            <div className="flex flex-col w-full mb-3 min-[1024px]:mb-2.5 max-[768px]:mb-4 max-[640px]:mb-3 max-[480px]:mb-2.5">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 text-left min-[1024px]:text-xs min-[1024px]:mb-1 max-[480px]:text-xs">Your Name*</label>
              <input 
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg font-lato text-sm text-gray-900 bg-white outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 min-[1024px]:px-2.5 min-[1024px]:py-2 min-[1024px]:text-xs max-[768px]:px-4 max-[768px]:py-3 max-[768px]:text-base max-[480px]:px-2.5 max-[480px]:py-2 max-[480px]:text-sm max-[360px]:px-2 max-[360px]:py-1.5 max-[360px]:text-xs" 
                placeholder="John Doe"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col w-full mb-6 max-[640px]:mb-4 max-[480px]:mb-3">
              <label className="text-sm font-semibold text-gray-700 mb-2 text-left max-[480px]:text-xs">Your Review*</label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-lato text-base text-gray-900 bg-white outline-none resize-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 min-h-[100px] max-[640px]:min-h-[80px] max-[480px]:px-2.5 max-[480px]:py-2 max-[480px]:text-sm max-[480px]:min-h-[70px] max-[360px]:px-2 max-[360px]:py-1.5 max-[360px]:text-xs max-[360px]:min-h-[60px]" 
                placeholder="The travel route was smooth and the journey was comfortable."
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-600 text-white font-semibold text-base px-6 py-3.5 rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg mt-4 max-[640px]:py-3 max-[640px]:text-sm max-[480px]:py-2.5 max-[480px]:text-sm max-[360px]:py-2 max-[360px]:text-xs"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

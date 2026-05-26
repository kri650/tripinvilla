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
    <div className="auth-modal-overlay" onClick={() => setReviewModalOpen(false)}>
      <div className="auth-modal-card review-modal-card-size" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={() => setReviewModalOpen(false)}>&times;</button>
        
        <div className="review-modal-content fade-in">
          <h2 className="auth-modal-title">
            Share Your <span className="highlight-sharp-blue-box">Experience</span>
          </h2>
          
          {/* Interactive Star Row */}
          <div className="review-star-selector-row">
            {[1, 2, 3, 4, 5].map((num) => (
              <button 
                key={num}
                type="button"
                className="review-star-select-btn"
                onClick={() => setReviewRating(num)}
              >
                <Star 
                  size={32} 
                  fill={num <= reviewRating ? "var(--accent-orange)" : "none"} 
                  color={num <= reviewRating ? "var(--accent-orange)" : "#D1D5DB"} 
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>

          <form onSubmit={handleReviewFormSubmit} className="review-submit-form">
            
            <div className="auth-form-group full-width" style={{ marginBottom: '16px' }}>
              <label className="auth-input-label">Your Name*</label>
              <input 
                type="text"
                className="auth-input-field" 
                placeholder="John Doe"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group full-width">
              <label className="auth-input-label">Your Review*</label>
              <textarea 
                className="auth-input-field auth-textarea-field" 
                placeholder="The travel route was smooth and the journey was comfortable."
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn-green mt-36">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

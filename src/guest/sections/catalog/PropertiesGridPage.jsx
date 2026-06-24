import { Heart, MapPin } from 'lucide-react';
import { areaIcon, bedIcon, guestIcon, roomIcon } from '../../../assets';
import { propertyCategories } from '../../../data/mockData';
import './PropertiesGridPage.css';
import { useEffect, useRef } from 'react';

export default function PropertiesGridPage(props) {
  const {
    activePropCategory, setActivePropCategory,
    setFilterSelectedTypes,
    setWhere,
    fetchProperties,
    setActiveMenu,
    setSelectedProperty,
    setContactStep, setContactModalOpen,
    toggleWishlist, user,
    homepageContent, renderTitle,
    mapDbProperties,
    allProperties,
  } = props;

  const scrollerRef = useRef(null);

  const typeMap = { Apartments: 'Apartment', Homestays: 'Homestay', Resorts: 'Resort', Motels: 'Motel', Cottages: 'Cottage', Bungalows: 'Bungalow', Villas: 'Villa' };
  const activeType = typeMap[activePropCategory] || activePropCategory || 'Villa';

  const actualProps = allProperties?.filter(p => 
    (p?.type || '').toLowerCase() === activeType.toLowerCase() || 
    (p?.category || '').toLowerCase() === activeType.toLowerCase()
  ) || [];

  // Sort properties so premium owners appear first
  const sortedProps = [...actualProps].sort((a, b) => {
    const aIsPremium = a.owner?.isPremium || a.owner?.subscription?.isActive || ['monthly', 'yearly'].includes(a.owner?.plan) ? 1 : 0;
    const bIsPremium = b.owner?.isPremium || b.owner?.subscription?.isActive || ['monthly', 'yearly'].includes(b.owner?.plan) ? 1 : 0;
    return bIsPremium - aIsPremium;
  });

  // Limit to exactly 3 properties as requested
  const top3Props = sortedProps.slice(0, 3);

  const mappedProps = mapDbProperties ? mapDbProperties(top3Props, []) : [];

  // Handle scroll behavior for mobile (simplified)
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Just ensure smooth scrolling is enabled
    scroller.style.scrollBehavior = 'smooth';
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="properties-page-layout fade-in">

      {/* Category Scroller */}
     <div 
  className="w-full max-w-[1280px] mx-auto mb-3 md:mb-4 px-0 md:px-4 max-[900px]:overflow-x-auto lg:overflow-x-visible overflow-y-hidden scroll-smooth relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 select-none touch-manipulation"
  ref={scrollerRef}
  role="tablist"
  aria-label="Property categories"
  style={{ WebkitOverflowScrolling: 'touch' }}
>
  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:justify-center max-[900px]:w-max px-4 md:px-0 py-1.5">
    {propertyCategories.map((cat) => {
      const isSelected = activePropCategory === cat.name;
      return (
        <button
          key={cat.name}
          className={`flex items-center justify-center gap-2 px-3.5 sm:px-4 md:px-5 py-2 md:py-2.5 border-2 rounded-xl font-lato font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ease-out text-sm md:text-base lg:text-lg min-w-[65px] sm:min-w-[80px] md:min-w-0 relative z-10 ${
            isSelected
              ? 'border-gray-600 text-green-600 shadow-md shadow-green-600/10 -translate-y-0.5 z-30'
              : 'bg-transparent border-gray-300 text-gray-600 hover:bg-green-600/5 hover:border-green-600/20 hover:-translate-y-0.5'
          } active:scale-95`}
          onClick={() => {
            setActivePropCategory(cat.name);
            setFilterSelectedTypes([typeMap[cat.name] || cat.name]);
            setWhere('');
            fetchProperties({ type: cat.name, search: '' });
          }}
          aria-label={`Filter by ${cat.name}`}
          role="tab"
          aria-selected={isSelected}
          data-category={cat.name}
        >
          {/* Enhanced Responsive Icon Container */}
          <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 sm:w-5.5 md:w-6 lg:w-6.5">
            {cat.iconImg ? (
              <img 
                src={cat.iconImg} 
                alt={cat.name} 
                className="w-full h-full object-contain block"
              />
            ) : (
              cat.icon
            )}
          </span>

          {/* Text Labels */}
          <span className={`leading-none ${
            cat.name === 'Apartments' || cat.name === 'Homestays' || cat.name === 'Bungalows' 
              ? 'hidden sm:inline' 
              : ''
          }`}>
            {cat.name}
          </span>

          {/* Micro-responsive Abbreviated Labels */}
          {cat.name === 'Apartments' && <span className="sm:hidden leading-none">Apt</span>}
          {cat.name === 'Homestays' && <span className="sm:hidden leading-none">Home</span>}
          {cat.name === 'Bungalows' && <span className="sm:hidden leading-none">Bung</span>}
        </button>
      );
    })}
  </div>
  
  {/* Left fade gradient indicator - adjusted to match tighter vertical padding */}
  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-20 md:hidden" />
  
  {/* Right fade gradient indicator - adjusted to match tighter vertical padding */}
  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-20 md:hidden" />
</div>
      {/* Dynamic Properties Section */}
      <div className="villas-around-section" style={{ marginTop: '40px' }}>
        <div className="section-title-wrap">
          <h2 className="section-main-headline">
            {(() => {
              const baseTitle = homepageContent?.section1?.title || 'Best Villas around you';
              const dynamicTitle = baseTitle.replace(/villas?/gi, activePropCategory || 'Villas');
              return renderTitle(dynamicTitle, <span>Best <span className="highlight-sharp-blue-box">{activePropCategory || 'Villas'}</span> Around You</span>, activePropCategory || 'Villas');
            })()}
          </h2>
          <p className="section-sub-headline">
            {homepageContent?.section1?.subText || 'Choose from homestays, villas, apartments, resorts and more.'}
          </p>
        </div>

        <div className="villas-grid">
          {mappedProps.length === 0 ? (
            <div style={{ padding: '40px 20px', gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', fontSize: '16px' }}>
              No {activePropCategory} found matching your criteria. Try another category!
            </div>
          ) : (
            mappedProps.map((propData, idx) => {
              const isLiked = user && user.wishlist && user.wishlist.some(w => w._id === propData._id || w === propData._id);
              return (
                <div key={idx} className="recommend-property-card">
                  <div className="recommend-card-img-wrap">
                    <img src={propData.img} alt={propData.title} />
                    <button className={`recommend-heart-circle ${isLiked ? 'liked' : ''}`} onClick={(e) => toggleWishlist(propData._id, e)}>
                      <Heart size={16} fill={isLiked ? '#EF4444' : 'none'} color={isLiked ? '#EF4444' : '#111827'} />
                    </button>
                  </div>
                  <div className="recommend-card-info-col">
                    <h3 className="recommend-card-name-text">{propData.title}</h3>
                    <div className="recommend-card-location-row"><span>{propData.location}</span><MapPin size={13} color="#9CA3AF" /></div>
                    <div className="recommend-specs-2x2-grid">
                      <div className="recommend-spec-pill"><img src={areaIcon} alt="Area" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Area Size: {propData.area}</span></div>
                      <div className="recommend-spec-pill"><img src={bedIcon} alt="Beds" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Beds: {propData.beds}</span></div>
                      <div className="recommend-spec-pill"><img src={roomIcon} alt="Rooms" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Rooms: {propData.roomCountString}</span></div>
                      <div className="recommend-spec-pill"><img src={guestIcon} alt="Guests" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Guests: {propData.guests}</span></div>
                    </div>

                    <div className="recommend-price-tag-row">
                      <span className="price-label">Starting from</span>
                      <span className="price-green-bold">₹{Number(String(propData.price || 0).replace(/[^\d]/g, '')).toLocaleString('en-IN')}/night</span>
                    </div>
                    <div className="recommend-actions-row">
                      <button className="recommend-details-btn-blue" onClick={() => { setSelectedProperty(propData); setActiveMenu('Detail'); }}>View Details</button>
                      <button className="recommend-contact-btn-green" onClick={() => { setSelectedProperty(propData); setContactStep(1); setContactModalOpen(true); }}>Contact Owner</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {mappedProps.length > 0 && (
          <div className="view-more-btn-container">
            <button 
              className="btn-view-more"
              onClick={() => {
                setFilterSelectedTypes([activeType]);
                setActiveMenu('Search');
              }}
            >
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

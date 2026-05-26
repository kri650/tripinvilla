import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GalleryModal(props) {
  const {
    isGalleryOpen,
    activeDetailProp,
    currentImageIndex,
    setCurrentImageIndex,
    setIsGalleryOpen,
  } = props;

  if (!isGalleryOpen || !activeDetailProp) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99999, 
        background: 'rgba(0,0,0,0.92)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }} 
      onClick={() => setIsGalleryOpen(false)}
    >
      <div 
        style={{ 
          position: 'relative', 
          width: '90vw', 
          height: '90vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          style={{ 
            position: 'absolute', top: '-50px', right: '0', 
            color: '#fff', background: 'transparent', border: 'none', 
            cursor: 'pointer', padding: '8px', lineHeight: 1
          }} 
          onClick={() => setIsGalleryOpen(false)}
        >
          <X size={32} />
        </button>
        
        {/* Prev arrow */}
        <button 
          style={{ 
            position: 'absolute', left: '-60px', 
            color: '#fff', background: 'rgba(255,255,255,0.15)', 
            border: 'none', cursor: 'pointer', 
            padding: '14px 16px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} 
          onClick={() => setCurrentImageIndex(prev => {
            const imgs = activeDetailProp.images && activeDetailProp.images.length > 0 ? activeDetailProp.images : [activeDetailProp.img];
            return prev === 0 ? imgs.length - 1 : prev - 1;
          })}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Main image */}
        <img 
          src={(activeDetailProp.images && activeDetailProp.images.length > 0 ? activeDetailProp.images : [activeDetailProp.img])[currentImageIndex]} 
          alt={`Gallery view ${currentImageIndex + 1}`}
          style={{ 
            maxHeight: '100%', maxWidth: '100%', 
            objectFit: 'contain', borderRadius: '10px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            userSelect: 'none'
          }} 
        />

        {/* Next arrow */}
        <button 
          style={{ 
            position: 'absolute', right: '-60px', 
            color: '#fff', background: 'rgba(255,255,255,0.15)', 
            border: 'none', cursor: 'pointer', 
            padding: '14px 16px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} 
          onClick={() => setCurrentImageIndex(prev => {
            const imgs = activeDetailProp.images && activeDetailProp.images.length > 0 ? activeDetailProp.images : [activeDetailProp.img];
            return prev === imgs.length - 1 ? 0 : prev + 1;
          })}
        >
          <ChevronRight size={28} />
        </button>

        {/* Image counter */}
        <div style={{ 
          position: 'absolute', bottom: '-44px', left: '50%', transform: 'translateX(-50%)',
          color: '#fff', fontSize: '16px', fontWeight: '500',
          background: 'rgba(255,255,255,0.1)', padding: '4px 16px', borderRadius: '20px'
        }}>
          {currentImageIndex + 1} / {(activeDetailProp.images && activeDetailProp.images.length > 0 ? activeDetailProp.images : [activeDetailProp.img]).length}
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalItems, itemsPerPage = 10, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #F3F4F6', background: '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
      <div style={{ fontSize: 13, color: '#6B7280' }}>
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB', background: currentPage === 1 ? '#F9FAFB' : '#fff', color: currentPage === 1 ? '#D1D5DB' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
          // Show max 5 page numbers: first, last, current, current-1, current+1
          if (
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button 
                key={page}
                onClick={() => onPageChange(page)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB', background: currentPage === page ? '#58A429' : '#fff', color: currentPage === page ? '#fff' : '#374151', cursor: 'pointer', fontWeight: currentPage === page ? 600 : 400 }}
              >
                {page}
              </button>
            );
          }
          if (page === 2 && currentPage > 3) return <span key={page} style={{ padding: '0 4px', color: '#9CA3AF' }}>...</span>;
          if (page === totalPages - 1 && currentPage < totalPages - 2) return <span key={page} style={{ padding: '0 4px', color: '#9CA3AF' }}>...</span>;
          return null;
        })}

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB', background: currentPage === totalPages ? '#F9FAFB' : '#fff', color: currentPage === totalPages ? '#D1D5DB' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

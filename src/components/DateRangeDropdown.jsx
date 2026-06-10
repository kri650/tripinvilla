import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangeDropdown({ 
  startDate, 
  endDate, 
  onChange 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState([
    {
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
      key: 'selection'
    }
  ]);
  const wrapperRef = useRef(null);
  const popupRef = useRef(null);
  const [dropdownCoords, setDropdownCoords] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    setTempRange([{
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
      key: 'selection'
    }]);
  }, [startDate, endDate]);

  useEffect(() => {
    function updatePosition() {
      if (isOpen && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const mobile = window.innerWidth <= 640;
        setIsMobile(mobile);

        // Desktop: 2 months = ~580px, Mobile: single month = ~320px
        const popupWidth = mobile ? Math.min(window.innerWidth - 32, 320) : 580;

        let leftPos = rect.right - popupWidth;
        const minLeft = 16;
        if (leftPos < minLeft) leftPos = rect.left;
        const maxLeft = window.innerWidth - popupWidth - 16;
        leftPos = Math.max(minLeft, Math.min(leftPos, maxLeft));

        setDropdownCoords({
          top: rect.bottom + 8,
          left: mobile ? (window.innerWidth - popupWidth) / 2 : leftPos,
        });
      }
    }

    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target) &&
        (!popupRef.current || !popupRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (ranges) => {
    setTempRange([ranges.selection]);
  };

  const handleApply = () => {
    const start = format(tempRange[0].startDate, 'yyyy-MM-dd');
    const end = format(tempRange[0].endDate, 'yyyy-MM-dd');
    onChange(start, end);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Scoped styles to keep original calendar appearance */}
      <style>{`
        .daterange-dropdown-popup {
          font-family: 'Outfit', 'Inter', sans-serif;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }
        .daterange-dropdown-popup .rdrCalendarWrapper {
          font-size: 12px;
          font-family: inherit;
        }
        .daterange-dropdown-popup .rdrDateRangePickerWrapper {
          font-family: inherit;
        }
        .daterange-dropdown-popup .rdrDefinedRangesWrapper {
          display: none;
        }
        .daterange-dropdown-popup .rdrMonthAndYearPickers select {
          font-size: 13px;
        }
        .daterange-dropdown-popup .rdrDayNumber span {
          font-size: 12px;
        }
        .daterange-dropdown-popup .rdrStartEdge,
        .daterange-dropdown-popup .rdrEndEdge,
        .daterange-dropdown-popup .rdrInRange {
          color: #2563EB !important;
        }
        .daterange-dropdown-popup .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span,
        .daterange-dropdown-popup .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span {
          color: #fff !important;
        }
        @media (max-width: 640px) {
          .daterange-dropdown-popup .rdrMonth {
            width: 100% !important;
          }
          .daterange-dropdown-popup .rdrMonths {
            flex-direction: column !important;
          }
        }
      `}</style>

      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="daterange-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 10px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          cursor: 'pointer',
          minWidth: 170,
          maxWidth: 220,
          color: '#374151',
          fontSize: 12,
          fontFamily: '"Outfit", sans-serif',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
      >
        <Calendar size={13} style={{ color: '#6B7280', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {startDate ? format(new Date(startDate), 'dd MMM yy') : 'Start Date'} 
          {' – '}
          {endDate ? format(new Date(endDate), 'dd MMM yy') : 'End Date'}
        </span>
      </div>

      {/* Dropdown Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={popupRef}
          className="daterange-dropdown-popup"
          style={{
            position: 'fixed',
            top: dropdownCoords?.top || 0,
            left: dropdownCoords?.left || 0,
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            zIndex: 99999,
            overflow: 'hidden',
            width: 'max-content',
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>Select Date Range</span>
            <X size={16} style={{ cursor: 'pointer', color: '#6B7280' }} onClick={() => setIsOpen(false)} />
          </div>

          {/* Calendar — 2 months side by side on desktop, 1 month on mobile */}
          <div style={{ padding: '0 8px' }}>
            <DateRange
              ranges={tempRange}
              onChange={handleSelect}
              months={isMobile ? 1 : 2}
              direction={isMobile ? 'vertical' : 'horizontal'}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              rangeColors={['#2563EB']}
              showMonthAndYearPickers={true}
            />
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            padding: '12px 16px',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB'
          }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                padding: '8px 16px',
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleApply}
              style={{
                padding: '8px 16px',
                background: '#2563EB',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              Apply Filter
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

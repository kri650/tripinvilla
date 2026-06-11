import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as ReactCalendar } from 'react-date-range';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangeDropdown({ 
  startDate, 
  endDate, 
  onChange 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use state to track the selected dates locally before applying
  const [tempStart, setTempStart] = useState(startDate ? new Date(startDate) : new Date());
  const [tempEnd, setTempEnd] = useState(endDate ? new Date(endDate) : new Date());

  const wrapperRef = useRef(null);
  const popupRef = useRef(null);
  const [dropdownCoords, setDropdownCoords] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  // Sync with props when opened
  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate ? new Date(startDate) : new Date());
      setTempEnd(endDate ? new Date(endDate) : new Date());
    }
  }, [isOpen, startDate, endDate]);

  useEffect(() => {
    function updatePosition() {
      if (isOpen && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const mobile = window.innerWidth <= 640;
        setIsMobile(mobile);

        // Width for dual calendar is approx 740px (332x2 + 32 gap + 40 padding)
        const popupWidth = mobile ? Math.min(window.innerWidth - 32, 320) : 740;

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

  const handleApply = () => {
    onChange(format(tempStart, 'yyyy-MM-dd'), format(tempEnd, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const handleCancel = () => {
    onChange('', '');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        .daterange-dropdown-popup {
          font-family: 'Outfit', 'Inter', sans-serif;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }
        .daterange-dropdown-popup .rdrCalendarWrapper {
          font-size: 13px;
          font-family: inherit;
          width: 100%;
        }
        .daterange-dropdown-popup .rdrMonthAndYearPickers select {
          font-size: 14px;
        }
        .daterange-dropdown-popup .rdrDayNumber span {
          font-size: 13px;
        }
      `}</style>

      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="daterange-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          cursor: 'pointer',
          minWidth: 170,
          color: (startDate || endDate) ? '#111827' : '#6B7280',
          fontSize: 13,
          fontFamily: '"Outfit", sans-serif',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
      >
        <CalendarIcon size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
          {(startDate || endDate) 
            ? `${startDate ? format(new Date(startDate), 'yyyy-MM-dd') : ''} to ${endDate ? format(new Date(endDate), 'yyyy-MM-dd') : ''}` 
            : 'Select Dates'}
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
          {/* Calendar — 2 independent calendars with From/To titles */}
          <div style={{ padding: '24px 20px 16px', display: 'flex', gap: '32px', flexDirection: isMobile ? 'column' : 'row' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>From</div>
              <ReactCalendar
                date={tempStart}
                onChange={(date) => {
                  setTempStart(date);
                  // If start date is after end date, update end date to match
                  if (date > tempEnd) {
                    setTempEnd(date);
                  }
                }}
                color="#2563EB"
              />
            </div>
            
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>To</div>
              <ReactCalendar
                date={tempEnd}
                onChange={(date) => {
                  setTempEnd(date);
                  // If end date is before start date, update start date to match
                  if (date < tempStart) {
                    setTempStart(date);
                  }
                }}
                minDate={tempStart}
                color="#2563EB"
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            padding: '16px 20px',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB'
          }}>
            <button 
              onClick={handleCancel}
              style={{
                padding: '8px 20px',
                background: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleApply}
              style={{
                padding: '8px 20px',
                background: '#2563EB',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              Filter
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

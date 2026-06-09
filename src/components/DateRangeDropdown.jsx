import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DateRange, Calendar as ReactCalendar } from 'react-date-range';
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

      // Desktop popup width is around 558px with scaled styles, mobile width is centered via CSS
      const popupWidth = window.innerWidth <= 640 ? 320 : 558;

      // Try aligning right edge of popup with right edge of trigger button
      let leftPos = rect.right - popupWidth;

      // Constrain leftPos to not overlap sidebar (if visible)
      // Note: Assuming no sidebar interference with fixed positioning, or sidebar handled by z-index
      const minLeft = 16;
      if (leftPos < minLeft) {
        leftPos = rect.left;
      }

      // Constrain right edge to not overflow the viewport
      const maxLeft = window.innerWidth - popupWidth - 16;
      leftPos = Math.max(minLeft, Math.min(leftPos, maxLeft));

      setDropdownCoords({
        top: rect.bottom + 8,
        left: leftPos,
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
  }, [wrapperRef, popupRef]);

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
      {/* Custom Scoped Styles to shrink calendar size and enforce responsiveness */}
      <style>{`
        .daterange-dropdown-popup {
          font-family: 'Outfit', 'Inter', sans-serif;
        }
        .daterange-dropdown-popup .rdrCalendarWrapper {
          font-size: 10px !important;
          font-family: inherit;
        }
        .daterange-dropdown-popup .rdrMonth {
          width: 25.5em !important;
          padding: 0 0.5em 0.5em 0.5em !important;
        }
        .daterange-dropdown-popup .rdrMonthAndYearWrapper {
          height: 40px !important;
          padding-top: 2px !important;
        }
        .daterange-dropdown-popup .rdrMonthAndYearPickers select {
          font-size: 11px !important;
          padding: 4px 20px 4px 6px !important;
        }
        .daterange-dropdown-popup .rdrMonthName {
          padding: 4px 6px !important;
          font-size: 11px !important;
        }
        .daterange-dropdown-popup .rdrWeekDays {
          padding: 0 !important;
        }
        .daterange-dropdown-popup .rdrWeekDay {
          font-size: 10px !important;
          line-height: 2em !important;
        }
        .daterange-dropdown-popup .rdrDay {
          line-height: 2.2em !important;
          height: 2.2em !important;
        }
        .daterange-dropdown-popup .rdrDayNumber {
          top: 2px !important;
          bottom: 2px !important;
          font-size: 10px !important;
        }
        .daterange-dropdown-popup .rdrSelected, 
        .daterange-dropdown-popup .rdrInRange, 
        .daterange-dropdown-popup .rdrStartEdge, 
        .daterange-dropdown-popup .rdrEndEdge {
          top: 2px !important;
          bottom: 2px !important;
        }
        .daterange-dropdown-popup .rdrDayToday .rdrDayNumber span:after {
          bottom: 2px !important;
          width: 12px !important;
          height: 2px !important;
        }
        @media (max-width: 640px) {
          .daterange-dropdown-popup {
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            width: calc(100vw - 32px) !important;
            max-width: 320px !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
          }
          .daterange-calendars-wrapper {
            flex-direction: column !important;
            gap: 16px !important;
            align-items: center !important;
          }
          .daterange-dropdown-popup .rdrMonth {
            width: 100% !important;
            max-width: 260px;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Trigger Input */}
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
          maxWidth: 200,
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
          {' - '}
          {endDate ? format(new Date(endDate), 'dd MMM yy') : 'End Date'}
        </span>
      </div>

      {/* Dropdown Modal via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div ref={popupRef} className="daterange-dropdown-popup" style={{
          position: 'fixed',
          top: dropdownCoords?.top || 0,
          left: dropdownCoords?.left || 0,
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 99999,
          overflow: 'hidden',
          width: 'max-content'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>Select dates</span>
            <X size={16} style={{ cursor: 'pointer', color: '#6B7280' }} onClick={() => setIsOpen(false)} />
          </div>

          <div style={{ padding: '16px' }}>
            <div className="daterange-calendars-wrapper" style={{ display: 'flex', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>From</div>
                <ReactCalendar
                  date={tempRange[0].startDate}
                  onChange={(date) => {
                    const newRange = { ...tempRange[0], startDate: date };
                    if (newRange.endDate && newRange.endDate < date) {
                      newRange.endDate = date;
                    }
                    setTempRange([newRange]);
                  }}
                  color="#2563EB"
                  showMonthAndYearPickers={false}
                />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>To</div>
                <ReactCalendar
                  date={tempRange[0].endDate}
                  onChange={(date) => {
                    const newRange = { ...tempRange[0], endDate: date };
                    if (date < newRange.startDate) {
                      newRange.startDate = date;
                      newRange.endDate = date;
                    }
                    setTempRange([newRange]);
                  }}
                  minDate={tempRange[0].startDate}
                  color="#2563EB"
                  showMonthAndYearPickers={false}
                />
              </div>
            </div>
          </div>

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
              Filter
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

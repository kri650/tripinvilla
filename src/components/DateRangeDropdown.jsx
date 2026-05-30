import React, { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    setTempRange([{
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
      key: 'selection'
    }]);
  }, [startDate, endDate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

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
      {/* Trigger Input */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          cursor: 'pointer',
          minWidth: 240,
          color: '#374151',
          fontSize: 13,
          fontFamily: '"Outfit", sans-serif'
        }}
      >
        <Calendar size={14} style={{ color: '#6B7280' }} />
        <span>
          {startDate ? format(new Date(startDate), 'MMM dd, yyyy') : 'Start Date'} 
          {' - '}
          {endDate ? format(new Date(endDate), 'MMM dd, yyyy') : 'End Date'}
        </span>
      </div>

      {/* Dropdown Modal */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 8,
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 9999,
          overflow: 'hidden'
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

          <div style={{ padding: '0 16px' }}>
            <DateRange
              ranges={tempRange}
              onChange={handleSelect}
              months={2}
              direction="horizontal"
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              rangeColors={['#2563EB']}
              showMonthAndYearPickers={false}
            />
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
        </div>
      )}
    </div>
  );
}

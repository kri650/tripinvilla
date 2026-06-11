import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import './SearchableDropdown.css';

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  searchPlaceholder = "Search..."
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`searchable-dropdown ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
      <div 
        className={`dropdown-header ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'selected-text' : 'placeholder-text'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-search-wrapper">
            <Search size={14} className="dropdown-search-icon" />
            <input
              type="text"
              className="dropdown-search-input"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="dropdown-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`dropdown-option ${opt.value === value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className="option-label" title={opt.label}>{opt.label}</span>
                  {opt.value === value && <Check size={14} className="option-check" />}
                </div>
              ))
            ) : (
              <div className="dropdown-no-results">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

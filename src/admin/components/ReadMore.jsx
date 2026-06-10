import { useState, useRef, useLayoutEffect, useEffect } from 'react';

export default function ReadMore({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);
  
  if (children === null || children === undefined || children === '') return null;
  if (typeof children !== 'string' && typeof children !== 'number') {
    return <>{children}</>;
  }

  const text = String(children);

  const checkOverflow = () => {
    if (textRef.current) {
      // If expanded is false, scrollHeight > clientHeight when clamped
      // We only measure when not expanded to avoid false negatives
      if (!expanded) {
        setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    }
  };

  useLayoutEffect(() => {
    checkOverflow();
  }, [text]);

  useEffect(() => {
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [expanded]);

  return (
    <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 0 }}>
      <span 
        ref={textRef}
        className={`cell-text ${expanded ? 'expanded' : ''}`}
      >
        {text}
      </span>
      {(isClamped || expanded) && (
        <button 
          className="read-more-btn"
          onClick={(e) => { 
            e.stopPropagation(); 
            setExpanded(!expanded); 
          }} 
        >
          {expanded ? 'read less' : 'read more'}
        </button>
      )}
    </div>
  );
}

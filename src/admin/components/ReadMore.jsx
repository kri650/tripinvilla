import { useState, useRef, useLayoutEffect, useEffect } from 'react';

export default function ReadMore({ children, lines = 3 }) {
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
        setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight + 2);
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
    <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', width: '100%' }}>
      <span 
        ref={textRef}
        className={`cell-text ${expanded ? 'expanded' : ''}`}
        style={!expanded ? { 
          display: '-webkit-box', 
          WebkitLineClamp: lines, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        } : { whiteSpace: 'normal', wordBreak: 'break-word' }}
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

import { useState } from 'react';

export default function ReadMore({ children, maxChars = 50 }) {
  const [expanded, setExpanded] = useState(false);
  
  if (children === null || children === undefined || children === '') return null;
  if (typeof children !== 'string' && typeof children !== 'number') {
    return <>{children}</>;
  }

  const text = String(children);

  if (text.length <= maxChars) {
    return <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', display: 'inline-block', maxWidth: '300px' }}>{text}</span>;
  }

  return (
    <div style={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
      <span 
        className={`cell-text ${expanded ? 'expanded' : ''}`}
        style={{
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.4
        }}
      >
        {text}
      </span>
      <button 
        className="read-more-btn"
        onClick={(e) => { 
          e.stopPropagation(); 
          setExpanded(!expanded); 
        }} 
        style={{
          fontSize: '12px',
          color: '#6c757d',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
          marginTop: '2px',
          textDecoration: 'underline'
        }}
      >
        {expanded ? 'read less' : 'read more'}
      </button>
    </div>
  );
}

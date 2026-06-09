import { useState } from 'react';

export default function ReadMore({ children, maxWords = 6 }) {
  const [expanded, setExpanded] = useState(false);
  
  if (children === null || children === undefined) return null;
  if (typeof children !== 'string' && typeof children !== 'number') {
    return <>{children}</>;
  }

  const text = String(children);
  const words = text.split(/\s+/);

  if (words.length <= maxWords) {
    return <span className="read-more-text" style={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word', display: 'inline-block', width: 'min(250px, 100%)', maxWidth: '100%' }}>{text}</span>;
  }

  return (
    <span className="read-more-text" style={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word', display: 'inline-block', width: 'min(250px, 100%)', maxWidth: '100%' }}>
      {expanded ? text : words.slice(0, maxWords).join(' ') + '... '}
      <span 
        onClick={(e) => { 
          e.stopPropagation(); 
          setExpanded(!expanded); 
        }} 
        style={{ color: 'black', cursor: 'pointer', fontWeight: 500, fontSize: '0.9em', marginLeft: '4px', whiteSpace: 'nowrap' }}
      >
        {expanded ? 'read less' : 'read more'}
      </span>
    </span>
  );
}

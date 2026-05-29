import { useState } from 'react';

export default function ReadMore({ children, maxWords = 4 }) {
  const [expanded, setExpanded] = useState(false);
  
  if (children === null || children === undefined) return null;
  if (typeof children !== 'string' && typeof children !== 'number') {
    return <>{children}</>;
  }

  const text = String(children);
  const words = text.split(/\s+/);

  if (words.length <= maxWords) {
    return <span>{text}</span>;
  }

  return (
    <span style={{ whiteSpace: 'normal', wordBreak: 'break-word', display: 'inline-block', maxWidth: '250px' }}>
      {expanded ? text : words.slice(0, maxWords).join(' ') + '... '}
      <span 
        onClick={(e) => { 
          e.stopPropagation(); 
          setExpanded(!expanded); 
        }} 
        style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 500, fontSize: '0.9em', marginLeft: '4px', whiteSpace: 'nowrap' }}
      >
        {expanded ? 'read less' : 'read more'}
      </span>
    </span>
  );
}

import { BookOpen } from 'lucide-react';
export default function Content() {
  return (
    <div className="fade-in">
      <div className="page-header"><div className="page-title">Content</div></div>
      <div className="content-card">
        <div className="empty-state"><BookOpen /><p>General content management will appear here.</p></div>
      </div>
    </div>
  );
}

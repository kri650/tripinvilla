import { UserX } from 'lucide-react';
export default function Blacklist() {
  return (
    <div className="fade-in">
      <div className="page-header"><div className="page-title">Blacklist</div><div className="page-subtitle">Manage blacklisted users</div></div>
      <div className="content-card">
        <div className="empty-state"><UserX /><p>No blacklisted users. Connect backend to populate.</p></div>
      </div>
    </div>
  );
}

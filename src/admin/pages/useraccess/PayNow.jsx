import { CreditCard } from 'lucide-react';
export default function PayNow() {
  return (
    <div className="fade-in">
      <div className="page-header"><div className="page-title">Pay Now</div></div>
      <div className="content-card">
        <div className="empty-state"><CreditCard /><p>Payment management will appear here.</p></div>
      </div>
    </div>
  );
}

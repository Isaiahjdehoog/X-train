import { useUI } from '../../context/UIContext';

export default function EmptyState() {
  const { setAddDayOpen } = useUI();
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="8" width="3" height="8" rx="1"/>
          <rect x="4" y="10" width="2.5" height="4" rx="0.5"/>
          <line x1="6.5" y1="12" x2="17.5" y2="12" strokeWidth="2"/>
          <rect x="17.5" y="10" width="2.5" height="4" rx="0.5"/>
          <rect x="20" y="8" width="3" height="8" rx="1"/>
        </svg>
      </div>
      <div className="empty-state-title sans">No Training Days Yet</div>
      <div className="empty-state-text sans">
        Get started by adding your first training day. Click the + button above to begin building your workout program.
      </div>
      <button className="empty-state-btn sans" onClick={() => setAddDayOpen(true)}>
        Add Your First Day
      </button>
    </div>
  );
}

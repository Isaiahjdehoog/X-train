import { useUI } from '../../context/UIContext';

export default function BottomNav() {
  const { activeView, setActiveView } = useUI();

  const nav = (view) => {
    setActiveView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bottom-nav sans">
      <button className={`nav-btn ${activeView === 'workout' ? 'active' : ''}`} onClick={() => nav('workout')}>
        <span className="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="8" width="3" height="8" rx="1"/>
            <rect x="4" y="10" width="2.5" height="4" rx="0.5"/>
            <line x1="6.5" y1="12" x2="17.5" y2="12" strokeWidth="2.2"/>
            <rect x="17.5" y="10" width="2.5" height="4" rx="0.5"/>
            <rect x="20" y="8" width="3" height="8" rx="1"/>
          </svg>
        </span>
        <span>Workout</span>
      </button>
      <button className={`nav-btn ${activeView === 'calendar' ? 'active' : ''}`} onClick={() => nav('calendar')}>
        <span className="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </span>
        <span>Calendar</span>
      </button>
      <button className={`nav-btn ${activeView === 'notes' ? 'active' : ''}`} onClick={() => nav('notes')}>
        <span className="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="13" y2="17"/>
          </svg>
        </span>
        <span>Notes</span>
      </button>
    </div>
  );
}

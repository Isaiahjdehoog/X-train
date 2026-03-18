import { useState, useRef, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';

export default function DayHeader({ dayIdx }) {
  const { program, setProgram, getTodayStr } = useAppData();
  const { openEditDay, setAddDayOpen } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menuOpen]);

  const p = program[dayIdx];
  if (!p) return null;

  const handleRemoveDay = () => {
    if (!confirm(`Remove ${p.day} from your program?`)) return;
    setMenuOpen(false);
    // handled in WorkoutView via AppDataContext
  };

  return (
    <div className="day-header">
      <div className="day-top">
        <div className="day-name-row">
          <div className="day-name">{p.day}</div>
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button className="day-menu-btn sans" onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }} title="Day options">
              ⋯
            </button>
            {menuOpen && (
              <div className="day-menu sans active">
                <button className="day-menu-item sans" onClick={() => { openEditDay(dayIdx); setMenuOpen(false); }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Day
                </button>
                {program.length > 1 && (
                  <button className="day-menu-item danger sans" onClick={() => { handleRemoveDay(); }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    Delete Day
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="day-badge sans" style={{ color: p.accent, background: `${p.color}80` }}>
          {p.exercises.length} exercise{p.exercises.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="day-label" style={{ color: p.accent }}>{p.label}</div>
      {p.tip ? (
        <div className="day-tip sans" style={{ borderLeftColor: p.accent }}>
          {p.tip}
        </div>
      ) : (
        <button className="day-tip-add sans" onClick={() => openEditDay(dayIdx)}>
          + Add training tip
        </button>
      )}
    </div>
  );
}

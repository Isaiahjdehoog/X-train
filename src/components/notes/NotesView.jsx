import { useState, useRef } from 'react';
import { useAppData } from '../../context/AppDataContext';

export default function NotesView() {
  const { appNotes, setAppNotes } = useAppData();
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAppNotes(val);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="notes-container">
      <div className="notes-title sans">Training Notes</div>
      <textarea
        className="notes-textarea"
        placeholder="Keep track of your progress, goals, or anything else..."
        defaultValue={appNotes}
        onChange={handleChange}
      />
      <div className="notes-saved sans" style={{ opacity: saved ? 1 : 0 }}>Notes saved</div>
    </div>
  );
}

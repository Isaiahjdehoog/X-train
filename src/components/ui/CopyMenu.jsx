import { useEffect } from 'react';
import { useUI } from '../../context/UIContext';

export default function CopyMenu() {
  const { copiedExercise, setCopiedExercise } = useUI();

  // Auto-hide the "Exercise copied!" toast after 2 seconds
  useEffect(() => {
    if (!copiedExercise) return;
    const timer = setTimeout(() => {
      // Don't clear copiedExercise here — user might still want to paste
    }, 2000);
    return () => clearTimeout(timer);
  }, [copiedExercise]);

  if (!copiedExercise) return null;

  const cancel = () => setCopiedExercise(null);

  return (
    <>
      <div className="copy-menu sans active">
        <div className="copy-menu-text">Exercise copied!</div>
        <div className="copy-menu-buttons">
          <button className="copy-menu-btn" onClick={cancel}>Cancel</button>
        </div>
      </div>
      <div className="paste-banner sans active">
        <span className="paste-banner-text">Tap a day tab to paste exercise</span>
        <button className="paste-banner-cancel" onClick={(e) => { e.stopPropagation(); cancel(); }}>Cancel</button>
      </div>
    </>
  );
}

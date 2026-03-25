import { useUI } from '../../context/UIContext';

export default function CopyMenu() {
  const { copiedExercise, setCopiedExercise } = useUI();

  if (!copiedExercise) return null;

  const cancel = () => setCopiedExercise(null);

  return (
    <div className="paste-banner sans active">
      <span className="paste-banner-text">Tap a day tab to paste exercise</span>
      <button className="paste-banner-cancel" onClick={(e) => { e.stopPropagation(); cancel(); }}>Cancel</button>
    </div>
  );
}

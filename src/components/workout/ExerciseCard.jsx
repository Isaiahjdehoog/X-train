import { useState, useRef, useEffect } from 'react';
import { useAppData, getTodayStr } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import { useLongPress } from '../../hooks/useLongPress';
import WeightRow from './WeightRow';

export default function ExerciseCard({ ex, exIdx, dayIdx, day: p, dragHandlers }) {
  const {
    program, setProgram,
    checked, setChecked,
    addTrainingDate, removeTrainingDate,
    addPartialDate, removePartialDate,
    getLastDate, getExerciseNote, getExerciseImage,
    removeExerciseImage, setExerciseImage,
  } = useAppData();
  const { openEditExercise, openEditSets, openExerciseNotes, openImagePreview, setCopiedExercise } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const exerciseMenuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (exerciseMenuRef.current && !exerciseMenuRef.current.contains(e.target)) {
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

  const key = `${dayIdx}-${exIdx}`;
  const isChecked = !!checked[key];
  const lastDate = getLastDate(ex.id);
  const exerciseNote = getExerciseNote(ex.id);
  const exerciseImage = getExerciseImage(ex.id);

  const handleToggle = () => {
    const newChecked = { ...checked, [key]: !isChecked };
    setChecked(newChecked);

    const exercises = program[dayIdx].exercises;
    const allDone = exercises.every((_, i) => newChecked[`${dayIdx}-${i}`]);
    const anyDone = exercises.some((_, i) => newChecked[`${dayIdx}-${i}`]);
    const today = getTodayStr();

    if (allDone && exercises.length > 0) {
      addTrainingDate(today);
      removePartialDate(today);
    } else if (anyDone) {
      removeTrainingDate(today);
      addPartialDate(today);
    } else {
      removeTrainingDate(today);
      removePartialDate(today);
    }
  };

  const handleRemove = () => {
    if (!confirm('Remove this exercise?')) return;
    setProgram(prev => {
      const next = prev.map(d => ({ ...d, exercises: [...d.exercises] }));
      next[dayIdx].exercises.splice(exIdx, 1);
      return next;
    });
    setMenuOpen(false);
  };

  const handleCopy = () => {
    setCopiedExercise({
      name: ex.name, sets: ex.sets, numSets: ex.numSets, note: ex.note,
      exerciseNotes: getExerciseNote(ex.id),
      image: getExerciseImage(ex.id),
    });
    setMenuOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setExerciseImage(ex.id, ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (!confirm('Remove this image?')) return;
    removeExerciseImage(ex.id);
  };

  const longPress = useLongPress(() => {
    setCopiedExercise({
      name: ex.name, sets: ex.sets, numSets: ex.numSets, note: ex.note,
      exerciseNotes: getExerciseNote(ex.id),
      image: getExerciseImage(ex.id),
    });
  });

  const cardStyle = isChecked
    ? { background: `${p.color}30`, borderColor: `${p.accent}40` }
    : {};

  return (
    <div
      className={`ex-card ${isChecked ? 'checked' : ''}`}
      style={cardStyle}
      onDragOver={dragHandlers.onCardDragOver}
      onDrop={dragHandlers.onCardDrop}
      onDragLeave={dragHandlers.onCardDragLeave}
      {...longPress}
    >
      <div className="ex-row">
        <div
          className="drag-handle"
          draggable
          onDragStart={dragHandlers.onDragStart}
          onDragEnd={dragHandlers.onDragEnd}
        >
          <div className="drag-line" />
          <div className="drag-line" />
          <div className="drag-line" />
        </div>

        <button
          className={`check-btn ${isChecked ? 'on' : ''}`}
          style={isChecked
            ? { color: p.accent, background: p.accent, borderColor: p.accent }
            : { color: p.accent, borderColor: '#C8C0B4' }}
          onClick={handleToggle}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7L6 10L11 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="ex-content">
          <div className="ex-name sans">{ex.name}</div>
          <div
            className="ex-sets sans editable-sets"
            style={{ color: p.accent }}
            onClick={() => openEditSets(dayIdx, exIdx)}
          >
            {ex.sets}
          </div>
          {ex.note && <div className="ex-note sans">{ex.note}</div>}

          <div className="ex-image-container">
            {exerciseImage ? (
              <>
                <button className="image-view-link sans" onClick={() => openImagePreview(exerciseImage)}>View image</button>
                <button className="image-remove-link sans" onClick={handleRemoveImage}>Remove</button>
              </>
            ) : (
              <>
                <button className="image-upload-btn sans" onClick={() => fileInputRef.current?.click()}>+ Add image</button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              </>
            )}
          </div>

          {!ex.numSets && (
            <>
              <button
                className="notes-btn sans"
                style={{ color: p.accent }}
                onClick={() => openExerciseNotes(dayIdx, exIdx, ex.id)}
              >
                {exerciseNote ? 'View notes ▴' : 'Add notes ▾'}
              </button>
              {exerciseNote && (
                <div className="notes-display sans" style={{ borderLeftColor: p.accent }}>
                  {exerciseNote}
                </div>
              )}
            </>
          )}

          {lastDate && <div className="last-used sans">Last logged: {lastDate}</div>}

          <WeightRow ex={ex} accent={p.accent} />

          {!!ex.numSets && (
            <>
              <button
                className="notes-btn sans"
                style={{ color: p.accent }}
                onClick={() => openExerciseNotes(dayIdx, exIdx, ex.id)}
              >
                {exerciseNote ? 'View notes ▴' : 'Add notes ▾'}
              </button>
              {exerciseNote && (
                <div className="notes-display sans" style={{ borderLeftColor: p.accent }}>
                  {exerciseNote}
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ position: 'relative' }} ref={exerciseMenuRef}>
          <button
            className="exercise-menu-btn"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="exercise-menu sans active">
              <button className="exercise-menu-item" onClick={() => { openEditExercise(dayIdx, exIdx); setMenuOpen(false); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button className="exercise-menu-item" onClick={handleCopy}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </button>
              <button className="exercise-menu-item danger" onClick={handleRemove}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

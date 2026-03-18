import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import { useDragDrop } from '../../hooks/useDragDrop';
import ExerciseCard from './ExerciseCard';

export default function ExerciseList({ dayIdx }) {
  const { program, setProgram, checked, setChecked, activeDay, setActiveDay,
          trainingDates, partialDates, removeTrainingDate, removePartialDate } = useAppData();
  const { setAddExerciseOpen } = useUI();
  const dd = useDragDrop();

  const p = program[dayIdx];
  if (!p) return null;

  const allChecked = p.exercises.every((_, i) => !!checked[`${dayIdx}-${i}`]);

  const handleReset = () => {
    const newChecked = { ...checked };
    p.exercises.forEach((_, i) => { delete newChecked[`${dayIdx}-${i}`]; });
    setChecked(newChecked);
    const today = new Date().toLocaleDateString('en-CA');
    removeTrainingDate(today);
    removePartialDate(today);
  };

  return (
    <>
      <div className="exercises">
        {p.exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            ex={ex}
            exIdx={i}
            dayIdx={dayIdx}
            day={p}
            dragHandlers={{
              onDragStart: (e) => dd.handleExerciseDragStart(e, dayIdx, i),
              onDragEnd: dd.handleExerciseDragEnd,
              onCardDragOver: dd.handleCardDragOver,
              onCardDragLeave: dd.handleCardDragLeave,
              onCardDrop: (e) => dd.handleCardDrop(e, program, setProgram, dayIdx, i),
            }}
          />
        ))}
        <button className="add-exercise-btn sans" onClick={() => setAddExerciseOpen(true)}>
          + Add Exercise
        </button>
      </div>

      {p.exercises.length > 0 && (
        <div className="actions">
          {allChecked ? (
            <div className="done-banner sans" style={{ background: `${p.color}40`, color: p.accent }}>
              Done! Nice work today.
              <button className="reset-link" onClick={handleReset}>Reset day</button>
            </div>
          ) : (
            <button className="reset-btn sans" onClick={handleReset}>Reset checkboxes</button>
          )}
        </div>
      )}
    </>
  );
}

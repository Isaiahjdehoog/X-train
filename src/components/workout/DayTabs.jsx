import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import { useDragDrop } from '../../hooks/useDragDrop';

export default function DayTabs() {
  const { program, setProgram, activeDay, setActiveDay,
          setExerciseNote, setExerciseImage } = useAppData();
  const { setAddDayOpen, copiedExercise, setCopiedExercise } = useUI();
  const dd = useDragDrop();

  const pasteExercise = (toDayIdx) => {
    if (!copiedExercise) return;
    const p = program[toDayIdx];
    const newId = `${p.day.toLowerCase().slice(0, 3)}-${Date.now()}`;
    const next = program.map(d => ({ ...d, exercises: [...d.exercises] }));
    next[toDayIdx].exercises.push({
      id: newId, name: copiedExercise.name, sets: copiedExercise.sets,
      numSets: copiedExercise.numSets, note: copiedExercise.note,
    });
    setProgram(next);
    if (copiedExercise.exerciseNotes) setExerciseNote(newId, copiedExercise.exerciseNotes);
    if (copiedExercise.image) setExerciseImage(newId, copiedExercise.image);
    setActiveDay(toDayIdx);
    setCopiedExercise(null);
    alert(`Exercise pasted to ${p.day}!`);
  };

  const handleTabClick = (i) => {
    if (copiedExercise) {
      pasteExercise(i);
    } else {
      setActiveDay(i);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="tabs" id="tabs">
      {program.map((d, i) => (
        <button
          key={d.day}
          className={`tab ${i === activeDay ? 'active' : ''}`}
          draggable
          onClick={() => handleTabClick(i)}
          onDragStart={(e) => dd.handleTabDragStart(e, i)}
          onDragOver={dd.handleTabDragOver}
          onDrop={(e) => dd.handleTabDrop(e, program, setProgram, activeDay, setActiveDay, i)}
          onDragEnd={dd.handleTabDragEnd}
          onDragLeave={dd.handleTabDragLeave}
          style={i === activeDay ? { background: `${d.color}40`, borderBottomColor: d.accent } : {}}
        >
          <div className="tab-label sans" style={i === activeDay ? { color: d.accent } : {}}>
            {d.day.slice(0, 3)}
          </div>
        </button>
      ))}
      {program.length < 7 && (
        <button className="add-day-tab sans" onClick={() => setAddDayOpen(true)} title="Add training day">
          +
        </button>
      )}
    </div>
  );
}

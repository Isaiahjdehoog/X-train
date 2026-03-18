import { useRef } from 'react';
import { useAppData, getTodayStr } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import Modal from './Modal';

export default function AddExerciseModal() {
  const { program, setProgram, activeDay } = useAppData();
  const { setAddExerciseOpen } = useUI();
  const nameRef = useRef();
  const setsRef = useRef();
  const numSetsRef = useRef();
  const noteRef = useRef();

  const close = () => setAddExerciseOpen(false);

  const handleAdd = () => {
    const name = nameRef.current.value.trim();
    const sets = setsRef.current.value.trim();
    const numSets = parseInt(numSetsRef.current.value) || 0;
    const note = noteRef.current.value.trim();
    if (!name || !sets) { alert('Please enter exercise name and sets/reps'); return; }

    const p = program[activeDay];
    const newId = `${p.day.toLowerCase().slice(0, 3)}-${Date.now()}`;
    setProgram(prev => {
      const next = prev.map(d => ({ ...d, exercises: [...d.exercises] }));
      next[activeDay].exercises.push({ id: newId, name, sets, numSets, note });
      return next;
    });
    close();
  };

  return (
    <Modal onClose={close}>
      <div className="modal-title">Add Exercise</div>
      <label className="modal-label sans">Exercise Name</label>
      <input ref={nameRef} type="text" className="modal-input sans" placeholder="e.g., Barbell Squat" />
      <label className="modal-label sans">Sets × Reps</label>
      <input ref={setsRef} type="text" className="modal-input sans" placeholder="e.g., 3 × 10" />
      <label className="modal-label sans">Number of Sets (for weight tracking)</label>
      <input ref={numSetsRef} type="number" className="modal-input sans" placeholder="3" min="0" max="10" />
      <label className="modal-label sans">Notes</label>
      <textarea ref={noteRef} className="modal-textarea sans" placeholder="Form cues, tips, etc." />
      <div className="modal-buttons">
        <button className="modal-btn modal-btn-secondary sans" onClick={close}>Cancel</button>
        <button className="modal-btn modal-btn-primary sans" onClick={handleAdd}>Add Exercise</button>
      </div>
    </Modal>
  );
}

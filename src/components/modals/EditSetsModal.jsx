import { useRef } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import Modal from './Modal';

export default function EditSetsModal() {
  const { program, setProgram } = useAppData();
  const { editSetsPayload, closeEditSets } = useUI();
  const setsRef = useRef();
  const numSetsRef = useRef();

  if (!editSetsPayload) return null;
  const { dayIdx, exIdx } = editSetsPayload;
  const ex = program[dayIdx]?.exercises[exIdx];
  if (!ex) return null;

  const handleSave = () => {
    const sets = setsRef.current.value.trim();
    const numSets = parseInt(numSetsRef.current.value) || 0;
    if (!sets) { alert('Please enter sets/reps'); return; }
    setProgram(prev => {
      const next = prev.map(d => ({ ...d, exercises: [...d.exercises] }));
      next[dayIdx].exercises[exIdx] = { ...next[dayIdx].exercises[exIdx], sets, numSets };
      return next;
    });
    closeEditSets();
  };

  return (
    <Modal onClose={closeEditSets}>
      <div className="modal-title">Edit Sets &amp; Reps</div>
      <label className="modal-label sans">Sets × Reps</label>
      <input ref={setsRef} type="text" className="modal-input sans" defaultValue={ex.sets} placeholder="e.g., 3 × 10" />
      <label className="modal-label sans">Number of Sets (for weight tracking)</label>
      <input ref={numSetsRef} type="number" className="modal-input sans" defaultValue={ex.numSets} placeholder="3" min="0" max="10" />
      <div className="modal-buttons">
        <button className="modal-btn modal-btn-secondary sans" onClick={closeEditSets}>Cancel</button>
        <button className="modal-btn modal-btn-primary sans" onClick={handleSave}>Save</button>
      </div>
    </Modal>
  );
}

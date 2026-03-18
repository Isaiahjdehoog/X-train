import { useRef } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import Modal from './Modal';

export default function EditExerciseModal() {
  const { program, setProgram } = useAppData();
  const { editExercisePayload, closeEditExercise } = useUI();
  const nameRef = useRef();
  const noteRef = useRef();

  if (!editExercisePayload) return null;
  const { dayIdx, exIdx } = editExercisePayload;
  const ex = program[dayIdx]?.exercises[exIdx];
  if (!ex) return null;

  const handleSave = () => {
    const name = nameRef.current.value.trim();
    const note = noteRef.current.value.trim();
    if (!name) { alert('Please enter an exercise name'); return; }
    setProgram(prev => {
      const next = prev.map(d => ({ ...d, exercises: [...d.exercises] }));
      next[dayIdx].exercises[exIdx] = { ...next[dayIdx].exercises[exIdx], name, note };
      return next;
    });
    closeEditExercise();
  };

  return (
    <Modal onClose={closeEditExercise}>
      <div className="modal-title">Edit Exercise</div>
      <label className="modal-label sans">Exercise Name</label>
      <input ref={nameRef} type="text" className="modal-input sans" defaultValue={ex.name} placeholder="e.g., Barbell Squat" />
      <label className="modal-label sans">Description/Form Notes</label>
      <textarea ref={noteRef} className="modal-textarea sans" defaultValue={ex.note || ''} placeholder="Form cues, tips, etc." />
      <div className="modal-buttons">
        <button className="modal-btn modal-btn-secondary sans" onClick={closeEditExercise}>Cancel</button>
        <button className="modal-btn modal-btn-primary sans" onClick={handleSave}>Save</button>
      </div>
    </Modal>
  );
}

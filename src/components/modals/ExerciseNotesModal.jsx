import { useRef } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import Modal from './Modal';

export default function ExerciseNotesModal() {
  const { program, getExerciseNote, setExerciseNote } = useAppData();
  const { exerciseNotesPayload, closeExerciseNotes } = useUI();
  const noteRef = useRef();

  if (!exerciseNotesPayload) return null;
  const { dayIdx, exIdx, exId } = exerciseNotesPayload;
  const ex = program[dayIdx]?.exercises[exIdx];
  if (!ex) return null;

  const currentNote = getExerciseNote(exId);

  const handleSave = () => {
    const note = noteRef.current.value.trim();
    setExerciseNote(exId, note);
    closeExerciseNotes();
  };

  return (
    <Modal onClose={closeExerciseNotes}>
      <div className="modal-title">Exercise Notes</div>
      <div className="modal-label sans" style={{ marginBottom: 8, fontWeight: 600 }}>{ex.name}</div>
      <label className="modal-label sans">Personal Notes</label>
      <textarea
        ref={noteRef}
        className="modal-textarea sans"
        defaultValue={currentNote}
        placeholder="Your notes, cues, PRs, tips..."
        style={{ minHeight: 120 }}
      />
      <div className="modal-buttons">
        <button className="modal-btn modal-btn-secondary sans" onClick={closeExerciseNotes}>Cancel</button>
        <button className="modal-btn modal-btn-primary sans" onClick={handleSave}>Save</button>
      </div>
    </Modal>
  );
}

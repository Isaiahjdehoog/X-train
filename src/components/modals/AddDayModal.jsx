import { useRef, useState } from 'react';
import { useAppData, getTodayStr } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import Modal from './Modal';
import ColorPicker from '../ui/ColorPicker';

const DAY_OPTIONS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function AddDayModal() {
  const { program, setProgram, doUpdateRestDays, doSeedDayHistory } = useAppData();
  const { setAddDayOpen } = useUI();
  const dayRef = useRef();
  const labelRef = useRef();
  const tipRef = useRef();
  const [color, setColor] = useState('#3A3A3A');
  const [accent, setAccent] = useState('#1A1A1A');

  const close = () => setAddDayOpen(false);

  const handleAdd = () => {
    const day = dayRef.current.value;
    const label = labelRef.current.value.trim();
    const tip = tipRef.current.value.trim();
    if (!day) { alert('Please select a day'); return; }

    const newDay = {
      id: `day-${Date.now()}`,
      day,
      label: label || day,
      tip,
      color,
      accent,
      exercises: [],
    };

    setProgram(prev => {
      const next = [...prev, newDay];
      doUpdateRestDays(next);
      doSeedDayHistory(next);
      return next;
    });
    close();
  };

  return (
    <Modal onClose={close}>
      <div className="modal-title">Add Training Day</div>
      <label className="modal-label sans">Day of Week</label>
      <select ref={dayRef} className="modal-input sans" defaultValue="">
        <option value="" disabled>Select a day...</option>
        {DAY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <label className="modal-label sans">Label (e.g., Push Day)</label>
      <input ref={labelRef} type="text" className="modal-input sans" placeholder="e.g., Push Day" />
      <label className="modal-label sans">Training Tip (optional)</label>
      <textarea ref={tipRef} className="modal-textarea sans" placeholder="e.g., Focus on form over weight" />
      <ColorPicker selected={color} onSelect={(c, a) => { setColor(c); setAccent(a); }} />
      <div className="modal-buttons">
        <button className="modal-btn modal-btn-secondary sans" onClick={close}>Cancel</button>
        <button className="modal-btn modal-btn-primary sans" onClick={handleAdd}>Add Day</button>
      </div>
    </Modal>
  );
}

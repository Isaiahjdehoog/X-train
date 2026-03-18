import { useRef, useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import Modal from './Modal';
import ColorPicker from '../ui/ColorPicker';

const DAY_OPTIONS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function EditDayModal() {
  const { program, setProgram, doUpdateRestDays } = useAppData();
  const { editDayPayload, closeEditDay } = useUI();

  const dayIdx = editDayPayload;
  const p = (dayIdx !== null && dayIdx !== undefined) ? program[dayIdx] : null;

  const labelRef = useRef();
  const tipRef = useRef();
  const [day, setDay] = useState(() => p?.day || 'Monday');
  const [color, setColor] = useState(() => p?.color || '#E8D5B7');
  const [accent, setAccent] = useState(() => p?.accent || '#8B6914');

  if (!p) return null;

  const handleSave = () => {
    const label = labelRef.current.value.trim();
    const tip = tipRef.current.value.trim();

    setProgram(prev => {
      const next = prev.map(d => ({ ...d }));
      next[dayIdx] = { ...next[dayIdx], day, label: label || day, tip, color, accent };
      doUpdateRestDays(next);
      return next;
    });
    closeEditDay();
  };

  return (
    <Modal onClose={closeEditDay}>
      <div className="modal-title">Edit Day</div>
      <label className="modal-label sans">Day of Week</label>
      <select className="modal-input sans" value={day} onChange={e => setDay(e.target.value)}>
        {DAY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <label className="modal-label sans">Label</label>
      <input ref={labelRef} type="text" className="modal-input sans" defaultValue={p.label} placeholder="e.g., Push Day" />
      <label className="modal-label sans">Training Tip</label>
      <textarea ref={tipRef} className="modal-textarea sans" defaultValue={p.tip || ''} placeholder="e.g., Focus on form over weight" />
      <ColorPicker selected={color} onSelect={(c, a) => { setColor(c); setAccent(a); }} />
      <div className="modal-buttons">
        <button className="modal-btn modal-btn-secondary sans" onClick={closeEditDay}>Cancel</button>
        <button className="modal-btn modal-btn-primary sans" onClick={handleSave}>Save</button>
      </div>
    </Modal>
  );
}

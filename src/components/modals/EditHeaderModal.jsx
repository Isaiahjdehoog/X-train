import { useRef } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import Modal from './Modal';

export default function EditHeaderModal() {
  const { headerInfo, setHeaderInfo } = useAppData();
  const { setEditHeaderOpen } = useUI();
  const nameRef = useRef();
  const subtitleRef = useRef();

  const close = () => setEditHeaderOpen(false);

  const handleSave = () => {
    const name = nameRef.current.value.trim();
    const subtitle = subtitleRef.current.value.trim();
    if (!name) { alert('Please enter a program name'); return; }
    setHeaderInfo({ name, subtitle });
    close();
  };

  return (
    <Modal onClose={close}>
      <div className="modal-title">Edit Header</div>
      <label className="modal-label sans">Program Name</label>
      <input ref={nameRef} type="text" className="modal-input sans" defaultValue={headerInfo.name} placeholder="e.g., My Training" />
      <label className="modal-label sans">Subtitle</label>
      <input ref={subtitleRef} type="text" className="modal-input sans" defaultValue={headerInfo.subtitle} placeholder="e.g., Build your custom workout program" />
      <div className="modal-buttons">
        <button className="modal-btn modal-btn-secondary sans" onClick={close}>Cancel</button>
        <button className="modal-btn modal-btn-primary sans" onClick={handleSave}>Save</button>
      </div>
    </Modal>
  );
}

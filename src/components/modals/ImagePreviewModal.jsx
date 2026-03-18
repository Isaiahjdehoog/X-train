import { useUI } from '../../context/UIContext';

export default function ImagePreviewModal() {
  const { imagePreviewOpen, imagePreviewUrl, closeImagePreview } = useUI();

  if (!imagePreviewOpen) return null;

  return (
    <div className="modal active" onClick={closeImagePreview}>
      <div
        className="modal-content"
        style={{ background: 'transparent', padding: 0, maxWidth: '95vw', boxShadow: 'none' }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imagePreviewUrl}
          alt="Exercise"
          style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12, display: 'block' }}
        />
        <button
          className="modal-btn modal-btn-secondary sans"
          style={{ marginTop: 12, width: '100%' }}
          onClick={closeImagePreview}
        >
          Close
        </button>
      </div>
    </div>
  );
}

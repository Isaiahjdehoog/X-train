const COLORS = [
  { color: '#3A3A3A', accent: '#1A1A1A', style: 'linear-gradient(135deg, #4A4A4A 0%, #2A2A2A 100%)' },
  { color: '#E8D5B7', accent: '#8B6914', style: 'linear-gradient(135deg, #F0E6D0 0%, #E8D5B7 100%)' },
  { color: '#E2E8F0', accent: '#475569', style: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%)' },
  { color: '#93C5FD', accent: '#1D4ED8', style: 'linear-gradient(135deg, #BFDBFE 0%, #93C5FD 100%)' },
  { color: '#C4B5FD', accent: '#6D28D9', style: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)' },
  { color: '#F9A8D4', accent: '#BE185D', style: 'linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%)' },
];

export default function ColorPicker({ selected, onSelect }) {
  return (
    <div className="color-picker-container">
      <span className="color-picker-label">Highlight Color</span>
      <div className="color-picker-dots">
        {COLORS.map(({ color, accent, style }) => (
          <div
            key={color}
            className={`color-dot ${selected === color ? 'selected' : ''}`}
            style={{ background: style }}
            onClick={() => onSelect(color, accent)}
          />
        ))}
      </div>
    </div>
  );
}

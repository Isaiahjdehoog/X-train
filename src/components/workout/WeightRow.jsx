import { useAppData } from '../../context/AppDataContext';

export default function WeightRow({ ex, accent }) {
  const { getWeight, setWeight, touchDate } = useAppData();

  if (!ex.numSets || ex.numSets <= 0) return null;

  const handleChange = (setIdx, val) => {
    setWeight(ex.id, setIdx, val);
    touchDate(ex.id);
  };

  return (
    <div className="weight-row">
      {Array.from({ length: ex.numSets }, (_, s) => (
        <div className="weight-group" key={s}>
          <span className="weight-label sans">Set {s + 1}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input
              className="weight-input sans"
              type="number"
              inputMode="decimal"
              placeholder="—"
              defaultValue={getWeight(ex.id, s)}
              onChange={e => handleChange(s, e.target.value)}
              onFocus={e => e.target.select()}
            />
            <span className="weight-unit sans">kg</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProgressBar({ completeCount, partialCount, missedCount, trainingDaysTotal }) {
  const completePct = trainingDaysTotal > 0 ? (completeCount / trainingDaysTotal) * 100 : 0;
  const partialPct  = trainingDaysTotal > 0 ? (partialCount  / trainingDaysTotal) * 100 : 0;
  const missedPct   = trainingDaysTotal > 0 ? (missedCount   / trainingDaysTotal) * 100 : 0;

  return (
    <>
      <div className="progress-bar-wrapper">
        <div className="progress-bar-segment segment-complete" style={{ width: `${completePct}%` }} />
        <div className="progress-bar-segment segment-partial"  style={{ width: `${partialPct}%`  }} />
        <div className="progress-bar-segment segment-missed"   style={{ width: `${missedPct}%`   }} />
      </div>
      <div className="progress-legend sans">
        <span className="legend-item">
          <span className="legend-dot dot-complete" />
          {completeCount} complete <span className="legend-pct">({Math.round(completePct)}%)</span>
        </span>
        {partialCount > 0 && (
          <span className="legend-item">
            <span className="legend-dot dot-partial" />
            {partialCount} partial <span className="legend-pct">({Math.round(partialPct)}%)</span>
          </span>
        )}
        {missedCount > 0 && (
          <span className="legend-item">
            <span className="legend-dot dot-missed" />
            {missedCount} missed <span className="legend-pct">({Math.round(missedPct)}%)</span>
          </span>
        )}
      </div>
      <div className="rest-day-info sans">Rest days excluded</div>
    </>
  );
}

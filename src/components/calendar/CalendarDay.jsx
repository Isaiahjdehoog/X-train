export default function CalendarDay({ dateStr, dayNum, isCurrentPeriod, isTrained, isPartial, isMissed, isRest, isToday, isOtherMonth, onClick, mode }) {
  const classes = ['calendar-day', 'sans'];
  if (mode === 'week') {
    // use week-day classes instead
  }
  if (isTrained) classes.push('trained');
  else if (isPartial) classes.push('partial');
  else if (isMissed) classes.push('missed');
  else if (isRest) classes.push('rest-day');
  if (isToday) classes.push('today');
  if (isOtherMonth) classes.push('other-month');

  const clickable = !isRest || isTrained || isPartial;

  if (mode === 'week') {
    const weekClasses = ['week-day', 'sans'];
    if (isTrained) weekClasses.push('trained');
    else if (isPartial) weekClasses.push('partial');
    else if (isMissed) weekClasses.push('missed');
    else if (isRest) weekClasses.push('rest-day');
    if (isToday) weekClasses.push('today');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [y, m, d] = dateStr.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();

    return (
      <div
        className={weekClasses.join(' ')}
        onClick={clickable ? onClick : undefined}
        style={clickable ? { cursor: 'pointer' } : {}}
      >
        <div className="week-day-header">{days[dayOfWeek]}</div>
        <div className="week-day-number">{dayNum}</div>
        {isTrained && <div className="calendar-dot dot-complete-small" />}
        {isPartial && <div className="calendar-dot dot-partial-small" />}
      </div>
    );
  }

  return (
    <div
      className={classes.join(' ')}
      onClick={clickable ? onClick : undefined}
      style={clickable ? { cursor: 'pointer' } : {}}
    >
      {dayNum}
      {isTrained && <div className="calendar-dot dot-complete-small" />}
      {isPartial && <div className="calendar-dot dot-partial-small" />}
    </div>
  );
}

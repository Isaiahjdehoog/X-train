import { useAppData, getTodayStr, wasTrainingDay, getTrainingDaysInPeriod } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import ProgressBar from './ProgressBar';
import CalendarDay from './CalendarDay';

export default function CalendarView() {
  const { trainingDates, partialDates, program, setActiveDay } = useAppData();
  const { calendarDate, setCalendarDate, setActiveView } = useUI();

  const todayStr = getTodayStr();
  const allHistory = [...trainingDates, ...partialDates].sort();
  const historyFloor = allHistory.length > 0 ? allHistory[0] : null;

  const changeMonth = (dir) => {
    const d = new Date(calendarDate);
    d.setMonth(d.getMonth() + dir);
    setCalendarDate(d);
  };

  const handleDayClick = (dateStr) => {
    const dayMap = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
    const [y, m, d] = dateStr.split('-').map(Number);
    const dayName = dayMap[new Date(y, m - 1, d).getDay()];
    const progIdx = program.findIndex(p => p.day === dayName);
    if (progIdx !== -1) {
      setActiveDay(progIdx);
      setActiveView('workout');
      window.scrollTo(0, 0);
    }
  };

  const isMissed = (ds) =>
    wasTrainingDay(ds) && !trainingDates.includes(ds) && !partialDates.includes(ds) &&
    ds < todayStr && historyFloor && ds >= historyFloor;

  {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const monthTitle = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const trainingDaysInMonth = getTrainingDaysInPeriod(firstDay, lastDay);

    const monthTrained = trainingDates.filter(d => {
      const dt = new Date(d + 'T00:00:00');
      return dt.getMonth() === month && dt.getFullYear() === year;
    });
    const monthPartial = partialDates.filter(d => {
      const dt = new Date(d + 'T00:00:00');
      return dt.getMonth() === month && dt.getFullYear() === year;
    });

    let missedCount = 0;
    const tmp = new Date(firstDay);
    while (tmp <= lastDay) {
      if (isMissed(tmp.toLocaleDateString('en-CA'))) missedCount++;
      tmp.setDate(tmp.getDate() + 1);
    }

    const days = [];
    const cur = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      const ds = cur.toLocaleDateString('en-CA');
      days.push({
        ds, dayNum: cur.getDate(),
        isTrained: trainingDates.includes(ds),
        isPartial: partialDates.includes(ds),
        isMissed: isMissed(ds),
        isRest: !wasTrainingDay(ds),
        isToday: ds === todayStr,
        isOtherMonth: cur.getMonth() !== month,
      });
      cur.setDate(cur.getDate() + 1);
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-controls">
            <div className="calendar-nav sans">
              <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>◀</button>
              <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>▶</button>
            </div>
            </div>
          <div className="calendar-title sans">{monthTitle}</div>
          <ProgressBar
            completeCount={monthTrained.length}
            partialCount={monthPartial.length}
            missedCount={missedCount}
            trainingDaysTotal={trainingDaysInMonth}
          />
        </div>
        <div className="calendar-grid">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="calendar-day-header sans">{d}</div>
          ))}
          {days.map(({ ds, dayNum, isTrained, isPartial, isMissed: missed, isRest, isToday, isOtherMonth }) => (
            <CalendarDay
              key={ds}
              dateStr={ds}
              dayNum={dayNum}
              isTrained={isTrained}
              isPartial={isPartial}
              isMissed={missed}
              isRest={isRest}
              isToday={isToday}
              isOtherMonth={isOtherMonth}
              onClick={() => handleDayClick(ds)}
              mode="month"
            />
          ))}
        </div>
      </div>
    );
  }
}

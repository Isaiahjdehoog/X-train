import { useAppData, getTodayStr } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import DayHeader from './DayHeader';
import ExerciseList from './ExerciseList';
import EmptyState from './EmptyState';

export default function WorkoutView() {
  const { program, setProgram, activeDay, setActiveDay, doUpdateRestDays, doSeedDayHistory } = useAppData();
  const { openEditDay } = useUI();

  // Seed day history on first mount if needed
  if (program.length > 0) {
    doSeedDayHistory(program);
  }

  if (program.length === 0) {
    return <EmptyState />;
  }

  const safeDay = Math.min(activeDay, program.length - 1);

  return (
    <>
      <DayHeader dayIdx={safeDay} />
      <ExerciseList dayIdx={safeDay} />
      <div className="footer-note sans">
        Track your progress and build the workout routine that works for you.
      </div>
    </>
  );
}

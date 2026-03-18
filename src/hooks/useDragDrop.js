import { useRef } from 'react';

export function useDragDrop() {
  const draggedExerciseRef = useRef(null);
  const draggedTabRef = useRef(null);

  // Exercise drag handlers
  const handleExerciseDragStart = (e, dayIdx, exIdx) => {
    draggedExerciseRef.current = { dayIdx, exIdx };
    draggedTabRef.current = null;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
  };

  const handleExerciseDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.drag-handle').forEach(h => h.classList.remove('dragging'));
    document.querySelectorAll('.ex-card').forEach(c => c.classList.remove('drag-over'));
    draggedExerciseRef.current = null;
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  };

  const handleCardDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  };

  const handleCardDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleCardDrop = (e, program, setProgram, toDayIdx, toExIdx) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const drag = draggedExerciseRef.current;
    if (!drag) return;

    const fromDayIdx = drag.dayIdx;
    const fromExIdx = drag.exIdx;
    if (fromDayIdx === toDayIdx && fromExIdx === toExIdx) return;

    const next = program.map(d => ({ ...d, exercises: [...d.exercises] }));
    const [moved] = next[fromDayIdx].exercises.splice(fromExIdx, 1);

    if (fromDayIdx !== toDayIdx) {
      const targetDay = next[toDayIdx].day.toLowerCase().slice(0, 3);
      moved.id = `${targetDay}-${Date.now()}`;
    }
    next[toDayIdx].exercises.splice(toExIdx, 0, moved);
    setProgram(next);
    draggedExerciseRef.current = null;
  };

  // Tab drag handlers
  const handleTabDragStart = (e, tabIdx) => {
    draggedTabRef.current = tabIdx;
    draggedExerciseRef.current = null;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTabDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('drag-over'));
    draggedTabRef.current = null;
  };

  const handleTabDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  };

  const handleTabDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleTabDrop = (e, program, setProgram, activeDay, setActiveDay, toIdx) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    // Dragging exercise onto a tab (cross-day move)
    if (draggedExerciseRef.current !== null) {
      const { dayIdx: fromDayIdx, exIdx: fromExIdx } = draggedExerciseRef.current;
      if (fromDayIdx === toIdx) return;
      const next = program.map(d => ({ ...d, exercises: [...d.exercises] }));
      const [moved] = next[fromDayIdx].exercises.splice(fromExIdx, 1);
      const targetDay = next[toIdx].day.toLowerCase().slice(0, 3);
      moved.id = `${targetDay}-${Date.now()}`;
      next[toIdx].exercises.push(moved);
      setProgram(next);
      draggedExerciseRef.current = null;
      return;
    }

    // Tab reordering
    const fromIdx = draggedTabRef.current;
    if (fromIdx === null || fromIdx === toIdx) return;

    const next = [...program];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);

    let newActiveDay = activeDay;
    if (activeDay === fromIdx) {
      newActiveDay = toIdx;
    } else if (fromIdx < activeDay && toIdx >= activeDay) {
      newActiveDay = activeDay - 1;
    } else if (fromIdx > activeDay && toIdx <= activeDay) {
      newActiveDay = activeDay + 1;
    }
    setActiveDay(newActiveDay);
    setProgram(next);
    draggedTabRef.current = null;
  };

  return {
    handleExerciseDragStart, handleExerciseDragEnd,
    handleCardDragOver, handleCardDragLeave, handleCardDrop,
    handleTabDragStart, handleTabDragEnd,
    handleTabDragOver, handleTabDragLeave, handleTabDrop,
    getDraggedExercise: () => draggedExerciseRef.current,
  };
}

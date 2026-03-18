import { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [activeView, setActiveView] = useState('workout');
  const [calendarView, setCalendarView] = useState('month');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [copiedExercise, setCopiedExercise] = useState(null);

  // Modal visibility + payload
  const [addExerciseOpen, setAddExerciseOpen] = useState(false);
  const [editExerciseOpen, setEditExerciseOpen] = useState(false);
  const [editExercisePayload, setEditExercisePayload] = useState(null);
  const [editSetsOpen, setEditSetsOpen] = useState(false);
  const [editSetsPayload, setEditSetsPayload] = useState(null);
  const [addDayOpen, setAddDayOpen] = useState(false);
  const [editDayOpen, setEditDayOpen] = useState(false);
  const [editDayPayload, setEditDayPayload] = useState(null);
  const [editHeaderOpen, setEditHeaderOpen] = useState(false);
  const [exerciseNotesOpen, setExerciseNotesOpen] = useState(false);
  const [exerciseNotesPayload, setExerciseNotesPayload] = useState(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const openEditExercise = useCallback((dayIdx, exIdx) => {
    setEditExercisePayload({ dayIdx, exIdx });
    setEditExerciseOpen(true);
  }, []);
  const closeEditExercise = useCallback(() => {
    setEditExerciseOpen(false);
    setEditExercisePayload(null);
  }, []);

  const openEditSets = useCallback((dayIdx, exIdx) => {
    setEditSetsPayload({ dayIdx, exIdx });
    setEditSetsOpen(true);
  }, []);
  const closeEditSets = useCallback(() => {
    setEditSetsOpen(false);
    setEditSetsPayload(null);
  }, []);

  const openEditDay = useCallback((dayIdx) => {
    setEditDayPayload(dayIdx);
    setEditDayOpen(true);
  }, []);
  const closeEditDay = useCallback(() => {
    setEditDayOpen(false);
    setEditDayPayload(null);
  }, []);

  const openExerciseNotes = useCallback((dayIdx, exIdx, exId) => {
    setExerciseNotesPayload({ dayIdx, exIdx, exId });
    setExerciseNotesOpen(true);
  }, []);
  const closeExerciseNotes = useCallback(() => {
    setExerciseNotesOpen(false);
    setExerciseNotesPayload(null);
  }, []);

  const openImagePreview = useCallback((url) => {
    setImagePreviewUrl(url);
    setImagePreviewOpen(true);
  }, []);
  const closeImagePreview = useCallback(() => setImagePreviewOpen(false), []);

  return (
    <UIContext.Provider value={{
      activeView, setActiveView,
      calendarView, setCalendarView,
      calendarDate, setCalendarDate,
      copiedExercise, setCopiedExercise,
      // Add Exercise
      addExerciseOpen, setAddExerciseOpen,
      // Edit Exercise
      editExerciseOpen, editExercisePayload, openEditExercise, closeEditExercise,
      // Edit Sets
      editSetsOpen, editSetsPayload, openEditSets, closeEditSets,
      // Add Day
      addDayOpen, setAddDayOpen,
      // Edit Day
      editDayOpen, editDayPayload, openEditDay, closeEditDay,
      // Edit Header
      editHeaderOpen, setEditHeaderOpen,
      // Exercise Notes
      exerciseNotesOpen, exerciseNotesPayload, openExerciseNotes, closeExerciseNotes,
      // Image Preview
      imagePreviewOpen, imagePreviewUrl, openImagePreview, closeImagePreview,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}

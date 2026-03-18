import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { UIProvider } from './context/UIContext';
import { useDarkMode } from './hooks/useDarkMode';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { useUI } from './context/UIContext';
import { useAppData } from './context/AppDataContext';

import AuthGate from './components/auth/AuthGate';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

import WorkoutView from './components/workout/WorkoutView';
import DayTabs from './components/workout/DayTabs';
import CalendarView from './components/calendar/CalendarView';
import NotesView from './components/notes/NotesView';

import AddExerciseModal from './components/modals/AddExerciseModal';
import EditExerciseModal from './components/modals/EditExerciseModal';
import EditSetsModal from './components/modals/EditSetsModal';
import AddDayModal from './components/modals/AddDayModal';
import EditDayModal from './components/modals/EditDayModal';
import EditHeaderModal from './components/modals/EditHeaderModal';
import ExerciseNotesModal from './components/modals/ExerciseNotesModal';
import ImagePreviewModal from './components/modals/ImagePreviewModal';

import CopyMenu from './components/ui/CopyMenu';

function AppShell() {
  const [syncStatus, setSyncStatus] = useState('');
  const { activeView } = useUI();
  const { program } = useAppData();
  const {
    addExerciseOpen, editExerciseOpen, editSetsOpen,
    addDayOpen, editDayOpen, editHeaderOpen,
    exerciseNotesOpen, imagePreviewOpen,
  } = useUI();

  useDarkMode();
  useFirebaseSync(setSyncStatus);

  // Apple Touch Icon canvas generation
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 180; canvas.height = 180;
      const ctx = canvas.getContext('2d');
      const r = 40;
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.lineTo(180 - r, 0);
      ctx.quadraticCurveTo(180, 0, 180, r);
      ctx.lineTo(180, 180 - r);
      ctx.quadraticCurveTo(180, 180, 180 - r, 180);
      ctx.lineTo(r, 180);
      ctx.quadraticCurveTo(0, 180, 0, 180 - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      const drawDumbbell = (rotDeg) => {
        ctx.save();
        ctx.translate(90, 90);
        ctx.rotate((rotDeg * Math.PI) / 180);
        ctx.fillStyle = '#111111';
        ctx.beginPath(); ctx.roundRect(-4, -46, 8, 92, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(-12, -50, 24, 12, 3); ctx.fill();
        ctx.beginPath(); ctx.roundRect(-12, 38, 24, 12, 3); ctx.fill();
        ctx.beginPath(); ctx.roundRect(-15, -47, 10, 7, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(5, -47, 10, 7, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(-15, 40, 10, 7, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(5, 40, 10, 7, 2); ctx.fill();
        ctx.restore();
      };

      drawDumbbell(45);
      drawDumbbell(-45);

      const link = document.createElement('link');
      link.rel = 'apple-touch-icon';
      link.href = canvas.toDataURL('image/png');
      document.head.appendChild(link);
    } catch (e) {
      // Canvas not supported, skip
    }
  }, []);

  return (
    <div className="app-container">
      <Header syncStatus={syncStatus} />

      {program.length > 0 && activeView === 'workout' && <DayTabs />}

      <div className="content-area">
        {activeView === 'workout' && <WorkoutView />}
        {activeView === 'calendar' && <CalendarView />}
        {activeView === 'notes' && <NotesView />}
      </div>

      <BottomNav />

      <CopyMenu />

      {addExerciseOpen && <AddExerciseModal />}
      {editExerciseOpen && <EditExerciseModal />}
      {editSetsOpen && <EditSetsModal />}
      {addDayOpen && <AddDayModal />}
      {editDayOpen && <EditDayModal />}
      {editHeaderOpen && <EditHeaderModal />}
      {exerciseNotesOpen && <ExerciseNotesModal />}
      <ImagePreviewModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <UIProvider>
          <AuthGate>
            <AppShell />
          </AuthGate>
        </UIProvider>
      </AppDataProvider>
    </AuthProvider>
  );
}

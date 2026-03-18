import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppDataContext = createContext(null);

// Storage keys
export const KEYS = {
  PROGRAM:       'training-app-program',
  WEIGHTS:       'training-app-weights',
  CHECKED:       'training-app-checked',
  TRAINING_DATES:'training-app-training-dates',
  PARTIAL_DATES: 'training-app-partial-dates',
  DAY_HISTORY:   'training-app-day-history',
  EX_IMAGES:     'training-app-exercise-images',
  EX_NOTES:      'training-app-exercise-notes',
  APP_NOTES:     'training-app-app-notes',
  REST_DAYS:     'training-app-rest-days',
  HEADER_INFO:   'training-app-header-info',
  ACTIVE_DAY:    'training-app-active-day',
  DARK_MODE:     'training-app-dark-mode',
  ACTIVE_DAY_DATE: 'training-app-active-day-date',
  LAST_CHECK_DATE: 'training-app-last-check-date',
  DAY_HISTORY_SEEDED: 'training-app-day-history-seeded-v1',
};

function parseLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function getLS(key, fallback = '') {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

const BRISBANE_TZ = 'Australia/Brisbane';

export function getTodayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: BRISBANE_TZ });
}

function getSmartActiveDayFn(program) {
  const dayMap = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
  const todayName = new Date().toLocaleDateString('en-AU', { weekday: 'long', timeZone: BRISBANE_TZ });
  const todayNum = dayMap[todayName];
  if (program.length === 0) return 0;
  const trainingDayNums = program.map((d, i) => ({ i, num: dayMap[d.day] }));
  const todayMatch = trainingDayNums.find(d => d.num === todayNum);
  if (todayMatch !== undefined) return todayMatch.i;
  for (let offset = 1; offset <= 7; offset++) {
    const targetNum = (todayNum + offset) % 7;
    const nextMatch = trainingDayNums.find(d => d.num === targetNum);
    if (nextMatch !== undefined) return nextMatch.i;
  }
  return 0;
}

function loadActiveDayFn(program) {
  const today = getTodayStr();
  const lastOpenDate = getLS(KEYS.ACTIVE_DAY_DATE);
  if (lastOpenDate !== today) {
    localStorage.setItem(KEYS.ACTIVE_DAY_DATE, today);
    const smart = getSmartActiveDayFn(program);
    localStorage.setItem(KEYS.ACTIVE_DAY, smart.toString());
    return smart;
  }
  const saved = getLS(KEYS.ACTIVE_DAY);
  if (saved !== '') {
    const idx = parseInt(saved, 10);
    if (!isNaN(idx) && idx >= 0 && idx < program.length) return idx;
  }
  return getSmartActiveDayFn(program);
}

function autoResetOldCheckboxesFn() {
  const today = getTodayStr();
  const lastCheckDate = getLS(KEYS.LAST_CHECK_DATE);
  if (lastCheckDate && lastCheckDate !== today) {
    localStorage.setItem(KEYS.CHECKED, JSON.stringify({}));
  }
  localStorage.setItem(KEYS.LAST_CHECK_DATE, today);
}

function seedDayHistoryFn(program) {
  if (getLS(KEYS.DAY_HISTORY_SEEDED)) return;
  const history = parseLS(KEYS.DAY_HISTORY, {});
  const trainingDates = parseLS(KEYS.TRAINING_DATES, []);
  const partialDates = parseLS(KEYS.PARTIAL_DATES, []);
  const allDates = [...trainingDates, ...partialDates].sort();
  const floor = allDates.length > 0 ? allDates[0] : getTodayStr();
  program.forEach(d => {
    if (!history[d.day]) history[d.day] = [];
    if (!history[d.day].some(r => r.to === null)) {
      history[d.day].push({ from: floor, to: null });
    }
  });
  localStorage.setItem(KEYS.DAY_HISTORY, JSON.stringify(history));
  localStorage.setItem(KEYS.DAY_HISTORY_SEEDED, 'true');
}

function updateRestDaysFromProgram(program) {
  const dayMap = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
  const trainingDays = program.map(d => dayMap[d.day]);
  const restDays = [0,1,2,3,4,5,6].filter(d => !trainingDays.includes(d));
  localStorage.setItem(KEYS.REST_DAYS, JSON.stringify(restDays));
  return restDays;
}

export function wasTrainingDay(dateStr) {
  const history = parseLS(KEYS.DAY_HISTORY, {});
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const [y, m, d] = dateStr.split('-').map(Number);
  const dayName = dayNames[new Date(y, m - 1, d).getDay()];
  const ranges = history[dayName];
  if (!ranges || ranges.length === 0) return false;
  return ranges.some(r => dateStr >= r.from && (r.to === null || dateStr <= r.to));
}

export function getTrainingDaysInPeriod(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  while (current <= endDate) {
    const ds = current.toLocaleDateString('en-CA');
    if (wasTrainingDay(ds)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function AppDataProvider({ children }) {
  const [program, _setProgram] = useState(() => parseLS(KEYS.PROGRAM, []));
  const [weights, _setWeights] = useState(() => parseLS(KEYS.WEIGHTS, {}));
  const [checked, _setChecked] = useState(() => {
    autoResetOldCheckboxesFn();
    return parseLS(KEYS.CHECKED, {});
  });
  const [trainingDates, _setTrainingDates] = useState(() => parseLS(KEYS.TRAINING_DATES, []));
  const [partialDates, _setPartialDates] = useState(() => parseLS(KEYS.PARTIAL_DATES, []));
  const [exerciseImages, _setExerciseImages] = useState(() => parseLS(KEYS.EX_IMAGES, {}));
  const [exerciseNotes, _setExerciseNotes] = useState(() => parseLS(KEYS.EX_NOTES, {}));
  const [appNotes, _setAppNotes] = useState(() => getLS(KEYS.APP_NOTES));
  const [headerInfo, _setHeaderInfo] = useState(() => {
    const saved = parseLS(KEYS.HEADER_INFO, null);
    if (saved) return { name: saved.name || saved.title || 'My Training', subtitle: saved.subtitle || 'Build your custom workout program' };
    return { name: 'My Training', subtitle: 'Build your custom workout program' };
  });
  const [activeDay, _setActiveDay] = useState(() => {
    const prog = parseLS(KEYS.PROGRAM, []);
    return loadActiveDayFn(prog);
  });
  const [darkMode, _setDarkMode] = useState(() => getLS(KEYS.DARK_MODE) === 'true');

  const triggerSyncRef = useRef(null);

  const triggerSync = useCallback(() => {
    if (triggerSyncRef.current) triggerSyncRef.current();
  }, []);

  // Expose setter for sync hook to register its callback
  const registerTriggerSync = useCallback((fn) => {
    triggerSyncRef.current = fn;
  }, []);

  const setProgram = useCallback((p) => {
    const next = typeof p === 'function' ? p(program) : p;
    localStorage.setItem(KEYS.PROGRAM, JSON.stringify(next));
    _setProgram(next);
    triggerSync();
  }, [program, triggerSync]);

  const setWeights = useCallback((w) => {
    const next = typeof w === 'function' ? w(weights) : w;
    localStorage.setItem(KEYS.WEIGHTS, JSON.stringify(next));
    _setWeights(next);
    triggerSync();
  }, [weights, triggerSync]);

  const setChecked = useCallback((c) => {
    const next = typeof c === 'function' ? c(checked) : c;
    localStorage.setItem(KEYS.CHECKED, JSON.stringify(next));
    _setChecked(next);
    triggerSync();
  }, [checked, triggerSync]);

  const setTrainingDates = useCallback((d) => {
    const next = typeof d === 'function' ? d(trainingDates) : d;
    localStorage.setItem(KEYS.TRAINING_DATES, JSON.stringify(next));
    _setTrainingDates(next);
    triggerSync();
  }, [trainingDates, triggerSync]);

  const setPartialDates = useCallback((d) => {
    const next = typeof d === 'function' ? d(partialDates) : d;
    localStorage.setItem(KEYS.PARTIAL_DATES, JSON.stringify(next));
    _setPartialDates(next);
    triggerSync();
  }, [partialDates, triggerSync]);

  const setExerciseImages = useCallback((imgs) => {
    const next = typeof imgs === 'function' ? imgs(exerciseImages) : imgs;
    localStorage.setItem(KEYS.EX_IMAGES, JSON.stringify(next));
    _setExerciseImages(next);
    triggerSync();
  }, [exerciseImages, triggerSync]);

  const setExerciseNotes = useCallback((notes) => {
    const next = typeof notes === 'function' ? notes(exerciseNotes) : notes;
    localStorage.setItem(KEYS.EX_NOTES, JSON.stringify(next));
    _setExerciseNotes(next);
    triggerSync();
  }, [exerciseNotes, triggerSync]);

  const setAppNotes = useCallback((text) => {
    localStorage.setItem(KEYS.APP_NOTES, text);
    _setAppNotes(text);
    triggerSync();
  }, [triggerSync]);

  const setHeaderInfo = useCallback((info) => {
    localStorage.setItem(KEYS.HEADER_INFO, JSON.stringify(info));
    _setHeaderInfo(info);
    triggerSync();
  }, [triggerSync]);

  const setActiveDay = useCallback((idx) => {
    localStorage.setItem(KEYS.ACTIVE_DAY, idx.toString());
    _setActiveDay(idx);
  }, []);

  const setDarkMode = useCallback((val) => {
    const next = typeof val === 'function' ? val(darkMode) : val;
    localStorage.setItem(KEYS.DARK_MODE, next ? 'true' : 'false');
    _setDarkMode(next);
    triggerSync();
  }, [darkMode, triggerSync]);

  // Restores all data from a cloud snapshot (used by sync hook)
  const restoreFromCloud = useCallback((data) => {
    if (data.program) { localStorage.setItem(KEYS.PROGRAM, JSON.stringify(data.program)); _setProgram(data.program); }
    if (data.weights) { localStorage.setItem(KEYS.WEIGHTS, JSON.stringify(data.weights)); _setWeights(data.weights); }
    if (data.checked) { localStorage.setItem(KEYS.CHECKED, JSON.stringify(data.checked)); _setChecked(data.checked); }
    if (data.trainingDates) { localStorage.setItem(KEYS.TRAINING_DATES, JSON.stringify(data.trainingDates)); _setTrainingDates(data.trainingDates); }
    if (data.partialDates) { localStorage.setItem(KEYS.PARTIAL_DATES, JSON.stringify(data.partialDates)); _setPartialDates(data.partialDates); }
    if (data.dayHistory) localStorage.setItem(KEYS.DAY_HISTORY, JSON.stringify(data.dayHistory));
    if (data.exerciseImages) { localStorage.setItem(KEYS.EX_IMAGES, JSON.stringify(data.exerciseImages)); _setExerciseImages(data.exerciseImages); }
    if (data.exerciseNotes) { localStorage.setItem(KEYS.EX_NOTES, JSON.stringify(data.exerciseNotes)); _setExerciseNotes(data.exerciseNotes); }
    if (data.appNotes) { localStorage.setItem(KEYS.APP_NOTES, data.appNotes); _setAppNotes(data.appNotes); }
    if (data.restDays) localStorage.setItem(KEYS.REST_DAYS, JSON.stringify(data.restDays));
    if (data.headerInfo) {
      const info = { name: data.headerInfo.name || data.headerInfo.title || 'My Training', subtitle: data.headerInfo.subtitle || '' };
      localStorage.setItem(KEYS.HEADER_INFO, JSON.stringify(info));
      _setHeaderInfo(info);
    }
    if (data.activeDay !== undefined) {
      localStorage.setItem(KEYS.ACTIVE_DAY, data.activeDay.toString());
      _setActiveDay(data.activeDay);
    }
    // Dark mode is device-local preference — never overwrite from cloud
  }, []);

  // Helpers
  const getWeight = useCallback((exId, setIdx) => {
    return (weights[exId] && weights[exId][setIdx]) || '';
  }, [weights]);

  const setWeight = useCallback((exId, setIdx, val) => {
    setWeights(prev => {
      const next = { ...prev };
      if (!next[exId]) next[exId] = {};
      next[exId] = { ...next[exId], [setIdx]: val };
      return next;
    });
  }, [setWeights]);

  const getLastDate = useCallback((exId) => {
    return weights[exId] && weights[exId]._lastDate;
  }, [weights]);

  const touchDate = useCallback((exId) => {
    setWeights(prev => {
      const next = { ...prev };
      if (!next[exId]) next[exId] = {};
      next[exId] = { ...next[exId], _lastDate: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: BRISBANE_TZ }) };
      return next;
    });
  }, [setWeights]);

  const recordTrainingDate = useCallback(() => {
    const today = getTodayStr();
    setTrainingDates(prev => {
      if (prev.includes(today)) return prev;
      return [...prev, today];
    });
  }, [setTrainingDates]);

  const addTrainingDate = useCallback((dateStr) => {
    setTrainingDates(prev => prev.includes(dateStr) ? prev : [...prev, dateStr]);
  }, [setTrainingDates]);

  const removeTrainingDate = useCallback((dateStr) => {
    setTrainingDates(prev => prev.filter(d => d !== dateStr));
  }, [setTrainingDates]);

  const addPartialDate = useCallback((dateStr) => {
    setPartialDates(prev => prev.includes(dateStr) ? prev : [...prev, dateStr]);
  }, [setPartialDates]);

  const removePartialDate = useCallback((dateStr) => {
    setPartialDates(prev => prev.filter(d => d !== dateStr));
  }, [setPartialDates]);

  const getExerciseNote = useCallback((exId) => exerciseNotes[exId] || '', [exerciseNotes]);

  const setExerciseNote = useCallback((exId, text) => {
    setExerciseNotes(prev => {
      const next = { ...prev };
      if (text.trim()) next[exId] = text;
      else delete next[exId];
      return next;
    });
  }, [setExerciseNotes]);

  const getExerciseImage = useCallback((exId) => exerciseImages[exId], [exerciseImages]);

  const setExerciseImage = useCallback((exId, dataUrl) => {
    setExerciseImages(prev => ({ ...prev, [exId]: dataUrl }));
  }, [setExerciseImages]);

  const removeExerciseImage = useCallback((exId) => {
    setExerciseImages(prev => {
      const next = { ...prev };
      delete next[exId];
      return next;
    });
  }, [setExerciseImages]);

  const doUpdateRestDays = useCallback((prog) => {
    updateRestDaysFromProgram(prog || program);
  }, [program]);

  const doSeedDayHistory = useCallback((prog) => {
    seedDayHistoryFn(prog || program);
  }, [program]);

  // Build the data snapshot for cloud save
  const getCloudSnapshot = useCallback(() => ({
    program,
    weights,
    checked,
    trainingDates,
    partialDates,
    dayHistory: parseLS(KEYS.DAY_HISTORY, {}),
    exerciseImages,
    exerciseNotes,
    appNotes,
    restDays: parseLS(KEYS.REST_DAYS, []),
    headerInfo,
    activeDay,
    darkMode,
  }), [program, weights, checked, trainingDates, partialDates, exerciseImages, exerciseNotes, appNotes, headerInfo, activeDay, darkMode]);

  return (
    <AppDataContext.Provider value={{
      program, setProgram,
      weights, setWeights,
      checked, setChecked,
      trainingDates, addTrainingDate, removeTrainingDate,
      partialDates, addPartialDate, removePartialDate,
      exerciseImages, getExerciseImage, setExerciseImage, removeExerciseImage,
      exerciseNotes, getExerciseNote, setExerciseNote,
      appNotes, setAppNotes,
      headerInfo, setHeaderInfo,
      activeDay, setActiveDay,
      darkMode, setDarkMode,
      getWeight, setWeight, getLastDate, touchDate, recordTrainingDate,
      restoreFromCloud, getCloudSnapshot,
      registerTriggerSync,
      doUpdateRestDays, doSeedDayHistory,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}

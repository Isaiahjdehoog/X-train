export const DEFAULT_TEMPLATE = {
  program: [
    {
      day: "Sunday",
      label: "Shoulders & Accessories",
      tip: "Focus on shoulder health and accessories",
      color: "#E8D5B7",
      accent: "#8B6914",
      exercises: [
        { id: "sun-inner-rot", name: "Inner Shoulder Rotations", sets: "3x8", numSets: 3, note: "" },
        { id: "sun-outer-rot", name: "Outer Shoulder Rotations", sets: "3x8", numSets: 3, note: "" },
        { id: "sun-back-raise", name: "Weighted Back Raise", sets: "3x8", numSets: 3, note: "" },
        { id: "sun-hip-outer", name: "Hip Abduction (Outer)", sets: "3x8", numSets: 3, note: "" },
        { id: "sun-hip-inner", name: "Hip Abduction (Inner)", sets: "3x8", numSets: 3, note: "" },
        { id: "sun-calf-machine", name: "Calf Raises Machine", sets: "3x15", numSets: 3, note: "" },
        { id: "sun-calf-single", name: "Single Leg Calf Raises", sets: "3x15", numSets: 3, note: "" }
      ]
    },
    {
      day: "Monday",
      label: "Arms",
      tip: "Biceps and Triceps",
      color: "#5B9FFF",
      accent: "#4A8FFF",
      exercises: [
        { id: "mon-alt-curl", name: "Alternating Curls", sets: "3x8", numSets: 3, note: "" },
        { id: "mon-tri-bar", name: "Tricep Pulldown - Bar", sets: "3x8", numSets: 3, note: "" },
        { id: "mon-tri-rope", name: "Tricep Pulldown - Rope", sets: "3x12", numSets: 3, note: "" },
        { id: "mon-incline-curl", name: "Incline Curls - Dumbbell", sets: "3x8", numSets: 3, note: "" },
        { id: "mon-seated-tri", name: "Seated Tricep Extensions - Dumbbell", sets: "3x8", numSets: 3, note: "" },
        { id: "mon-cable-curl", name: "Bicep Curl - Cable", sets: "3x8", numSets: 3, note: "" }
      ]
    },
    {
      day: "Tuesday",
      label: "Chest & Shoulders",
      tip: "Push day",
      color: "#FF9F43",
      accent: "#FF8C29",
      exercises: [
        { id: "tue-cable-fly", name: "Lateral Cable Flies", sets: "3x8", numSets: 3, note: "" },
        { id: "tue-shoulder-press", name: "Shoulder Press", sets: "3x8", numSets: 3, note: "" },
        { id: "tue-lat-raise", name: "Lateral Raises", sets: "3x8", numSets: 3, note: "" },
        { id: "tue-pec-arsenal", name: "Peck Flies (Arsenal)", sets: "3x8", numSets: 3, note: "" },
        { id: "tue-incline-press", name: "Incline Peck Press", sets: "3x8", numSets: 3, note: "" },
        { id: "tue-pushups", name: "Push Ups", sets: "1x20", numSets: 1, note: "" }
      ]
    },
    {
      day: "Wednesday",
      label: "Core & Accessories",
      tip: "Core stability and balance",
      color: "#5FD068",
      accent: "#4CBF56",
      exercises: [
        { id: "wed-plank", name: "Plank Hold", sets: "1x60s", numSets: 1, note: "" },
        { id: "wed-plank-side", name: "Plank Side to Side", sets: "1x30s", numSets: 1, note: "" },
        { id: "wed-side-plank", name: "Side Plank", sets: "1x30s", numSets: 1, note: "" },
        { id: "wed-russian", name: "Decline Russian Twist", sets: "3x12", numSets: 3, note: "" },
        { id: "wed-lunge", name: "Lunge Machine", sets: "4x8 EL", numSets: 4, note: "Each leg" },
        { id: "wed-copenhagen", name: "Copenhagens", sets: "3x6 EL", numSets: 3, note: "Each leg" },
        { id: "wed-soleus", name: "Soleus Calf Raises", sets: "4x12 EL", numSets: 4, note: "Each leg" },
        { id: "wed-hip-flex", name: "Hip Flexor Raises", sets: "4x8 EL", numSets: 4, note: "Each leg" }
      ]
    },
    {
      day: "Thursday",
      label: "Back & Arms",
      tip: "Pull day",
      color: "#A78BFA",
      accent: "#9575FA",
      exercises: [
        { id: "thu-preacher", name: "Preacher Curls Machine", sets: "3x8", numSets: 3, note: "" },
        { id: "thu-tri-bar", name: "Tricep Pulldown - Bar", sets: "3x8", numSets: 3, note: "" },
        { id: "thu-tri-rope", name: "Tricep Pulldown - Rope", sets: "3x12", numSets: 3, note: "" },
        { id: "thu-face-pull", name: "Face Pulls", sets: "3x8", numSets: 3, note: "" },
        { id: "thu-cable-row", name: "Seated Cable Rows", sets: "3x8", numSets: 3, note: "" },
        { id: "thu-lat-pull", name: "Lateral Pulldown - Machine", sets: "3x8", numSets: 3, note: "" },
        { id: "thu-dips", name: "Tricep Dips", sets: "3x8", numSets: 3, note: "" }
      ]
    },
    {
      day: "Friday",
      label: "Legs",
      tip: "Leg day - go heavy",
      color: "#FF6B6B",
      accent: "#EE5A52",
      exercises: [
        { id: "fri-squat-warm1", name: "Barbell Back Squats - Warm-up 1", sets: "1x10", numSets: 1, note: "20kg bar" },
        { id: "fri-squat-warm2", name: "Barbell Back Squats - Warm-up 2", sets: "1x10", numSets: 1, note: "20kg bar" },
        { id: "fri-squat-work", name: "Barbell Back Squats - Working Sets", sets: "3x6-10", numSets: 3, note: "Heavy, push to failure" },
        { id: "fri-leg-curl", name: "Seated Leg Curls", sets: "3x12", numSets: 3, note: "" },
        { id: "fri-leg-ext", name: "Leg Extensions", sets: "3x15", numSets: 3, note: "" },
        { id: "fri-leg-press", name: "Leg Press", sets: "3x6-10", numSets: 3, note: "Heavy, push to failure" },
        { id: "fri-glute", name: "Glute Bridge", sets: "3x12", numSets: 3, note: "" },
        { id: "fri-calf", name: "Machine Standing Calf Raises", sets: "3x10", numSets: 3, note: "" }
      ]
    },
    {
      day: "Saturday",
      label: "Chest & Core",
      tip: "Chest focus with core work",
      color: "#FFC837",
      accent: "#FFB700",
      exercises: [
        { id: "sat-bench", name: "Bench Press", sets: "3x6", numSets: 3, note: "Heavy" },
        { id: "sat-incline", name: "Incline Peck Press", sets: "3x8", numSets: 3, note: "30 degrees" },
        { id: "sat-chest-press", name: "Chest Press", sets: "3x8", numSets: 3, note: "" },
        { id: "sat-decline-sit", name: "Decline Sit Ups + Romanian Twist", sets: "3x16", numSets: 3, note: "" },
        { id: "sat-leg-raise", name: "Hanging Leg Raises", sets: "3x8", numSets: 3, note: "" },
        { id: "sat-recovery", name: "Sauna / Ice / Pool", sets: "Recovery", numSets: 0, note: "" }
      ]
    }
  ],
  weights: {
    "sun-inner-rot": { "0": "7.5", "1": "7.5", "2": "7.5" },
    "sun-outer-rot": { "0": "7.5", "1": "7.5", "2": "7.5" },
    "sun-back-raise": { "0": "25", "1": "25", "2": "25" },
    "sun-hip-outer": { "0": "96", "1": "103", "2": "110" },
    "sun-hip-inner": { "0": "126.5", "1": "126.5", "2": "126.5" },
    "mon-alt-curl": { "0": "17.5", "1": "17.5", "2": "17.5" },
    "mon-tri-bar": { "0": "43.75", "1": "43.75", "2": "43.75" },
    "mon-tri-rope": { "0": "18.75", "1": "18.75", "2": "18.75" },
    "mon-incline-curl": { "0": "15", "1": "15", "2": "12.5" },
    "mon-seated-tri": { "0": "25", "1": "25", "2": "25" },
    "mon-cable-curl": { "0": "11.25", "1": "13.75", "2": "13.75" },
    "tue-cable-fly": { "0": "8.75", "1": "8.75", "2": "8.75" },
    "tue-shoulder-press": { "0": "22.5", "1": "22.5", "2": "20" },
    "tue-lat-raise": { "0": "15", "1": "15", "2": "15" },
    "tue-pec-arsenal": { "0": "99.5", "1": "99.5", "2": "99.5" },
    "tue-incline-press": { "0": "27.5", "1": "25", "2": "25" },
    "wed-russian": { "0": "15", "1": "15", "2": "15" },
    "wed-lunge": { "0": "40", "1": "40", "2": "40", "3": "40" },
    "wed-copenhagen": { "0": "BW", "1": "BW", "2": "BW" },
    "thu-preacher": { "0": "35", "1": "35", "2": "35" },
    "thu-tri-bar": { "0": "46.25", "1": "46.25", "2": "46.25" },
    "thu-tri-rope": { "0": "18.75", "1": "18.75", "2": "18.75" },
    "thu-face-pull": { "0": "23.75", "1": "28.75", "2": "28.75" },
    "thu-cable-row": { "0": "65", "1": "65", "2": "65" },
    "thu-lat-pull": { "0": "40", "1": "40", "2": "40" },
    "fri-squat-warm1": { "0": "40" },
    "fri-squat-warm2": { "0": "40" },
    "fri-squat-work": { "0": "80", "1": "90", "2": "90" },
    "fri-leg-curl": { "0": "54", "1": "54", "2": "54" },
    "fri-leg-ext": { "0": "75", "1": "75", "2": "61" },
    "fri-leg-press": { "0": "160", "1": "200", "2": "200" },
    "fri-calf": { "0": "65", "1": "65", "2": "65" },
    "sat-bench": { "0": "60", "1": "60", "2": "60" },
    "sat-incline": { "0": "27.5", "1": "27.5", "2": "27.5" },
    "sat-chest-press": { "0": "54", "1": "54", "2": "54" },
    "sat-decline-sit": { "0": "15", "1": "15", "2": "15" }
  },
  restDays: [],
  headerInfo: {
    name: "Isaiah's Training Program",
    subtitle: "7-Day Split"
  },
  appNotes: "Stay consistent and track your progress!",
  exerciseNotes: {
    "mon-incline-curl": "4 then 4 @12.5kg on set 2",
    "tue-shoulder-press": "Failure at 6 on set 2",
    "tue-pec-arsenal": "Failure on sets 2 & 3",
    "tue-incline-press": "Failure @ 7",
    "fri-squat-work": "Safety 12, resting 5",
    "fri-leg-ext": "Set 2 failure at 15"
  }
};

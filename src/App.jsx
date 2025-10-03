import React, { useEffect, useMemo, useState } from "react";

// ---- Data ---- //
const plan = {
  Push: {
    warmup: ["Dynamic upper-body mobility"],
    exercises: [
      { 
        name: "Incline Smith Machine Press (or DB/Machine)", 
        sets: 3, 
        reps: "8–12", 
        notes: "2 warm-up sets first",
        tips: "Focus on upper chest activation. Keep shoulders back and down. Control the negative. Full range of motion.",
        videoUrl: "https://www.youtube.com/watch?v=SrqOu55lrYU"
      },
      { 
        name: "Flat Machine Press", 
        sets: 3, 
        reps: "8–12",
        tips: "Squeeze chest at the top. Don't lock out elbows completely. Keep core tight throughout the movement.",
        videoUrl: "https://www.youtube.com/watch?v=gRVjAtPip0Y"
      },
      { 
        name: "Lateral Raises", 
        sets: 4, 
        reps: "10–15",
        tips: "Lead with pinkies. Slight forward lean. Control the weight down. Don't go above shoulder height.",
        videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo"
      },
      { 
        name: "Machine Triceps Extension OR Weighted Dips", 
        sets: 3, 
        reps: "8–12",
        tips: "Keep elbows tucked. Full stretch at bottom. Squeeze triceps at top. Maintain upright torso on dips.",
        videoUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU"
      },
      { 
        name: "Cable Triceps Extension (rope or cross-cable)", 
        sets: 3, 
        reps: "10–15",
        tips: "Pull rope apart at bottom. Keep upper arms stationary. Squeeze and hold for a second at bottom.",
        videoUrl: "https://www.youtube.com/watch?v=vB5OHsJ3EME"
      },
      { 
        name: "Pec Deck OR Cable Crossover", 
        sets: 2, 
        reps: "10–15",
        tips: "Focus on squeezing chest. Slow controlled movement. Feel the stretch in the chest.",
        videoUrl: "https://www.youtube.com/watch?v=Z8SACYKITKA"
      },
    ],
  },
  PullAbs: {
    warmup: ["Dynamic back/shoulder mobility"],
    exercises: [
      { 
        name: "Cable Lat Pulldown", 
        sets: 3, 
        reps: "8–12", 
        notes: "2 warm-up sets first",
        tips: "Pull to upper chest. Squeeze shoulder blades. Control the weight up. Feel the stretch at top.",
        videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc"
      },
      { 
        name: "Chest-Supported Row Machine", 
        sets: 3, 
        reps: "8–12",
        tips: "Squeeze shoulder blades together. Pull with elbows, not hands. Pause at the back. Control the negative.",
        videoUrl: "https://www.youtube.com/watch?v=xQNrFHEMhI4"
      },
      { 
        name: "Seated Hammer Curl (elbows supported)", 
        sets: 3, 
        reps: "8–12",
        tips: "Keep elbows stationary. Neutral grip throughout. Control both up and down. Squeeze at the top.",
        videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4"
      },
      { 
        name: "Single-Arm Cable Row OR Straight-Arm Pulldown", 
        sets: 3, 
        reps: "8–12",
        tips: "Row: Pull elbow back, squeeze lat. Pulldown: Keep arms straight, pull with lats.",
        videoUrl: "https://www.youtube.com/watch?v=GZbfZ033f74"
      },
      { 
        name: "Bayesian Curl OR Incline DB Curl", 
        sets: 3, 
        reps: "8–12",
        tips: "Full stretch at bottom. Keep shoulders back. Squeeze biceps at top. Control the negative.",
        videoUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8"
      },
    ],
    abs: [
      { 
        name: "Weighted Cable Crunch", 
        sets: 3, 
        reps: "10–15",
        tips: "Pull with abs, not arms. Crunch down and forward. Slow controlled movement. Feel the abs working.",
        videoUrl: "https://www.youtube.com/watch?v=Xyd_fa5zoEU"
      },
      { 
        name: "Leg Raises (sit-up bench preferred)", 
        sets: 3, 
        reps: "10–15",
        tips: "Control the legs down slowly. Don't swing. Keep lower back pressed down. Focus on lower abs.",
        videoUrl: "https://www.youtube.com/watch?v=JB2oyawG9KI"
      },
    ],
  },
  LegsA: {
    title: "Hamstring-Focused (Variant A)",
    warmup: ["5–10 min dynamic + Walking Lunges"],
    exercises: [
      { 
        name: "Seated Hamstring Curl", 
        sets: 3, 
        reps: "8–12", 
        notes: "2 quick warm-up sets first",
        tips: "Squeeze hamstrings at top. Control the negative. Keep hips pressed back. Full range of motion.",
        videoUrl: "https://www.youtube.com/watch?v=1Tq3QdYUuHs"
      },
      { 
        name: "Smith or Hack Squat (feet higher)", 
        sets: 3, 
        reps: "6–10",
        tips: "Feet higher targets hamstrings/glutes. Deep squat. Drive through heels. Keep knees in line with toes.",
        videoUrl: "https://www.youtube.com/watch?v=EdtaJRBqka8"
      },
      { 
        name: "Stiff-Leg Deadlift (Pit Shark/BB/Smith)", 
        sets: 3, 
        reps: "8–12",
        tips: "Hinge at hips. Keep legs slightly bent. Feel stretch in hamstrings. Drive hips forward.",
        videoUrl: "https://www.youtube.com/watch?v=1uDiW5--rAE"
      },
      { 
        name: "Bulgarian Split Squat", 
        sets: 2, 
        reps: "8–12",
        tips: "Most weight on front leg. Keep torso upright. Drive through front heel. Control the descent.",
        videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE"
      },
      { 
        name: "Abductors", 
        sets: 3, 
        reps: "10–15",
        tips: "Squeeze glutes outward. Control the weight back in. Keep core tight. Full range of motion.",
        videoUrl: "https://www.youtube.com/watch?v=YzEYj_PKdB4"
      },
    ],
  },
  LegsB: {
    title: "Quad-Focused (Variant B)",
    warmup: ["Dynamic + Seated Leg Curl for knees"],
    exercises: [
      { 
        name: "Hack or Smith Squat (feet lower)", 
        sets: 3, 
        reps: "6–10",
        tips: "Feet lower targets quads. Keep chest up. Drive through heels. Controlled descent.",
        videoUrl: "https://www.youtube.com/watch?v=EdtaJRBqka8"
      },
      { 
        name: "Leg Extension", 
        sets: 3, 
        reps: "12–15 (8–12 if heavy)",
        tips: "Squeeze quads at top. Control the negative. Keep back against pad. Point toes up.",
        videoUrl: "https://www.youtube.com/watch?v=YyvSfVjQeL0"
      },
      { 
        name: "Adduction Machine", 
        sets: 3, 
        reps: "10–15",
        tips: "Squeeze inner thighs together. Control the weight back out. Keep core engaged.",
        videoUrl: "https://www.youtube.com/watch?v=NImeGqz15Pg"
      },
      { 
        name: "Calf Raises (Smith + step)", 
        sets: 4, 
        reps: "8–15",
        tips: "Full stretch at bottom. Rise high on toes. Squeeze calves at top. Control the descent.",
        videoUrl: "https://www.youtube.com/watch?v=gwLzBJYoWlI"
      },
    ],
  },
  Upper: {
    warmup: ["Light shoulder/chest mobility"],
    notes: [
      "Alternate starting with Chest or Back each week.",
      "Add an Overhead Press variation every other week.",
    ],
    exercises: [
      { section: "Chest", items: [
        { 
          name: "Incline Press Variation", 
          sets: 3, 
          reps: "8–12",
          tips: "Focus on upper chest. Squeeze at top. Control the negative. Full range of motion.",
          videoUrl: "https://www.youtube.com/watch?v=SrqOu55lrYU"
        },
        { 
          name: "Flat Press Variation", 
          sets: 2, 
          reps: "8–12",
          tips: "Squeeze chest at top. Keep shoulders back. Control both up and down phases.",
          videoUrl: "https://www.youtube.com/watch?v=gRVjAtPip0Y"
        },
      ]},
      { section: "Back", items: [
        { 
          name: "Lat Pulldown", 
          sets: 3, 
          reps: "8–12",
          tips: "Pull to upper chest. Squeeze shoulder blades. Control the weight up. Feel the stretch.",
          videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc"
        },
        { 
          name: "Single-Arm Cable Row", 
          sets: 2, 
          reps: "8–12",
          tips: "Pull elbow back. Squeeze lat. Keep core tight. Control the negative.",
          videoUrl: "https://www.youtube.com/watch?v=GZbfZ033f74"
        },
      ]},
      { section: "Shoulders", items: [
        { 
          name: "Lateral Raises", 
          sets: 4, 
          reps: "10–15",
          tips: "Lead with pinkies. Slight forward lean. Control down. Don't go above shoulder height.",
          videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo"
        },
      ]},
      { section: "Arms", items: [
        { 
          name: "Biceps Curl Variation", 
          sets: 3, 
          reps: "8–12",
          tips: "Keep elbows stationary. Full range of motion. Squeeze biceps at top. Control negative.",
          videoUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
        },
        { 
          name: "Triceps Variation", 
          sets: 3, 
          reps: "8–12",
          tips: "Keep elbows tucked. Full stretch at bottom. Squeeze triceps at top. Control the movement.",
          videoUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU"
        },
      ]},
    ],
  },
};

const dayOrder = ["Push", "Pull & Abs", "Rest", "Leg Day", "Upper Body", "Rest (2)"];

function classNames(...cls) {
  return cls.filter(Boolean).join(" ");
}

const storageKey = "sixDaySplitTracker_v1";

export default function App() {
  const [legVariant, setLegVariant] = useState("A"); // A = Hamstrings, B = Quads
  const [todayIndex, setTodayIndex] = useState(getTodayIndex());
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [showExerciseTips, setShowExerciseTips] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : { notes: "", history: {} };
    } catch (e) {
      return { notes: "", history: {} };
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentDayLabel = dayOrder[todayIndex];

  const { blocks, titleSuffix } = useMemo(() => {
    switch (currentDayLabel) {
      case "Push":
        return { titleSuffix: "— Chest-focused Push", blocks: buildSimpleBlock(plan.Push) };
      case "Pull & Abs":
        return { titleSuffix: "— Back-focused Pull + Abs", blocks: buildPullAbsBlock(plan.PullAbs) };
      case "Leg Day": {
        const leg = legVariant === "A" ? plan.LegsA : plan.LegsB;
        return { titleSuffix: `— ${leg.title}`, blocks: buildSimpleBlock(leg) };
      }
      case "Upper Body":
        return { titleSuffix: "— Full Upper", blocks: buildUpperBlock(plan.Upper) };
      default:
        return { titleSuffix: "— Rest & Recovery", blocks: [] };
    }
  }, [currentDayLabel, legVariant]);

  const dateKey = new Date().toISOString().slice(0, 10); // compute each render
  const sessionKey = `${dateKey}_${currentDayLabel}_LV${legVariant}`;
  const session = data.history[sessionKey] || { completed: {}, notes: "" };

  const toggleSet = (exIndex, setIndex) => {
    const key = `${exIndex}_${setIndex}`;
    const isCurrentlyCompleted = session.completed[key];
    const newCompleted = { ...session.completed };
    
    if (isCurrentlyCompleted) {
      // If unchecking a set, uncheck this set and all sets after it for this exercise
      for (let i = setIndex; i < 10; i++) { // Assuming max 10 sets per exercise
        const laterKey = `${exIndex}_${i}`;
        delete newCompleted[laterKey];
      }
    } else {
      // If checking a set, auto-complete all previous sets for this exercise
      for (let i = 0; i <= setIndex; i++) {
        const prevKey = `${exIndex}_${i}`;
        newCompleted[prevKey] = true;
      }
    }
    
    setData((d) => ({
      ...d,
      history: { ...d.history, [sessionKey]: { ...session, completed: newCompleted } },
    }));
  };

  const updateSessionNotes = (txt) => {
    setData((d) => ({
      ...d,
      history: { ...d.history, [sessionKey]: { ...session, notes: txt } },
    }));
  };

  const clearToday = () => {
    setData((d) => ({
      ...d,
      history: { ...d.history, [sessionKey]: { completed: {}, notes: "" } },
    }));
  };

  const clearWeek = () => {
    if (!confirm('Are you sure you want to clear all workouts for this week? This action cannot be undone.')) {
      return;
    }
    
    setData((d) => {
      const newHistory = { ...d.history };
      
      // Clear all sessions for the current date across all days and both leg variants
      dayOrder.forEach(day => {
        const keyA = `${dateKey}_${day}_LVA`;
        const keyB = `${dateKey}_${day}_LVB`;
        delete newHistory[keyA];
        delete newHistory[keyB];
      });
      
      return { ...d, history: newHistory };
    });
  };

  const selectDay = (dayIndex) => {
    setTodayIndex(dayIndex);
    setShowDaySelector(false);
  };

  const openExerciseTips = (exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseTips(true);
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Workout Tracker</h1>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-2 rounded-2xl shadow bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              onClick={() => setTodayIndex((i) => (i + dayOrder.length - 1) % dayOrder.length)}
            >◀</button>
            <button 
              className="px-3 py-2 rounded-2xl bg-white dark:bg-gray-800 shadow text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => setShowDaySelector(true)}
            >
              {currentDayLabel}
            </button>
            <button
              className="px-3 py-2 rounded-2xl shadow bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              onClick={() => setTodayIndex((i) => (i + 1) % dayOrder.length)}
            >▶</button>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Leg Variant</span>
              <div className="flex gap-2">
                <button
                  className={classNames(
                    "px-3 py-1 rounded-full text-sm border",
                    legVariant === "A" 
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                      : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                  )}
                  onClick={() => setLegVariant("A")}
                >A (Hamstrings)</button>
                <button
                  className={classNames(
                    "px-3 py-1 rounded-full text-sm border",
                    legVariant === "B" 
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                      : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                  )}
                  onClick={() => setLegVariant("B")}
                >B (Quads)</button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Session</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={clearToday}>Clear Today</button>
                <button className="px-3 py-1 rounded-full text-sm border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={clearWeek}>Clear Week</button>
              </div>
            </div>
          </div>
        </div>

        {/* Day Selector Modal */}
        {showDaySelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-sm w-full p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Select Workout Day</h3>
              <div className="space-y-2">
                {dayOrder.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => selectDay(index)}
                    className={classNames(
                      "w-full p-3 rounded-xl text-left transition-colors",
                      index === todayIndex
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-2 border-blue-200 dark:border-blue-700"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent"
                    )}
                  >
                    <div className="font-medium">{day}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {day === "Push" && "Chest-focused Push"}
                      {day === "Pull & Abs" && "Back-focused Pull + Abs"}
                      {day === "Leg Day" && `${legVariant === "A" ? "Hamstring-Focused" : "Quad-Focused"} (Variant ${legVariant})`}
                      {day === "Upper Body" && "Full Upper"}
                      {(day === "Rest" || day === "Rest (2)") && "Rest & Recovery"}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDaySelector(false)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Exercise Tips Modal */}
        {showExerciseTips && selectedExercise && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold pr-4">{selectedExercise.name}</h3>
                <button
                  onClick={() => setShowExerciseTips(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close tips"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">Exercise Tips</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedExercise.tips}
                  </p>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <strong>Sets:</strong> {selectedExercise.sets} • <strong>Reps:</strong> {selectedExercise.reps}
                  {selectedExercise.notes && (
                    <div className="mt-2">
                      <strong>Note:</strong> {selectedExercise.notes}
                    </div>
                  )}
                </div>
                
                {selectedExercise.videoUrl && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Video Tutorial</h4>
                    <a
                      href={selectedExercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowExerciseTips(false)}
                className="w-full mt-6 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-1">{currentDayLabel} <span className="text-gray-500 dark:text-gray-400 text-base">{titleSuffix}</span></h2>
          {blocks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">Rest & recovery. Get steps in, mobility, and prep meals.</p>
          ) : (
            <div className="space-y-5">
              {(() => {
                let globalExIndex = 0;
                return blocks.map((block, idx) => (
                  <section key={idx} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                    <h3 className="font-semibold mb-2 flex items-center justify-between">
                      <span>{block.title}</span>
                      {block.subtitle && <span className="text-sm text-gray-500 dark:text-gray-400">{block.subtitle}</span>}
                    </h3>
                    {block.warmup && (
                      <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {block.warmup.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    )}
                    <div className="space-y-3">
                      {block.items.map((ex, localExIndex) => {
                        const currentGlobalIndex = globalExIndex++;
                        return (
                          <div key={localExIndex} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">{ex.name}</div>
                                  {ex.tips && (
                                    <button
                                      onClick={() => openExerciseTips(ex)}
                                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                      aria-label={`View tips for ${ex.name}`}
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Sets: {ex.sets} • Reps: {ex.reps}</div>
                                {ex.notes && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ex.notes}</div>}
                              </div>
                              <div className="flex gap-1 flex-wrap">
                                {Array.from({ length: ex.sets }).map((_, setIdx) => {
                                  const key = `${currentGlobalIndex}_${setIdx}`;
                                  const done = !!session.completed[key];
                                  return (
                                    <button
                                      key={key}
                                      onClick={() => toggleSet(currentGlobalIndex, setIdx)}
                                      className={classNames(
                                        "w-8 h-8 rounded-full border text-sm font-semibold",
                                        done 
                                          ? "bg-green-600 text-white border-green-600" 
                                          : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                                      )}
                                      aria-label={`Toggle set ${setIdx + 1} for ${ex.name}`}
                                    >{setIdx + 1}</button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ));
              })()}

              <section className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                <h3 className="font-semibold mb-2">Session Notes</h3>
                <textarea
                  value={session.notes || ""}
                  onChange={(e) => updateSessionNotes(e.target.value)}
                  placeholder="Load used, RPE, tweaks, substitutions…"
                  className="w-full min-h-[100px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl p-3 focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </section>
            </div>
          )}
        </main>

        <footer className="mt-6 space-y-3">
          <div className="flex justify-center">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Tip: If a machine is taken, swap to a close alternative; keep the stimulus hard & joint-friendly.</p>
            <p>Data saves to your browser (localStorage).</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Helpers
function buildSimpleBlock(section) {
  return [{
    title: "Main Workout",
    subtitle: "Follow sets & reps as listed",
    warmup: section.warmup,
    items: section.exercises,
  }];
}
function buildPullAbsBlock(section) {
  return [
    { title: "Pull — Back & Biceps", subtitle: "Back-focused", warmup: section.warmup, items: section.exercises },
    { title: "Abs (once per week — do after Pull)", subtitle: "Progressive overload on cables", items: section.abs?.map(a => ({ ...a, notes: undefined })) || [] },
  ];
}
function buildUpperBlock(section) {
  return [
    { title: "Chest Block", subtitle: "Start with Chest or Back (alternate weekly)", warmup: section.warmup, items: section.exercises.find(b=>b.section==='Chest').items },
    { title: "Back Block", subtitle: "Lat focus", items: section.exercises.find(b=>b.section==='Back').items },
    { title: "Shoulders", items: section.exercises.find(b=>b.section==='Shoulders').items },
    { title: "Arms", items: section.exercises.find(b=>b.section==='Arms').items },
  ];
}
function getTodayIndex() {
  const now = new Date();
  const jsDay = now.getDay();
  const monday0 = (jsDay + 6) % 7;
  return Math.min(monday0, 5);
}

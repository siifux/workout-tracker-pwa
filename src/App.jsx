import React, { useEffect, useMemo, useState } from "react";

// ---- Data ---- //
const plan = {
  Push: {
    warmup: ["Dynamic upper-body mobility"],
    exercises: [
      { name: "Incline Smith Machine Press (or DB/Machine)", sets: 3, reps: "8–12", notes: "2 warm-up sets first" },
      { name: "Flat Machine Press", sets: 3, reps: "8–12" },
      { name: "Lateral Raises", sets: 4, reps: "10–15" },
      { name: "Machine Triceps Extension OR Weighted Dips", sets: 3, reps: "8–12" },
      { name: "Cable Triceps Extension (rope or cross-cable)", sets: 3, reps: "10–15" },
      { name: "Pec Deck OR Cable Crossover", sets: 2, reps: "10–15" },
    ],
  },
  PullAbs: {
    warmup: ["Dynamic back/shoulder mobility"],
    exercises: [
      { name: "Cable Lat Pulldown", sets: 3, reps: "8–12", notes: "2 warm-up sets first" },
      { name: "Chest-Supported Row Machine", sets: 3, reps: "8–12" },
      { name: "Seated Hammer Curl (elbows supported)", sets: 3, reps: "8–12" },
      { name: "Single-Arm Cable Row OR Straight-Arm Pulldown", sets: 3, reps: "8–12" },
      { name: "Bayesian Curl OR Incline DB Curl", sets: 3, reps: "8–12" },
    ],
    abs: [
      { name: "Weighted Cable Crunch", sets: 3, reps: "10–15" },
      { name: "Leg Raises (sit-up bench preferred)", sets: 3, reps: "10–15" },
    ],
  },
  LegsA: {
    title: "Hamstring-Focused (Variant A)",
    warmup: ["5–10 min dynamic + Walking Lunges"],
    exercises: [
      { name: "Seated Hamstring Curl", sets: 3, reps: "8–12", notes: "2 quick warm-up sets first" },
      { name: "Smith or Hack Squat (feet higher)", sets: 3, reps: "6–10" },
      { name: "Stiff-Leg Deadlift (Pit Shark/BB/Smith)", sets: 3, reps: "8–12" },
      { name: "Bulgarian Split Squat", sets: 2, reps: "8–12" },
      { name: "Abductors", sets: 3, reps: "10–15" },
    ],
  },
  LegsB: {
    title: "Quad-Focused (Variant B)",
    warmup: ["Dynamic + Seated Leg Curl for knees"],
    exercises: [
      { name: "Hack or Smith Squat (feet lower)", sets: 3, reps: "6–10" },
      { name: "Leg Extension", sets: 3, reps: "12–15 (8–12 if heavy)" },
      { name: "Adduction Machine", sets: 3, reps: "10–15" },
      { name: "Calf Raises (Smith + step)", sets: 4, reps: "8–15" },
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
        { name: "Incline Press Variation", sets: 3, reps: "8–12" },
        { name: "Flat Press Variation", sets: 2, reps: "8–12" },
      ]},
      { section: "Back", items: [
        { name: "Lat Pulldown", sets: 3, reps: "8–12" },
        { name: "Single-Arm Cable Row", sets: 2, reps: "8–12" },
      ]},
      { section: "Shoulders", items: [
        { name: "Lateral Raises", sets: 4, reps: "10–15" },
      ]},
      { section: "Arms", items: [
        { name: "Biceps Curl Variation", sets: 3, reps: "8–12" },
        { name: "Triceps Variation", sets: 3, reps: "8–12" },
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
                              <div>
                                <div className="font-medium">{ex.name}</div>
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

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
    title: "Hamstring-Focused (Week A)",
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
    title: "Quad-Focused (Week B)",
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
  const [weekType, setWeekType] = useState("A"); // A = Hamstrings, B = Quads
  const [todayIndex, setTodayIndex] = useState(getTodayIndex());
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

  const currentDayLabel = dayOrder[todayIndex];

  const { blocks, titleSuffix } = useMemo(() => {
    switch (currentDayLabel) {
      case "Push":
        return { titleSuffix: "— Chest-focused Push", blocks: buildSimpleBlock(plan.Push) };
      case "Pull & Abs":
        return { titleSuffix: "— Back-focused Pull + Abs", blocks: buildPullAbsBlock(plan.PullAbs) };
      case "Leg Day": {
        const leg = weekType === "A" ? plan.LegsA : plan.LegsB;
        return { titleSuffix: `— ${leg.title}`, blocks: buildSimpleBlock(leg) };
      }
      case "Upper Body":
        return { titleSuffix: "— Full Upper", blocks: buildUpperBlock(plan.Upper) };
      default:
        return { titleSuffix: "— Rest & Recovery", blocks: [] };
    }
  }, [currentDayLabel, weekType]);

  const dateKey = new Date().toISOString().slice(0, 10); // compute each render
  const sessionKey = `${dateKey}_${currentDayLabel}_W${weekType}`;
  const session = data.history[sessionKey] || { completed: {}, notes: "" };

  const toggleSet = (exIndex, setIndex) => {
    const key = `${exIndex}_${setIndex}`;
    const completed = { ...session.completed, [key]: !session.completed[key] };
    setData((d) => ({
      ...d,
      history: { ...d.history, [sessionKey]: { ...session, completed } },
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

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout-tracker-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        setData(json);
      } catch (e) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">6-Day Workout Split Tracker</h1>
            <p className="text-sm text-gray-600">Exact exercises from the video • One leg day (alternating Week A/B)</p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 text-sm"
              onClick={() => setTodayIndex((i) => (i + dayOrder.length - 1) % dayOrder.length)}
            >◀</button>
            <div className="px-3 py-2 rounded-2xl bg-white shadow text-sm font-medium">
              {currentDayLabel}
            </div>
            <button
              className="px-3 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 text-sm"
              onClick={() => setTodayIndex((i) => (i + 1) % dayOrder.length)}
            >▶</button>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-white rounded-2xl shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Week</span>
              <div className="flex gap-2">
                <button
                  className={classNames(
                    "px-3 py-1 rounded-full text-sm border",
                    weekType === "A" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"
                  )}
                  onClick={() => setWeekType("A")}
                >A (Hamstrings)</button>
                <button
                  className={classNames(
                    "px-3 py-1 rounded-full text-sm border",
                    weekType === "B" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"
                  )}
                  onClick={() => setWeekType("B")}
                >B (Quads)</button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Data</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-full text-sm border hover:bg-gray-100" onClick={exportData}>Export</button>
                <label className="px-3 py-1 rounded-full text-sm border hover:bg-gray-100 cursor-pointer">
                  Import
                  <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && importData(e.target.files[0])} />
                </label>
                <button className="px-3 py-1 rounded-full text-sm border hover:bg-gray-100" onClick={clearToday}>Clear Today</button>
              </div>
            </div>
          </div>
        </div>

        <main className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-1">{currentDayLabel} <span className="text-gray-500 text-base">{titleSuffix}</span></h2>
          {blocks.length === 0 ? (
            <p className="text-gray-600">Rest & recovery. Get steps in, mobility, and prep meals.</p>
          ) : (
            <div className="space-y-5">
              {blocks.map((block, idx) => (
                <section key={idx} className="border rounded-2xl p-4">
                  <h3 className="font-semibold mb-2 flex items-center justify-between">
                    <span>{block.title}</span>
                    {block.subtitle && <span className="text-sm text-gray-500">{block.subtitle}</span>}
                  </h3>
                  {block.warmup && (
                    <ul className="list-disc ml-5 text-sm text-gray-700 mb-3">
                      {block.warmup.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  )}
                  <div className="space-y-3">
                    {block.items.map((ex, exIndex) => (
                      <div key={exIndex} className="rounded-xl border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">{ex.name}</div>
                            <div className="text-sm text-gray-600">Sets: {ex.sets} • Reps: {ex.reps}</div>
                            {ex.notes && <div className="text-xs text-gray-500 mt-1">{ex.notes}</div>}
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {Array.from({ length: ex.sets }).map((_, setIdx) => {
                              const key = `${exIndex}_${setIdx}`;
                              const done = !!session.completed[key];
                              return (
                                <button
                                  key={key}
                                  onClick={() => toggleSet(exIndex, setIdx)}
                                  className={classNames(
                                    "w-8 h-8 rounded-full border text-sm font-semibold",
                                    done ? "bg-green-600 text-white border-green-600" : "bg-white hover:bg-gray-100"
                                  )}
                                  aria-label={`Toggle set ${setIdx + 1} for ${ex.name}`}
                                >{setIdx + 1}</button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <section className="border rounded-2xl p-4">
                <h3 className="font-semibold mb-2">Session Notes</h3>
                <textarea
                  value={session.notes || ""}
                  onChange={(e) => updateSessionNotes(e.target.value)}
                  placeholder="Load used, RPE, tweaks, substitutions…"
                  className="w-full min-h-[100px] border rounded-xl p-3 focus:outline-none focus:ring"
                />
              </section>
            </div>
          )}
        </main>

        <footer className="text-xs text-gray-500 mt-6 space-y-1">
          <p>Tip: If a machine is taken, swap to a close alternative; keep the stimulus hard & joint-friendly.</p>
          <p>Data saves to your browser (localStorage). Use Export/Import to move between devices.</p>
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

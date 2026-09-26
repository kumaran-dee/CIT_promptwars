import React, { useState } from "react";
import { useSkillForge } from "../../context/SkillForgeContext";
import {
  BookOpen, CheckCircle2, Clock, FileText, Code, Database, ArrowRight,
  Lock, HelpCircle, ExternalLink, AlertTriangle,
  Zap, XCircle, Eye, EyeOff, Brain, Lightbulb, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Language display config
const LANG_CONFIG = {
  python:     { label: "Python",      color: "bg-blue-900 text-blue-200",    dot: "bg-blue-400" },
  javascript: { label: "JavaScript",  color: "bg-yellow-900 text-yellow-200",dot: "bg-yellow-400" },
  cpp:        { label: "C++",         color: "bg-cyan-900 text-cyan-200",    dot: "bg-cyan-400" },
  java:       { label: "Java",        color: "bg-orange-900 text-orange-200",dot: "bg-orange-400" },
  mysql:      { label: "MySQL",       color: "bg-sky-900 text-sky-200",      dot: "bg-sky-400" },
  postgresql: { label: "PostgreSQL",  color: "bg-indigo-900 text-indigo-200",dot: "bg-indigo-400" },
  mssql:      { label: "SQL Server",  color: "bg-red-900 text-red-200",      dot: "bg-red-400" },
  sqlite:     { label: "SQLite",      color: "bg-teal-900 text-teal-200",    dot: "bg-teal-400" }
};

export const LearnPage = () => {
  const { learnModules, leetCodeStudyCases, value2, completeLesson, setActiveTab, user } = useSkillForge();

  const categories = ["All", "DBMS", "Programming", "Data Structures", "Aptitude"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [questionAnswer, setQuestionAnswer] = useState(null);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeLang, setActiveLang] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Sort: unsolved LC first, completed last
  const sortedModules = [...learnModules].sort((a, b) => {
    const aLCSolved = a.linkedLeetCodeId ? (value2.leetCodeSolvedCases || []).includes(a.linkedLeetCodeId) : true;
    const bLCSolved = b.linkedLeetCodeId ? (value2.leetCodeSolvedCases || []).includes(b.linkedLeetCodeId) : true;
    const aCompleted = value2.topicsStudied.includes(a.title);
    const bCompleted = value2.topicsStudied.includes(b.title);
    if (!aLCSolved && !aCompleted && (bLCSolved || bCompleted)) return -1;
    if (!bLCSolved && !bCompleted && (aLCSolved || aCompleted)) return 1;
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;
    return 0;
  });

  const filteredModules = selectedCategory === "All"
    ? sortedModules
    : sortedModules.filter(m => m.category === selectedCategory);

  const [selectedModule, setSelectedModule] = useState(filteredModules[0] || learnModules[0]);

  const linkedLC = selectedModule.linkedLeetCodeId
    ? leetCodeStudyCases.find(lc => lc.id === selectedModule.linkedLeetCodeId)
    : null;

  const isLCSolved = linkedLC ? (value2.leetCodeSolvedCases || []).includes(linkedLC.id) : true;
  const isTopicCompleted = value2.topicsStudied.includes(selectedModule.title);
  const canMarkCompleted = isLCSolved;

  const availableLangs = linkedLC?.solutions ? Object.keys(linkedLC.solutions) : [];
  const currentLang = activeLang && availableLangs.includes(activeLang) ? activeLang : availableLangs[0] || null;

  const handleSelectModule = (mod) => {
    setSelectedModule(mod);
    setQuestionAnswer(null);
    setQuestionSubmitted(false);
    setShowSolution(false);
    setShowHint(false);
    setActiveLang(null);
  };

  const handleMarkCompleted = () => {
    if (!isTopicCompleted && canMarkCompleted) {
      completeLesson(selectedModule);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const lcStatusForModule = (mod) => {
    if (!mod.linkedLeetCodeId) return "no-lc";
    if ((value2.leetCodeSolvedCases || []).includes(mod.linkedLeetCodeId)) return "solved";
    return "unsolved";
  };

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-200 border border-white/20 flex items-center gap-1.5">
                <Code size={13} className="text-yellow-300" /> LeetCode-Driven Learn Center
              </span>
              <span className="text-xs font-medium text-slate-300">{user.leetCodeHandle}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Placement Training & Learn Center</h2>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-xl">
              Each topic is linked to a real LeetCode problem. Read the description, understand the logic, check your understanding, then reveal the solution in all languages!
            </p>
          </div>
          <div className="text-right bg-white/10 p-3 rounded-xl border border-white/15">
            <span className="text-xs text-blue-200 block">Topics Completed</span>
            <span className="text-xl font-extrabold text-white">{value2.topicsStudied.length} / {learnModules.length}</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat, idx) => (
          <button key={idx} onClick={() => setSelectedCategory(cat)}
            className={"px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer " +
              (selectedCategory === cat ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80")}>
            {cat}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Module List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Modules ({filteredModules.length})
          </h3>
          <div className="space-y-2.5">
            {filteredModules.map(mod => {
              const completed = value2.topicsStudied.includes(mod.title);
              const isSelected = selectedModule.id === mod.id;
              const lcStatus = lcStatusForModule(mod);
              const lc = mod.linkedLeetCodeId ? leetCodeStudyCases.find(l => l.id === mod.linkedLeetCodeId) : null;

              return (
                <motion.div key={mod.id} whileHover={{ x: 3 }} onClick={() => handleSelectModule(mod)}
                  className={"glass-card p-4 cursor-pointer transition border " + (isSelected ? "glass-card-active" : "hover:border-blue-300")}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">{mod.category}</span>
                    {completed ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200"><CheckCircle2 size={10} /> Completed</span>
                    ) : lcStatus === "unsolved" ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200"><Lock size={10} /> LC Required</span>
                    ) : lcStatus === "solved" ? (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">LC Solved</span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">{mod.duration}</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{mod.title}</h4>
                  {lc && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 " + (lcStatus === "solved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")}>
                        <Code size={8} /> {lc.title.split(".")[0]} - {lc.difficulty}
                      </span>
                      <span className="text-[9px] text-slate-400">{lc.tags[0]}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Learning Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">

          {/* Module Header Card */}
          <div className="glass-card p-5">
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200/70 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{selectedModule.category}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={13} /> {selectedModule.duration}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{selectedModule.level} Level</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedModule.title}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">{selectedModule.summary}</p>
              </div>
              {isTopicCompleted ? (
                <span className="px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} /> Topic Completed
                </span>
              ) : canMarkCompleted ? (
                <button onClick={handleMarkCompleted}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition">
                  <CheckCircle2 size={16} /> Mark as Completed
                </button>
              ) : (
                <div className="text-right">
                  <button disabled className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300">
                    <Lock size={16} /> Complete LeetCode First
                  </button>
                  {linkedLC && (
                    <p className="text-[10px] text-amber-700 mt-1 font-medium">
                      Solve <a href={"https://leetcode.com/problems/" + linkedLC.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "/"} target="_blank" rel="noreferrer" className="underline font-bold">{linkedLC.title}</a> to unlock
                    </p>
                  )}
                </div>
              )}
            </div>

            {linkedLC && !isLCSolved && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                  <div className="text-xs">
                    <strong className="text-amber-900">LeetCode Required:</strong>
                    <span className="text-amber-800 ml-1">Solve <strong>{linkedLC.title}</strong> ({linkedLC.difficulty}) to unlock completion.</span>
                  </div>
                </div>
                <a href={"https://leetcode.com/problems/" + linkedLC.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "/"} target="_blank" rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] whitespace-nowrap flex items-center gap-1 cursor-pointer transition">
                  Open LC <ExternalLink size={11} />
                </a>
              </div>
            )}
            {linkedLC && isLCSolved && !isTopicCompleted && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <strong>LeetCode Solved!</strong>&nbsp;{linkedLC.title} is done on your profile. Click "Mark as Completed" to save to Value 2!
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════ */}
          {/* SECTION 1: CODE DESCRIPTION                           */}
          {/* ══════════════════════════════════════════════════════ */}
          {linkedLC && (
            <div className="glass-card p-6 border-l-4 border-l-blue-500 space-y-5">

              {/* Problem Header */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={"text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5 " + (linkedLC.difficulty === "Easy" ? "bg-emerald-100 text-emerald-800" : linkedLC.difficulty === "Medium" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800")}>
                    <Code size={12} /> {linkedLC.difficulty}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">{linkedLC.title}</h4>
                  {isLCSolved ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Solved on LC</span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock size={10} /> Not Solved</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Acceptance: {linkedLC.acceptance}</span>
                  <a href={"https://leetcode.com/problems/" + linkedLC.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "/"}
                    target="_blank" rel="noreferrer"
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5 font-bold">LC <ExternalLink size={11} /></a>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {linkedLC.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">#{tag}</span>
                ))}
              </div>

              {/* Problem Statement */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <HelpCircle size={13} className="text-blue-600" /> Problem Statement
                </h5>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
                  {linkedLC.description}
                </div>
              </div>

              {/* Code Description */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Brain size={13} className="text-purple-600" /> Code Description & Approach
                </h5>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-sm text-purple-950 leading-relaxed">
                  {linkedLC.codeDescription}
                </div>
              </div>

              {/* Step-by-step Logic */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText size={13} className="text-blue-600" /> Step-by-Step Logic
                </h5>
                <div className="space-y-2">
                  {linkedLC.steps && linkedLC.steps.map((step, si) => (
                    <motion.div key={si} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.07 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">{si + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hint (collapsible) */}
              {linkedLC.hint && (
                <div className="space-y-2">
                  <button onClick={() => setShowHint(!showHint)}
                    className={"w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition cursor-pointer border " + (showHint ? "bg-amber-100 border-amber-300 text-amber-900" : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100")}>
                    <span className="flex items-center gap-2">
                      <Lightbulb size={15} className="text-amber-600" />
                      {showHint ? "Hide Hint" : "Show Logic Hint (Think before revealing the answer!)"}
                    </span>
                    {showHint ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  <AnimatePresence>
                    {showHint && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-sm text-amber-950 leading-relaxed">
                        <strong>Hint:</strong> {linkedLC.hint}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Understanding Check MCQ */}
              {linkedLC.learningQuestion && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <HelpCircle size={13} className="text-blue-600" /> Understanding Check
                  </h5>
                  <div className="p-5 rounded-xl bg-white border-2 border-blue-200 shadow-xs space-y-3">
                    <p className="text-sm font-bold text-slate-900">{linkedLC.learningQuestion.question}</p>
                    <div className="space-y-2">
                      {linkedLC.learningQuestion.options.map((opt, oi) => {
                        const isSel = questionAnswer === oi;
                        let style = "bg-white border-slate-200 text-slate-800 hover:bg-blue-50/60 cursor-pointer";
                        if (questionSubmitted) {
                          if (oi === linkedLC.learningQuestion.correctIndex) style = "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold";
                          else if (isSel) style = "bg-rose-50 border-rose-400 text-rose-900";
                        } else if (isSel) {
                          style = "bg-blue-50 border-blue-500 text-blue-900 font-bold";
                        }
                        return (
                          <div key={oi} onClick={() => !questionSubmitted && setQuestionAnswer(oi)}
                            className={"p-3 rounded-xl border transition text-xs flex items-center justify-between " + style}>
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-extrabold shrink-0">
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {questionSubmitted && oi === linkedLC.learningQuestion.correctIndex && <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />}
                            {questionSubmitted && isSel && oi !== linkedLC.learningQuestion.correctIndex && <XCircle size={15} className="text-rose-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                    {!questionSubmitted ? (
                      <button onClick={() => questionAnswer !== null && setQuestionSubmitted(true)}
                        disabled={questionAnswer === null}
                        className={"px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer " +
                          (questionAnswer !== null ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
                        <Zap size={13} /> Check Answer
                      </button>
                    ) : (
                      <div className={"p-3.5 rounded-xl text-xs leading-relaxed border " +
                        (questionAnswer === linkedLC.learningQuestion.correctIndex
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                          : "bg-amber-50 border-amber-200 text-amber-900")}>
                        <p className="font-bold mb-1 flex items-center gap-1.5">
                          {questionAnswer === linkedLC.learningQuestion.correctIndex
                            ? <><CheckCircle2 size={14} className="text-emerald-600" /> Correct! Great understanding.</>
                            : <><AlertTriangle size={14} className="text-amber-600" /> Not quite — here is the explanation:</>}
                        </p>
                        <p>{linkedLC.learningQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════ */}
              {/* REVEAL ANSWER — multi-language code tabs            */}
              {/* ═══════════════════════════════════════════════════ */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Code size={13} className="text-blue-600" /> Solution in All Languages
                </h5>

                <button
                  onClick={() => setShowSolution(!showSolution)}
                  disabled={!questionSubmitted}
                  className={"w-full py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 border " +
                    (!questionSubmitted
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                      : showSolution
                        ? "bg-emerald-900 hover:bg-emerald-800 text-emerald-300 border-emerald-800 cursor-pointer shadow-md"
                        : "bg-slate-900 hover:bg-slate-800 text-emerald-400 border-slate-700 cursor-pointer shadow-md")}>
                  {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                  {!questionSubmitted
                    ? "Answer the Understanding Check above to unlock solutions"
                    : showSolution
                      ? "Hide Solutions"
                      : "Reveal Solutions in All Languages"}
                </button>

                <AnimatePresence>
                  {showSolution && currentLang && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="rounded-2xl border border-slate-800 overflow-hidden shadow-xl">

                      {/* Language Tabs */}
                      <div className="flex overflow-x-auto bg-slate-900 border-b border-slate-700">
                        {availableLangs.map(lang => {
                          const cfg = LANG_CONFIG[lang] || { label: lang, color: "bg-slate-700 text-slate-200", dot: "bg-slate-400" };
                          const isActive = currentLang === lang;
                          return (
                            <button key={lang} onClick={() => setActiveLang(lang)}
                              className={"px-4 py-2.5 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition border-b-2 cursor-pointer " +
                                (isActive
                                  ? "text-white border-blue-400 bg-slate-800"
                                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/60")}>
                              <span className={"w-2 h-2 rounded-full shrink-0 " + cfg.dot}></span>
                              {cfg.label}
                            </button>
                          );
                        })}
                        <div className="ml-auto px-4 flex items-center">
                          <span className="text-[10px] text-slate-500 font-medium">Acceptance: {linkedLC.acceptance}</span>
                        </div>
                      </div>

                      {/* Code Panel */}
                      <div className="bg-slate-950 p-5 overflow-x-auto">
                        {availableLangs.map(lang => (
                          <div key={lang} style={{ display: currentLang === lang ? "block" : "none" }}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className={"text-[10px] font-extrabold px-2 py-0.5 rounded " + (LANG_CONFIG[lang] || {}).color}>
                                {(LANG_CONFIG[lang] || { label: lang }).label}
                              </span>
                              <span className="text-[10px] text-slate-500">Optimal Solution</span>
                            </div>
                            <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                              {linkedLC.solutions[lang]}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════ */}
          {/* SECTION 2: COURSE NOTES (no video)                    */}
          {/* ══════════════════════════════════════════════════════ */}
          <div className="glass-card p-6 space-y-5">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" /> Course Notes & Examples
            </h4>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={13} className="text-blue-600" /> Placement Core Notes
              </h5>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                {selectedModule.notes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Code size={13} className="text-blue-600" /> Interactive Example
              </h5>
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800 overflow-x-auto shadow-inner">
                <pre>{selectedModule.interactiveSnippet}</pre>
              </div>
            </div>

            <div className={"p-3.5 rounded-xl text-xs flex items-center gap-3 " +
              (isTopicCompleted
                ? "bg-blue-50 border border-blue-200 text-blue-900"
                : canMarkCompleted
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border border-amber-200 text-amber-900")}>
              <Database size={18} className={"shrink-0 " + (isTopicCompleted ? "text-blue-600" : canMarkCompleted ? "text-emerald-600" : "text-amber-600")} />
              <div>
                {isTopicCompleted
                  ? <><strong>Completed!</strong> This topic is saved in Value 2 and powers your AI Placement Tests.</>
                  : canMarkCompleted
                    ? <><strong>LeetCode Solved!</strong> Click "Mark as Completed" above to save this topic to Value 2.</>
                    : <><strong>Action Required:</strong> Solve <strong>{linkedLC?.title || "the linked LeetCode problem"}</strong> on LeetCode then sync your profile to unlock completion.</>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

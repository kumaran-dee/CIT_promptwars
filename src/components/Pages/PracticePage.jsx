import React, { useState } from "react";
import { useSkillForge } from "../../context/SkillForgeContext";
import { Target, CheckCircle2, XCircle, Zap, Code, Database, ArrowRight, Brain, Sparkles, ExternalLink, AlertTriangle, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const TAG_CATEGORY_MAP = {
  "Array": { category: "Data Structures", learnTip: "Arrays are fundamental: study prefix sums, sliding window, two-pointer patterns." },
  "Hash Table": { category: "Data Structures", learnTip: "Hash maps enable O(1) lookups. Practice frequency counting and grouping problems." },
  "String": { category: "Programming", learnTip: "String manipulation is tested in almost every placement exam. Study pattern matching." },
  "Dynamic Programming": { category: "Programming", learnTip: "DP builds on solved subproblems. Start with memoization then optimize to tabulation." },
  "Tree": { category: "Data Structures", learnTip: "BST, AVL, N-ary trees are common. Study all traversal methods (DFS/BFS)." },
  "Graph": { category: "Data Structures", learnTip: "Master BFS/DFS for graphs. Study shortest path (Dijkstra) and union-find." },
  "Backtracking": { category: "Programming", learnTip: "Key for permutations/combinations. Practice N-Queens and Sudoku solver." },
  "Heap (Priority Queue)": { category: "Data Structures", learnTip: "Heaps solve K-th largest/smallest problems. Learn min-heap and max-heap patterns." },
  "Sliding Window": { category: "Programming", learnTip: "Sliding window reduces O(n^2) to O(n) for substring/subarray problems." },
  "Binary Search": { category: "Data Structures", learnTip: "Binary search works on sorted arrays. Study search on answer space problems too." },
  "Greedy": { category: "Programming", learnTip: "Greedy selects locally optimal choices. Study interval scheduling and coin change." },
  "SQL": { category: "DBMS", learnTip: "SQL joins, GROUP BY, subqueries are heavily tested. Practice LeetCode Database section." },
  "Divide and Conquer": { category: "Programming", learnTip: "D&C underpins merge sort and binary search. Study recursion tree analysis." },
  "Bit Manipulation": { category: "Programming", learnTip: "Bit operations are speed tricks. Study AND/OR/XOR patterns and power of 2 checks." },
  "Trie": { category: "Data Structures", learnTip: "Tries handle prefix searches efficiently. Key for autocomplete and word search." },
  "Linked List": { category: "Data Structures", learnTip: "Tests pointer manipulation. Study fast/slow pointers and reversal in place." },
  "Stack": { category: "Data Structures", learnTip: "Stacks solve bracket matching and monotonic stack problems. Great for placement." },
  "Two Pointers": { category: "Programming", learnTip: "Two pointers reduce O(n^2) brute force. Study sorted array and palindrome problems." },
  "Sorting": { category: "Data Structures", learnTip: "Know all sorting algorithms and complexities. Merge sort & quicksort are key." }
};

const getDifficultyColor = (d) => {
  if (d === "Easy") return "bg-emerald-100 text-emerald-800";
  if (d === "Medium") return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
};

export const PracticePage = () => {
  const { practiceQuestions, leetCodeStudyCases, leetCodeTagData, value2, user, submitPracticeAnswer, solveLeetCodeCase, setActiveTab } = useSkillForge();
  const [activeTabMode, setActiveTabMode] = useState("recommendations");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedQuestion, setSelectedQuestion] = useState(practiceQuestions[0]);
  const [selectedLCCase, setSelectedLCCase] = useState(leetCodeStudyCases[0]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [codeInputValue, setCodeInputValue] = useState(selectedQuestion.initialCode || "");
  const [attemptSubmitted, setAttemptSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const categories = ["All", "DBMS", "Programming", "Aptitude", "Data Structures"];
  const filteredQuestions = activeCategory === "All" ? practiceQuestions : practiceQuestions.filter(q => q.category === activeCategory);
  const completedLCCases = leetCodeStudyCases.filter(lc => (value2.leetCodeSolvedCases || []).includes(lc.id));
  const unsolvedLCCases = leetCodeStudyCases.filter(lc => !(value2.leetCodeSolvedCases || []).includes(lc.id));

  const unsolvedTagsToLearn = (leetCodeTagData.unsolvedTags || []).filter(t => !!TAG_CATEGORY_MAP[t.tagName]);
  const recommendationsByCategory = unsolvedTagsToLearn.reduce((acc, tag) => {
    const cat = (TAG_CATEGORY_MAP[tag.tagName] || {}).category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tag);
    return acc;
  }, {});

  const handleSelectQuestion = (q) => {
    setSelectedQuestion(q);
    setSelectedOption(null);
    setCodeInputValue(q.initialCode || "");
    setAttemptSubmitted(false);
    setIsCorrect(false);
  };

  const handleAnswerSubmit = () => {
    let correct = false;
    if (selectedQuestion.type === "MCQ" || selectedQuestion.type === "Aptitude Questions") {
      correct = selectedOption === selectedQuestion.correctIndex;
    } else {
      correct = codeInputValue.includes("return") && codeInputValue.length > 30;
    }
    setIsCorrect(correct);
    setAttemptSubmitted(true);
    submitPracticeAnswer(selectedQuestion, correct, 45);
    if (correct) confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
  };

  const handleSolveLeetCode = (lcCase) => {
    solveLeetCodeCase(lcCase);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 pb-12">

      {/* Top Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-200 border border-white/20 flex items-center gap-1.5">
                <Code size={13} className="text-yellow-300" /> LeetCode Profile Integration
              </span>
              <span className="text-xs font-medium text-slate-300">Handle: {user.leetCodeHandle}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">LeetCode Access &amp; Technical Lab</h2>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-xl">
              Completed problems unlock AI tests. Unsolved topics guide your personalized study queue!
            </p>
          </div>
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 text-right space-y-1">
            <div className="flex items-center justify-end gap-1 text-xs font-bold text-emerald-300">
              <CheckCircle2 size={14} /> {completedLCCases.length} Used for Tests
            </div>
            <span className="text-xl font-extrabold text-white">{completedLCCases.length} / {leetCodeStudyCases.length}</span>
            <span className="block text-[10px] text-amber-300">{unsolvedLCCases.length} Help to Learn Pending</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex gap-3 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: "recommendations", icon: <TrendingUp size={15} />, label: "What to Learn Next", badge: unsolvedTagsToLearn.length },
          { key: "leetcode", icon: <Code size={15} />, label: "LeetCode Study Cases", badge: unsolvedLCCases.length },
          { key: "drills", icon: <Target size={15} />, label: "MCQ & Aptitude Drills", badge: null }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTabMode(tab.key)}
            className={"px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap " + (activeTabMode === tab.key ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200")}
          >
            {tab.icon} {tab.label}
            {tab.badge > 0 && <span className="bg-amber-400 text-amber-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* TAB 1: WHAT TO LEARN NEXT */}
      {activeTabMode === "recommendations" && (
        <div className="space-y-6">
          <div className={"p-4 rounded-xl border flex items-start gap-3 text-xs " + (leetCodeTagData.isFetched ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900")}>
            <Sparkles size={18} className={"shrink-0 mt-0.5 " + (leetCodeTagData.isFetched ? "text-emerald-600" : "text-amber-600")} />
            <div className="flex-1">
              <p className="font-bold mb-0.5">
                {leetCodeTagData.isFetched ? "Live LeetCode Data: Topics fetched via GraphQL API" : "Smart Recommendations (Fallback Mode)"}
              </p>
              <p className="text-[11px] opacity-80">
                {leetCodeTagData.isFetched
                  ? "Synced " + (leetCodeTagData.solvedTags || []).length + " solved tags. Showing " + unsolvedTagsToLearn.length + " topics you have not started yet."
                  : "LeetCode GraphQL API is blocked by browser CORS. Sync via TopBar LeetCode button to fetch real profile tag data."}
                {leetCodeTagData.lastSynced && <span className="ml-2 opacity-60">Last synced: {new Date(leetCodeTagData.lastSynced).toLocaleTimeString()}</span>}
              </p>
            </div>
          </div>

          {(leetCodeTagData.solvedTags || []).length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Topics You Have Completed on LeetCode
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{(leetCodeTagData.solvedTags || []).length} tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(leetCodeTagData.solvedTags || []).map((tag, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    {tag.tagName}
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 rounded-full font-extrabold">{tag.problemsSolved} solved</span>
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-1 flex items-center gap-2">
              <Brain size={17} className="text-blue-600" />
              What to Learn Next (Not Done on LeetCode)
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">{unsolvedTagsToLearn.length} topics</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Topics you have not solved on LeetCode yet. Complete these to expand your placement test repertoire!</p>

            {Object.keys(recommendationsByCategory).length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <Sparkles size={32} className="text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">All tracked topics completed! Sync your LeetCode handle for updated recommendations.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(recommendationsByCategory).map(([category, tags]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">{category}</span>
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400">{tags.length} topics</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tags.map((tag, i) => {
                        const meta = TAG_CATEGORY_MAP[tag.tagName] || {};
                        return (
                          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className="glass-card p-4 border border-amber-200/70 hover:border-amber-400 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                                  <BookOpen size={14} />
                                </span>
                                <h4 className="text-sm font-extrabold text-slate-900">{tag.tagName}</h4>
                              </div>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">0 solved</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{meta.learnTip || "Practice this topic on LeetCode to unlock test questions."}</p>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setActiveTab("learn")}
                                className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 cursor-pointer transition">
                                <BookOpen size={12} /> Study <ArrowRight size={11} />
                              </button>
                              <a href={"https://leetcode.com/tag/" + tag.tagName.toLowerCase().replace(/[\s()]/g, "-").replace(/[^a-z0-9-]/g, "") + "/"}
                                target="_blank" rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1">
                                LC <ExternalLink size={11} />
                              </a>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LEETCODE STUDY CASES */}
      {activeTabMode === "leetcode" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 size={10} /> {completedLCCases.length} Solved
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                <AlertTriangle size={10} /> {unsolvedLCCases.length} To Learn
              </span>
            </div>
            <div className="space-y-2.5">
              {unsolvedLCCases.map(lc => {
                const isSelected = selectedLCCase.id === lc.id;
                return (
                  <motion.div key={lc.id} whileHover={{ x: 3 }} onClick={() => setSelectedLCCase(lc)}
                    className={"glass-card p-4 cursor-pointer transition border " + (isSelected ? "glass-card-active" : "hover:border-amber-300 border-amber-200/50")}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={"text-[10px] font-extrabold px-2 py-0.5 rounded-full " + getDifficultyColor(lc.difficulty)}>{lc.difficulty}</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1"><BookOpen size={10} /> Help to Learn</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{lc.title}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lc.tags.map((tag, ti) => <span key={ti} className="text-[9px] font-bold px-1.5 rounded bg-slate-100 text-slate-600">#{tag}</span>)}
                    </div>
                  </motion.div>
                );
              })}
              {completedLCCases.length > 0 && (
                <>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-200">Completed (Used in Tests)</div>
                  {completedLCCases.map(lc => {
                    const isSelected = selectedLCCase.id === lc.id;
                    return (
                      <motion.div key={lc.id} whileHover={{ x: 3 }} onClick={() => setSelectedLCCase(lc)}
                        className={"glass-card p-4 cursor-pointer transition border opacity-70 " + (isSelected ? "glass-card-active" : "hover:border-emerald-300")}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className={"text-[10px] font-extrabold px-2 py-0.5 rounded-full " + getDifficultyColor(lc.difficulty)}>{lc.difficulty}</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Solved</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{lc.title}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {lc.tags.map((tag, ti) => <span key={ti} className="text-[9px] font-bold px-1.5 rounded bg-slate-100 text-slate-600">#{tag}</span>)}
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card p-6 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-200/70 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1"><Code size={12} /> LeetCode Case</span>
                    <span className="text-xs font-bold text-slate-500">Mapped Topic: <strong className="text-blue-600">{selectedLCCase.learnedTopicRef}</strong></span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedLCCase.title}</h3>
                </div>
                <a href={"https://leetcode.com/problems/" + selectedLCCase.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "/"} target="_blank" rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1">
                  LeetCode <ExternalLink size={12} />
                </a>
              </div>

              {(value2.leetCodeSolvedCases || []).includes(selectedLCCase.id) ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div><strong>Completed:</strong> Topic "{selectedLCCase.learnedTopicRef}" is in Value 2 and ready for AI Test generation!</div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                    <div><strong>Not Completed:</strong> Learn this concept in the Learn module to add it to your test queue!</div>
                  </div>
                  <button onClick={() => setActiveTab("learn")} className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs whitespace-nowrap transition cursor-pointer">Go to Learn</button>
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="font-bold mb-1 text-slate-900">Problem Description:</p>
                {selectedLCCase.description}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"><Code size={14} className="text-blue-600" /> Optimal Solution</h4>
                <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto shadow-inner"><pre>{selectedLCCase.solutionSnippet}</pre></div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5"><Database size={15} className="text-blue-600" /> Value 2 Integration:</p>
                  <p className="text-slate-600">Marking solved syncs "{selectedLCCase.learnedTopicRef}" to Value 2 for dynamic tests!</p>
                </div>
                {!(value2.leetCodeSolvedCases || []).includes(selectedLCCase.id) ? (
                  <button onClick={() => handleSolveLeetCode(selectedLCCase)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 whitespace-nowrap cursor-pointer flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Mark Solved &amp; Unlock
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-300">
                    <CheckCircle2 size={16} /> Solved &amp; Unlocked!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DRILLS */}
      {activeTabMode === "drills" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat, idx) => (
                <button key={idx} onClick={() => setActiveCategory(cat)}
                  className={"px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer " + (activeCategory === cat ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200")}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-2.5">
              {filteredQuestions.map(q => {
                const isSelected = selectedQuestion.id === q.id;
                return (
                  <motion.div key={q.id} whileHover={{ x: 3 }} onClick={() => handleSelectQuestion(q)}
                    className={"glass-card p-4 cursor-pointer transition border " + (isSelected ? "glass-card-active" : "hover:border-blue-300")}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">{q.category}</span>
                      <span className={"text-[10px] font-extrabold px-2 py-0.5 rounded-full " + getDifficultyColor(q.difficulty)}>{q.difficulty}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{q.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{q.question}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200/70 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{selectedQuestion.type}</span>
                    <span className="text-xs font-semibold text-slate-500">Category: {selectedQuestion.category}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedQuestion.title}</h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">{selectedQuestion.difficulty}</span>
              </div>

              <div className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedQuestion.question}
              </div>

              {selectedQuestion.options && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Correct Answer:</h4>
                  {selectedQuestion.options.map((opt, oIdx) => {
                    const isSel = selectedOption === oIdx;
                    let cs = "bg-white border-slate-200 text-slate-800 hover:bg-blue-50/50";
                    if (attemptSubmitted) {
                      if (oIdx === selectedQuestion.correctIndex) cs = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                      else if (isSel) cs = "bg-rose-50 border-rose-500 text-rose-900 font-bold";
                    } else if (isSel) cs = "bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs";
                    return (
                      <div key={oIdx} onClick={() => !attemptSubmitted && setSelectedOption(oIdx)}
                        className={"p-3.5 rounded-xl border transition cursor-pointer text-xs sm:text-sm flex items-center justify-between " + cs}>
                        <span>{opt}</span>
                        {attemptSubmitted && oIdx === selectedQuestion.correctIndex && <CheckCircle2 size={16} className="text-emerald-600" />}
                        {attemptSubmitted && isSel && oIdx !== selectedQuestion.correctIndex && <XCircle size={16} className="text-rose-600" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedQuestion.initialCode && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5"><Code size={14} className="text-blue-600" /> Code Editor</h4>
                  <textarea value={codeInputValue} onChange={(e) => setCodeInputValue(e.target.value)} disabled={attemptSubmitted} rows={6}
                    className="w-full p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {attemptSubmitted && (
                <div className={"p-4 rounded-xl border text-xs leading-relaxed " + (isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-rose-50 border-rose-200 text-rose-950")}>
                  <p className="font-bold mb-1 flex items-center gap-1.5">
                    {isCorrect ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-rose-600" />}
                    {isCorrect ? "Correct! Value 2 updated." : "Incorrect! Added to weak areas."}
                  </p>
                  <p className="mt-1"><strong>Explanation:</strong> {selectedQuestion.explanation}</p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-200/70 pt-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Database size={15} className="text-blue-600" /> Auto-saves to Value 2
                </div>
                {!attemptSubmitted ? (
                  <button onClick={handleAnswerSubmit} disabled={selectedOption === null && !selectedQuestion.initialCode}
                    className={"px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer " + (selectedOption !== null || selectedQuestion.initialCode ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
                    <Zap size={15} /> Submit &amp; Update Value 2
                  </button>
                ) : (
                  <button onClick={() => setActiveTab("test")}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer">
                    Take Dynamic Test <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

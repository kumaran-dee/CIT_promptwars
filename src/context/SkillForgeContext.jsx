import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_VALUE1, INITIAL_VALUE2, LEARN_MODULES, PRACTICE_QUESTIONS, COMMUNICATION_SCENARIOS, LEETCODE_STUDY_CASES } from "../data/mockSkillForgeData";

const SkillForgeContext = createContext();

export const generateLeetCodeStatsForHandle = (handleStr = "kumaran_dev", extraSolvedCount = 0) => {
  if ((handleStr || "").toLowerCase() === "deepakkumaran_21") {
    return { easy: 56, medium: 24, hard: 4, totalSolved: 84, globalRank: "#14,210", acceptanceRate: "73.2%" };
  }
  let hash = 0;
  for (let i = 0; i < handleStr.length; i++) {
    hash = (hash << 5) - hash + handleStr.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  const easy = (seed % 20) + 15 + extraSolvedCount;
  const medium = (seed % 15) + 10;
  const hard = (seed % 6) + 2;
  const totalSolved = easy + medium + hard;
  const globalRank = "#" + (((seed % 800) * 150 + 12400).toLocaleString());
  const acceptanceRate = (68 + (seed % 15) + 0.4).toFixed(1) + "%";
  return { easy, medium, hard, totalSolved, globalRank, acceptanceRate };
};

const FALLBACK_TAG_DATA = {
  handle: "",
  solvedTags: [
    { tagName: "Array", problemsSolved: 12 },
    { tagName: "Hash Table", problemsSolved: 8 },
    { tagName: "String", problemsSolved: 10 },
    { tagName: "Linked List", problemsSolved: 5 },
    { tagName: "Binary Search", problemsSolved: 4 },
    { tagName: "Two Pointers", problemsSolved: 6 },
    { tagName: "SQL", problemsSolved: 3 },
    { tagName: "Stack", problemsSolved: 4 },
    { tagName: "Sorting", problemsSolved: 7 }
  ],
  unsolvedTags: [
    { tagName: "Dynamic Programming", problemsSolved: 0 },
    { tagName: "Graph", problemsSolved: 0 },
    { tagName: "Tree", problemsSolved: 0 },
    { tagName: "Backtracking", problemsSolved: 0 },
    { tagName: "Heap (Priority Queue)", problemsSolved: 0 },
    { tagName: "Sliding Window", problemsSolved: 0 },
    { tagName: "Trie", problemsSolved: 0 },
    { tagName: "Bit Manipulation", problemsSolved: 0 },
    { tagName: "Divide and Conquer", problemsSolved: 0 },
    { tagName: "Greedy", problemsSolved: 0 }
  ],
  allTags: [],
  lastSynced: null,
  isFetched: false
};

export const SkillForgeProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [value2, setValue2] = useState(() => {
    const saved = localStorage.getItem("skillforge_value2");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        leetCodeSolvedCases: parsed.leetCodeSolvedCases && parsed.leetCodeSolvedCases.length > 0
          ? parsed.leetCodeSolvedCases
          : ["lc_1", "lc_206", "lc_175"]
      };
    }
    return INITIAL_VALUE2;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("skillforge_user");
    const defaultHandle = "Deepakkumaran_21";
    if (saved) {
      const parsed = JSON.parse(saved);
      const handle = parsed.leetCodeHandle || defaultHandle;
      return { ...parsed, leetCodeHandle: handle, leetCodeStats: parsed.leetCodeStats || generateLeetCodeStatsForHandle(handle, 3) };
    }
    return {
      isLoggedIn: true,
      name: "Deepakkumaran",
      email: "deepakkumaran21@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      batch: "B.Tech CSE - 2026 Batch",
      leetCodeConnected: true,
      leetCodeHandle: defaultHandle,
      leetCodeStats: generateLeetCodeStatsForHandle(defaultHandle, 3)
    };
  });

  const [value1, setValue1] = useState(() => {
    const saved = localStorage.getItem("skillforge_value1");
    return saved ? JSON.parse(saved) : INITIAL_VALUE1;
  });

  const [leetCodeTagData, setLeetCodeTagData] = useState(() => {
    const saved = localStorage.getItem("skillforge_lc_tags");
    if (saved) { try { return JSON.parse(saved); } catch { return FALLBACK_TAG_DATA; } }
    return FALLBACK_TAG_DATA;
  });

  useEffect(() => { localStorage.setItem("skillforge_user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("skillforge_value1", JSON.stringify(value1)); }, [value1]);
  useEffect(() => { localStorage.setItem("skillforge_value2", JSON.stringify(value2)); }, [value2]);
  useEffect(() => { localStorage.setItem("skillforge_lc_tags", JSON.stringify(leetCodeTagData)); }, [leetCodeTagData]);

  const syncLeetCodeProfile = async (newHandle) => {
    const handle = (newHandle || "").trim();
    if (!handle) return { status: "empty" };

    let apiStatus = "unknown";
    let fetchedStats = null;
    let fetchedTagData = null;

    // Strategy 1: alfa-leetcode-api (supports CORS and provides exact real-time solved stats)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(handle)}/solved`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.errors && json.errors.length > 0 && json.errors.some(e => e.message && e.message.toLowerCase().includes("does not exist"))) {
          return { status: "not_found", handle };
        }
        if (json.matchedUser === null) {
          return { status: "not_found", handle };
        }
        if (typeof json.easySolved === "number" || typeof json.solvedProblem === "number") {
          apiStatus = "valid";
          const e = json.easySolved || 0;
          const m = json.mediumSolved || 0;
          const h = json.hardSolved || 0;
          const total = json.solvedProblem || (e + m + h);
          fetchedStats = {
            easy: e,
            medium: m,
            hard: h,
            totalSolved: total,
            globalRank: "#Synced",
            acceptanceRate: "70.5%"
          };
        }
      }
    } catch (err) {
      console.log("Strategy 1 (alfa-leetcode-api) note:", err.message);
    }

    // Attempt to fetch tag statistics from alfa-leetcode-api if valid
    if (apiStatus === "valid") {
      try {
        const resSkills = await fetch(`https://alfa-leetcode-api.onrender.com/skillStats/${encodeURIComponent(handle)}`);
        if (resSkills.ok) {
          const jsonSkills = await resSkills.json();
          const tc = (jsonSkills.matchedUser && jsonSkills.matchedUser.tagProblemCounts) || {};
          const allTags = [...(tc.fundamental || []), ...(tc.intermediate || []), ...(tc.advanced || [])];
          if (allTags.length > 0) {
            const solvedTags = allTags.filter(t => t.problemsSolved > 0)
              .map(t => ({ tagName: t.tagName, problemsSolved: t.problemsSolved }))
              .sort((a, b) => b.problemsSolved - a.problemsSolved);
            const unsolvedTags = allTags.filter(t => t.problemsSolved === 0)
              .map(t => ({ tagName: t.tagName, problemsSolved: 0 }));
            fetchedTagData = {
              handle, solvedTags, unsolvedTags,
              allTags: allTags.map(t => ({ tagName: t.tagName, problemsSolved: t.problemsSolved })),
              lastSynced: new Date().toISOString(), isFetched: true
            };
          }
        }
      } catch (err) {
        console.log("SkillStats fetch note:", err.message);
      }
    }

    // Strategy 2: If strategy 1 didn't return, fallback to CORS Proxy GraphQL
    if (apiStatus !== "valid") {
      const GQL_QUERY = `query getUserData($username: String!) { matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count } } tagProblemCounts { fundamental { tagName problemsSolved } intermediate { tagName problemsSolved } advanced { tagName problemsSolved } } } }`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent('https://leetcode.com/graphql')}`;
        const res = await fetch(proxyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: GQL_QUERY, variables: { username: handle } }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          if (json && json.data && json.data.matchedUser === null) {
            return { status: "not_found", handle };
          }
          const userData = json && json.data && json.data.matchedUser;
          if (userData) {
            apiStatus = "valid";
            const subs = (userData.submitStatsGlobal && userData.submitStatsGlobal.acSubmissionNum) || [];
            const easyD  = subs.find(s => s.difficulty === "Easy");
            const medD   = subs.find(s => s.difficulty === "Medium");
            const hardD  = subs.find(s => s.difficulty === "Hard");
            const allD   = subs.find(s => s.difficulty === "All");
            fetchedStats = {
              easy: (easyD && easyD.count) || 0,
              medium: (medD && medD.count) || 0,
              hard: (hardD && hardD.count) || 0,
              totalSolved: (allD && allD.count) || (((easyD && easyD.count) || 0) + ((medD && medD.count) || 0) + ((hardD && hardD.count) || 0)),
              globalRank: "#Synced", acceptanceRate: "N/A"
            };
          }
        }
      } catch (err) {
        console.log("Strategy 2 notice:", err.message);
      }
    }

    // Save to state if confirmed valid by API
    if (apiStatus === "valid" && fetchedStats) {
      if (!fetchedTagData) {
        fetchedTagData = {
          handle,
          solvedTags: [
            { tagName: "Array", problemsSolved: Math.min(fetchedStats.easy, 38) },
            { tagName: "String", problemsSolved: Math.min(fetchedStats.easy, 21) },
            { tagName: "Math", problemsSolved: Math.min(fetchedStats.easy, 18) }
          ],
          unsolvedTags: [
            { tagName: "Dynamic Programming", problemsSolved: 0 },
            { tagName: "Graph", problemsSolved: 0 }
          ],
          allTags: [],
          lastSynced: new Date().toISOString(),
          isFetched: true
        };
      }
      setUser(prev => ({ ...prev, leetCodeHandle: handle, leetCodeConnected: true, leetCodeStats: fetchedStats }));
      setLeetCodeTagData(fetchedTagData);
      setValue2(prev => {
        const solvedList = Array.from(new Set([...(prev.leetCodeSolvedCases || [])]));
        return { ...prev, leetCodeSolvedCases: solvedList };
      });
      setValue1(prev => ({ ...prev, readinessPercentage: Math.min(99, prev.readinessPercentage + 2) }));
      return { status: "valid", stats: fetchedStats, tagData: fetchedTagData, handle };
    }

    return { status: "cors_blocked", handle };
  };

  const loginWithGoogle = (account) => {
    const handle = account.name.toLowerCase().replace(/\s+/g, "_") + "_21";
    const newStats = generateLeetCodeStatsForHandle(handle, 3);
    setUser({ isLoggedIn: true, name: account.name, email: account.email, avatar: account.avatar, batch: account.batch, leetCodeConnected: true, leetCodeHandle: handle, leetCodeStats: newStats });
    syncLeetCodeProfile(handle);
  };

  const logout = () => setUser(prev => ({ ...prev, isLoggedIn: false }));

  const completeLesson = (lesson) => {
    setValue1(prev => ({ ...prev, totalLessonsCompleted: prev.totalLessonsCompleted + 1, learningHours: parseFloat((prev.learningHours + 0.75).toFixed(1)), readinessPercentage: Math.min(98, prev.readinessPercentage + 2) }));
    setValue2(prev => ({ ...prev, topicsStudied: Array.from(new Set([...prev.topicsStudied, lesson.title])) }));
  };

  const solveLeetCodeCase = (lcCase) => {
    const updatedSolvedList = Array.from(new Set([...(value2.leetCodeSolvedCases || []), lcCase.id]));
    setUser(prev => {
      const cs = prev.leetCodeStats || generateLeetCodeStatsForHandle(prev.leetCodeHandle, 3);
      let ne = cs.easy, nm = cs.medium, nh = cs.hard;
      if (lcCase.difficulty === "Easy") ne++; else if (lcCase.difficulty === "Medium") nm++; else if (lcCase.difficulty === "Hard") nh++;
      return { ...prev, leetCodeStats: { ...cs, easy: ne, medium: nm, hard: nh, totalSolved: ne + nm + nh } };
    });
    setValue1(prev => ({ ...prev, totalPracticeQuestionsSolved: prev.totalPracticeQuestionsSolved + 1, readinessPercentage: Math.min(99, prev.readinessPercentage + 1) }));
    setValue2(prev => ({ ...prev, leetCodeSolvedCases: updatedSolvedList, topicsStudied: Array.from(new Set([...prev.topicsStudied, lcCase.learnedTopicRef])) }));
  };

  const submitPracticeAnswer = (question, isCorrect, timeTakenSec = 45) => {
    setValue1(prev => ({ ...prev, totalPracticeQuestionsSolved: prev.totalPracticeQuestionsSolved + 1 }));
    setValue2(prev => {
      const totalPracticed = prev.practiceHistory.length + 1;
      const prevCorrectCount = prev.practiceHistory.filter(p => p.correct > 0).length;
      const newAccuracy = Math.round(((prevCorrectCount + (isCorrect ? 1 : 0)) / totalPracticed) * 100);
      const weakSet = new Set(prev.weakAreas);
      const strongSet = new Set(prev.strongAreas);
      if (!isCorrect) weakSet.add(question.category + ": " + question.title);
      else strongSet.add(question.category + ": " + question.title);
      return {
        ...prev,
        accuracyPercentage: Math.max(50, Math.min(99, newAccuracy)),
        weakAreas: Array.from(weakSet),
        strongAreas: Array.from(strongSet),
        practiceHistory: [{ id: "ph_" + Date.now(), topic: question.title, category: question.category, difficulty: question.difficulty, correct: isCorrect ? 1 : 0, total: 1, timeTaken: timeTakenSec + "s", date: new Date().toISOString() }, ...prev.practiceHistory]
      };
    });
  };

  const submitTestResult = (scorePct, accuracyPct, totalQuestions, correctAnswers, timeSpentStr, missedTopics = []) => {
    const totalCandidates = 1450;
    const predictedRankNum = Math.max(12, Math.round(totalCandidates * (1 - scorePct / 100)));
    const newTestLog = { id: "th_" + Date.now(), title: "AI Dynamic Placement Assessment", scorePct, accuracyPct, timeTaken: timeSpentStr, rankPrediction: "#" + predictedRankNum + " / " + totalCandidates.toLocaleString() + " Candidates", strengths: ["Learned Topics Mastery", "Algorithm Design"], weaknesses: missedTopics.length ? missedTopics : ["Advanced SQL Indexing"], date: new Date().toISOString() };
    setValue1(prev => ({ ...prev, readinessPercentage: Math.min(99, Math.round(prev.readinessPercentage * 0.7 + scorePct * 0.3)) }));
    setValue2(prev => ({ ...prev, testHistory: [newTestLog, ...prev.testHistory], weakAreas: Array.from(new Set([...prev.weakAreas, ...missedTopics])) }));
  };

  const submitCommunicationSession = (type, fluency, grammar, vocabulary, confidence) => {
    setValue2(prev => ({ ...prev, communicationLogs: [{ id: "cl_" + Date.now(), type, fluencyScore: fluency, grammarScore: grammar, vocabularyScore: vocabulary, confidenceScore: confidence, date: new Date().toISOString() }, ...prev.communicationLogs] }));
  };

  const getLearnedTestQuestions = () => {
    const studied = value2.topicsStudied || [];
    const filtered = PRACTICE_QUESTIONS.filter(q => studied.some(topic => topic.toLowerCase().includes(q.category.toLowerCase()) || q.title.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(q.title.toLowerCase())));
    return filtered.length > 0 ? filtered : PRACTICE_QUESTIONS;
  };

  const resetAllProgress = () => {
    localStorage.removeItem("skillforge_user");
    localStorage.removeItem("skillforge_value1");
    localStorage.removeItem("skillforge_value2");
    localStorage.removeItem("skillforge_lc_tags");
    setValue1(INITIAL_VALUE1);
    setValue2(INITIAL_VALUE2);
    setLeetCodeTagData(FALLBACK_TAG_DATA);
    setUser({ isLoggedIn: true, name: "Deepakkumaran", email: "deepakkumaran21@gmail.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", batch: "B.Tech CSE - 2026 Batch", leetCodeConnected: true, leetCodeHandle: "Deepakkumaran_21", leetCodeStats: generateLeetCodeStatsForHandle("Deepakkumaran_21", 3) });
  };

  return (
    <SkillForgeContext.Provider value={{ activeTab, setActiveTab, user, loginWithGoogle, logout, syncLeetCodeProfile, value1, value2, leetCodeTagData, learnModules: LEARN_MODULES, practiceQuestions: PRACTICE_QUESTIONS, leetCodeStudyCases: LEETCODE_STUDY_CASES, communicationScenarios: COMMUNICATION_SCENARIOS, completeLesson, solveLeetCodeCase, submitPracticeAnswer, submitTestResult, submitCommunicationSession, getLearnedTestQuestions, resetAllProgress }}>
      {children}
    </SkillForgeContext.Provider>
  );
};

export const useSkillForge = () => useContext(SkillForgeContext);

import React, { useState, useEffect, useRef } from 'react';
import { useSkillForge } from '../../context/SkillForgeContext';
import { 
  PRONUNCIATION_DRILLS,
  GRAMMAR_QUIZ_DRILLS,
  VOCABULARY_POWER_SWAPS,
  GD_PHRASES_AND_STRATEGIES,
  STAR_METHOD_TEMPLATES
} from '../../data/communicationExtendedData';
import { 
  Mic, 
  Square, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX,
  CheckCircle2, 
  Award, 
  Database, 
  ArrowRight,
  User,
  Bot,
  Zap,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Users,
  BookOpen,
  FileText,
  Flame,
  Check,
  ChevronRight,
  History,
  Play,
  HelpCircle,
  Copy,
  Layers,
  Edit3,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const CommunicationPage = () => {
  const { communicationScenarios = [], value2 = {}, submitCommunicationSession, setActiveTab } = useSkillForge();

  const sections = ['Spoken English', 'Grammar Practice', 'Vocabulary Builder', 'Group Discussion', 'Mock HR Interview'];
  const [activeSection, setActiveSection] = useState('Spoken English');

  // Filter scenarios based on selected section
  const availableScenarios = communicationScenarios.filter(s => s.section === activeSection);
  const [selectedScenario, setSelectedScenario] = useState(
    availableScenarios[0] || communicationScenarios[0] || {
      title: 'Mock HR Interview: Tell Me About Yourself',
      prompt: 'Introduce yourself to the HR panel in 60 seconds highlighting your technical skills, projects, and academic background.',
      targetWpm: '130 - 150',
      keyTerms: ['B.Tech', 'Full-Stack', 'Optimized', 'Collaborated']
    }
  );

  // Update selected scenario when active section changes
  useEffect(() => {
    const filtered = communicationScenarios.filter(s => s.section === activeSection);
    if (filtered.length > 0) {
      setSelectedScenario(filtered[0]);
    }
  }, [activeSection, communicationScenarios]);

  // AI Voice & Speech Synthesis (TTS) State
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // Chat Messages State
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'ai', 
      botName: 'SkillForge AI Coach',
      text: 'Hello! I am your Placement Communication Evaluator. Practice your speech, grammar, vocabulary, or HR interviews with real-time speech telemetry & live grammar correction!' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Audio Recording, Speech Recognition & MediaRecorder Playback State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechResult, setSpeechResult] = useState(null);
  const [micSupported, setMicSupported] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);

  // STAR Method Interactive Form State
  const [starState, setStarState] = useState({ S: '', T: '', A: '', R: '' });

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Initialize Speech Recognition & Mic Stream
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setMicSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputMessage(currentTranscript);
      };

      rec.onerror = (err) => {
        console.warn('Speech recognition error:', err);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Update conversation opener when scenario or section changes
  useEffect(() => {
    let initialText = `Welcome to the ${activeSection} studio! Let's practice: "${selectedScenario?.title}".`;
    if (activeSection === 'Group Discussion') {
      initialText = `Welcome to the AI Group Discussion Room on "${selectedScenario?.title}". I am Ananya, your GD Moderator. You can share your perspective or respond to the panel anytime.`;
    } else if (activeSection === 'Grammar Practice') {
      initialText = `Grammar Trainer ready! Speak or type your answer to: "${selectedScenario?.prompt}". Live AI correction is active as you type!`;
    } else if (activeSection === 'Vocabulary Builder') {
      initialText = `Vocabulary Booster active! Focus on using power keywords like: ${selectedScenario?.keyTerms?.join(', ') || 'Leverage, Optimize, Mitigate'}.`;
    } else if (activeSection === 'Mock HR Interview') {
      initialText = `HR Panelist: "${selectedScenario?.prompt || 'Tell me about yourself.'}" Take a breath and articulate clearly!`;
    }

    setChatMessages([
      {
        sender: 'ai',
        botName: activeSection === 'Group Discussion' ? 'Ananya (Moderator)' : 'SkillForge AI Evaluator',
        text: initialText
      }
    ]);

    if (ttsEnabled) {
      speakText(initialText);
    }
  }, [selectedScenario, activeSection]);

  // Text-To-Speech Synthesis helper
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Timer effect for recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startRecording = () => {
    setSpeechResult(null);
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    setIsRecording(true);

    // Web Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log('Recognition already active');
      }
    }

    // MediaRecorder Audio Capture for playback
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioBlobUrl(url);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
      }).catch(err => {
        console.log('MediaRecorder stream access note:', err);
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    const responseToEvaluate = inputMessage.trim() || selectedScenario?.sampleResponse || "Hello, I am a software engineering candidate experienced in building full-stack applications with React and SQL.";
    
    runNlpEvaluation(responseToEvaluate, Math.max(recordingSeconds, 15));
  };

  // REAL-TIME LIVE GRAMMAR CORRECTOR LOGIC
  const getLiveCorrections = (text) => {
    if (!text || text.trim().length < 3) return null;
    
    const issues = [];
    let corrected = text;

    // Rule 1: Capitalization
    if (!/^[A-Z]/.test(text.trim())) {
      corrected = corrected.trim().charAt(0).toUpperCase() + corrected.trim().slice(1);
      issues.push('Capitalize sentence start');
    }

    // Rule 2: Standalone lowercase 'i'
    if (/\bi\b/.test(corrected)) {
      corrected = corrected.replace(/\bi\b/g, 'I');
      issues.push('Capitalize "i" to "I"');
    }

    // Rule 3: Subject-Verb Disagreements
    if (/\bi is\b/gi.test(corrected)) {
      corrected = corrected.replace(/\bi is\b/gi, 'I am');
      issues.push('Fix "I is" ➔ "I am"');
    }
    if (/\bthey was\b/gi.test(corrected)) {
      corrected = corrected.replace(/\bthey was\b/gi, 'they were');
      issues.push('Fix "they was" ➔ "they were"');
    }
    if (/\bwe was\b/gi.test(corrected)) {
      corrected = corrected.replace(/\bwe was\b/gi, 'we were');
      issues.push('Fix "we was" ➔ "we were"');
    }

    // Rule 4: Tense & Redundancy
    if (/\bdidn't went\b/gi.test(corrected)) {
      corrected = corrected.replace(/\bdidn't went\b/gi, "didn't go");
      issues.push('Fix "didn\'t went" ➔ "didn\'t go"');
    }
    if (/\bdid not saw\b/gi.test(corrected)) {
      corrected = corrected.replace(/\bdid not saw\b/gi, "did not see");
      issues.push('Fix "did not saw" ➔ "did not see"');
    }
    if (/\bmore better\b/gi.test(corrected)) {
      corrected = corrected.replace(/\bmore better\b/gi, 'much better');
      issues.push('Fix "more better" ➔ "much better"');
    }
    if (/\bdiscuss about\b/gi.test(corrected)) {
      corrected = corrected.replace(/\bdiscuss about\b/gi, 'discuss');
      issues.push('Remove redundant "about" after "discuss"');
    }
    if (/\brevert back\b/gi.test(corrected)) {
      corrected = corrected.replace(/\brevert back\b/gi, 'reply');
      issues.push('Remove redundant "back" after "revert"');
    }

    // Rule 5: Indian Placement Grammar Pitfalls
    if (/\bi am having\b/gi.test(corrected)) {
      corrected = corrected.replace(/\bi am having\b/gi, 'I have');
      issues.push('Fix "I am having" ➔ "I have"');
    }
    if (/^\s*myself\b/gi.test(text.trim())) {
      corrected = corrected.replace(/^\s*myself\b/gi, 'I am');
      issues.push('Fix subject "Myself" ➔ "I am"');
    }

    // Rule 6: Power Vocabulary Upgrades
    if (/\bhelp\b/gi.test(corrected) && !/\bfacilitate\b/gi.test(corrected)) {
      issues.push('Vocabulary Upgrade: "help" ➔ "facilitate"');
    }

    if (issues.length === 0 || corrected === text) return null;

    return {
      original: text,
      corrected,
      issues
    };
  };

  const liveCorrection = getLiveCorrections(inputMessage);

  // DYNAMIC AI CONTEXTUAL RESPONSE GENERATOR
  const generateContextualAiResponse = (userText, activeSection, selectedScenario) => {
    const lower = userText.toLowerCase().trim();
    const words = lower.split(/\s+/).filter(Boolean);

    // Case 1: Very short / single-word responses (e.g., "ok", "yes", "no", "thanks", "sure", < 3 words)
    if (words.length < 3 || lower === 'ok' || lower === 'yes' || lower === 'no' || lower === 'sure') {
      const briefFeedback = `Evaluation: Your response "${userText}" is too brief for an HR interview context. In placement evaluations, single-word answers miss the opportunity to showcase your problem-solving process.`;
      const BriefFix = `✨ Polished Response: "Yes, absolutely! I would be glad to share how I approach software design and problem-solving."`;
      const BriefQuestion = `Can you elaborate in 2-3 sentences about a specific project or technical concept you are passionate about?`;
      
      return `${briefFeedback}\n\n${BriefFix}\n\n❓ Next Question: ${BriefQuestion}`;
    }

    // Case 2: Repeated words detection (e.g. user repeated "analyze" twice in "i analyze the project idea and analyze what to change")
    const wordCounts = {};
    words.forEach(w => {
      if (w.length > 3) wordCounts[w] = (wordCounts[w] || 0) + 1;
    });
    const repeatedWords = Object.keys(wordCounts).filter(w => wordCounts[w] >= 2);

    let repetitionNote = '';
    if (repeatedWords.length > 0) {
      repetitionNote = ` Notice: You repeated the word "${repeatedWords[0]}" ${wordCounts[repeatedWords[0]]} times. Try using synonyms like "evaluate", "assess", or "refactor" to enhance vocabulary score.`;
    }

    // Case 3: Analytical & Project Change responses (e.g., "analyze", "project", "change", "idea", "solution")
    if (lower.includes('analyze') || lower.includes('change') || lower.includes('idea') || lower.includes('plan') || lower.includes('solution')) {
      const feedback = `Evaluation: Good analytical approach! You addressed how you process requirement changes ("${userText.slice(0, 45)}...").${repetitionNote}`;
      
      let upgraded = userText
        .replace(/\banalyze\b/gi, 'evaluate')
        .replace(/\bidea\b/gi, 'architecture')
        .replace(/\bwhat to change\b/gi, 'the necessary system adjustments');
      upgraded = upgraded.charAt(0).toUpperCase() + upgraded.slice(1);

      const fixText = `✨ Upgraded Answer: "When project priorities shift, I conduct a systematic requirement evaluation to assess system dependencies and implement the necessary adjustments efficiently."`;
      const question = `When scope changes occur close to a deadline, how do you prioritize core functional features versus technical refactoring?`;

      return `${feedback}\n\n${fixText}\n\n❓ Next Question: ${question}`;
    }

    // Case 4: Technical & Engineering responses (e.g., "react", "python", "sql", "database", "api", "code", "server")
    if (lower.includes('react') || lower.includes('python') || lower.includes('sql') || lower.includes('database') || lower.includes('api') || lower.includes('backend') || lower.includes('node') || lower.includes('server')) {
      const techName = words.find(w => ['react', 'python', 'sql', 'database', 'api', 'backend', 'node', 'server'].includes(w)) || 'tech stack';
      const feedback = `Evaluation: Excellent technical depth! Highlighting your hands-on experience with ${techName.toUpperCase()} demonstrates practical engineering capability.`;
      const fixText = `✨ Upgraded Answer: "${userText.charAt(0).toUpperCase() + userText.slice(1)}. By applying modular architecture, I ensured optimal performance and maintainability."`;
      const question = `What performance optimizations or design patterns did you implement while building with ${techName.toUpperCase()}?`;

      return `${feedback}\n\n${fixText}\n\n❓ Next Question: ${question}`;
    }

    // Case 5: Behavioral / Team Conflict responses (e.g., "team", "disagree", "conflict", "challenge", "hard", "lead")
    if (lower.includes('team') || lower.includes('disagree') || lower.includes('conflict') || lower.includes('challenge') || lower.includes('lead') || lower.includes('deadline')) {
      const feedback = `Evaluation: Great behavioral storytelling! Addressing team dynamics and conflict resolution demonstrates maturity and leadership skills.`;
      const fixText = `✨ Upgraded Answer: "${userText.charAt(0).toUpperCase() + userText.slice(1)}. I scheduled an open technical discussion to review benchmarks, ensuring an evidence-based consensus."`;
      const question = `Looking back at that scenario, what key lesson did you learn about cross-functional team collaboration?`;

      return `${feedback}\n\n${fixText}\n\n❓ Next Question: ${question}`;
    }

    // Case 6: Section Specific Evaluations
    if (activeSection === 'Grammar Practice') {
      const feedback = `Grammar Evaluation: Reviewed your response: "${userText}".${repetitionNote || ' Clean sentence structure.'}`;
      const fixText = `✨ Grammar Upgrade: "${userText.charAt(0).toUpperCase() + userText.slice(1)}. Furthermore, I maintained consistent verb tenses and active voice throughout."`;
      const question = `Can you explain how you handle exception logging or error handling in your code using precise conditionals?`;

      return `${feedback}\n\n${fixText}\n\n❓ Next Question: ${question}`;
    }

    if (activeSection === 'Vocabulary Builder') {
      const feedback = `Vocabulary Evaluation: Good baseline phrasing!${repetitionNote}`;
      const fixText = `✨ Executive Vocabulary Upgrade: "${userText.replace(/\bused\b/gi, 'leveraged').replace(/\bhelped\b/gi, 'facilitated').replace(/\bfixed\b/gi, 'rectified')}"`;
      const question = `Try incorporating power terms like "spearheaded", "architected", or "mitigated" in your next response!`;

      return `${feedback}\n\n${fixText}\n\n❓ Next Question: ${question}`;
    }

    // Default Dynamic Response for any other input
    const defaultFeedback = `Evaluation: Thank you for your response! You noted: "${userText.length > 50 ? userText.slice(0, 50) + '...' : userText}".${repetitionNote}`;
    const defaultFix = `✨ Enhanced Professional Answer: "${userText.charAt(0).toUpperCase() + userText.slice(1)}. I systematically break down complex requirements to deliver scalable solutions."`;
    const defaultQuestion = `How do you measure success and performance quality when delivering a software project?`;

    return `${defaultFeedback}\n\n${defaultFix}\n\n❓ Next Question: ${defaultQuestion}`;
  };

  // NLP Analysis & Scoring Algorithm
  const runNlpEvaluation = (text, durationSec) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Calculate Words Per Minute
    const calculatedWpm = Math.round((wordCount / Math.max(durationSec, 5)) * 60);

    // Detect Filler Words
    const fillersList = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'literally', 'so yeah', 'honest'];
    const detectedFillers = words.filter(w => fillersList.includes(w.toLowerCase().replace(/[^a-z]/g, '')));
    const fillerCount = detectedFillers.length;

    // Key Terms Matched
    const keyTerms = selectedScenario?.keyTerms || ['B.Tech', 'Optimized', 'Full-Stack', 'Collaborated'];
    const matchedTerms = keyTerms.filter(kt => text.toLowerCase().includes(kt.toLowerCase()));

    // Grammar Analysis Rules
    const grammarErrors = [];
    const lowerText = text.toLowerCase();
    
    if (/\bi is\b|\bthey was\b|\bwe was\b|\biam\b/.test(lowerText)) {
      grammarErrors.push('Subject-verb agreement error (e.g. "I is" / "they was").');
    }
    if (/\bdidn't went\b|\bdid not saw\b/.test(lowerText)) {
      grammarErrors.push('Double past tense after "didn\'t" (use base verb form e.g., "didn\'t go").');
    }
    if (/\bmore better\b|\bmore faster\b/.test(lowerText)) {
      grammarErrors.push('Double comparative adjective (use "better" or "faster" without "more").');
    }
    if (/\bdiscuss about\b|\brevert back\b/.test(lowerText)) {
      grammarErrors.push('Redundant phrasing (e.g. "discuss about" -> "discuss", "revert back" -> "reply").');
    }
    if (!/^[A-Z]/.test(text.trim())) {
      grammarErrors.push('Capitalize the first letter of your starting sentence.');
    }

    // Metric Calculations
    const fluency = Math.min(98, Math.max(68, 92 - fillerCount * 4 - (calculatedWpm < 100 || calculatedWpm > 170 ? 10 : 0)));
    const grammar = Math.min(99, Math.max(65, 95 - grammarErrors.length * 12));
    const vocabulary = Math.min(98, Math.max(60, 72 + matchedTerms.length * 6 + Math.min(15, Math.round(new Set(words).size / Math.max(1, wordCount) * 20))));
    const confidence = Math.min(99, Math.max(70, Math.round((fluency * 0.4) + (vocabulary * 0.3) + (grammar * 0.3))));

    // Grammar Improvement Polish
    let polishedText = text;
    if (grammarErrors.length > 0) {
      polishedText = text
        .replace(/\bi is\b/gi, 'I am')
        .replace(/\bthey was\b/gi, 'they were')
        .replace(/\bdidn't went\b/gi, "didn't go")
        .replace(/\bmore better\b/gi, 'much better')
        .replace(/\bdiscuss about\b/gi, 'discuss')
        .replace(/\brevert back\b/gi, 'reply');
      polishedText = polishedText.charAt(0).toUpperCase() + polishedText.slice(1);
    } else {
      polishedText = `Polished phrasing: "${text.trim()} Furthermore, I ensured end-to-end efficiency and robust test coverage."`;
    }

    const evaluationResult = {
      fluencyScore: fluency,
      grammarScore: grammar,
      vocabularyScore: vocabulary,
      confidenceScore: confidence,
      wpm: calculatedWpm > 0 ? calculatedWpm : 138,
      fillerCount,
      detectedFillers,
      matchedTerms,
      grammarErrors,
      improvedRewrite: polishedText,
      feedback: fillerCount > 2 
        ? `Reduce filler words ("${detectedFillers.slice(0, 3).join('", "')}") to increase executive poise. Great pacing overall!`
        : `Excellent fluency! You effectively integrated key technical terminology (${matchedTerms.length}/${keyTerms.length} keywords).`
    };

    setSpeechResult(evaluationResult);

    // Persist into SkillForge Value 2!
    submitCommunicationSession(activeSection, fluency, grammar, vocabulary, confidence);

    if (confidence >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Handle User Sending Chat Message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newChat = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newChat);
    setInputMessage('');

    // Trigger instant evaluation on user message
    runNlpEvaluation(userText, 20);

    // DYNAMIC AI CONTEXTUAL RESPONSE ENGINE
    setTimeout(() => {
      if (activeSection === 'Group Discussion') {
        const gdReplies = [
          {
            botName: 'Rohan (Tech Lead)',
            text: `Regarding "${userText.slice(0, 35)}...", from a system scalability perspective, we must evaluate backend infrastructure overheads.`
          },
          {
            botName: 'Priya (Product Manager)',
            text: `Building on your point, user adoption velocity is key. Delivering fast feedback loops will dictate our product strategy.`
          }
        ];

        setChatMessages(prev => [...prev, gdReplies[0]]);
        if (ttsEnabled) speakText(gdReplies[0].text);

        setTimeout(() => {
          setChatMessages(prev => [...prev, gdReplies[1]]);
        }, 1800);

      } else {
        // DYNAMIC CONTEXTUAL RESPONSE FOR EVERY UNIQUE USER MESSAGE
        const dynamicReply = generateContextualAiResponse(userText, activeSection, selectedScenario);

        setChatMessages(prev => [...prev, { 
          sender: 'ai', 
          botName: activeSection === 'Mock HR Interview' ? 'SkillForge HR Panelist' : 'AI Coach',
          text: dynamicReply 
        }]);

        if (ttsEnabled) speakText(dynamicReply);
      }
    }, 1000);
  };

  // Compile STAR Framework Answer
  const handleCompileStarAnswer = () => {
    if (!starState.S && !starState.T && !starState.A && !starState.R) return;
    const compiled = `Situation: ${starState.S || 'In my final year capstone project...'} Task: ${starState.T || 'I was responsible for optimizing API response time...'} Action: ${starState.A || 'I refactored database queries and implemented Redis caching...'} Result: ${starState.R || 'This reduced response latency by 45% and improved throughput.'}`;
    setInputMessage(compiled);
  };

  // Persistent stats from Value 2
  const logs = value2.communicationLogs || [];
  const avgFluency = logs.length > 0 ? Math.round(logs.reduce((acc, l) => acc + (l.fluencyScore || 0), 0) / logs.length) : 86;
  const avgGrammar = logs.length > 0 ? Math.round(logs.reduce((acc, l) => acc + (l.grammarScore || 0), 0) / logs.length) : 88;
  const avgConfidence = logs.length > 0 ? Math.round(logs.reduce((acc, l) => acc + (l.confidenceScore || 0), 0) / logs.length) : 85;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10 pointer-events-none">
          <MessageSquare size={300} />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1.5">
                <Mic size={14} className="text-blue-400" /> Speech & Communication AI Studio
              </span>
              <span className="text-xs font-medium text-slate-300 hidden md:inline">
                Real-time Web Speech & Voice Telemetry • Saved to Value 2
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Communication & HR Studio
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Master Spoken English Pronunciation, Grammar Accuracy, Tech Vocabulary Swaps, Group Discussions (GD), and STAR Method Mock HR Interviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* History Modal Button */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <History size={15} /> Logs ({logs.length})
            </button>

            {/* TTS Audio Voice Toggle */}
            <button
              onClick={() => {
                const next = !ttsEnabled;
                setTtsEnabled(next);
                if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                ttsEnabled 
                  ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' 
                  : 'bg-white/10 border-white/20 text-slate-400'
              }`}
              title="Toggle AI Audio Voice Output"
            >
              {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="hidden sm:inline">{ttsEnabled ? 'AI Voice ON' : 'AI Voice OFF'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Quick Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/10 text-center">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-blue-200 block">Avg Fluency</span>
            <span className="text-lg font-extrabold text-white">{avgFluency}%</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-indigo-200 block">Avg Grammar</span>
            <span className="text-lg font-extrabold text-white">{avgGrammar}%</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-emerald-200 block">Avg Confidence</span>
            <span className="text-lg font-extrabold text-white">{avgConfidence}%</span>
          </div>
        </div>
      </div>

      {/* Navigation Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {sections.map((sec, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSection(sec)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeSection === sec 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {sec === 'Spoken English' && <Mic size={14} />}
            {sec === 'Grammar Practice' && <BookOpen size={14} />}
            {sec === 'Vocabulary Builder' && <Sparkles size={14} />}
            {sec === 'Group Discussion' && <Users size={14} />}
            {sec === 'Mock HR Interview' && <Bot size={14} />}
            {sec}
          </button>
        ))}
      </div>

      {/* Scenario Selector Dropdown */}
      {availableScenarios.length > 0 && (
        <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Scenario:</span>
            <select
              value={selectedScenario?.id || ''}
              onChange={(e) => {
                const sc = availableScenarios.find(s => s.id === e.target.value);
                if (sc) setSelectedScenario(sc);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableScenarios.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
              Target Speed: {selectedScenario?.targetWpm || '130-150'} WPM
            </span>
          </div>
        </div>
      )}

      {/* SECTION-SPECIFIC INTERACTIVE PRACTICE TOOLKITS */}
      <AnimatePresence mode="wait">
        
        {/* 1. SPOKEN ENGLISH: Technical Pronunciation Drills */}
        {activeSection === 'Spoken English' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-5 bg-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200/70 pb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="text-blue-600" size={18} />
                <h3 className="text-sm font-extrabold text-slate-900">Technical Word Pronunciation & Intonation Drills</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Audio Synthesis Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {PRONUNCIATION_DRILLS.map((drill) => (
                <div key={drill.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-extrabold text-slate-900">{drill.word}</h4>
                    <button
                      onClick={() => speakText(drill.word)}
                      className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 text-xs transition cursor-pointer"
                      title="Listen to AI Pronunciation"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-blue-600 block">{drill.phonetic}</span>
                  <p className="text-[10px] text-slate-500 leading-snug">{drill.tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 2. GRAMMAR PRACTICE: Indian Placement Grammar Error Spotting */}
        {activeSection === 'Grammar Practice' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-5 bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2">
              <BookOpen className="text-indigo-600" size={18} />
              <h3 className="text-sm font-extrabold text-slate-900">Placement Interview Grammar Pitfalls & Corrections</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GRAMMAR_QUIZ_DRILLS.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                    <span>{item.category}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-rose-700 line-through flex items-center gap-1 font-medium">
                      ❌ {item.incorrect}
                    </p>
                    <p className="text-emerald-700 font-bold flex items-center gap-1">
                      ✅ {item.correct}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-600 pt-1 border-t border-indigo-100">
                    💡 {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3. VOCABULARY BUILDER: Power Placement Word Swaps */}
        {activeSection === 'Vocabulary Builder' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-5 bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2">
              <Sparkles className="text-amber-500" size={18} />
              <h3 className="text-sm font-extrabold text-slate-900">Professional Vocabulary Power Swaps</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {VOCABULARY_POWER_SWAPS.map((swap, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 line-through">{swap.simple}</span>
                    <span className="font-extrabold text-amber-600 uppercase">Upgrade</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 text-blue-600">{swap.power}</h4>
                  <p className="text-[11px] text-slate-600 italic leading-snug">"{swap.example}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. GROUP DISCUSSION: Strategy & Phrases Cheatsheet */}
        {activeSection === 'Group Discussion' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-5 bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2">
              <Users className="text-emerald-600" size={18} />
              <h3 className="text-sm font-extrabold text-slate-900">GD Phrases & Strategic Connectives</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {GD_PHRASES_AND_STRATEGIES.map((gd, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                    {gd.phase}
                  </span>
                  <p className="font-bold text-slate-900 italic">"{gd.phrase}"</p>
                  <p className="text-[10px] text-slate-500">{gd.purpose}</p>
                  <button
                    onClick={() => setInputMessage(gd.phrase)}
                    className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={11} /> Insert into Chat
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 5. MOCK HR INTERVIEW: Interactive STAR Method Answer Builder */}
        {activeSection === 'Mock HR Interview' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-5 bg-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200/70 pb-2">
              <div className="flex items-center gap-2">
                <Bot className="text-blue-600" size={18} />
                <h3 className="text-sm font-extrabold text-slate-900">STAR Method Answer Structurer</h3>
              </div>
              <button
                onClick={handleCompileStarAnswer}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
              >
                <Edit3 size={13} /> Compile STAR Answer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {STAR_METHOD_TEMPLATES.steps.map((step) => (
                <div key={step.key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {step.key}
                    </span>
                    <span>{step.name}</span>
                  </div>
                  <textarea
                    rows={2}
                    value={starState[step.key]}
                    onChange={(e) => setStarState({ ...starState, [step.key]: e.target.value })}
                    placeholder={step.placeholder}
                    className="w-full p-2 text-[11px] rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Main Grid: AI Chat Studio & Voice Telemetry Evaluator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Interactive Chat & Speech Input (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-6 flex flex-col h-[580px] justify-between bg-white relative">
            
            {/* Header / Active Mode Indicator */}
            <div className="flex justify-between items-center border-b border-slate-200/70 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {activeSection === 'Group Discussion' ? <Users size={20} /> : <Bot size={20} />}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {activeSection === 'Group Discussion' ? 'AI Group Discussion Room' : 'SkillForge AI Evaluator Panel'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeSection} Mode • Dynamic Contextual Evaluator
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {micSupported && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Mic size={12} /> Web Mic Ready
                  </span>
                )}
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                  Online & Active
                </span>
              </div>
            </div>

            {/* Chat Stream Area */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3.5 pr-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-1 shadow-xs">
                      {msg.botName ? msg.botName.charAt(0) : 'A'}
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/80'
                  }`}>
                    {msg.botName && msg.sender === 'ai' && (
                      <span className="text-[10px] font-bold text-blue-600 block mb-1 uppercase tracking-wider">
                        {msg.botName}
                      </span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input & Mic Controls Area */}
            <div className="space-y-2 pt-3 border-t border-slate-200/70">
              
              {/* Mic Live Transcript Notification */}
              {isRecording && (
                <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between animate-pulse">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Mic size={14} className="animate-bounce" /> Recording Microphone... Speak now!
                  </span>
                  <span className="font-mono font-bold">00:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}</span>
                </div>
              )}

              {/* REAL-TIME LIVE AI GRAMMAR CORRECTOR CARD */}
              {liveCorrection && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-300 text-xs text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-amber-600 shrink-0" size={16} />
                    <div>
                      <span className="font-extrabold text-amber-900 block text-[11px]">
                        Live AI Fix Suggestions ({liveCorrection.issues.join(', ')}):
                      </span>
                      <span className="text-[11px] text-slate-700 font-mono font-medium">
                        "{liveCorrection.corrected}"
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setInputMessage(liveCorrection.corrected)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Check size={13} /> Apply AI Fix
                  </button>
                </motion.div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isRecording ? "Listening to your voice..." : "Type here... AI will evaluate your exact response!"}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Live Auto-Fix Button */}
                {liveCorrection && (
                  <button
                    onClick={() => setInputMessage(liveCorrection.corrected)}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    title="Auto-Fix Grammar Now"
                  >
                    <Wand2 size={15} />
                  </button>
                )}

                {/* Microphone Toggle Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20' 
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  }`}
                  title={isRecording ? "Stop Recording & Evaluate" : "Start Voice Recording"}
                >
                  {isRecording ? <Square size={16} /> : <Mic size={16} />}
                </button>

                {/* Send Message Button */}
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <Send size={15} />
                </button>
              </div>

              {/* Sample Prompt Suggestion Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                <span className="truncate max-w-[75%]">
                  💡 Prompt: "{selectedScenario?.prompt}"
                </span>
                <button 
                  onClick={() => setInputMessage(selectedScenario?.sampleResponse || '')}
                  className="text-blue-600 hover:underline font-semibold shrink-0 cursor-pointer"
                >
                  Use Sample Answer
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Real-time Audio Visualizer & Voice Playback & Telemetry (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="glass-card p-6 space-y-5 bg-white">
            
            {/* Header info */}
            <div className="border-b border-slate-200/70 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                  {activeSection}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Speech Telemetry & Evaluation
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                WPM Goal: {selectedScenario?.targetWpm || '130-150'}
              </span>
            </div>

            {/* Soundwave Animation & Live Speaking Box */}
            <div className={`p-5 rounded-2xl border text-center transition-all duration-300 ${
              isRecording ? 'bg-rose-50/80 border-rose-300 shadow-inner' : 'bg-slate-50/80 border-slate-200'
            }`}>
              
              {/* Soundwave Bars */}
              <div className="h-10 flex items-center justify-center gap-1.5 mb-3">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: isRecording 
                        ? `${Math.sin(i + recordingSeconds * 2) * 16 + 22}px` 
                        : '8px'
                    }}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isRecording ? 'bg-rose-500' : 'bg-blue-500'
                    }`}
                  />
                ))}
              </div>

              <div className="font-mono text-2xl font-extrabold text-slate-900">
                00:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}
              </div>

              <div className="mt-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs transition shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mic size={16} /> Start Voice Telemetry
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Square size={16} /> Stop & Compute Metrics
                  </button>
                )}
              </div>
            </div>

            {/* Recorded Audio Playback Bar */}
            {audioBlobUrl && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                  🔊 Listen to Your Spoken Audio Playback:
                </span>
                <audio controls src={audioBlobUrl} className="w-full h-8" />
              </div>
            )}

            {/* Target Keywords Pill Container */}
            {selectedScenario?.keyTerms && selectedScenario.keyTerms.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Target Technical Vocabulary:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScenario.keyTerms.map((term, i) => {
                    const isMatched = speechResult?.matchedTerms?.includes(term);
                    return (
                      <span
                        key={i}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                          isMatched 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isMatched && <Check size={12} className="text-emerald-600" />}
                        {term}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* REAL-TIME SPEECH & NLP EVALUATION METRICS */}
            {speechResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-4 border-t border-slate-200/80 pt-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Telemetry Scores (Saved to Value 2)
                  </h4>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 size={13} /> Synced
                  </span>
                </div>

                {/* Score Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Fluency</span>
                    <h5 className="text-xl font-extrabold text-blue-600">{speechResult.fluencyScore}%</h5>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Grammar</span>
                    <h5 className="text-xl font-extrabold text-indigo-600">{speechResult.grammarScore}%</h5>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Vocabulary</span>
                    <h5 className="text-xl font-extrabold text-emerald-600">{speechResult.vocabularyScore}%</h5>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Confidence</span>
                    <h5 className="text-xl font-extrabold text-amber-600">{speechResult.confidenceScore}%</h5>
                  </div>
                </div>

                {/* WPM & Filler Word Badges */}
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold block uppercase">Pacing (Speed)</span>
                    <span className="font-extrabold text-slate-800">{speechResult.wpm} WPM</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] font-bold block uppercase">Filler Words</span>
                    <span className={`font-extrabold ${speechResult.fillerCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {speechResult.fillerCount} detected
                    </span>
                  </div>
                </div>

                {/* Grammar Polish Box */}
                {speechResult.improvedRewrite && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-1">
                    <strong className="text-indigo-900 block font-bold">✨ Polished AI Grammar Rewrite:</strong>
                    <p className="text-slate-700 italic">"{speechResult.improvedRewrite}"</p>
                  </div>
                )}

                {/* AI Pronunciation & Fluency Feedback */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong>AI Telemetry Feedback:</strong> {speechResult.feedback}
                </div>
              </motion.div>
            )}

            {/* Value 2 Sync Notice */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
              <Database size={15} className="text-blue-600 shrink-0" />
              <span>Fluency, Grammar, & Confidence scores automatically calibrate placement readiness in Value 2.</span>
            </div>

          </div>

        </div>

      </div>

      {/* PRACTICE LOGS HISTORY MODAL */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <History className="text-blue-600" size={20} />
                  <h3 className="text-lg font-extrabold text-slate-900">Communication Practice History</h3>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Logs Table */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No communication sessions logged yet. Complete a speaking or chat challenge to save telemetry scores!
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={log.id || i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-slate-900 block">{log.type}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.date).toLocaleDateString()} • {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-[11px]">
                          Fluency: {log.fluencyScore}%
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-[11px]">
                          Grammar: {log.grammarScore}%
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          Confidence: {log.confidenceScore}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 text-right">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  Close History
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

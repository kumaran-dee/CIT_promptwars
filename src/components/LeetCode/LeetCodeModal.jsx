import React, { useState } from 'react';
import { useSkillForge } from '../../context/SkillForgeContext';
import { X, Code, CheckCircle2, AlertTriangle, ExternalLink, ArrowRight, RefreshCw, Sparkles, UserX, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LeetCodeModal = ({ isOpen, onClose }) => {
  const { user, value2, leetCodeStudyCases, syncLeetCodeProfile, setActiveTab } = useSkillForge();
  const [handleInput, setHandleInput] = useState(user.leetCodeHandle || '');
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync result state: null | "valid" | "not_found" | "cors_blocked" | "empty"
  const [syncResult, setSyncResult] = useState(null);
  const [lastSyncedHandle, setLastSyncedHandle] = useState(null);

  const solvedSet = value2.leetCodeSolvedCases && value2.leetCodeSolvedCases.length > 0
    ? value2.leetCodeSolvedCases
    : ['lc_1', 'lc_206', 'lc_175'];

  const completedCases = leetCodeStudyCases.filter(lc => solvedSet.includes(lc.id));
  const pendingCases = leetCodeStudyCases.filter(lc => !solvedSet.includes(lc.id));

  const completedEasy   = completedCases.filter(c => c.difficulty === 'Easy').length;
  const completedMedium = completedCases.filter(c => c.difficulty === 'Medium').length;
  const completedHard   = completedCases.filter(c => c.difficulty === 'Hard').length;
  const pendingEasy     = pendingCases.filter(c => c.difficulty === 'Easy').length;
  const pendingMedium   = pendingCases.filter(c => c.difficulty === 'Medium').length;
  const pendingHard     = pendingCases.filter(c => c.difficulty === 'Hard').length;

  const handleSync = async () => {
    const trimmed = handleInput.trim();
    if (!trimmed) {
      setSyncResult({ status: 'empty' });
      return;
    }
    setIsSyncing(true);
    setSyncResult(null);
    setLastSyncedHandle(trimmed);
    const result = await syncLeetCodeProfile(trimmed);
    setSyncResult(result);
    setIsSyncing(false);
  };

  if (!isOpen) return null;

  const isValidConfirmed = syncResult?.status === 'valid';
  const isNotFound       = syncResult?.status === 'not_found';
  const isCorsBlocked    = syncResult?.status === 'cors_blocked';
  const isEmpty          = syncResult?.status === 'empty';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-lg p-6 bg-white shadow-2xl rounded-2xl space-y-5 border border-slate-200"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold">
                <Code size={22} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">LeetCode Profile & Case Sync</h3>
                <p className="text-xs text-slate-500">Enter your LeetCode username to validate & sync</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
              <X size={18} />
            </button>
          </div>

          {/* Handle Input */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">LeetCode Username:</span>
              {isValidConfirmed && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> Verified Valid User
                </span>
              )}
              {isNotFound && (
                <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <UserX size={10} /> Username Not Found
                </span>
              )}
              {isCorsBlocked && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldAlert size={10} /> Browser CORS Restricted
                </span>
              )}
              {!syncResult && user.leetCodeHandle && (
                <span className="text-[10px] font-medium text-slate-400">Current: {user.leetCodeHandle}</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={handleInput}
                onChange={(e) => { setHandleInput(e.target.value); setSyncResult(null); }}
                onKeyDown={(e) => e.key === 'Enter' && !isSyncing && handleSync()}
                className={"flex-1 px-3 py-2 rounded-lg text-xs font-mono bg-white border focus:outline-none focus:ring-2 " +
                  (isNotFound ? "border-rose-400 focus:ring-rose-400" :
                   isValidConfirmed ? "border-emerald-400 focus:ring-emerald-400" :
                   "border-slate-300 focus:ring-amber-500")}
                placeholder="e.g. Deepakkumaran_21"
              />
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className={"px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap " +
                  (isSyncing ? "bg-amber-400 text-white cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 text-white")}
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Checking...' : 'Verify & Sync'}
              </button>
            </div>

            {/* Result Messages */}
            <AnimatePresence mode="wait">

              {/* ✅ Valid user confirmed by LeetCode API */}
              {isValidConfirmed && syncResult?.stats && (
                <motion.div key="valid" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs flex items-start gap-2">
                  <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-emerald-900 mb-0.5">
                      ✓ Valid LeetCode User: <span className="font-mono">{lastSyncedHandle}</span>
                    </p>
                    <p className="text-emerald-800">
                      Profile synced! Total Solved: <strong>{syncResult.stats.totalSolved}</strong>
                      &nbsp;(Easy: {syncResult.stats.easy} / Medium: {syncResult.stats.medium} / Hard: {syncResult.stats.hard}).
                      Topic data updated in Value 2.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ❌ Username does not exist on LeetCode */}
              {isNotFound && (
                <motion.div key="not_found" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs flex items-start gap-2">
                  <UserX size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-rose-900 mb-0.5">
                      Username "<span className="font-mono">{lastSyncedHandle}</span>" does not exist on LeetCode.
                    </p>
                    <p className="text-rose-800">
                      Please check your username carefully. You can find it on your&nbsp;
                      <a href="https://leetcode.com/profile/" target="_blank" rel="noreferrer" className="underline font-bold">
                        LeetCode profile page
                      </a>.
                      Your profile was NOT updated.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ⚠️ Browser CORS blocks the API — can't confirm validity */}
              {isCorsBlocked && (
                <motion.div key="cors" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs flex items-start gap-2">
                  <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-amber-900 mb-0.5">Cannot verify — browser blocks LeetCode API (CORS)</p>
                    <p className="text-amber-800">
                      Your browser's security policy blocks direct API calls to LeetCode. 
                      We cannot confirm if "<span className="font-mono font-bold">{lastSyncedHandle}</span>" is a valid username. 
                      Your profile was <strong>not updated</strong> to avoid saving incorrect data.
                    </p>
                    <p className="text-amber-700 mt-1 font-semibold">
                      Try: Verifying on&nbsp;
                      <a href={"https://leetcode.com/u/" + lastSyncedHandle + "/"} target="_blank" rel="noreferrer" className="underline">
                        leetcode.com/u/{lastSyncedHandle}
                      </a>
                      &nbsp;to confirm the username exists.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Empty input */}
              {isEmpty && (
                <motion.div key="empty" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-700 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-slate-500 shrink-0" />
                  Please enter your LeetCode username before syncing.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Grid — only show if valid confirmed */}
          {isValidConfirmed && syncResult?.stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Easy Solved</span>
                <h4 className="text-lg font-extrabold text-emerald-700">{syncResult.stats.easy}</h4>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Medium Solved</span>
                <h4 className="text-lg font-extrabold text-amber-700">{syncResult.stats.medium}</h4>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase">Hard Solved</span>
                <h4 className="text-lg font-extrabold text-rose-700">{syncResult.stats.hard}</h4>
              </div>
            </motion.div>
          )}

          {/* If NOT yet synced successfully, show current saved stats (dimmed) */}
          {!isValidConfirmed && user.leetCodeStats && (
            <div className="grid grid-cols-3 gap-3 text-center opacity-50">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Easy Solved</span>
                <h4 className="text-lg font-extrabold text-emerald-700">{user.leetCodeStats?.easy ?? 0}</h4>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Medium Solved</span>
                <h4 className="text-lg font-extrabold text-amber-700">{user.leetCodeStats?.medium ?? 0}</h4>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase">Hard Solved</span>
                <h4 className="text-lg font-extrabold text-rose-700">{user.leetCodeStats?.hard ?? 0}</h4>
              </div>
            </div>
          )}

          {/* Pipeline Info */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">Completed Cases (Used in Tests):</span>
                  <span className="text-[10px] text-slate-500 block">({completedEasy} Easy, {completedMedium} Medium, {completedHard} Hard)</span>
                </div>
              </div>
              <span className="font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">{completedCases.length} Cases</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">Pending Cases (Help to Learn Queue):</span>
                  <span className="text-[10px] text-slate-500 block">({pendingEasy} Easy, {pendingMedium} Medium, {pendingHard} Hard)</span>
                </div>
              </div>
              <span className="font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">{pendingCases.length} Cases</span>
            </div>
          </div>

          <button
            onClick={() => { onClose(); setActiveTab('practice'); }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
          >
            Go to LeetCode Practice Workspace <ArrowRight size={14} />
          </button>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Search, Terminal, Loader } from 'lucide-react';
import clsx from 'clsx';
import type { Job, UserProfile, ApplicationRecord, AgentLog } from '../types.ts';
import { ApplicationStatus } from '../types.ts';
import { MOCK_JOBS } from '../services/mockData.ts';
import { analyzeJobFit, generateCoverLetter } from '../services/geminiService.ts';

interface AgentViewProps {
  profile: UserProfile;
  applications: ApplicationRecord[];
  addApplication: (app: ApplicationRecord) => void;
}

const AgentView: React.FC<AgentViewProps> = ({ profile, applications, addApplication }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [progress, setProgress] = useState(0); // 0 to 100 for current task
  const [task, setTask] = useState<string>("Idle");
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, type: AgentLog['type'] = 'info') => {
    setLogs(prev => [...prev, { timestamp: Date.now(), message, type }]);
  };

  const processJob = async (job: Job) => {
    // 1. Scan
    setCurrentJob(job);
    setTask("Scanning Job Boards...");
    addLog(`Found new listing: ${job.title} at ${job.company}`, 'info');
    await new Promise(r => setTimeout(r, 1500)); // Simulate network

    // 2. Analyze
    setTask("Analyzing Fit (Gemini AI)...");
    setProgress(30);
    const fit = await analyzeJobFit(profile, job);
    
    if (!fit.isMatch) {
      addLog(`Skipping: Low match score (${fit.score}%). Reason: ${fit.reason}`, 'warning');
      addApplication({
        id: Math.random().toString(36),
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        status: ApplicationStatus.REJECTED,
        matchScore: fit.score,
        matchReason: fit.reason,
        timestamp: Date.now()
      });
      setProgress(100);
      return;
    }

    addLog(`High Match (${fit.score}%)! Reason: ${fit.reason}`, 'success');
    
    // 3. Generate Cover Letter
    setTask("Generating Cover Letter...");
    setProgress(60);
    const coverLetter = await generateCoverLetter(profile, job);
    addLog("Cover letter generated.", 'info');
    await new Promise(r => setTimeout(r, 1000));

    // 4. Apply
    setTask("Submitting Application...");
    setProgress(90);
    await new Promise(r => setTimeout(r, 1500)); // Simulate form filling
    
    addLog(`Successfully applied to ${job.company}`, 'success');
    addApplication({
      id: Math.random().toString(36),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      status: ApplicationStatus.APPLIED,
      matchScore: fit.score,
      matchReason: fit.reason,
      coverLetter: coverLetter,
      timestamp: Date.now()
    });

    setProgress(100);
    setTask("Cooldown...");
    await new Promise(r => setTimeout(r, 1000));
  };

  const startAgent = async () => {
    if (isRunning) return;
    setIsRunning(true);
    addLog("Agent started. Initializing...", 'info');
    
    // Simple queue processing simulation
    const jobsToProcess = MOCK_JOBS.filter((j: Job) => !applications.find(a => a.jobId === j.id));
    
    if (jobsToProcess.length === 0) {
        addLog("No new jobs found in feed.", 'warning');
        setIsRunning(false);
        setTask("Idle");
        return;
    }

    for (const job of jobsToProcess) {
      if (!isRunning) break; // Check interrupt
      await processJob(job);
    }

    setIsRunning(false);
    setTask("Finished");
    setCurrentJob(null);
    addLog("Batch processing complete.", 'info');
  };

  const stopAgent = () => {
    setIsRunning(false);
    setTask("Stopping...");
    addLog("Agent stopped by user.", 'warning');
  };

  // Toggle handler wrapper
  const toggleAgent = () => {
      if (isRunning) stopAgent();
      else startAgent();
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      
      {/* Left Panel: Status & Controls */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Status Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg shadow-indigo-100 border border-indigo-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Agent Status</h2>
              <div className="flex items-center mt-2 space-x-2">
                <span className={clsx("relative flex h-3 w-3")}>
                    {isRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                    <span className={clsx("relative inline-flex rounded-full h-3 w-3", isRunning ? "bg-green-500" : "bg-slate-400")}></span>
                </span>
                <span className="text-slate-500 font-medium">{isRunning ? "Active & Running" : "Offline"}</span>
              </div>
            </div>

            <button
              onClick={toggleAgent}
              className={clsx(
                "px-8 py-4 rounded-xl font-bold text-lg flex items-center shadow-lg transition-all transform hover:scale-105 active:scale-95",
                isRunning 
                  ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-300"
              )}
            >
              {isRunning ? <><Pause className="mr-2 fill-current" /> Stop Agent</> : <><Play className="mr-2 fill-current" /> Start Agent</>}
            </button>
          </div>

          {/* Current Action Display */}
          <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-100">
            <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
               <span>Current Task</span>
               <span>{progress}%</span>
            </div>
            <div className="text-xl font-semibold text-slate-800 flex items-center">
                {isRunning && <Loader className="w-5 h-5 mr-3 animate-spin text-indigo-600"/>}
                {task}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Live Job Card */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-indigo-500"/>
                Current Target
            </h3>
            
            {currentJob ? (
                <div className="flex-1 flex flex-col animate-fade-in">
                    <div className="flex items-start gap-4 mb-6">
                        <img src={currentJob.logo} alt="Logo" className="w-16 h-16 rounded-xl bg-slate-100 object-cover" />
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">{currentJob.title}</h4>
                            <p className="text-slate-600 font-medium">{currentJob.company} • {currentJob.location}</p>
                            <div className="flex gap-2 mt-2">
                                {currentJob.tags.map(t => (
                                    <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed flex-1 overflow-y-auto">
                        {currentJob.description}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                    <Search className="w-12 h-12 mb-2 opacity-20" />
                    <p>Agent is waiting for jobs...</p>
                </div>
            )}
        </div>
      </div>

      {/* Right Panel: Terminal Logs */}
      <div className="bg-slate-900 rounded-2xl p-4 shadow-xl flex flex-col font-mono text-sm overflow-hidden h-full">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-2">
            <div className="flex items-center text-slate-400">
                <Terminal className="w-4 h-4 mr-2" />
                <span>Agent Logs</span>
            </div>
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {logs.length === 0 && (
                <div className="text-slate-600 italic">Ready to start...</div>
            )}
            {logs.map((log, i) => (
                <div key={i} className="flex gap-3 animate-fade-in-up">
                    <span className="text-slate-600 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                    </span>
                    <span className={clsx(
                        "break-words",
                        log.type === 'success' && "text-green-400",
                        log.type === 'error' && "text-red-400",
                        log.type === 'warning' && "text-yellow-400",
                        log.type === 'info' && "text-blue-300",
                    )}>
                        {log.type === 'success' && "✓ "}
                        {log.type === 'error' && "✗ "}
                        {log.message}
                    </span>
                </div>
            ))}
            <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default AgentView;
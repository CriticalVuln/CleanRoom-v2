import React, { useState, useEffect, useCallback } from 'react';
import { Play, Square, Clock } from 'lucide-react';
import { PomodoroSession } from '../types';

interface PomodoroTimerProps {
  todoId: string;
  onSessionComplete: (session: PomodoroSession) => void;
  onTimeUpdate: (minutes: number) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  todoId, 
  onSessionComplete, 
  onTimeUpdate 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // elapsed time in seconds

  const storageKey = `pomodoro-${todoId}`;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load timer state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const { sessionId: savedSessionId, sessionStartTime: savedStartTime, isRunning: savedIsRunning } = JSON.parse(savedState);
        if (savedIsRunning && savedStartTime && savedSessionId) {
          const startTime = new Date(savedStartTime);
          setSessionId(savedSessionId);
          setSessionStartTime(startTime);
          setIsRunning(true);
          
          // Immediately calculate and set the elapsed time
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
          setElapsedTime(elapsed);
        }
      } catch (error) {
        console.error('Error loading timer state:', error);
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (isRunning && sessionStartTime && sessionId) {
      localStorage.setItem(storageKey, JSON.stringify({
        sessionId,
        sessionStartTime: sessionStartTime.toISOString(),
        isRunning: true
      }));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [isRunning, sessionStartTime, sessionId, storageKey]);

  const updateElapsedTime = useCallback(() => {
    if (sessionStartTime && isRunning) {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }
  }, [sessionStartTime, isRunning]);

  const toggleTimer = useCallback(() => {
    if (!isRunning) {
      // Start the timer
      const newSessionId = `${todoId}-${Date.now()}`;
      const startTime = new Date();
      setSessionId(newSessionId);
      setSessionStartTime(startTime);
      setIsRunning(true);
      setElapsedTime(0);
    } else {
      // Stop the timer and complete the session
      if (sessionId && sessionStartTime) {
        const endTime = new Date();
        const actualDuration = Math.round((endTime.getTime() - sessionStartTime.getTime()) / 60000);
        
        const session: PomodoroSession = {
          id: sessionId,
          startTime: sessionStartTime,
          endTime,
          duration: actualDuration,
          completed: true
        };

        onSessionComplete(session);
        onTimeUpdate(actualDuration);
      }
      
      setIsRunning(false);
      setElapsedTime(0);
      setSessionId(null);
      setSessionStartTime(null);
    }
  }, [isRunning, todoId, sessionId, sessionStartTime, onSessionComplete, onTimeUpdate]);

  const resetTimer = useCallback(() => {
    if (sessionId && sessionStartTime && isRunning) {
      const endTime = new Date();
      const actualDuration = Math.round((endTime.getTime() - sessionStartTime.getTime()) / 60000);
      
      const session: PomodoroSession = {
        id: sessionId,
        startTime: sessionStartTime,
        endTime,
        duration: actualDuration,
        completed: false
      };

      onSessionComplete(session);
      onTimeUpdate(actualDuration);
    }
    
    setIsRunning(false);
    setElapsedTime(0);
    setSessionId(null);
    setSessionStartTime(null);
  }, [sessionId, sessionStartTime, isRunning, onSessionComplete, onTimeUpdate]);

  // Update elapsed time based on actual timestamps
  useEffect(() => {
    let interval: number;

    if (isRunning && sessionStartTime) {
      // Update immediately
      updateElapsedTime();
      
      // Then update every second
      interval = setInterval(() => {
        updateElapsedTime();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, sessionStartTime, updateElapsedTime]);

  // Ensure timer is updated immediately when component has a running timer
  useEffect(() => {
    if (isRunning && sessionStartTime) {
      updateElapsedTime();
    }
  }, [isRunning, sessionStartTime, updateElapsedTime]);

  // Handle page visibility changes to ensure accurate timing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isRunning) {
        // Page became visible, update the time immediately
        updateElapsedTime();
      }
    };

    const handleFocus = () => {
      if (isRunning) {
        // Window got focus, update the time immediately
        updateElapsedTime();
      }
    };

    const handlePageShow = () => {
      if (isRunning) {
        // Page was restored from bfcache (important for mobile browsers)
        updateElapsedTime();
      }
    };

    const handleResume = () => {
      if (isRunning) {
        // App resumed from background (mobile)
        updateElapsedTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('resume', handleResume);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('resume', handleResume);
    };
  }, [isRunning, updateElapsedTime]);

  // Calculate progress as a percentage (for visual indicator after 25 minutes)
  const progress = Math.min((elapsedTime / (25 * 60)) * 100, 100);

  return (
    <div className="flex items-center gap-2 ml-2">
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-mono bg-white dark:bg-gray-800">
          <Clock size={12} className={isRunning ? 'text-green-500' : 'text-gray-500'} />
        </div>
        {isRunning && elapsedTime > 0 && (
          <div 
            className="absolute inset-0 rounded-full border-2 border-green-500"
            style={{
              background: `conic-gradient(from 0deg, #22c55e ${progress}%, transparent ${progress}%)`
            }}
          />
        )}
      </div>
      
      <span className="text-xs font-mono text-gray-600 dark:text-gray-400 min-w-[50px]">
        {formatTime(elapsedTime)}
      </span>

      <div className="flex gap-1">
        <button
          onClick={toggleTimer}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isRunning ? "Stop Timer" : "Start Timer"}
        >
          {!isRunning ? (
            <Play size={12} className="text-green-600" />
          ) : (
            <Square size={12} className="text-red-600" />
          )}
        </button>
        
        {(isRunning || elapsedTime > 0) && (
          <button
            onClick={resetTimer}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Reset Timer"
          >
            <Square size={12} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;

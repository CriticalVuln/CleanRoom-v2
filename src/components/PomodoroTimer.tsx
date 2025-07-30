import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    if (!isRunning) {
      const newSessionId = `${todoId}-${Date.now()}`;
      const startTime = new Date();
      setSessionId(newSessionId);
      setSessionStartTime(startTime);
      setIsRunning(true);
    }
  }, [isRunning, todoId]);

  const pauseTimer = useCallback(() => {
    if (isRunning && sessionId && sessionStartTime) {
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
    setSessionId(null);
    setSessionStartTime(null);
  }, [isRunning, sessionId, sessionStartTime, onSessionComplete, onTimeUpdate]);

  const stopTimer = useCallback(() => {
    if (sessionId && sessionStartTime) {
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
    setTimeLeft(25 * 60);
    setSessionId(null);
    setSessionStartTime(null);
  }, [sessionId, sessionStartTime, onSessionComplete, onTimeUpdate]);

  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed
            if (sessionId && sessionStartTime) {
              const endTime = new Date();
              const session: PomodoroSession = {
                id: sessionId,
                startTime: sessionStartTime,
                endTime,
                duration: 25,
                completed: true
              };
              onSessionComplete(session);
              onTimeUpdate(25);
            }
            setIsRunning(false);
            setSessionId(null);
            setSessionStartTime(null);
            return 25 * 60; // Reset to 25 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, sessionId, sessionStartTime, onSessionComplete, onTimeUpdate]);

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="flex items-center gap-2 ml-2">
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-mono bg-white dark:bg-gray-800">
          <Clock size={12} className={isRunning ? 'text-orange-500' : 'text-gray-500'} />
        </div>
        {isRunning && (
          <div 
            className="absolute inset-0 rounded-full border-2 border-orange-500"
            style={{
              background: `conic-gradient(from 0deg, #f97316 ${progress}%, transparent ${progress}%)`
            }}
          />
        )}
      </div>
      
      <span className="text-xs font-mono text-gray-600 dark:text-gray-400 min-w-[40px]">
        {formatTime(timeLeft)}
      </span>

      <div className="flex gap-1">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Start Pomodoro (25 min)"
          >
            <Play size={12} className="text-green-600" />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Pause Pomodoro"
          >
            <Pause size={12} className="text-yellow-600" />
          </button>
        )}
        
        <button
          onClick={stopTimer}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Stop Pomodoro"
        >
          <Square size={12} className="text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  completedAt?: Date;
  category?: string;
  timeSpent: number; // in minutes
  pomodoroSessions: PomodoroSession[];
}

export interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes (25 for complete, partial for incomplete)
  completed: boolean;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completedToday: number;
  streak: number;
  totalTimeSpent: number; // in minutes
  averageTimePerTask: number; // in minutes
}

export interface TimeData {
  date: string;
  totalMinutes: number;
}

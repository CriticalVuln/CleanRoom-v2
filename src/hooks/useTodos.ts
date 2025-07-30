import { useState, useEffect } from 'react';
import { Todo, TodoStats, TimeData } from '../types';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import { sampleTodos } from '../data/sampleData';

const STORAGE_KEY = 'todo-dashboard-data';
const SETTINGS_KEY = 'todo-dashboard-settings';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setTodos(parsed.todos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          timeSpent: todo.timeSpent || 0,
          pomodoroSessions: todo.pomodoroSessions?.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined,
          })) || [],
        })));
      } else {
        // If no data in localStorage, use sample data
        setTodos(sampleTodos);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      setTodos(sampleTodos);
    }
    
    // Load settings including dark mode preference
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDarkMode(settings.darkMode ?? false);
      } else {
        // Check system preference if no saved settings
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isDark);
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
    }
    
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        todos,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ 
        darkMode,
        lastUpdated: new Date().toISOString()
      }));
      document.documentElement.classList.toggle('dark', darkMode);
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [darkMode]);

  const addTodo = (text: string, priority: Todo['priority'] = 'medium', category?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      createdAt: new Date(),
      category,
      timeSpent: 0,
      pomodoroSessions: [],
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date() : undefined
          }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
  };

  const getStats = (): TodoStats => {
    const currentDate = new Date('2025-07-30'); // Current date: July 30, 2025
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    // Check if today (July 30, 2025) has completed tasks
    const todayStart = startOfDay(currentDate);
    const todayEnd = endOfDay(currentDate);
    const completedToday = todos.filter(todo => 
      todo.completed && 
      todo.completedAt && 
      todo.completedAt >= todayStart && 
      todo.completedAt <= todayEnd
    ).length;
    
    // Calculate streak (consecutive days with completed tasks) up to current date
    let streak = 0;
    let checkDate = new Date(currentDate);
    
    while (true) {
      const dayStart = startOfDay(checkDate);
      const dayEnd = endOfDay(checkDate);
      
      const hasCompletedTask = todos.some(todo => 
        todo.completed && 
        todo.completedAt && 
        todo.completedAt >= dayStart && 
        todo.completedAt <= dayEnd
      );
      
      if (hasCompletedTask) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else if (checkDate.getTime() === currentDate.getTime()) {
        // If current date has no completed tasks, continue checking yesterday
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    const totalTimeSpent = todos.reduce((sum, todo) => sum + (todo.timeSpent || 0), 0);
    const averageTimePerTask = completed > 0 ? totalTimeSpent / completed : 0;

    return { total, completed, pending, completedToday, streak, totalTimeSpent, averageTimePerTask };
  };

  const getPriorityStats = () => {
    const stats = { low: 0, medium: 0, high: 0 };
    todos.forEach(todo => {
      if (!todo.completed) {
        stats[todo.priority]++;
      }
    });
    return stats;
  };

  const getCompletionTrend = () => {
    const trend = [];
    const currentDate = new Date('2025-07-30'); // Current date: July 30, 2025
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(currentDate, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      // Include data up to and including current date
      if (date <= currentDate) {
        const completed = todos.filter(todo => 
          todo.completed && 
          todo.completedAt && 
          todo.completedAt >= dayStart && 
          todo.completedAt <= dayEnd
        ).length;
        
        trend.push({
          date: format(date, 'MMM dd'),
          completed
        });
      }
    }
    
    return trend;
  };

  const getTimeAnalytics = (): TimeData[] => {
    const data: TimeData[] = [];
    const currentDate = new Date('2025-07-30'); // Current date: July 30, 2025
    
    // Generate data for the last 30 days up to current date
    for (let i = 29; i >= 0; i--) {
      const date = subDays(currentDate, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      // Only include data up to current date
      if (date > currentDate) continue;
      
      // Calculate total time spent on tasks completed on this day
      const dayTodos = todos.filter(todo => {
        if (!todo.completedAt) return false;
        return todo.completedAt >= dayStart && todo.completedAt <= dayEnd;
      });
      
      // Also include time from pomodoro sessions on this day
      let totalMinutes = 0;
      
      // Add completed task time
      totalMinutes += dayTodos.reduce((sum, todo) => sum + (todo.timeSpent || 0), 0);
      
      // Add time from pomodoro sessions that occurred on this day
      todos.forEach(todo => {
        if (todo.pomodoroSessions) {
          todo.pomodoroSessions.forEach(session => {
            if (session.startTime >= dayStart && session.startTime <= dayEnd) {
              totalMinutes += session.duration;
            }
          });
        }
      });
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        totalMinutes,
      });
    }
    
    return data;
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setTodos([]);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    }
  };

  const loadSampleData = () => {
    if (confirm('This will replace your current tasks with sample data. Continue?')) {
      setTodos(sampleTodos);
    }
  };

  const exportData = () => {
    const dataToExport = {
      todos,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.todos && Array.isArray(data.todos)) {
          const importedTodos = data.todos.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          }));
          setTodos(importedTodos);
        }
      } catch (error) {
        alert('Invalid file format. Please select a valid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return {
    todos,
    darkMode,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    toggleDarkMode,
    getStats,
    getPriorityStats,
    getCompletionTrend,
    getTimeAnalytics,
    clearAllData,
    loadSampleData,
    exportData,
    importData,
  };
};

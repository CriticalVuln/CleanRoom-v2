// Sample data for demonstration
// This file shows the structure of data that would be stored

import { Todo } from '../types';

export const sampleTodos: Todo[] = [
  {
    id: '1',
    text: 'Complete project proposal',
    completed: true,
    priority: 'high' as const,
    createdAt: new Date('2025-07-28T09:00:00'),
    completedAt: new Date('2025-07-28T15:30:00'),
    category: 'Work',
    timeSpent: 120, // 2 hours
    pomodoroSessions: [
      {
        id: '1-1',
        startTime: new Date('2025-07-28T09:00:00'),
        endTime: new Date('2025-07-28T09:25:00'),
        duration: 25,
        completed: true
      },
      {
        id: '1-2',
        startTime: new Date('2025-07-28T09:30:00'),
        endTime: new Date('2025-07-28T09:55:00'),
        duration: 25,
        completed: true
      }
    ]
  },
  {
    id: '2', 
    text: 'Review team feedback',
    completed: true,
    priority: 'medium' as const,
    createdAt: new Date('2025-07-28T10:00:00'),
    completedAt: new Date('2025-07-28T16:00:00'),
    category: 'Work',
    timeSpent: 75, // 1.25 hours
    pomodoroSessions: [
      {
        id: '2-1',
        startTime: new Date('2025-07-28T14:00:00'),
        endTime: new Date('2025-07-28T14:25:00'),
        duration: 25,
        completed: true
      }
    ]
  },
  {
    id: '3',
    text: 'Buy groceries',
    completed: false,
    priority: 'low' as const,
    createdAt: new Date('2025-07-29T08:00:00'),
    category: 'Personal',
    timeSpent: 0,
    pomodoroSessions: []
  },
  {
    id: '4',
    text: 'Schedule dentist appointment',
    completed: false,
    priority: 'medium' as const,
    createdAt: new Date('2025-07-29T09:00:00'),
    category: 'Health',
    timeSpent: 15, // 15 minutes partial session
    pomodoroSessions: [
      {
        id: '4-1',
        startTime: new Date('2025-07-29T09:00:00'),
        endTime: new Date('2025-07-29T09:15:00'),
        duration: 15,
        completed: false
      }
    ]
  },
  {
    id: '5',
    text: 'Finish quarterly report',
    completed: false,
    priority: 'high' as const,
    createdAt: new Date('2025-07-30T07:00:00'),
    category: 'Work',
    timeSpent: 50, // 50 minutes
    pomodoroSessions: [
      {
        id: '5-1',
        startTime: new Date('2025-07-30T07:00:00'),
        endTime: new Date('2025-07-30T07:25:00'),
        duration: 25,
        completed: true
      }
    ]
  }
];

export const sampleStats = {
  total: 5,
  completed: 2,
  pending: 3,
  completedToday: 0,
  streak: 1
};

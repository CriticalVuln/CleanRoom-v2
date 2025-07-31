// Sample data for demonstration
// This file shows the structure of data that would be stored

import { Todo } from '../types';

export const sampleTodos: Todo[] = [
  {
    id: '1',
    text: 'Complete project proposal',
    completed: true,
    priority: 'high' as const,
    createdAt: new Date('2025-07-26T09:00:00'),
    completedAt: new Date('2025-07-26T15:30:00'),
    category: 'Work',
    timeSpent: 75, // 3 sessions × 25 minutes each
    pomodoroSessions: [
      {
        id: '1-1',
        startTime: new Date('2025-07-26T09:00:00'),
        endTime: new Date('2025-07-26T09:25:00'),
        duration: 25,
        completed: true
      },
      {
        id: '1-2',
        startTime: new Date('2025-07-26T09:30:00'),
        endTime: new Date('2025-07-26T09:55:00'),
        duration: 25,
        completed: true
      },
      {
        id: '1-3',
        startTime: new Date('2025-07-26T14:00:00'),
        endTime: new Date('2025-07-26T14:25:00'),
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
    createdAt: new Date('2025-07-27T10:00:00'),
    completedAt: new Date('2025-07-27T16:00:00'),
    category: 'Work',
    timeSpent: 50, // 2 sessions × 25 minutes each
    pomodoroSessions: [
      {
        id: '2-1',
        startTime: new Date('2025-07-27T14:00:00'),
        endTime: new Date('2025-07-27T14:25:00'),
        duration: 25,
        completed: true
      },
      {
        id: '2-2',
        startTime: new Date('2025-07-27T15:00:00'),
        endTime: new Date('2025-07-27T15:25:00'),
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
    createdAt: new Date('2025-07-28T09:00:00'),
    category: 'Health',
    timeSpent: 40, // 1 full session + 1 partial session
    pomodoroSessions: [
      {
        id: '4-1',
        startTime: new Date('2025-07-28T09:00:00'),
        endTime: new Date('2025-07-28T09:25:00'),
        duration: 25,
        completed: true
      },
      {
        id: '4-2',
        startTime: new Date('2025-07-28T10:00:00'),
        endTime: new Date('2025-07-28T10:15:00'),
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
    createdAt: new Date('2025-07-29T07:00:00'),
    category: 'Work',
    timeSpent: 25, // 1 session × 25 minutes
    pomodoroSessions: [
      {
        id: '5-1',
        startTime: new Date('2025-07-29T07:00:00'),
        endTime: new Date('2025-07-29T07:25:00'),
        duration: 25,
        completed: true
      }
    ]
  },
  {
    id: '6',
    text: 'Prepare presentation slides',
    completed: true,
    priority: 'high' as const,
    createdAt: new Date('2025-07-29T08:00:00'),
    completedAt: new Date('2025-07-30T17:00:00'),
    category: 'Work',
    timeSpent: 75, // 3 sessions × 25 minutes each
    pomodoroSessions: [
      {
        id: '6-1',
        startTime: new Date('2025-07-30T08:00:00'),
        endTime: new Date('2025-07-30T08:25:00'),
        duration: 25,
        completed: true
      },
      {
        id: '6-2',
        startTime: new Date('2025-07-30T09:00:00'),
        endTime: new Date('2025-07-30T09:25:00'),
        duration: 25,
        completed: true
      },
      {
        id: '6-3',
        startTime: new Date('2025-07-30T10:00:00'),
        endTime: new Date('2025-07-30T10:25:00'),
        duration: 25,
        completed: true
      }
    ]
  }
];

export const sampleStats = {
  total: 6,
  completed: 3,
  pending: 3,
  completedToday: 0,
  streak: 1
};

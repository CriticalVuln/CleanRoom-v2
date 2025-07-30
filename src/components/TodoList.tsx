import React, { useState } from 'react';
import { Todo, PomodoroSession } from '../types';
import { Check, X, Edit2, AlertCircle, Circle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import PomodoroTimer from './PomodoroTimer';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleTodo, onDeleteTodo, onUpdateTodo }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const handlePomodoroSession = (todoId: string, session: PomodoroSession) => {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      const updatedSessions = [...(todo.pomodoroSessions || []), session];
      onUpdateTodo(todoId, { pomodoroSessions: updatedSessions });
    }
  };

  const handleTimeUpdate = (todoId: string, additionalMinutes: number) => {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      const newTimeSpent = (todo.timeSpent || 0) + additionalMinutes;
      onUpdateTodo(todoId, { timeSpent: newTimeSpent });
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch = filter === 'all' || 
                       (filter === 'pending' && !todo.completed) || 
                       (filter === 'completed' && todo.completed);
    const priorityMatch = priorityFilter === 'all' || todo.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const getPriorityIcon = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Circle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Clock className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      onUpdateTodo(id, { text: editText.trim() });
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tasks ({filteredTodos.length})
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Done</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-1 focus:ring-purple-500"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto scroll-hide">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
            {filter === 'all' ? 'No tasks yet!' : `No ${filter} tasks found.`}
          </div>
        ) : (
          filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={`flex items-center gap-2 p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${getPriorityColor(todo.priority)} ${
                todo.completed ? 'opacity-60' : ''
              } animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => onToggleTodo(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                  todo.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                }`}
              >
                {todo.completed && <Check className="h-3 w-3" />}
              </button>

              <div className="flex items-center gap-1 flex-shrink-0">
                {getPriorityIcon(todo.priority)}
              </div>

              <div className="flex-1 min-w-0">
                {editingId === todo.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(todo.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p
                      className={`text-gray-900 dark:text-white ${
                        todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                      }`}
                    >
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {todo.category && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          {todo.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(todo.createdAt, 'MMM dd, yyyy')}
                      </span>
                      {todo.timeSpent > 0 && (
                        <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                          ⏱ {formatTime(todo.timeSpent)}
                        </span>
                      )}
                      {todo.completed && todo.completedAt && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          ✓ {format(todo.completedAt, 'MMM dd')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!todo.completed && editingId !== todo.id && (
                <PomodoroTimer
                  todoId={todo.id}
                  onSessionComplete={(session) => handlePomodoroSession(todo.id, session)}
                  onTimeUpdate={(minutes) => handleTimeUpdate(todo.id, minutes)}
                />
              )}

              {editingId !== todo.id && (
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(todo)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;

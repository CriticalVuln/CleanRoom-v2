import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Todo } from '../types';

interface TodoInputProps {
  onAddTodo: (text: string, priority: Todo['priority']) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text.trim(), priority);
      setText('');
      setPriority('medium');
    }
  };

  return (
    <div className="card theme-optimized p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
          
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Todo['priority'])}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <button
              type="submit"
              className="btn-primary flex items-center gap-1 px-4 py-2 text-sm"
              disabled={!text.trim()}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoInput;

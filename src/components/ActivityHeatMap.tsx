import React, { useState } from 'react';
import { format, getDaysInMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivityHeatMapProps {
  todos: any[];
}

const ActivityHeatMap: React.FC<ActivityHeatMapProps> = ({ todos }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Generate activity data for the year
  const generateActivityData = () => {
    const activityMap = new Map<string, number>();
    
    // Filter and process completed todos
    const completedTodos = todos.filter(todo => todo.completed && todo.completedAt);
    
    completedTodos.forEach(todo => {
      try {
        const completedDate = new Date(todo.completedAt);
        
        // Check if the completion date is valid and in the selected year
        if (!isNaN(completedDate.getTime()) && completedDate.getFullYear() === selectedYear) {
          const dateKey = format(completedDate, 'yyyy-MM-dd');
          activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
        }
      } catch (error) {
        console.warn('Invalid date in todo completedAt:', todo.completedAt);
      }
    });

    return activityMap;
  };

  const activityData = generateActivityData();

  // Generate calendar for a specific month (only actual days, no empty cells)
  const generateMonthCalendar = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(new Date(year, month));
    const days: Date[] = [];
    
    // Only add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Get activity level for styling (Custom levels)
  const getActivityLevel = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const count = activityData.get(dateKey) || 0;
    
    // Custom activity levels: 0 (none), 1 (1 task), 2 (2 tasks), 3 (3-4 tasks), 4 (5+ tasks)
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count >= 3 && count <= 4) return 3;
    return 4; // 5+ tasks
  };

  // Get CSS classes for activity level
  const getActivityClass = (level: number) => {
    const baseClass = "w-4 h-4 rounded-sm border border-gray-200 dark:border-gray-600";
    switch (level) {
      case 0: return `${baseClass} bg-gray-100 dark:bg-gray-700`;
      case 1: return `${baseClass} bg-orange-200 dark:bg-orange-800`;
      case 2: return `${baseClass} bg-orange-300 dark:bg-orange-700`;
      case 3: return `${baseClass} bg-orange-400 dark:bg-orange-600`;
      case 4: return `${baseClass} bg-orange-500 dark:bg-orange-500`;
      default: return `${baseClass} bg-gray-100 dark:bg-gray-700`;
    }
  };

  // Generate all months for the year (only actual days)
  const generateYearMonths = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      months.push({
        month,
        name: format(new Date(selectedYear, month), 'MMM'),
        days: generateMonthCalendar(selectedYear, month)
      });
    }
    return months;
  };

  const yearMonths = generateYearMonths();
  
  // Generate available years (current year and past 2 years)
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <div className="h-full flex flex-col">
      {/* Header with title and year selector */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          Activity Heat Map
        </h4>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Month navigation */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {yearMonths[selectedMonth].name}
          </div>
        </div>
        
        <button
          onClick={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main content area - calendar grid */}
      <div className="flex-1 flex justify-center items-center">
        <div className="space-y-1">
          {(() => {
            const currentMonth = yearMonths[selectedMonth];
            const daysPerRow = 7;
            const rows = [];
            
            for (let i = 0; i < currentMonth.days.length; i += daysPerRow) {
              const rowDays = currentMonth.days.slice(i, i + daysPerRow);
              rows.push(
                <div key={i} className="flex gap-1 justify-center">
                  {rowDays.map((date, dayIndex) => {
                    const activityLevel = getActivityLevel(date);
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    const taskCount = activityData.get(format(date, 'yyyy-MM-dd')) || 0;
                    
                    // GitHub-style tooltip
                    const tooltipText = taskCount === 0 
                      ? `No tasks completed on ${format(date, 'MMM d, yyyy')}`
                      : `${taskCount} task${taskCount === 1 ? '' : 's'} completed on ${format(date, 'MMM d, yyyy')}`;
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`
                          ${getActivityClass(activityLevel)}
                          ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                          cursor-pointer hover:scale-110 transition-transform
                        `}
                        title={tooltipText}
                      />
                    );
                  })}
                </div>
              );
            }
            
            return rows;
          })()}
        </div>
      </div>

      {/* Legend - Fixed at bottom */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className={getActivityClass(level)} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatMap;

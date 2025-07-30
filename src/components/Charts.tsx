import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartsProps {
  priorityStats: {
    '7days': { low: number; medium: number; high: number };
    '30days': { low: number; medium: number; high: number };
    '180days': { low: number; medium: number; high: number };
    '1year': { low: number; medium: number; high: number };
  };
  completionTrend: {
    '7days': { date: string; completed: number }[];
    '30days': { date: string; completed: number }[];
    '180days': { date: string; completed: number }[];
    '1year': { date: string; completed: number }[];
  };
}

const Charts: React.FC<ChartsProps> = ({ priorityStats, completionTrend }) => {
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days' | '180days' | '1year'>('7days');
  const [trendTimePeriod, setTrendTimePeriod] = useState<'7days' | '30days' | '180days' | '1year'>('7days');

  const currentPriorityStats = priorityStats[timePeriod];
  const currentTrendData = completionTrend[trendTimePeriod];

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [currentPriorityStats.high, currentPriorityStats.medium, currentPriorityStats.low],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const getTimePeriodLabel = (period: string) => {
    switch (period) {
      case '7days': return '7 Days';
      case '30days': return '30 Days';
      case '180days': return '6 Months';
      case '1year': return '1 Year';
      default: return '7 Days';
    }
  };

  const trendData = {
    labels: currentTrendData.map(item => item.date),
    datasets: [
      {
        label: 'Completed Tasks',
        data: currentTrendData.map(item => item.completed),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
        border: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
        border: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Priority Distribution */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Completed Task Priorities
          </h3>
          <div className="flex gap-1">
            {(['7days', '30days', '180days', '1year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  timePeriod === period
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {getTimePeriodLabel(period)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48">
          <Doughnut data={priorityData} options={doughnutOptions} />
        </div>
      </div>

      {/* Completion Trend */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Completed Tasks
          </h3>
          <div className="flex gap-1">
            {(['7days', '30days', '180days', '1year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTrendTimePeriod(period)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  trendTimePeriod === period
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {getTimePeriodLabel(period)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48">
          <Bar data={trendData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;

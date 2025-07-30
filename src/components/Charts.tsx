import React from 'react';
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
  priorityStats: { low: number; medium: number; high: number };
  completionTrend: { date: string; completed: number }[];
}

const Charts: React.FC<ChartsProps> = ({ priorityStats, completionTrend }) => {
  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [priorityStats.high, priorityStats.medium, priorityStats.low],
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

  const trendData = {
    labels: completionTrend.map(item => item.date),
    datasets: [
      {
        label: 'Completed Tasks',
        data: completionTrend.map(item => item.completed),
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
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Priority Distribution
        </h3>
        <div className="h-48">
          <Doughnut data={priorityData} options={doughnutOptions} />
        </div>
      </div>

      {/* Completion Trend */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          7-Day Trend
        </h3>
        <div className="h-48">
          <Bar data={trendData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;

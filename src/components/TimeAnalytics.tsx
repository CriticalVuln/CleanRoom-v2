import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TimeData } from '../types';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface TimeAnalyticsProps {
  data: {
    '7days': TimeData[];
    '30days': TimeData[];
    '180days': TimeData[];
    '1year': TimeData[];
  };
}

const TimeAnalytics: React.FC<TimeAnalyticsProps> = ({ data }) => {
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days' | '180days' | '1year'>('30days');

  const currentData = data[timePeriod];

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTimePeriodLabel = (period: string) => {
    switch (period) {
      case '7days': return '7 Days';
      case '30days': return '30 Days';
      case '180days': return '6 Months';
      case '1year': return '1 Year';
      default: return '30 Days';
    }
  };

  // Calculate cumulative averages for each day
  const calculateRunningAverages = (data: TimeData[]) => {
    return data.map((_, index) => {
      const subset = data.slice(0, index + 1);
      const total = subset.reduce((sum, item) => sum + item.totalMinutes, 0);
      return subset.length > 0 ? total / subset.length : 0;
    });
  };

  const runningAverages = calculateRunningAverages(currentData);

  const chartData = {
    labels: currentData.map(item => format(parseISO(item.date), 'MMM dd')),
    datasets: [
      {
        label: 'Total Time',
        data: currentData.map(item => (item.totalMinutes / 60).toFixed(1)), // Convert to hours
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 0, // Remove dots
        pointHoverRadius: 6,
      },
      {
        label: 'Average Time',
        data: runningAverages.map(avg => (avg / 60).toFixed(1)), // Convert to hours
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 0, // Remove dots
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const minutes = currentData[context.dataIndex].totalMinutes;
            const avgMinutes = runningAverages[context.dataIndex];
            if (context.datasetIndex === 0) {
              return `Total time: ${formatHours(minutes)}`;
            } else {
              return `Average time: ${formatHours(avgMinutes)}`;
            }
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#e5e7eb',
        },
        border: {
          color: '#e5e7eb',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        border: {
          color: '#e5e7eb',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
          callback: (value: any) => `${value}h`,
        },
      },
    },
  };

  const totalTime = currentData.reduce((sum, item) => sum + item.totalMinutes, 0);
  const averageTime = currentData.length > 0 ? totalTime / currentData.length : 0;
  const maxTime = Math.max(...currentData.map(item => item.totalMinutes), 0);

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
          Time Analytics
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex gap-3 text-xs">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Avg</div>
              <div className="font-semibold text-purple-600 dark:text-purple-400">
                {formatHours(averageTime)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Max</div>
              <div className="font-semibold text-orange-600 dark:text-orange-400">
                {formatHours(maxTime)}
              </div>
            </div>
          </div>
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
      </div>

      <div className="h-48 mb-3">
        <Line data={chartData} options={options} />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
        <span>Last {currentData.length} days</span>
        <span className="font-medium">
          Total: {formatHours(totalTime)}
        </span>
      </div>
    </div>
  );
};

export default TimeAnalytics;

import React from 'react';
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
  data: TimeData[];
}

const TimeAnalytics: React.FC<TimeAnalyticsProps> = ({ data }) => {
  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const chartData = {
    labels: data.map(item => format(parseISO(item.date), 'MMM dd')),
    datasets: [
      {
        label: 'Time Spent',
        data: data.map(item => (item.totalMinutes / 60).toFixed(1)), // Convert to hours
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const minutes = data[context.dataIndex].totalMinutes;
            return `Total time: ${formatHours(minutes)}`;
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
          display: false,
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12,
          },
          callback: (value: any) => `${value}h`,
        },
      },
    },
  };

  const totalTime = data.reduce((sum, item) => sum + item.totalMinutes, 0);
  const averageTime = data.length > 0 ? totalTime / data.length : 0;
  const maxTime = Math.max(...data.map(item => item.totalMinutes), 0);

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
          Time Analytics
        </h3>
        <div className="flex gap-3 text-xs">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">Avg</div>
            <div className="font-semibold text-orange-600 dark:text-orange-400">
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
      </div>

      <div className="h-48 mb-3">
        <Line data={chartData} options={options} />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
        <span>Last {data.length} days</span>
        <span className="font-medium">
          Total: {formatHours(totalTime)}
        </span>
      </div>
    </div>
  );
};

export default TimeAnalytics;

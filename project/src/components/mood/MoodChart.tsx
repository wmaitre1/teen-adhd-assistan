import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MoodChartProps {
  entries: Array<{
    mood: { value: number; label: string };
    timestamp: Date;
  }>;
}

export function MoodChart({ entries }: MoodChartProps) {
  const sortedEntries = [...entries].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  const data = {
    labels: sortedEntries.map(entry => format(entry.timestamp, 'MMM d, h:mm a')),
    datasets: [
      {
        label: 'Mood',
        data: sortedEntries.map(entry => entry.mood.value),
        borderColor: '#E52B50',
        backgroundColor: 'rgba(229, 43, 80, 0.1)',
        tension: 0.4,
        fill: true,
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
            const entry = sortedEntries[context.dataIndex];
            return `Mood: ${entry.mood.label}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value: number) => {
            const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Very Good'];
            return labels[value - 1] || '';
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return <Line data={data} options={options} />;
}
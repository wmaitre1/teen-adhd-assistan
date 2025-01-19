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
  Legend
} from 'chart.js';
import { format, subDays } from 'date-fns';
import type { JournalEntry } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MoodTrendsProps {
  entries: JournalEntry[];
}

export function MoodTrends({ entries }: MoodTrendsProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'EEE');
  });

  const moodData = last7Days.map(day => {
    const dayEntries = entries.filter(entry => 
      format(new Date(entry.timestamp), 'EEE') === day
    );
    if (dayEntries.length === 0) return null;
    return dayEntries.reduce((acc, entry) => acc + entry.mood.value, 0) / dayEntries.length;
  });

  const data = {
    labels: last7Days,
    datasets: [
      {
        label: 'Mood',
        data: moodData,
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
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
}
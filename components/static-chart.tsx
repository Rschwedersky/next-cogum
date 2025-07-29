"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-plugin-dragdata';
import { useLoading } from './loading-context';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: string[];
      backgroundColor?: string;
      borderColor?: string;
      tension?: number;
      fill?: boolean;
      pointBackgroundColor?:string;
      pointBorderColor?:string;
    }[];
  }

const options:any = {
responsive: true,
aspectRatio:3.5,
animations: {
    tension: {
      duration: 1000,
      easing: 'linear',
      from: 0,
      to: 1,
      loop: false
    }}
/* plugins: {
    legend: {
    position: 'top',
    },
    title: {
    display: true,
    text: 'Humidity', // Set your desired title
    },
    scales: {
    y: {
        min: 0, // Optional: Set suggested minimum
        max: 110, // Adjust this value to match your highest data point
        ticks: {
        // forces step size to be 50 units
        stepSize: 1
        }
    },
    },
}, */
};

const StaticChart = ({ chartData }: { chartData: ChartData }) => {
  return (
    <Suspense fallback={<div className='animate-spin'>adadaa</div>}>
    <div className='bg-orange-50 rounded-lg'>
      <Line data={chartData} options={options} />
    </div>
    </Suspense>
  );
};

export default StaticChart;
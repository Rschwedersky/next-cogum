"use client"
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-dragdata';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Chart = () => {
  // Convert data object to chart-ready format
  const chartData = {
    labels: Object.keys(data), // Extract keys (axis labels)
    datasets: [
      {
        label: 'Humidy', // Customize label
        data: Object.values(data), // Extract values (data points)
        backgroundColor: 'rgba(26, 51, 0, 0.5)', // Optional: Set background color
        borderColor: 'rgba(26, 51, 0, 1)', // Optional: Set border color
        tension: 0.3,
      },
      {
        label: '', // Customize label
        data: Object.values(data2), // Extract values (data points)
        backgroundColor: 'rgba(26, 51, 0, 0)', // Optional: Set background color
        borderColor: 'rgba(26, 51, 0, 0)', // Optional: Set border color
        tension: 0.3,
      },
    ],
  };

  const handleDragEnd = (...event: any) => {
    console.log("event",event)
    // Get the dragged element (point)
    //const point = event.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true });
  
  /*   // Check if a point was actually dragged
    if (point.length > 0) {
      // Access the final y-axis value of the dragged point
      const finalYValue = point[0].y; // Assuming point structure has a 'y' property
      console.log('Final Y Value:', finalYValue);
  
      // You can potentially update other data or perform actions based on the new value
    } else {
      console.log('No point dragged');
    } */
  };

  const options:any = {
    responsive: true,
    plugins: {
      dragData: {
        // ... other dragData options
        onDragEnd: handleDragEnd,
      },
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
    },
  };

  return (
    <div className='bg-orange-50 rounded'>
      <Line options={options} data={chartData} /* width={600} height={300} */ />
    </div>
  );
};
const data2={"0": 0.23,"23": 100,}
const data = {
  "0": 10,
  "1": 20,
  "2": 10,
  "3": 40,
  "4": 10,
  "5": 100,
  "6": 10,
  "7": 10,
  "8": 30,
  "9": 100,
  "10": 10,
  "11": 10,
  "12": 80,
  "13": 90,
  "14": 45,
  "15": 77,
  "16": 88,
  "17": 57,
  "18": 88,
  "19": 10,
  "20": 34,
  "21": 10,
  "22": 10,
  "23": 10,
};

export default Chart;
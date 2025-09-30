// frontend/src/components/StockChart.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
function StockChart({ plots }) {
  const [timeRange, setTimeRange] = useState('1M');
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);
  
  const chartData = {
    labels: plots[timeRange]?.dates || [],
    datasets: [
      {
        label: 'Actual Price',
        data: plots[timeRange]?.actual || [],
        borderColor: 'cyan',
        backgroundColor: 'rgba(0,255,255,0.1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Predicted Price',
        data: plots[timeRange]?.predicted || [],
        borderColor: 'limegreen',
        backgroundColor: 'rgba(50,205,50,0.1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: { duration: 1000, easing: 'easeInOutQuart' },
    scales: {
      x: { display: true, title: { display: true, text: 'Date' }, ticks: { maxRotation: 45, minRotation: 45, color: '#fff' } },
      y: { display: true, title: { display: true, text: 'Price (₹)' }, ticks: { color: '#fff', callback: (value) => `₹${value.toLocaleString()}` } },
    },
    plugins: {
      legend: { labels: { color: '#fff' } },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) label += `₹${context.parsed.y.toLocaleString()}`;
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="right-panel">
      <h2>Actual V/S Predicted Graph</h2>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
      <div className="range-buttons">
        {['1W', '1M', '3M', '6M'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={timeRange === range ? 'active' : ''}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StockChart;
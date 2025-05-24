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
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardChart = ({ data, loading }) => {
  // Default data if no data is provided or loading
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 3, 5, 2, 3, 15],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Products',
        data: [5, 12, 8, 15, 7, 10, 18],
        borderColor: 'rgba(236, 72, 153, 1)',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartData = data?.chartData || defaultData;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E5E7EB'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#F3F4F6',
        bodyColor: '#E5E7EB',
        borderColor: 'rgba(75, 85, 99, 1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(55, 65, 81, 1)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      y: {
        grid: {
          color: 'rgba(55, 65, 81, 1)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    },
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="h-80 relative">
      {loading ? (
        <div className="absolute inset-0 bg-gray-800 rounded-lg animate-pulse"></div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default DashboardChart;
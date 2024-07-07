import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Registering the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Items',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  });

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bar-chart', {
        params: { month: selectedMonth },
      });
      const labels = response.data.map(item => item.range);
      const data = response.data.map(item => item.count);
      setBarChartData({
        labels,
        datasets: [
          {
            label: 'Number of Items',
            data,
            backgroundColor: 'rgba(75,192,192,0.6)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  return <Bar data={barChartData} />;
};

export default BarChart;

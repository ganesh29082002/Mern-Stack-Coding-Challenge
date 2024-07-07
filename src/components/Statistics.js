import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSoldItems: 0,
    totalUnsoldItems: 0,
  });

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/statistics`, {
        params: { month: selectedMonth },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div>
      <h3>Statistics</h3>
      <p>Total Sale Amount: {statistics.totalSales}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Unsold Items: {statistics.totalUnsoldItems}</p>
    </div>
  );
};

export default Statistics;

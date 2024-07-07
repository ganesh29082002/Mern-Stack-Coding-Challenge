import React, { useState } from 'react';
import TransactionsTable from './TransactionsTable';
import Statistics from './Statistics';
import BarChart from './BarChart';

const MainPage = () => {
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <div>
        <label>
          Select Month:
          <select value={selectedMonth} onChange={handleMonthChange}>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <input
          type="text"
          placeholder="Search transactions"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <TransactionsTable
        selectedMonth={selectedMonth}
        searchQuery={searchQuery}
        onPaginationChange={() => {}}
      />
      <Statistics selectedMonth={selectedMonth} />
      {/* Use the selectedMonth as a key to force re-render the chart */}
      <BarChart key={selectedMonth} selectedMonth={selectedMonth} />
    </div>
  );
};

export default MainPage;

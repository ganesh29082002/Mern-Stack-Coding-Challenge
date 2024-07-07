import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = ({ selectedMonth, searchQuery, onPaginationChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/transactions`, {
        params: {
          month: selectedMonth,
          search: searchQuery,
          page,
          perPage,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, searchQuery, page, perPage]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    onPaginationChange(page + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
    onPaginationChange(page - 1);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction?.category}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handlePreviousPage} disabled={page === 1}>
        Previous
      </button>
      <button onClick={handleNextPage}>
        Next
      </button>
    </div>
  );
};

export default TransactionsTable;

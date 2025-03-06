import React, { useState } from 'react';

export const Pagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    onPageChange(page); 
  };

  return (
    <div>
      {currentPage > 1 && (
        <button onClick={() => handlePageClick(currentPage - 1)}>上一页</button>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button onClick={() => handlePageClick(currentPage + 1)}>下一页</button>
      )}
    </div>
  );
};
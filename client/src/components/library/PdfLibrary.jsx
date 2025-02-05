// src/components/library/PdfLibrary.jsx
import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const PdfLibrary = () => {
  // Access the authentication context
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div>
      <h1>PDF Library</h1>
      {isAuthenticated ? (
        <div>
          <p>Welcome to the PDF Library!</p>
          {/* Add your PDF-related components or functionality here */}
          <ul>
            <li>PDF Document 1</li>
            <li>PDF Document 2</li>
            <li>PDF Document 3</li>
          </ul>
        </div>
      ) : (
        <p>Please log in to access the PDF Library.</p>
      )}
    </div>
  );
};

export default PdfLibrary;
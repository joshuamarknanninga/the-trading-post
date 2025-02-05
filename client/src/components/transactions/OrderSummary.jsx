// src/components/transactions/OrderSummary.jsx
import React from 'react';

const OrderSummary = ({ order }) => {
  return (
    <div>
      <h2>Order Summary</h2>
      <p>Total: ${order.total}</p>
      {/* Add more order details here */}
    </div>
  );
};

export default OrderSummary; // Ensure this is a default export
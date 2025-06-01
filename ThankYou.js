import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css';

function ThankYouPage() {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem('order'));

  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <h1>Thank You for Your Order!</h1>
        <p>Your order number is: <strong>{order.orderNumber}</strong></p>
        <p>A confirmation email has been sent to <strong>{order.customer.email}</strong></p>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-item">
            <p><strong>{order.product.name}</strong> ({order.product.variant})</p>
            <p>Quantity: {order.product.quantity}</p>
            <p>Total: ${order.product.total.toFixed(2)}</p>
          </div>
        </div>
        
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );
}

export default ThankYouPage;
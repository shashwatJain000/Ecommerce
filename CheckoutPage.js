import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load product data from localStorage
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const storedProduct = JSON.parse(localStorage.getItem('product'));
    if (storedProduct) {
      setProduct(storedProduct);
    } else {
      navigate('/'); // Redirect to home if no product
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;
    const cardRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;
    const zipRegex = /^\d{5}(-\d{4})?$/;
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!zipRegex.test(formData.zipCode)) newErrors.zipCode = 'Invalid ZIP code';
    if (!cardRegex.test(formData.cardNumber)) newErrors.cardNumber = 'Invalid card number';
    
    // Validate expiry date
    if (formData.expiryDate) {
      const [month, year] = formData.expiryDate.split('/');
      const expiryDate = new Date(`20${year}`, month - 1);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate < today) {
        newErrors.expiryDate = 'Card has expired';
      }
    } else {
      newErrors.expiryDate = 'Expiry date is required';
    }
    
    if (!cvvRegex.test(formData.cvv)) newErrors.cvv = 'Invalid CVV';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateTransaction = () => {
    // Randomly simulate different transaction outcomes
    const outcomes = ['approved', 'declined', 'error'];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(randomOutcome);
      }, 1500); // Simulate network delay
    });
  };

  const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to process payment
      const transactionResult = await simulateTransaction();
      setTransactionStatus(transactionResult);
      
      if (transactionResult === 'approved') {
        // Create order object
        const orderData = {
          orderNumber: generateOrderNumber(),
          customer: formData,
          product,
          status: 'completed',
          date: new Date().toISOString()
        };
        
        // In a real app, you would send this to your backend
        localStorage.setItem('order', JSON.stringify(orderData));
        setOrder(orderData);
        
        // Simulate inventory update
        // (In a real app, this would be a backend operation)
        
        // Redirect to thank you page after 2 seconds
        setTimeout(() => {
          navigate('/thank-you');
        }, 2000);
      }
    } catch (error) {
      setTransactionStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Customer Information</h2>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
          
          <h2>Shipping Address</h2>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>
          
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            {errors.city && <span className="error">{errors.city}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
            
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
              {errors.zipCode && <span className="error">{errors.zipCode}</span>}
            </div>
          </div>
          
          <h2>Payment Information</h2>
          
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="16"
              required
            />
            {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date (MM/YY)</label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
              {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
            </div>
            
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                maxLength="3"
                required
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>
          </div>
          
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
          
          {transactionStatus === 'declined' && (
            <div className="error-message">
              Payment declined. Please try another payment method.
            </div>
          )}
          
          {transactionStatus === 'error' && (
            <div className="error-message">
              Payment processing error. Please try again later.
            </div>
          )}
        </form>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-item">
            <img src={`${product.image}?auto=format&fit=crop&w=200&q=60`} alt={product.name} />
            <div className="order-details">
              <h3>{product.name}</h3>
              <p>Variant: {product.variant}</p>
              {product.size && <p>Size: {product.size}</p>}
              <p>Quantity: {product.quantity}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${product.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${product.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
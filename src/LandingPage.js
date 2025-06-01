import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from './products';
import './App.css';

function LandingPage() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState(
    products.map(product => ({
      id: product.id,
      variant: product.variants?.[0] || '',
      size: product.sizes?.[0] || '',
      quantity: 1
    }))
  );

  // Filter products based on selection
  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => product.category === categoryFilter);

  const handleVariantChange = (productId, value) => {
    setSelectedProducts(prev => prev.map(item => 
      item.id === productId ? {...item, variant: value} : item
    ));
  };

  const handleSizeChange = (productId, value) => {
    setSelectedProducts(prev => prev.map(item => 
      item.id === productId ? {...item, size: value} : item
    ));
  };

  const handleQuantityChange = (productId, value) => {
    setSelectedProducts(prev => prev.map(item => 
      item.id === productId ? {...item, quantity: Math.max(1, value)} : item
    ));
  };

  const handleBuyNow = (productId) => {
    const product = products.find(p => p.id === productId);
    const selected = selectedProducts.find(item => item.id === productId);
    
    const productData = {
      ...product,
      variant: selected.variant,
      size: selected.size,
      quantity: selected.quantity,
      subtotal: product.price * selected.quantity,
      total: product.price * selected.quantity,
    };
    
    localStorage.setItem("product", JSON.stringify(productData));
    navigate('/checkout');
  };

  return (
    <div className="landing-container">
      <h1>Our Products</h1>
      
      {/* Category filters */}
      <div className="category-filters">
        <button onClick={() => setCategoryFilter('all')}>All Products</button>
        <button onClick={() => setCategoryFilter('shoes')}>Shoes</button>
        <button onClick={() => setCategoryFilter('clothing')}>Clothing</button>
        <button onClick={() => setCategoryFilter('electronics')}>Electronics</button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => {
          const selected = selectedProducts.find(item => item.id === product.id);
          return (
            <div key={product.id} className="product-card">
              <img 
                src={`${product.image}?auto=format&fit=crop&w=800&q=60`} 
                alt={product.name} 
                className="product-image" 
              />
              <div className="product-info">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <h3>${product.price.toFixed(2)}</h3>

                {product.variants && (
                  <label>
                    Color:
                    <select 
                      value={selected.variant} 
                      onChange={(e) => handleVariantChange(product.id, e.target.value)}
                    >
                      {product.variants.map(variant => (
                        <option key={variant} value={variant}>{variant}</option>
                      ))}
                    </select>
                  </label>
                )}

                {product.sizes && (
                  <label>
                    Size:
                    <select 
                      value={selected.size} 
                      onChange={(e) => handleSizeChange(product.id, e.target.value)}
                    >
                      {product.sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </label>
                )}

                <label>
                  Quantity:
                  <input 
                    type="number" 
                    min="1" 
                    value={selected.quantity} 
                    onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))} 
                  />
                </label>

                <button onClick={() => handleBuyNow(product.id)}>Buy Now</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LandingPage;
// src/App.js
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import CheckoutPage from './CheckoutPage';
import ThankYouPage from './ThankYou';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
    </Routes>
  );
}

export default App;

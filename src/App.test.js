import { render, screen } from '@testing-library/react';
import App from './App';  // Changed from LandingPage to App

test('renders app without crashing', () => {
  render(<App />);
  // You might want to add more specific tests here
});
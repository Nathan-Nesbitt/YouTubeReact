import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Youtuber Name/p);
  expect(linkElement).toBeInTheDocument();
  const linkElement = screen.getByText(/End Time/label);
  expect(linkElement).toBeInTheDocument();
});

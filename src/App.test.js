import { render, screen } from '@testing-library/react';
import App from './App';


test('Basic Components Test', () => {
  render(<App />);
  const nameElement = screen.getByText("Youtuber Name");
  expect(nameElement).toBeInTheDocument();
});

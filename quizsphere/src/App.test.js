import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the components since we're just testing basic rendering
jest.mock('./components/layout/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./components/layout/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: () => <div data-testid="route" />,
}));

test('renders app structure', () => {
  render(<App />);
  expect(screen.getByTestId('header')).toBeInTheDocument();
  expect(screen.getByTestId('footer')).toBeInTheDocument();
  expect(screen.getByTestId('router')).toBeInTheDocument();
  expect(screen.getByTestId('routes')).toBeInTheDocument();
});

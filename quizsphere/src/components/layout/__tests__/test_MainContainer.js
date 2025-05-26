import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainContainer from '../MainContainer';

// Mock navigate function
const mockNavigate = jest.fn();

// Mock needed modules
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/test' }),
  useNavigate: () => mockNavigate,
}));

// Create theme for testing
const mockTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    error: { main: '#d32f2f' },
    background: { paper: '#fff' },
    text: { secondary: '#666' }
  }
});

// Mock Material UI hooks
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: jest.fn(() => false)
}));

jest.mock('@mui/material/styles/useTheme', () => ({
  __esModule: true,
  default: jest.fn(() => mockTheme)
}));

// Mock QuizContext
jest.mock('../../../context/QuizContext', () => ({
  useQuizContext: () => ({
    loading: false,
    error: null,
    categories: ['Science', 'History', 'Sports'],
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    clearError: jest.fn(),
  }),
}));

// Mock UI components
jest.mock('../../ui/ContainerTransition', () => {
  return function MockContainerTransition({ children, disabled }) {
    return (
      <div data-testid="container-transition">
        {disabled ? 'Transitions disabled' : 'Transitions enabled'}
        <div>{children}</div>
      </div>
    );
  };
});

jest.mock('../../ui/LoadingOverlay', () => {
  return function MockLoadingOverlay({ loading, message }) {
    return loading ? <div data-testid="loading-overlay">{message}</div> : null;
  };
});

jest.mock('../../ui/BackgroundPattern', () => {
  return function MockBackgroundPattern({ type, opacity }) {
    return (
      <div data-testid="background-pattern" data-type={type} data-opacity={opacity}></div>
    );
  };
});

// Mock utils
jest.mock('../../../utils/containerUtils', () => ({
  generateAnimationKey: () => 'test-key',
}));

// Mock window.scrollTo
const originalScrollTo = window.scrollTo;
beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterAll(() => {
  window.scrollTo = originalScrollTo;
});

// Helper function to render with common providers
const renderWithProviders = (ui, { useMediaQueryValue = false } = {}) => {
  // Update media query mock value
  const useMediaQuery = require('@mui/material/useMediaQuery').default;
  useMediaQuery.mockImplementation(() => useMediaQueryValue);

  return {
    user: userEvent.setup(),
    ...render(
      <ThemeProvider theme={mockTheme}>
        {ui}
      </ThemeProvider>
    )
  };
};

describe('MainContainer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      renderWithProviders(<MainContainer>Test Content</MainContainer>);
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Main content');
    });
    
    test('renders children correctly', () => {
      renderWithProviders(
        <MainContainer>
          <div data-testid="child-element">Child Content</div>
        </MainContainer>
      );
      
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });
  
  // Props functionality tests
  describe('Props Functionality', () => {
    test('renders background pattern when backgroundPattern=true', () => {
      renderWithProviders(<MainContainer backgroundPattern>Content</MainContainer>);
      
      expect(screen.getByTestId('background-pattern')).toBeInTheDocument();
      expect(screen.getByTestId('background-pattern')).toHaveAttribute('data-type', 'dots');
    });
    
    test('renders with custom pattern type', () => {
      renderWithProviders(<MainContainer backgroundPattern patternType="waves">Content</MainContainer>);
      
      expect(screen.getByTestId('background-pattern')).toHaveAttribute('data-type', 'waves');
    });
    
    test('disables animations when disableAnimations=true', () => {
      renderWithProviders(<MainContainer disableAnimations>Content</MainContainer>);
      
      expect(screen.getByTestId('container-transition')).toHaveTextContent('Transitions disabled');
    });
  });

  // Container mode tests
  describe('Container Modes', () => {
    test('renders browse mode tabs', () => {
      renderWithProviders(<MainContainer containerMode="browse">Content</MainContainer>);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('All Quizzes')).toBeInTheDocument();
      expect(screen.getByText('By Category')).toBeInTheDocument();
    });
    
    test('renders create mode tabs', () => {
      renderWithProviders(<MainContainer containerMode="create">Content</MainContainer>);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('Basic Info')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
    });
  });

  // Loading and error state tests
  describe('Loading and Error States', () => {
    test('displays loading overlay when loading=true', () => {
      renderWithProviders(<MainContainer loading>Content</MainContainer>);
      
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
    });
    
    test('displays error message when error is provided', () => {
      renderWithProviders(<MainContainer error="Test error message">Content</MainContainer>);
      
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    });
  });

  // Filter functionality tests
  describe('Filter Functionality', () => {
    test('renders filter section when showFilters=true', () => {
      renderWithProviders(<MainContainer showFilters>Content</MainContainer>);
      
      expect(screen.getByText('Quiz Filters')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
    });
    
    test('calls onCategoryChange when category is clicked', async () => {
      const onCategoryChange = jest.fn();
      const { user } = renderWithProviders(
        <MainContainer 
          showFilters 
          onCategoryChange={onCategoryChange}
        >
          Content
        </MainContainer>
      );
      
      const categoryChip = screen.getByText('Science');
      await user.click(categoryChip);
      
      expect(onCategoryChange).toHaveBeenCalledWith('Science');
    });
  });

  // Navigation tests
  describe('Navigation', () => {
    test('renders back button when showNavigation=true', () => {
      renderWithProviders(<MainContainer showNavigation>Content</MainContainer>);
      
      expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    });
    
    test('calls navigate when back button is clicked', async () => {
      const { user } = renderWithProviders(<MainContainer showNavigation>Content</MainContainer>);
      
      const backButton = screen.getByLabelText('Go back');
      await user.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  // Responsive behavior tests
  describe('Responsive Behavior', () => {
    test('handles mobile view', () => {
      renderWithProviders(<MainContainer>Content</MainContainer>, { useMediaQueryValue: true });
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
    
    test('handles desktop view', () => {
      renderWithProviders(<MainContainer>Content</MainContainer>, { useMediaQueryValue: false });
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });
});

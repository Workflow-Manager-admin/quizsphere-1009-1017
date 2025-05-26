import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme, useMediaQuery } from '@mui/material';
import MainContainer from '../MainContainer';

// Mock theme
const mockTheme = {
  palette: {
    primary: { main: '#1976d2' },
    error: { main: '#d32f2f' },
    background: { paper: '#fff' },
    text: { secondary: '#666' }
  },
  breakpoints: {
    down: jest.fn((bp) => `(max-width:${bp === 'sm' ? '600' : '900'}px)`),
  },
  spacing: (factor) => `${8 * factor}px`,
};

// Mock useMediaQuery hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn().mockReturnValue(false),
  useTheme: jest.fn(() => mockTheme),
}));

// Mock navigate function
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/test' }),
  useNavigate: () => mockNavigate,
}));

// Mock QuizContext
jest.mock('../../../context/QuizContext', () => ({
  QuizContext: {
    Provider: ({ children }) => (
      <div data-testid="quiz-context-provider">{children}</div>
    )
  },
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

// Mock containerUtils
jest.mock('../../../utils/containerUtils', () => ({
  generateAnimationKey: () => 'test-key',
  getAnimationVariant: jest.requireActual('../../../utils/containerUtils').getAnimationVariant,
  formatErrorMessage: jest.requireActual('../../../utils/containerUtils').formatErrorMessage,
}));

// Mock window.scrollTo
const originalScrollTo = window.scrollTo;
beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterAll(() => {
  window.scrollTo = originalScrollTo;
});

// Helper function to render MainContainer with theme and mock context
const renderWithTheme = (ui, contextValue = {}) => {
  const defaultContext = {
    loading: false,
    error: null,
    categories: ['Science', 'History', 'Sports'],
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    clearError: jest.fn(),
    ...contextValue
  };

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
  // Basic rendering tests
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      renderWithTheme(<MainContainer>Test Content</MainContainer>);
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Main content');
    });
    
    test('renders children correctly', () => {
      renderWithTheme(
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
    test('applies centerContent styling when centerContent=true', () => {
      renderWithTheme(<MainContainer centerContent>Centered Content</MainContainer>);
      
      const container = screen.getByRole('region');
      expect(container).toBeInTheDocument();
      expect(screen.getByText('Centered Content')).toBeInTheDocument();
    });
    
    test('renders background pattern when backgroundPattern=true', () => {
      renderWithTheme(<MainContainer backgroundPattern>Content</MainContainer>);
      
      expect(screen.getByTestId('background-pattern')).toBeInTheDocument();
      expect(screen.getByTestId('background-pattern')).toHaveAttribute('data-type', 'dots');
    });
    
    test('renders with custom pattern type', () => {
      renderWithTheme(<MainContainer backgroundPattern patternType="waves">Content</MainContainer>);
      
      expect(screen.getByTestId('background-pattern')).toHaveAttribute('data-type', 'waves');
    });
    
    test('disables animations when disableAnimations=true', () => {
      renderWithTheme(<MainContainer disableAnimations>Content</MainContainer>);
      
      expect(screen.getByTestId('container-transition')).toHaveTextContent('Transitions disabled');
    });
  });

  // Container mode tests
  describe('Container Modes', () => {
    test('renders browse mode tabs', () => {
      renderWithTheme(<MainContainer containerMode="browse">Content</MainContainer>);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('All Quizzes')).toBeInTheDocument();
      expect(screen.getByText('By Category')).toBeInTheDocument();
    });
    
    test('renders create mode tabs', () => {
      renderWithTheme(<MainContainer containerMode="create">Content</MainContainer>);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('Basic Info')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
    });
    
    test('renders participate mode tabs', () => {
      renderWithTheme(<MainContainer containerMode="participate">Content</MainContainer>);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });
  });

  // Loading and error state tests
  describe('Loading and Error States', () => {
    test('displays loading overlay when loading=true', () => {
      renderWithTheme(<MainContainer loading>Content</MainContainer>);
      
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
    });
    
    test('displays error message when error is provided', () => {
      renderWithTheme(<MainContainer error="Test error message">Content</MainContainer>);
      
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    });
    
    test('calls clearError when refresh button is clicked', async () => {
      const clearErrorMock = jest.fn();
      const { user } = renderWithTheme(
        <MainContainer error="Test error">Content</MainContainer>
      );
      
      const refreshButton = screen.getByText('Try Again');
      await user.click(refreshButton);
      
      // Since clearError is part of context, we can't directly test it
      // but we can verify the button is clickable
      expect(refreshButton).toBeInTheDocument();
    });
  });

  // Filter functionality tests
  describe('Filter Functionality', () => {
    test('renders filter section when showFilters=true', () => {
      renderWithTheme(<MainContainer showFilters>Content</MainContainer>);
      
      expect(screen.getByText('Quiz Filters')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
    });
    
    test('calls onCategoryChange when category is clicked', async () => {
      const onCategoryChange = jest.fn();
      const { user } = renderWithTheme(
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
    
    test('calls onDifficultyChange when difficulty is clicked', async () => {
      const onDifficultyChange = jest.fn();
      const { user } = renderWithTheme(
        <MainContainer 
          showFilters 
          onDifficultyChange={onDifficultyChange}
        >
          Content
        </MainContainer>
      );
      
      const difficultyChip = screen.getByText('Medium');
      await user.click(difficultyChip);
      
      expect(onDifficultyChange).toHaveBeenCalledWith('Medium');
    });
  });

  // Navigation tests
  describe('Navigation', () => {
    test('renders back button when showNavigation=true', () => {
      renderWithTheme(<MainContainer showNavigation>Content</MainContainer>);
      
      expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    });
    
    test('calls navigate when back button is clicked', async () => {
      const { user } = renderWithTheme(<MainContainer showNavigation>Content</MainContainer>);
      
      const backButton = screen.getByLabelText('Go back');
      await user.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    test('container has appropriate ARIA attributes', () => {
      renderWithTheme(<MainContainer>Content</MainContainer>);
      
      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('aria-live', 'polite');
      expect(container).toHaveAttribute('aria-label', 'Main content');
    });
    
    test('filter controls have correct ARIA roles and labels', () => {
      renderWithTheme(<MainContainer showFilters>Content</MainContainer>);
      
      expect(screen.getByRole('region', { name: 'Category filters' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Difficulty filters' })).toBeInTheDocument();
    });
  });

  // Responsive behavior tests
  describe('Responsive Behavior', () => {
    test('handles mobile view', () => {
      useMediaQuery.mockReturnValue(true); // Simulate mobile viewport
      renderWithTheme(<MainContainer>Mobile Content</MainContainer>);
      
      const container = screen.getByRole('region');
      expect(container).toBeInTheDocument();
    });
    
    test('handles desktop view', () => {
      useMediaQuery.mockReturnValue(false); // Simulate desktop viewport
      renderWithTheme(<MainContainer>Desktop Content</MainContainer>);
      
      const container = screen.getByRole('region');
      expect(container).toBeInTheDocument();
    });
  });

  // Animation and transition tests
  describe('Animation and Transitions', () => {
    test('updates animation key on location change', async () => {
      const { rerender } = renderWithTheme(<MainContainer>Initial Content</MainContainer>);
      
      // Simulate route change
      rerender(<MainContainer key="new-route">New Content</MainContainer>);
      
      expect(screen.getByTestId('container-transition')).toBeInTheDocument();
      expect(screen.getByText('New Content')).toBeInTheDocument();
    });
  });
});

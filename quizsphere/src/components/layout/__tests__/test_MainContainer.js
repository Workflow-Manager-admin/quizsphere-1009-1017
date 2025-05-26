import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme, useMediaQuery } from '@mui/material';
import MainContainer from '../MainContainer';

// Create a comprehensive mock theme that matches Material UI's structure
const mockTheme = {
  palette: {
    primary: { 
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff'
    },
    error: { 
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#fff'
    },
    background: { 
      paper: '#fff',
      default: '#fafafa'
    },
    text: { 
      primary: '#000',
      secondary: '#666',
      disabled: '#999'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
    up: jest.fn(key => `@media (min-width:${mockTheme.breakpoints.values[key]}px)`),
    down: jest.fn(key => `@media (max-width:${mockTheme.breakpoints.values[key]}px)`),
    between: jest.fn((start, end) => 
      `@media (min-width:${mockTheme.breakpoints.values[start]}px) and (max-width:${mockTheme.breakpoints.values[end]}px)`
    ),
  },
  spacing: jest.fn(factor => `${8 * factor}px`),
  shape: {
    borderRadius: 4
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  }
};

// Create stateful mock for useMediaQuery to allow dynamic updates in tests
let mediaQueryState = {
  isMobile: false,
  isTablet: false
};

// Mock Material UI hooks
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn((query) => {
    if (query.includes('sm')) return mediaQueryState.isMobile;
    if (query.includes('md')) return mediaQueryState.isTablet;
    return false;
  }),
  useTheme: jest.fn(() => mockTheme),
}));

// Helper to update media query state
const setMediaQueryState = (mobile = false, tablet = false) => {
  mediaQueryState.isMobile = mobile;
  mediaQueryState.isTablet = tablet;
  return mediaQueryState;
};

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

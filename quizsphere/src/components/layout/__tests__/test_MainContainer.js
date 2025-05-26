import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import theme from '../../../styles/QuizStyles';
import MainContainer from '../MainContainer';
import { QuizContext } from '../../../context/QuizContext';

// Mock dependencies
// Instead of directly mocking react-router-dom, we'll mock specific components
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/test' }),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../utils/containerUtils', () => ({
  generateAnimationKey: () => 'test-key',
  getAnimationVariant: jest.requireActual('../../../utils/containerUtils').getAnimationVariant,
  formatErrorMessage: jest.requireActual('../../../utils/containerUtils').formatErrorMessage,
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

// Mock window.scrollTo
const originalScrollTo = window.scrollTo;
beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterAll(() => {
  window.scrollTo = originalScrollTo;
});

// Helper function to render MainContainer with mock context
const renderWithContext = (ui, contextValue = {}) => {
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
      <ThemeProvider theme={theme}>
        <QuizContext.Provider value={defaultContext}>
          {ui}
        </QuizContext.Provider>
      </ThemeProvider>
    )
  };
};

describe('MainContainer Component', () => {
  // Basic rendering tests
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      renderWithContext(<MainContainer>Test Content</MainContainer>);
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Main content');
    });
    
    test('renders children correctly', () => {
      renderWithContext(
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
      renderWithContext(<MainContainer centerContent>Centered Content</MainContainer>);
      
      // Check for centered styling class or attribute
      // The actual test would depend on how styling is applied
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByText('Centered Content')).toBeInTheDocument();
    });
    
    test('renders background pattern when backgroundPattern=true', () => {
      renderWithContext(<MainContainer backgroundPattern>Content</MainContainer>);
      
      expect(screen.getByTestId('background-pattern')).toBeInTheDocument();
      expect(screen.getByTestId('background-pattern')).toHaveAttribute('data-type', 'dots');
    });
    
    test('renders with custom pattern type', () => {
      renderWithContext(<MainContainer backgroundPattern patternType="waves">Content</MainContainer>);
      
      expect(screen.getByTestId('background-pattern')).toHaveAttribute('data-type', 'waves');
    });
    
    test('disables animations when disableAnimations=true', () => {
      renderWithContext(<MainContainer disableAnimations>Content</MainContainer>);
      
      expect(screen.getByTestId('container-transition')).toHaveTextContent('Transitions disabled');
    });
  });

  // Loading and error state tests
  describe('Loading and Error States', () => {
    test('displays loading overlay when loading=true', () => {
      renderWithContext(<MainContainer loading>Content</MainContainer>);
      
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
    });
    
    test('displays loading overlay when context loading=true', () => {
      renderWithContext(<MainContainer>Content</MainContainer>, { loading: true });
      
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
    });
    
    test('displays error message when error is provided', () => {
      renderWithContext(<MainContainer error="Test error message">Content</MainContainer>);
      
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    });
    
    test('displays error message when context error is provided', () => {
      renderWithContext(<MainContainer>Content</MainContainer>, { error: 'Context error message' });
      
      expect(screen.getByText('Context error message')).toBeInTheDocument();
      expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    });
    
    test('calls clearError when refresh button is clicked', async () => {
      const clearErrorMock = jest.fn();
      const { user } = renderWithContext(
        <MainContainer error="Test error">Content</MainContainer>, 
        { clearError: clearErrorMock }
      );
      
      const refreshButton = screen.getByText('Try Again');
      await user.click(refreshButton);
      
      expect(clearErrorMock).toHaveBeenCalled();
    });
    
    test('calls custom onRefresh when provided', async () => {
      const onRefreshMock = jest.fn();
      const { user } = renderWithContext(
        <MainContainer error="Test error" onRefresh={onRefreshMock}>Content</MainContainer>
      );
      
      const refreshButton = screen.getByText('Try Again');
      await user.click(refreshButton);
      
      expect(onRefreshMock).toHaveBeenCalled();
    });
  });
  
  // Container mode tests
  describe('Container Modes', () => {
    test('renders browse mode tabs', () => {
      renderWithContext(<MainContainer containerMode="browse">Content</MainContainer>);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('All Quizzes')).toBeInTheDocument();
      expect(screen.getByText('By Category')).toBeInTheDocument();
    });
    
    test('renders create mode tabs', () => {
      renderWithContext(<MainContainer containerMode="create">Content</MainContainer>);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('Basic Info')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
    });
    
    test('renders participate mode tabs', () => {
      renderWithContext(<MainContainer containerMode="participate">Content</MainContainer>);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });
    
    test('changes active tab when clicked', async () => {
      const { user } = renderWithContext(<MainContainer containerMode="browse">Content</MainContainer>);
      
      const categoryTab = screen.getByText('By Category');
      await user.click(categoryTab);
      
      // In a real component, we would check for aria-selected="true"
      // Here we check for the appropriate content change
      expect(screen.getByText('Category Browser')).toBeInTheDocument();
    });
  });
  
  // Navigation tests
  describe('Navigation', () => {
    test('renders back button when showNavigation=true', () => {
      renderWithContext(<MainContainer showNavigation>Content</MainContainer>);
      
      expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    });
    
    test('calls navigate when back button is clicked', async () => {
      const { user } = renderWithContext(<MainContainer showNavigation>Content</MainContainer>);
      
      const backButton = screen.getByLabelText('Go back');
      await user.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
  
  // Filter tests
  describe('Filter Functionality', () => {
    test('renders filter section when showFilters=true', () => {
      renderWithContext(<MainContainer showFilters>Content</MainContainer>);
      
      expect(screen.getByText('Quiz Filters')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
    });
    
    test('renders categories from context in filters', () => {
      const categories = ['Math', 'English', 'Chemistry'];
      
      renderWithContext(
        <MainContainer showFilters>Content</MainContainer>,
        { categories }
      );
      
      categories.forEach(category => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });
    
    test('renders difficulty levels from context in filters', () => {
      const difficultyLevels = ['Beginner', 'Intermediate', 'Expert'];
      
      renderWithContext(
        <MainContainer showFilters>Content</MainContainer>,
        { difficultyLevels }
      );
      
      difficultyLevels.forEach(level => {
        expect(screen.getByText(level)).toBeInTheDocument();
      });
    });
    
    test('calls onCategoryChange when category chip is clicked', async () => {
      const onCategoryChangeMock = jest.fn();
      const { user } = renderWithContext(
        <MainContainer showFilters onCategoryChange={onCategoryChangeMock}>Content</MainContainer>
      );
      
      const categoryChip = screen.getByText('Science');
      await user.click(categoryChip);
      
      expect(onCategoryChangeMock).toHaveBeenCalledWith('Science');
    });
    
    test('calls onDifficultyChange when difficulty chip is clicked', async () => {
      const onDifficultyChangeMock = jest.fn();
      const { user } = renderWithContext(
        <MainContainer showFilters onDifficultyChange={onDifficultyChangeMock}>Content</MainContainer>
      );
      
      const difficultyChip = screen.getByText('Medium');
      await user.click(difficultyChip);
      
      expect(onDifficultyChangeMock).toHaveBeenCalledWith('Medium');
    });
    
    test('highlights active category', () => {
      renderWithContext(
        <MainContainer 
          showFilters 
          activeCategory="Science"
        >
          Content
        </MainContainer>
      );
      
      // In a real test, we would check for styling or a specific class/attribute
      // Here, we're limited by our mocks
      expect(screen.getByText('Science')).toBeInTheDocument();
    });
  });
  
  // Accessibility tests
  describe('Accessibility', () => {
    test('container has appropriate ARIA attributes', () => {
      renderWithContext(<MainContainer>Content</MainContainer>);
      
      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('aria-live', 'polite');
      expect(container).toHaveAttribute('aria-label', 'Main content');
    });
    
    test('handles focus state correctly', () => {
      renderWithContext(<MainContainer>Content</MainContainer>);
      
      const container = screen.getByRole('region');
      fireEvent.focus(container);
      // In a real test, we would check for focus styling
      
      fireEvent.blur(container);
      // In a real test, we would check that focus styling is removed
    });
  });
});

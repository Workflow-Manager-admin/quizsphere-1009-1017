import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Container, 
  Box, 
  useTheme, 
  useMediaQuery, 
  Typography,
  alpha,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  Divider,
  Paper
} from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import CreateIcon from '@mui/icons-material/Create';
import QuizIcon from '@mui/icons-material/Quiz';
import FilterListIcon from '@mui/icons-material/FilterList';

// Import custom UI components
import ContainerTransition from '../ui/ContainerTransition';
import LoadingOverlay from '../ui/LoadingOverlay';
import BackgroundPattern from '../ui/BackgroundPattern';

// Import context
import { useQuizContext } from '../../context/QuizContext';
import { generateAnimationKey } from '../../utils/containerUtils';

// PUBLIC_INTERFACE
/**
 * MainContainer component for QuizSphere application
 * Provides consistent layout structure, padding, and responsive behavior across all pages
 * Handles proper spacing below the fixed header, page transitions, and loading states
 * Supports quiz creation, sharing, and participation features with appropriate layout
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Child elements to render within the container
 * @param {boolean} props.disablePadding - Whether to disable standard padding
 * @param {string} props.maxWidth - Maximum width of container ('xs', 'sm', 'md', 'lg', 'xl', false)
 * @param {boolean} props.loading - Whether content is in loading state
 * @param {string} props.error - Error message to display (if any)
 * @param {boolean} props.disableAnimations - Whether to disable transition animations
 * @param {boolean} props.backgroundPattern - Whether to show background pattern
 * @param {string} props.patternType - Pattern type ('dots', 'grid', 'waves')
 * @param {boolean} props.showNavigation - Whether to show back navigation
 * @param {Function} props.onRefresh - Function to call when refresh button is clicked
 * @param {boolean} props.centerContent - Whether to center content vertically
 * @param {Object} props.sx - Additional custom styles to apply to the container
 * @param {string} props.containerMode - Mode for container display ('browse', 'create', 'participate', 'results')
 * @param {string} props.activeCategory - Active quiz category filter (if applicable)
 * @param {string} props.activeDifficulty - Active quiz difficulty filter (if applicable)
 * @param {boolean} props.showFilters - Whether to show category/difficulty filters
 * @param {Function} props.onCategoryChange - Function to call when category filter changes
 * @param {Function} props.onDifficultyChange - Function to call when difficulty filter changes
 * @param {Object} props.quizData - Current quiz data for participate mode (if applicable)
 * @returns {React.ReactElement} The rendered MainContainer component
 */
const MainContainer = ({ 
  children, 
  disablePadding = false, 
  maxWidth = 'lg',
  loading = false,
  error = null,
  disableAnimations = false,
  backgroundPattern = false,
  patternType = 'dots',
  showNavigation = false,
  onRefresh = null,
  centerContent = false,
  sx = {},
  containerMode = 'browse',
  activeCategory = null,
  activeDifficulty = null,
  showFilters = false,
  onCategoryChange = null,
  onDifficultyChange = null,
  quizData = null
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Get global state from quiz context
  const { 
    loading: globalLoading,
    error: globalError,
    categories = [],
    difficultyLevels = [],
    currentQuestion = 0,
    totalQuestions = 0,
    prevQuestion,
    nextQuestion,
    clearError
  } = useQuizContext() || {};
  
  // Use either prop loading/error or global state if available
  const isLoading = loading || globalLoading;
  const errorMessage = error || globalError;
  
  // Track active tab for different container modes
  const [activeTab, setActiveTab] = useState(0);
  
  // Track whether this is the initial render
  const [isFirstRender, setIsFirstRender] = useState(true);
  // Track when content changes to trigger animations
  const [key, setKey] = useState(location.pathname + generateAnimationKey());
  // Track container height for smooth transitions
  const [containerHeight, setContainerHeight] = useState('auto');
  // Track if the container is focused for accessibility
  const [isFocused, setIsFocused] = useState(false);
  
  // Update key when location changes to trigger animations
  useEffect(() => {
    // Short delay to allow smooth transition
    const timer = setTimeout(() => {
      setKey(location.pathname + generateAnimationKey());
    }, 100);
    
    // Scroll to top on route change
    if (!isFirstRender) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      setIsFirstRender(false);
    }
    
    return () => clearTimeout(timer);
  }, [location.pathname, isFirstRender]);
  
  // Measure and update container height for smooth transitions
  useEffect(() => {
    if (containerRef.current && !disableAnimations) {
      const height = containerRef.current.offsetHeight;
      setContainerHeight(`${height}px`);
    }
  }, [children, disableAnimations]);
  
  // Handle browser back navigation with additional safety checks
  const handleBack = () => {
    // Check if we can go back in history
    if (window.history && window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to home if there's nowhere to go back to
      navigate('/');
    }
  };
  
  // Handle refresh click
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Default refresh behavior
      setKey(generateAnimationKey());
      if (clearError) {
        clearError();
      }
    }
  };
  
  // Handle tab change for different container modes
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Ensure focus is managed appropriately when changing tabs
    // This improves keyboard navigation accessibility
    if (event.type === 'keydown') {
      const timer = setTimeout(() => {
        const tabPanel = containerRef.current?.querySelector('[role="tabpanel"]');
        if (tabPanel) {
          tabPanel.setAttribute('tabindex', '-1');
          tabPanel.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (difficulty) => {
    if (onDifficultyChange) {
      onDifficultyChange(difficulty);
    }
  };
  
  // Renders the quiz navigation bar with filters
  const renderQuizNavigationBar = () => {
    if (!showFilters) return null;
    
    // Create the filter UI
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Section title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1" fontWeight="medium">
              Quiz Filters
            </Typography>
          </Box>
          
          <Divider />
          
          {/* Category filters */}
          <Box sx={{ mt: 1 }} role="region" aria-label="Category filters">
            <Typography variant="body2" color="text.secondary" gutterBottom id="category-filter-label">
              Categories
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              mt: 1 
            }}
            role="group"
            aria-labelledby="category-filter-label">
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  variant={activeCategory === category ? "filled" : "outlined"}
                  color={activeCategory === category ? "primary" : "default"}
                  onClick={() => handleCategoryChange(category)}
                  clickable
                  aria-pressed={activeCategory === category}
                  role="button"
                />
              ))}
            </Box>
          </Box>
          
          {/* Difficulty filters */}
          <Box sx={{ mt: 2 }} role="region" aria-label="Difficulty filters">
            <Typography variant="body2" color="text.secondary" gutterBottom id="difficulty-filter-label">
              Difficulty
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              mt: 1 
            }}
            role="group"
            aria-labelledby="difficulty-filter-label">
              {difficultyLevels.map((difficulty) => (
                <Chip
                  key={difficulty}
                  label={difficulty}
                  size="small"
                  variant={activeDifficulty === difficulty ? "filled" : "outlined"}
                  color={activeDifficulty === difficulty ? "primary" : "default"}
                  onClick={() => handleDifficultyChange(difficulty)}
                  clickable
                  aria-pressed={activeDifficulty === difficulty}
                  role="button"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  };
  
  // Renders the container mode tabs
  const renderContainerModeTabs = () => {
    if (containerMode === 'default') return null;
    
    const tabs = [];
    
    // Add appropriate tabs based on containerMode
    if (containerMode === 'browse') {
      tabs.push(
        { label: 'All Quizzes', icon: <QuizIcon fontSize="small" /> },
        { label: 'By Category', icon: <CategoryIcon fontSize="small" /> }
      );
    } else if (containerMode === 'create') {
      tabs.push(
        { label: 'Basic Info', icon: <InfoIcon fontSize="small" /> },
        { label: 'Questions', icon: <CreateIcon fontSize="small" /> },
        { label: 'Review', icon: <QuizIcon fontSize="small" /> }
      );
    } else if (containerMode === 'participate') {
      tabs.push(
        { label: 'Questions', icon: <QuizIcon fontSize="small" /> },
        { label: 'Progress', icon: <InfoIcon fontSize="small" /> }
      );
    }
    
    if (tabs.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="quiz container tabs"
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index} 
              label={tab.label} 
              icon={tab.icon} 
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>
    );
  };
  
  // Render error state with appropriate messaging based on containerMode
  const renderError = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '250px',
        p: 4,
        textAlign: 'center',
        flexDirection: 'column',
        gap: 3,
        bgcolor: alpha(theme.palette.error.main, 0.05),
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        maxWidth: '600px',
        mx: 'auto',
        my: 4
      }}
    >
      <Box 
        sx={{ 
          bgcolor: alpha(theme.palette.error.main, 0.1),
          borderRadius: '50%',
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <InfoIcon color="error" sx={{ fontSize: 40 }} />
      </Box>
      
      <Typography variant="h6" color="error.main" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        {errorMessage || getErrorMessageByMode(containerMode)}
      </Typography>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Try Again
        </Button>
        
        <Button 
          variant="text" 
          color="primary"
          onClick={handleBack}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
  
  // Get appropriate error message based on container mode
  const getErrorMessageByMode = (mode) => {
    switch (mode) {
      case 'browse':
        return "We couldn't load the quiz list. Please check your connection and try again.";
      case 'create':
        return "There was an issue with the quiz creation form. Please try again.";
      case 'participate':
        return "We couldn't load this quiz. It may have been removed or is temporarily unavailable.";
      case 'results':
        return "We couldn't load your quiz results. Please try again.";
      default:
        return "We've encountered an issue loading this content. Please try again.";
    }
  };
  
  // Helper function to format error messages
  const formatErrorMessage = (error) => {
    if (!error) return null;
    return typeof error === 'string' ? error : String(error);
  };
  
  // Render appropriate placeholder content based on container mode and active tab
  const renderModeContent = () => {
    // This will be replaced with actual components as they are developed
    // For now we just render placeholders
    
    if (containerMode === 'browse' && activeTab === 1) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Category Browser
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will display quizzes grouped by category
          </Typography>
        </Box>
      );
    }
    
    if (containerMode === 'create') {
      const createSteps = [
        "Fill in basic quiz information",
        "Add questions and answers",
        "Review and publish your quiz"
      ];
      
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Quiz Creator - Step {activeTab + 1}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {createSteps[activeTab]}
          </Typography>
        </Box>
      );
    }
    
    if (containerMode === 'participate') {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Quiz Participation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0 ? "Answer quiz questions here" : "View your progress"}
          </Typography>
        </Box>
      );
    }
    
    // Default just renders children
    return null;
  };
  
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: '100%',
        pt: { xs: '76px', sm: '84px' },
        pb: 2,
        transition: 'padding 0.3s ease',
        position: 'relative',
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        ...sx
      }}
    >
      {/* Background pattern with increased opacity */}
      {backgroundPattern && (
        <BackgroundPattern 
          type={patternType}
          opacity={0.08}
          aria-hidden="true"
        />
      )}
      
      {/* Optional back navigation with primary color hover */}
      {showNavigation && (
        <Box 
          sx={{ 
            px: { xs: 2, sm: 3, md: 4 },
            mb: 2, 
            maxWidth,
            mx: 'auto'
          }}
        >
          <Tooltip title="Go back">
            <IconButton 
              onClick={handleBack}
              aria-label="Go back"
              sx={{ 
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      
      <Container
        ref={containerRef}
        maxWidth={maxWidth}
        disableGutters={disablePadding}
        sx={{
          px: disablePadding ? 0 : { xs: 2, sm: 3, md: 4 },
          height: !disableAnimations ? containerHeight : '100%',
          transition: !disableAnimations ? 'height 0.3s ease-out' : 'none',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRight: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          ...(centerContent && {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            minHeight: 'calc(100vh - 200px)',
          }),
          '&:focus': {
            outline: isFocused ? `2px solid ${theme.palette.primary.main}` : 'none',
            outlineOffset: 2,
          },
          overflowY: 'visible',
          scrollBehavior: 'smooth',
        }}
        tabIndex={-1}
        aria-live="polite"
        role="region"
        aria-label="Main content"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Show loading spinner when in loading state */}
        <LoadingOverlay
          loading={isLoading}
          message="Loading content..."
          type="container"
          transparent={true}
        />
        
        {/* Show error message when there's an error */}
        {errorMessage && renderError()}
        
        {/* Render navigation filters if enabled */}
        {renderQuizNavigationBar()}
        
        {/* Render mode-specific tabs if applicable */}
        {renderContainerModeTabs()}
        
        {/* Render children with transition if not loading or error */}
        {!isLoading && !errorMessage && (
          <ContainerTransition 
            locationKey={key}
            type="fade"
            duration={0.4}
            disabled={disableAnimations}
          >
            <>
              {/* Render mode-specific placeholder content if applicable */}
              {renderModeContent()}
              
              {/* Render children */}
              {children}
            </>
          </ContainerTransition>
        )}
      </Container>
    </Box>
  );
};

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
  disablePadding: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  loading: PropTypes.bool,
  error: PropTypes.string,
  disableAnimations: PropTypes.bool,
  backgroundPattern: PropTypes.bool,
  patternType: PropTypes.oneOf(['dots', 'grid', 'waves']),
  showNavigation: PropTypes.bool,
  onRefresh: PropTypes.func,
  centerContent: PropTypes.bool,
  sx: PropTypes.object,
  containerMode: PropTypes.oneOf(['default', 'browse', 'create', 'participate', 'results']),
  activeCategory: PropTypes.string,
  activeDifficulty: PropTypes.string,
  showFilters: PropTypes.bool,
  onCategoryChange: PropTypes.func,
  onDifficultyChange: PropTypes.func,
  quizData: PropTypes.object
};

export default MainContainer;

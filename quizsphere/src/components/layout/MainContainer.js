import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  useTheme, 
  useMediaQuery, 
  Typography,
  alpha,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';

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
  sx = {} 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Get global state from quiz context
  const quizContext = useQuizContext();
  const globalLoading = quizContext?.loading;
  const globalError = quizContext?.error;
  
  // Use either prop loading/error or global state if available
  const isLoading = loading || globalLoading;
  const errorMessage = error || globalError;
  
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
  
  // Handle browser back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle refresh click
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Default refresh behavior
      setKey(generateAnimationKey());
      if (quizContext && quizContext.clearError) {
        quizContext.clearError();
      }
    }
  };
  
  // Render error state
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
        {errorMessage || "We've encountered an issue loading this content. Please try again."}
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
        
        {/* Render children with transition if not loading or error */}
        {!isLoading && !errorMessage && (
          <ContainerTransition 
            locationKey={key}
            type="fade"
            duration={0.4}
            disabled={disableAnimations}
          >
            {children}
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
  sx: PropTypes.object
};

export default MainContainer;

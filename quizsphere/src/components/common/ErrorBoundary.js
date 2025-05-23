import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { RefreshRounded, HomeRounded } from '@mui/icons-material';

/**
 * Error UI component that displays when an error is caught
 */
const ErrorFallback = ({ error, resetErrorBoundary, theme }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      borderRadius: 2,
      backgroundColor: alpha(theme.palette.error.main, 0.05),
      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
      textAlign: 'center',
      maxWidth: '600px',
      mx: 'auto',
      my: 8
    }}
  >
    <Typography variant="h4" color="error" gutterBottom>
      Oops! Something went wrong
    </Typography>
    
    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
      We encountered an error while rendering this view.
    </Typography>

    {process.env.NODE_ENV === 'development' && (
      <Box
        component="pre"
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          overflowX: 'auto',
          textAlign: 'left',
          fontSize: '0.75rem',
          color: 'error.main'
        }}
      >
        {error?.message || 'Unknown error occurred'}
      </Box>
    )}
    
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<HomeRounded />}
        onClick={() => window.location.href = '/'}
      >
        Go Home
      </Button>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<RefreshRounded />}
        onClick={resetErrorBoundary}
      >
        Try Again
      </Button>
    </Box>
  </Paper>
);

/**
 * ErrorBoundary component for catching React errors
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Log to monitoring service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackWithTheme 
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

// Wrap the ErrorFallback component to use theme
const ErrorFallbackWithTheme = (props) => {
  const theme = useTheme();
  return <ErrorFallback {...props} theme={theme} />;
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
  onReset: PropTypes.func
};

export default ErrorBoundary;

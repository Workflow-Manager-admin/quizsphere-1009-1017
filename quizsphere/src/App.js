import React, { useState, useEffect, Suspense } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import our custom theme
import theme from './styles/QuizStyles';

// Import layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainContainer from './components/layout/MainContainer';

// Import custom hooks
import useContainerState from './hooks/useContainerState';

// Import pages
import HomePage from './pages/HomePage';
import QuizBrowser from './pages/QuizBrowser';
import QuizCreator from './pages/QuizCreator';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

// Import context provider
import { QuizProvider } from './context/QuizContext';

// ScrollToTop component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

/**
 * Main App component - serves as the container for QuizSphere
 * Sets up routing, theming, and application structure
 */
function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  // Global error handling
  const handleError = (error) => {
    console.error('Application error:', error);
    setError('An unexpected error occurred. Please try refreshing the page.');
    showNotification('An error occurred. Some features may not work properly.', 'error');
  };
  
  // Notification helper
  const showNotification = (message, type = 'info') => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  // Setup global error handler
  useEffect(() => {
    const errorHandler = (event) => {
      event.preventDefault();
      handleError(event.error);
    };
    
    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QuizProvider>
        <Router>
          <ScrollToTop />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              position: 'relative',
            }}
          >
            {/* Loading indicator at the very top of the page */}
            {loading && (
              <LinearProgress 
                color="primary" 
                sx={{ 
                  position: 'fixed', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  zIndex: 9999,
                  height: 3
                }} 
              />
            )}
            
            <Header />
            
            <MainContainer 
              loading={loading} 
              error={error} 
              backgroundPattern={true}
            >
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<QuizBrowser />} />
                  <Route path="/create" element={<QuizCreator />} />
                  <Route path="/quiz/:quizId" element={<QuizPage />} />
                  <Route path="/results/:quizId" element={<ResultsPage />} />
                  <Route path="/my-quizzes" element={<QuizBrowser />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </MainContainer>
            
            <Footer />
            
            {/* Global notification system */}
            <Snackbar
              open={notification.open}
              autoHideDuration={6000}
              onClose={closeNotification}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert 
                onClose={closeNotification} 
                severity={notification.type} 
                variant="filled"
                sx={{ width: '100%' }}
              >
                {notification.message}
              </Alert>
            </Snackbar>
          </Box>
        </Router>
      </QuizProvider>
    </ThemeProvider>
  );
}

export default App;

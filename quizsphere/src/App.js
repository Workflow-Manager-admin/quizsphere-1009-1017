import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import our custom theme
import theme from './styles/QuizStyles';

// Import layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Import pages
import HomePage from './pages/HomePage';
import QuizBrowser from './pages/QuizBrowser';
import QuizCreator from './pages/QuizCreator';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

// Import context provider
import { QuizProvider } from './context/QuizContext';

/**
 * Main App component - serves as the container for QuizSphere
 * Sets up routing, theming, and application structure
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QuizProvider>
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<QuizBrowser />} />
                <Route path="/create" element={<QuizCreator />} />
                <Route path="/quiz/:quizId" element={<QuizPage />} />
                <Route path="/results/:quizId" element={<ResultsPage />} />
                <Route path="/my-quizzes" element={<QuizBrowser />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Box>
            
            <Footer />
          </Box>
        </Router>
      </QuizProvider>
    </ThemeProvider>
  );
}

export default App;

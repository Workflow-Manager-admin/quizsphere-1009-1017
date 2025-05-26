/* global console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  alpha,
  Divider,
  LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Import components
import MainContainer from '../layout/MainContainer';
import QuizProgress from '../ui/QuizProgress';
import QuizNavigation from '../ui/QuizNavigation';
import QuizTimer from '../ui/QuizTimer';

// Import context and hooks
import { useQuizContext } from '../../context/QuizContext';
import useContainerState from '../../hooks/useContainerState';

// PUBLIC_INTERFACE
/**
 * QuizContainer component - Specialized container for quiz participation
 * Extends MainContainer with quiz-specific features like progress tracking,
 * navigation controls, and timer integration
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render
 * @param {string} props.quizId - ID of the current quiz
 * @param {Object} props.quizData - Quiz data object
 * @param {boolean} props.showTimer - Whether to show the quiz timer
 * @param {number} props.timeLimit - Time limit in minutes (if timer is shown)
 * @param {Function} props.onTimeUp - Callback when timer expires
 * @param {boolean} props.showProgress - Whether to show progress indicators
 * @param {boolean} props.showNavigation - Whether to show navigation controls
 * @param {Function} props.onQuestionChange - Callback when question changes
 * @param {Function} props.onQuizComplete - Callback when quiz is completed
 * @param {Object} props.containerProps - Additional props to pass to MainContainer
 */
const QuizContainer = ({
  children,
  quizId,
  quizData,
  showTimer = true,
  timeLimit = 0,
  onTimeUp,
  showProgress = true,
  showNavigation = true,
  onQuestionChange,
  onQuizComplete,
  containerProps = {}
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Get quiz context state and actions
  const {
    submitAnswer,
    calculateScore,
    currentQuestion: contextCurrentQuestion,
    setCurrentQuestion: setContextCurrentQuestion,
    userAnswers: contextUserAnswers
  } = useQuizContext();
  
  // Container state management
  const { loading, error, executeWithLoading } = useContainerState();
  
  // Local state
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Start timer when quiz begins
  useEffect(() => {
    if (!showTimer || !timeLimit || submitted || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showTimer, timeLimit, submitted, timeRemaining, onTimeUp]);
  
  // Calculate progress
  const progress = quizData?.questions ? 
    ((contextCurrentQuestion + 1) / quizData.questions.length) * 100 : 0;
  
  // Handle question navigation
  const handleQuestionChange = async (direction) => {
    const totalQuestions = quizData?.questions?.length || 0;
    let nextQuestionIndex = contextCurrentQuestion;
    
    if (direction === 'next') {
      if (contextCurrentQuestion < totalQuestions - 1) {
        nextQuestionIndex = contextCurrentQuestion + 1;
      }
    } else if (direction === 'prev') {
      if (contextCurrentQuestion > 0) {
        nextQuestionIndex = contextCurrentQuestion - 1;
      }
    } else {
      nextQuestionIndex = direction; // For direct navigation
    }
    
    // Validate navigation
    if (nextQuestionIndex < 0 || nextQuestionIndex >= totalQuestions) {
      return;
    }
    
    try {
      await executeWithLoading(async () => {
        // Update question index
        setContextCurrentQuestion(nextQuestionIndex);
        
        // Notify parent component
        if (onQuestionChange) {
          onQuestionChange(nextQuestionIndex);
        }
      });
    } catch (err) {
      console.error('Failed to navigate questions:', err);
    }
  };
  
  // Handle quiz completion
  const handleQuizComplete = async () => {
    try {
      setIsSubmitting(true);
      
      await executeWithLoading(async () => {
        // Calculate score with fallback
        const score = calculateScore ? calculateScore() : 0;
        
        // Mark as submitted
        setSubmitted(true);
        
        // Notify parent component
        if (onQuizComplete) {
          onQuizComplete({
            score,
            total: quizData?.questions?.length || 0,
            userAnswers: contextUserAnswers,
            quizTitle: quizData?.title
          });
        }
        
        // Navigate to results page
        navigate(`/results/${quizId}`);
      });
    } catch (err) {
      console.error('Failed to complete quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render quiz header with progress and timer
  const renderQuizHeader = () => (
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
        {/* Quiz title and info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h1">
            {quizData?.title || 'Quiz Session'}
          </Typography>
          
          {showTimer && timeLimit > 0 && (
            <QuizTimer
              duration={timeRemaining}
              active={!submitted}
              onTimeUp={onTimeUp}
              showIcon={true}
            />
          )}
        </Box>
        
        <Divider />
        
        {/* Progress indicators */}
        {showProgress && quizData?.questions && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Question {contextCurrentQuestion + 1} of {quizData.questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% complete
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </>
        )}
      </Box>
    </Paper>
  );
  
  return (
    <MainContainer
      containerMode="participate"
      loading={loading}
      error={error}
      showNavigation={true}
      backgroundPattern={true}
      patternType="dots"
      {...containerProps}
    >
      {/* Quiz header with progress and timer */}
      {renderQuizHeader()}
      
      {/* Quiz content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {children}
        
        {/* Navigation controls */}
        {showNavigation && quizData?.questions && (
          <QuizNavigation
            showPrevious={true}
            showNext={!isSubmitting && contextCurrentQuestion < quizData.questions.length - 1}
            showFinish={contextCurrentQuestion === quizData.questions.length - 1}
            canGoNext={!isSubmitting}
            canGoBack={contextCurrentQuestion > 0 && !isSubmitting}
            onPrevious={() => handleQuestionChange('prev')}
            onNext={() => handleQuestionChange('next')}
            onFinish={handleQuizComplete}
            isLastQuestion={contextCurrentQuestion === quizData.questions.length - 1}
          />
        )}
      </Box>
    </MainContainer>
  );
};

QuizContainer.propTypes = {
  children: PropTypes.node.isRequired,
  quizId: PropTypes.string.isRequired,
  quizData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    timeLimit: PropTypes.number,
    questions: PropTypes.arrayOf(PropTypes.object),
  }),
  showTimer: PropTypes.bool,
  timeLimit: PropTypes.number,
  onTimeUp: PropTypes.func,
  showProgress: PropTypes.bool,
  showNavigation: PropTypes.bool,
  onQuestionChange: PropTypes.func,
  onQuizComplete: PropTypes.func,
  containerProps: PropTypes.object
};

export default QuizContainer;

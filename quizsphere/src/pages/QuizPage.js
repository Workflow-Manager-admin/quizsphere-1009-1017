import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Timer as TimerIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import { formatTime, getDifficultyColor } from '../utils/quizHelpers';
import mockQuizData from '../data/mockQuizData'; // Temporarily using mock data

// PUBLIC_INTERFACE
/**
 * QuizPage component for taking quizzes
 * Handles displaying questions, timer, submission and navigation
 */
const QuizPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { 
    submitAnswer, 
    calculateScore, 
    currentQuestion: contextCurrentQuestion,
    currentQuiz: contextCurrentQuiz,
    userAnswers: contextUserAnswers,
    setCurrentQuiz
  } = useQuizContext();
  
  // Local state for quiz data and UI
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Load quiz data
  useEffect(() => {
    // In a real app, this would fetch from API or context
    const loadQuiz = () => {
      setLoading(true);
      
      // Find quiz in mock data (in real app, would be API/context)
      const foundQuiz = mockQuizData.find(q => q.id === quizId);
      
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTimeRemaining(foundQuiz.timeLimit || 600);
        setUserAnswers(new Array(foundQuiz.questions.length).fill(null));
        
        // Also set in context (simulating what would happen in real app)
        setCurrentQuiz && setCurrentQuiz(foundQuiz);
      }
      
      setLoading(false);
    };
    
    loadQuiz();
  }, [quizId, setCurrentQuiz]);
  
  // Timer effect
  useEffect(() => {
    if (!quiz || submitted || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(timer);
          setShowTimeUpDialog(true);
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quiz, submitted, timeRemaining]);
  
  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (submitted) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
    
    // Also update in context
    submitAnswer && submitAnswer(currentQuestion, answer);
  };
  
  // Navigation functions
  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Submit quiz
  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    
    // Calculate score
    let score = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        score += 1;
      }
    });
    
    calculateScore && calculateScore();
    
    // Navigate to results page
    navigate(`/results/${quizId}`, { 
      state: { 
        score,
        total: quiz.questions.length,
        userAnswers,
        quizTitle: quiz.title
      }
    });
  }, [quiz, userAnswers, navigate, quizId, calculateScore]);
  
  // Handle time up
  const handleTimeUp = () => {
    setShowTimeUpDialog(false);
    handleSubmit();
  };
  
  // Return to quiz list
  const handleExit = () => {
    navigate('/browse');
  };
  
  // Loading state
  if (loading || !quiz) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <Typography>Loading quiz...</Typography>
        </Box>
      </Container>
    );
  }
  
  // Current question data
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  
  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
      {/* Quiz header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {quiz.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={quiz.category} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={quiz.difficulty} 
            sx={{ 
              bgcolor: getDifficultyColor(quiz.difficulty),
              color: 'white'
            }} 
          />
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ml: 'auto',
              color: timeRemaining < 60 ? 'error.main' : 'text.secondary'
            }}
          >
            <TimerIcon sx={{ mr: 0.5 }} />
            <Typography>
              {formatTime(timeRemaining)}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Progress bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Typography>
          <Typography variant="body2">
            {Math.round(progress)}% complete
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      {/* Question card */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4,
          borderRadius: 2,
          boxShadow: 2
        }}
      >
        <Typography variant="h5" gutterBottom>
          {question.text}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup 
            value={userAnswers[currentQuestion] || ''} 
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            <Grid container spacing={2}>
              {question.options.map((option, index) => (
                <Grid item xs={12} key={index}>
                  <Card 
                    sx={{ 
                      mb: 1,
                      borderColor: userAnswers[currentQuestion] === option ? 
                        theme.palette.primary.main : 'transparent',
                      borderWidth: 2,
                      borderStyle: 'solid',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: userAnswers[currentQuestion] !== option ? 
                          theme.palette.divider : theme.palette.primary.main,
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <FormControlLabel 
                        value={option} 
                        control={<Radio />} 
                        label={option}
                        sx={{ 
                          width: '100%',
                          ml: 0,
                          '.MuiFormControlLabel-label': {
                            width: '100%'
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
      </Paper>
      
      {/* Question navigation */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 4
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <Button
          variant="contained"
          onClick={() => setShowExitDialog(true)}
          color="error"
        >
          Exit Quiz
        </Button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
            color="primary"
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<CheckCircleIcon />}
            onClick={handleSubmit}
            color="primary"
          >
            Submit
          </Button>
        )}
      </Box>
      
      {/* Question navigation dots */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 1,
          mt: 4
        }}
      >
        {quiz.questions.map((q, index) => (
          <Box
            key={index}
            onClick={() => setCurrentQuestion(index)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: currentQuestion === index ? 
                'primary.main' : 
                (userAnswers[index] ? 'success.light' : 'grey.300'),
              color: currentQuestion === index ? 
                'white' : 
                (userAnswers[index] ? 'white' : 'text.primary'),
              border: currentQuestion === index ? 
                '2px solid' : '1px solid',
              borderColor: currentQuestion === index ? 
                'primary.dark' : 
                (userAnswers[index] ? 'success.main' : 'grey.400'),
              fontWeight: 'bold',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            {index + 1}
          </Box>
        ))}
      </Box>
      
      {/* Exit dialog */}
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
      >
        <DialogTitle>
          Exit Quiz?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to exit? Your progress will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>Cancel</Button>
          <Button onClick={handleExit} color="error">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Time's up dialog */}
      <Dialog
        open={showTimeUpDialog}
        onClose={handleTimeUp}
      >
        <DialogTitle>
          Time's Up!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your time has expired. Your quiz will be submitted with your current answers.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTimeUp} color="primary" autoFocus>
            View Results
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizPage;

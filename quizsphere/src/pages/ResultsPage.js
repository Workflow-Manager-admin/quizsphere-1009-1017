import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Share as ShareIcon,
  Replay as ReplayIcon,
  Home as HomeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import { calculatePercentage, formatQuizResults, getDifficultyColor } from '../utils/quizHelpers';
import mockQuizData from '../data/mockQuizData'; // Temporarily using mock data

// PUBLIC_INTERFACE
/**
 * ResultsPage component for displaying quiz results
 * Shows score, correct/incorrect answers, and provides options to share or retake
 */
const ResultsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const location = useLocation();
  const { score: contextScore, currentQuiz, userAnswers: contextUserAnswers } = useQuizContext();
  
  // Use state from navigation or context
  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(location.state?.score || contextScore || 0);
  const [userAnswers, setUserAnswers] = useState(location.state?.userAnswers || contextUserAnswers || []);
  const [loading, setLoading] = useState(true);
  
  // UI state
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareNote, setShareNote] = useState('');
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  
  // Load quiz data
  useEffect(() => {
    const loadQuiz = () => {
      setLoading(true);
      
      // Get quiz from mock data (in real app, would be API/context)
      const foundQuiz = mockQuizData.find(q => q.id === quizId);
      
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else if (currentQuiz) {
        setQuiz(currentQuiz);
      }
      
      setLoading(false);
    };
    
    loadQuiz();
  }, [quizId, currentQuiz]);
  
  // Handle share submission
  const handleShare = () => {
    // In a real app, this would call an API to share results
    setShowShareDialog(false);
    setShowShareSuccess(true);
  };
  
  // Handle retake quiz
  const handleRetake = () => {
    navigate(`/quiz/${quizId}`);
  };
  
  // Handle go back to home
  const handleGoHome = () => {
    navigate('/');
  };
  
  // Handle browse more quizzes
  const handleBrowseMore = () => {
    navigate('/browse');
  };
  
  if (loading || !quiz) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <Typography>Loading results...</Typography>
        </Box>
      </Container>
    );
  }
  
  // Calculate stats
  const total = quiz.questions.length;
  const percentage = calculatePercentage(score, total);
  const correctCount = score;
  const incorrectCount = total - score;
  
  // Determine performance level
  let performanceLevel = 'Poor';
  let performanceColor = 'error';
  
  if (percentage >= 80) {
    performanceLevel = 'Excellent';
    performanceColor = 'success';
  } else if (percentage >= 60) {
    performanceLevel = 'Good';
    performanceColor = 'primary';
  } else if (percentage >= 40) {
    performanceLevel = 'Fair';
    performanceColor = 'warning';
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
      {/* Results header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Quiz Results
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {quiz.title}
        </Typography>
      </Box>
      
      {/* Score summary */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 5,
          borderRadius: 2,
          boxShadow: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Your Score
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={percentage}
              size={160}
              thickness={5}
              color={performanceColor}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h3" component="div" fontWeight="bold">
                {percentage}%
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {score}/{total}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Chip 
            label={performanceLevel} 
            color={performanceColor}
            sx={{ fontSize: '1rem', py: 2, px: 1 }}
          />
        </Box>
        
        <Grid container spacing={3} sx={{ justifyContent: 'center', mb: 2 }}>
          <Grid item xs={6} sm={4}>
            <Card sx={{ bgcolor: 'background.default' }}>
              <CardContent>
                <Typography variant="h5" color="primary">
                  {correctCount}
                </Typography>
                <Typography variant="body2">
                  Correct
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4}>
            <Card sx={{ bgcolor: 'background.default' }}>
              <CardContent>
                <Typography variant="h5" color="error">
                  {incorrectCount}
                </Typography>
                <Typography variant="body2">
                  Incorrect
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<ShareIcon />}
            onClick={() => setShowShareDialog(true)}
          >
            Share Results
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ReplayIcon />}
            onClick={handleRetake}
          >
            Retake Quiz
          </Button>
        </Box>
      </Paper>
      
      {/* Answer review */}
      <Typography variant="h5" gutterBottom>
        Review Answers
      </Typography>
      
      {quiz.questions.map((question, index) => {
        const userAnswer = userAnswers[index] || 'Not answered';
        const isCorrect = userAnswer === question.correctAnswer;
        
        return (
          <Paper 
            key={question.id} 
            sx={{ 
              p: 3, 
              mb: 3,
              borderLeft: '4px solid',
              borderColor: isCorrect ? 'success.main' : 'error.main'
            }}
          >
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Question {index + 1}: {question.text}
            </Typography>
            
            <List dense>
              {question.options.map((option, optIndex) => {
                const isUserAnswer = option === userAnswer;
                const isCorrectAnswer = option === question.correctAnswer;
                
                return (
                  <ListItem 
                    key={optIndex}
                    sx={{ 
                      py: 0.5,
                      backgroundColor: isUserAnswer || isCorrectAnswer ? 
                        alpha(
                          isCorrectAnswer ? theme.palette.success.main : theme.palette.error.main,
                          0.1
                        ) : 'transparent',
                      borderRadius: 1,
                      mb: 0.5
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {isCorrectAnswer ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        isUserAnswer && <CancelIcon color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={option} 
                      primaryTypographyProps={{
                        fontWeight: isUserAnswer || isCorrectAnswer ? 'bold' : 'normal'
                      }}
                    />
                    {isUserAnswer && !isCorrectAnswer && (
                      <Typography variant="caption" color="error">
                        Your answer
                      </Typography>
                    )}
                    {isCorrectAnswer && !isUserAnswer && (
                      <Typography variant="caption" color="success.dark">
                        Correct answer
                      </Typography>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        );
      })}
      
      {/* Action buttons */}
      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
        >
          Go to Home
        </Button>
        
        <Button 
          variant="contained"
          onClick={handleBrowseMore}
        >
          Browse More Quizzes
        </Button>
      </Box>
      
      {/* Share dialog */}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Your Results</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              You scored {score}/{total} ({percentage}%) on "{quiz.title}"
            </Typography>
          </Box>
          
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Add a note (optional)"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={shareNote}
            onChange={(e) => setShareNote(e.target.value)}
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Share on social media
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <IconButton aria-label="facebook" color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="twitter" color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="linkedin" color="primary">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleShare} 
            variant="contained"
            color="primary"
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Share success notification */}
      <Snackbar
        open={showShareSuccess}
        autoHideDuration={6000}
        onClose={() => setShowShareSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowShareSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Results shared successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Need to define alpha function since it's used but not imported
const alpha = (color, opacity) => {
  return color + Math.round(opacity * 255).toString(16).padStart(2, '0');
};

export default ResultsPage;

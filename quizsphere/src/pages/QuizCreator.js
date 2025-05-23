import React, { useState } from 'react';
import {
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useQuizContext } from '../context/QuizContext';
import { validateQuiz, generateId } from '../utils/quizHelpers';
import { useNavigate } from 'react-router-dom';

// Transition for the submission dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// PUBLIC_INTERFACE
/**
 * QuizCreator component for creating and editing quizzes
 * Features a multi-step process to define quiz details and questions
 */
const QuizCreator = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { categories, difficultyLevels, createQuiz } = useQuizContext();
  
  // Step management
  const steps = ['Quiz Details', 'Create Questions', 'Review'];
  const [activeStep, setActiveStep] = useState(0);
  
  // Quiz state
  const [quiz, setQuiz] = useState({
    id: generateId(),
    title: '',
    description: '',
    category: '',
    difficulty: '',
    timeLimit: 600, // Default 10 minutes
    questions: []
  });
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState({
    id: generateId(),
    text: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [questionErrors, setQuestionErrors] = useState({});
  
  // Dialog states
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  
  const handleQuizDetailsChange = (field, value) => {
    setQuiz({
      ...quiz,
      [field]: value
    });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  const handleQuestionChange = (field, value) => {
    setCurrentQuestion({
      ...currentQuestion,
      [field]: value
    });
    
    // Clear error for this field if it exists
    if (questionErrors[field]) {
      setQuestionErrors({
        ...questionErrors,
        [field]: null
      });
    }
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
    
    // Clear options error if it exists
    if (questionErrors.options) {
      setQuestionErrors({
        ...questionErrors,
        options: null
      });
    }
  };
  
  const validateQuizDetails = () => {
    const newErrors = {};
    
    if (!quiz.title.trim()) {
      newErrors.title = 'Quiz title is required';
    }
    
    if (!quiz.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!quiz.difficulty) {
      newErrors.difficulty = 'Difficulty level is required';
    }
    
    if (!quiz.timeLimit || quiz.timeLimit < 60) {
      newErrors.timeLimit = 'Time limit must be at least 1 minute';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateQuestionForm = () => {
    const newErrors = {};
    
    if (!currentQuestion.text.trim()) {
      newErrors.text = 'Question text is required';
    }
    
    const nonEmptyOptions = currentQuestion.options.filter(opt => opt.trim() !== '');
    if (nonEmptyOptions.length < 2) {
      newErrors.options = 'At least two options are required';
    }
    
    if (!currentQuestion.correctAnswer) {
      newErrors.correctAnswer = 'Please select a correct answer';
    }
    
    setQuestionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddQuestion = () => {
    if (!validateQuestionForm()) return;
    
    const newQuestions = [...quiz.questions];
    
    if (editingQuestionIndex >= 0) {
      // Update existing question
      newQuestions[editingQuestionIndex] = {
        ...currentQuestion,
        id: quiz.questions[editingQuestionIndex].id
      };
    } else {
      // Add new question
      newQuestions.push({
        ...currentQuestion,
        id: generateId()
      });
    }
    
    setQuiz({
      ...quiz,
      questions: newQuestions
    });
    
    // Reset form
    setCurrentQuestion({
      id: generateId(),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
    setEditingQuestionIndex(-1);
  };
  
  const handleEditQuestion = (index) => {
    const question = quiz.questions[index];
    setCurrentQuestion({
      ...question,
      options: [...question.options] // Create a copy of options array
    });
    setEditingQuestionIndex(index);
  };
  
  const handleDeleteQuestion = (index) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(index, 1);
    setQuiz({
      ...quiz,
      questions: newQuestions
    });
    
    // If editing this question, reset form
    if (editingQuestionIndex === index) {
      setCurrentQuestion({
        id: generateId(),
        text: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
      setEditingQuestionIndex(-1);
    } else if (editingQuestionIndex > index) {
      // Adjust editingQuestionIndex if deleting a question before it
      setEditingQuestionIndex(editingQuestionIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate quiz details before proceeding
      if (!validateQuizDetails()) return;
    } else if (activeStep === 1) {
      // Ensure there's at least one question
      if (quiz.questions.length === 0) {
        setErrors({ questions: 'At least one question is required' });
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmitQuiz = () => {
    // Final validation
    const { isValid, errors: validationErrors } = validateQuiz(quiz);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    // In a real app, this would send the quiz to an API
    createQuiz(quiz);
    setShowSubmitDialog(false);
    setShowSuccessSnackbar(true);
    
    // Navigate to the quiz browser after a short delay
    setTimeout(() => {
      navigate('/browse');
    }, 2000);
  };
  
  // Render different steps based on activeStep
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderQuizDetailsForm();
      case 1:
        return renderQuestionForm();
      case 2:
        return renderQuizReview();
      default:
        return null;
    }
  };
  
  const renderQuizDetailsForm = () => (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quiz Title"
              value={quiz.title}
              onChange={(e) => handleQuizDetailsChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={quiz.description}
              onChange={(e) => handleQuizDetailsChange('description', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category} required>
              <InputLabel>Category</InputLabel>
              <Select
                value={quiz.category}
                label="Category"
                onChange={(e) => handleQuizDetailsChange('category', e.target.value)}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.difficulty} required>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={quiz.difficulty}
                label="Difficulty"
                onChange={(e) => handleQuizDetailsChange('difficulty', e.target.value)}
              >
                {difficultyLevels.map((level, index) => (
                  <MenuItem key={index} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
              {errors.difficulty && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.difficulty}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Time Limit (seconds)"
              value={quiz.timeLimit}
              onChange={(e) => handleQuizDetailsChange('timeLimit', parseInt(e.target.value) || 0)}
              error={!!errors.timeLimit}
              helperText={errors.timeLimit || 'Minimum: 60 seconds'}
              InputProps={{ inputProps: { min: 60 } }}
              required
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
  
  const renderQuestionForm = () => (
    <Box sx={{ mt: 4 }}>
      {/* Question form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingQuestionIndex >= 0 ? 'Edit Question' : 'Add New Question'}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Question Text"
              value={currentQuestion.text}
              onChange={(e) => handleQuestionChange('text', e.target.value)}
              error={!!questionErrors.text}
              helperText={questionErrors.text}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Options:
            </Typography>
            
            {currentQuestion.options.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                <Radio
                  checked={currentQuestion.correctAnswer === option}
                  onChange={() => option.trim() && handleQuestionChange('correctAnswer', option)}
                  disabled={!option.trim()}
                />
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  error={!!questionErrors.options}
                  sx={{ flex: 1 }}
                />
              </Box>
            ))}
            
            {questionErrors.options && (
              <Typography variant="caption" color="error" sx={{ mt: -1, ml: 2, display: 'block' }}>
                {questionErrors.options}
              </Typography>
            )}
            
            {questionErrors.correctAnswer && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2, display: 'block' }}>
                {questionErrors.correctAnswer}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {editingQuestionIndex >= 0 && (
              <Button 
                variant="outlined" 
                sx={{ mr: 1 }}
                onClick={() => {
                  setCurrentQuestion({
                    id: generateId(),
                    text: '',
                    options: ['', '', '', ''],
                    correctAnswer: ''
                  });
                  setEditingQuestionIndex(-1);
                  setQuestionErrors({});
                }}
              >
                Cancel
              </Button>
            )}
            
            <Button
              variant="contained"
              color="primary"
              startIcon={editingQuestionIndex >= 0 ? <CheckIcon /> : <AddIcon />}
              onClick={handleAddQuestion}
            >
              {editingQuestionIndex >= 0 ? 'Update Question' : 'Add Question'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Added questions list */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Questions ({quiz.questions.length})
        </Typography>
        
        {errors.questions && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.questions}
          </Alert>
        )}
        
        {quiz.questions.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No questions added yet. Create your first question above.
            </Typography>
          </Paper>
        ) : (
          quiz.questions.map((question, index) => (
            <Card key={question.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Question {index + 1}:</strong> {question.text}
                  </Typography>
                  
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditQuestion(index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Grid container spacing={1}>
                  {question.options.map((option, optIndex) => (
                    <Grid item xs={12} sm={6} key={optIndex}>
                      <Box 
                        sx={{ 
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: option === question.correctAnswer ? 
                            theme.palette.success.light + '40' : 'transparent',
                          border: '1px solid',
                          borderColor: option === question.correctAnswer ? 
                            theme.palette.success.main : theme.palette.divider
                        }}
                      >
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: option === question.correctAnswer ? 
                              theme.palette.success.dark : 'inherit'
                          }}
                        >
                          {option === question.correctAnswer && '✓ '}
                          {option}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
  
  const renderQuizReview = () => (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quiz Details
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Title:</Typography>
            <Typography variant="body1" gutterBottom>{quiz.title}</Typography>
          </Grid>
          
          {quiz.description && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description:</Typography>
              <Typography variant="body1" gutterBottom>{quiz.description}</Typography>
            </Grid>
          )}
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Category:</Typography>
            <Typography variant="body1" gutterBottom>{quiz.category}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Difficulty:</Typography>
            <Typography variant="body1" gutterBottom>{quiz.difficulty}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Time Limit:</Typography>
            <Typography variant="body1" gutterBottom>
              {Math.floor(quiz.timeLimit / 60)} minutes {quiz.timeLimit % 60} seconds
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2">Total Questions:</Typography>
            <Typography variant="body1" gutterBottom>{quiz.questions.length}</Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Questions Preview
      </Typography>
      
      {quiz.questions.map((question, index) => (
        <Paper key={question.id} sx={{ p: 3, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Question {index + 1}:</strong> {question.text}
          </Typography>
          
          <Divider sx={{ my: 1 }} />
          
          <Grid container spacing={2}>
            {question.options.map((option, optIndex) => (
              <Grid item xs={12} sm={6} key={optIndex}>
                <Box 
                  sx={{ 
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: option === question.correctAnswer ? 
                      theme.palette.success.light + '40' : 'transparent',
                    border: '1px solid',
                    borderColor: option === question.correctAnswer ? 
                      theme.palette.success.main : theme.palette.divider
                  }}
                >
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: option === question.correctAnswer ? 
                        theme.palette.success.dark : 'inherit'
                    }}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                    {option === question.correctAnswer && ' (Correct)'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
  
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ mb: 4, pt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Create Quiz
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create a custom quiz with your own questions
        </Typography>
      </Box>
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Step content */}
      {renderStepContent()}
      
      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={activeStep === 0 ? () => navigate('/browse') : handleBack}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          onClick={activeStep === steps.length - 1 ? () => setShowSubmitDialog(true) : handleNext}
        >
          {activeStep === steps.length - 1 ? 'Submit Quiz' : 'Continue'}
        </Button>
      </Box>
      
      {/* Submit dialog */}
      <Dialog
        open={showSubmitDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowSubmitDialog(false)}
        aria-describedby="submit-quiz-dialog-description"
      >
        <DialogTitle>
          Submit Quiz?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="submit-quiz-dialog-description">
            Are you sure you want to submit this quiz? Once submitted, you won't be able to make further changes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitQuiz} 
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success notification */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Quiz created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuizCreator;

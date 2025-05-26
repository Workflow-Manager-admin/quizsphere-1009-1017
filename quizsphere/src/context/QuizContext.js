import { createContext, useContext, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';

// Initial state for the quiz context
const initialState = {
  // Quiz session state
  quizId: null,
  quizData: null,
  quizStatus: 'idle', // 'idle' | 'in-progress' | 'completed' | 'paused'
  currentQuestion: 0,
  totalQuestions: 0,
  userAnswers: {},
  timeRemaining: null,
  
  // UI state
  loading: false,
  error: null,
  
  // Quiz metadata
  categories: ['General Knowledge', 'Science', 'History', 'Geography', 'Entertainment'],
  difficultyLevels: ['Easy', 'Medium', 'Hard'],
  
  // Results
  score: null,
  completedAt: null,
  reviewMode: false
};

// Action Types
const ActionTypes = {
  // Quiz session actions
  START_QUIZ: 'START_QUIZ',
  SET_QUIZ_DATA: 'SET_QUIZ_DATA',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
  COMPLETE_QUIZ: 'COMPLETE_QUIZ',
  PAUSE_QUIZ: 'PAUSE_QUIZ',
  RESUME_QUIZ: 'RESUME_QUIZ',
  RESET_QUIZ: 'RESET_QUIZ',
  
  // Timer actions
  UPDATE_TIME: 'UPDATE_TIME',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Review actions
  ENTER_REVIEW_MODE: 'ENTER_REVIEW_MODE',
  EXIT_REVIEW_MODE: 'EXIT_REVIEW_MODE'
};

// Reducer function to handle state updates
function quizReducer(state, action) {
  switch (action.type) {
    case ActionTypes.START_QUIZ:
      return {
        ...state,
        quizId: action.payload.quizId,
        quizStatus: 'in-progress',
        currentQuestion: 0,
        userAnswers: {},
        score: null,
        completedAt: null,
        error: null
      };
      
    case ActionTypes.SET_QUIZ_DATA:
      return {
        ...state,
        quizData: action.payload.quizData,
        totalQuestions: action.payload.quizData.questions.length
      };
      
    case ActionTypes.SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestion: action.payload.questionIndex
      };
      
    case ActionTypes.SUBMIT_ANSWER:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.payload.questionIndex]: action.payload.answer
        }
      };
      
    case ActionTypes.COMPLETE_QUIZ:
      return {
        ...state,
        quizStatus: 'completed',
        score: action.payload.score,
        completedAt: new Date().toISOString()
      };
      
    case ActionTypes.PAUSE_QUIZ:
      return {
        ...state,
        quizStatus: 'paused'
      };
      
    case ActionTypes.RESUME_QUIZ:
      return {
        ...state,
        quizStatus: 'in-progress'
      };
      
    case ActionTypes.RESET_QUIZ:
      return {
        ...initialState,
        categories: state.categories,
        difficultyLevels: state.difficultyLevels
      };
      
    case ActionTypes.UPDATE_TIME:
      return {
        ...state,
        timeRemaining: action.payload.timeRemaining
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ActionTypes.ENTER_REVIEW_MODE:
      return {
        ...state,
        reviewMode: true
      };
      
    case ActionTypes.EXIT_REVIEW_MODE:
      return {
        ...state,
        reviewMode: false
      };
      
    default:
      return state;
  }
}

// Create the context
const QuizContext = createContext(initialState);

// Create the provider component
const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  
  // Action creators
  const startQuiz = useCallback((quizId) => {
    dispatch({ type: ActionTypes.START_QUIZ, payload: { quizId } });
  }, []);
  
  const setQuizData = useCallback((quizData) => {
    dispatch({ type: ActionTypes.SET_QUIZ_DATA, payload: { quizData } });
  }, []);
  
  const setCurrentQuestion = useCallback((questionIndex) => {
    dispatch({ 
      type: ActionTypes.SET_CURRENT_QUESTION, 
      payload: { questionIndex } 
    });
  }, []);
  
  const submitAnswer = useCallback((questionIndex, answer) => {
    dispatch({ 
      type: ActionTypes.SUBMIT_ANSWER, 
      payload: { questionIndex, answer } 
    });
  }, []);
  
  const completeQuiz = useCallback(async () => {
    // Calculate score (simplified version)
    const score = Object.keys(state.userAnswers).length / state.totalQuestions * 100;
    
    dispatch({ 
      type: ActionTypes.COMPLETE_QUIZ, 
      payload: { score } 
    });
    
    return { score, completedAt: new Date().toISOString() };
  }, [state.userAnswers, state.totalQuestions]);
  
  const pauseQuiz = useCallback(() => {
    dispatch({ type: ActionTypes.PAUSE_QUIZ });
  }, []);
  
  const resumeQuiz = useCallback(() => {
    dispatch({ type: ActionTypes.RESUME_QUIZ });
  }, []);
  
  const resetQuiz = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_QUIZ });
  }, []);
  
  const updateTime = useCallback((timeRemaining) => {
    dispatch({ 
      type: ActionTypes.UPDATE_TIME, 
      payload: { timeRemaining } 
    });
  }, []);
  
  const setLoading = useCallback((loading) => {
    dispatch({ 
      type: ActionTypes.SET_LOADING, 
      payload: { loading } 
    });
  }, []);
  
  const setError = useCallback((error) => {
    dispatch({ 
      type: ActionTypes.SET_ERROR, 
      payload: { error } 
    });
  }, []);
  
  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);
  
  const enterReviewMode = useCallback(() => {
    dispatch({ type: ActionTypes.ENTER_REVIEW_MODE });
  }, []);
  
  const exitReviewMode = useCallback(() => {
    dispatch({ type: ActionTypes.EXIT_REVIEW_MODE });
  }, []);
  
  // Calculate score based on correct answers
  const calculateScore = useCallback(() => {
    if (!state.quizData || !state.userAnswers) return 0;
    
    const correctAnswers = Object.entries(state.userAnswers).reduce((count, [questionIndex, answer]) => {
      const question = state.quizData.questions[parseInt(questionIndex)];
      return question.correctAnswer === answer ? count + 1 : count;
    }, 0);
    
    return (correctAnswers / state.quizData.questions.length) * 100;
  }, [state.quizData, state.userAnswers]);

  // Combine state and actions into context value
  const value = {
    ...state,
    startQuiz,
    setQuizData,
    setCurrentQuestion,
    submitAnswer,
    completeQuiz,
    pauseQuiz,
    resumeQuiz,
    resetQuiz,
    updateTime,
    setLoading,
    setError,
    clearError,
    enterReviewMode,
    exitReviewMode,
    calculateScore
  };
  
  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

// Type checking for the provider
QuizProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook for using the quiz context
const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};

// Export everything that needs to be available
export { 
  QuizContext,
  useQuizContext,
  ActionTypes,
  initialState 
};

// Default export of the provider
export default QuizProvider;

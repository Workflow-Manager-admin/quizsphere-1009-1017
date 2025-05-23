import React, { createContext, useContext, useReducer } from 'react';

// Initial state for the quiz context
const initialState = {
  quizzes: [],
  currentQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  score: 0,
  loading: false,
  error: null,
  categories: [
    'General Knowledge',
    'Science',
    'History',
    'Geography',
    'Entertainment',
    'Sports',
    'Technology',
    'Art & Literature',
  ],
  difficultyLevels: ['Easy', 'Medium', 'Hard'],
};

// Reducer function to handle state changes
const quizReducer = (state, action) => {
  switch (action.type) {
    case 'SET_QUIZZES':
      return { ...state, quizzes: action.payload, loading: false };
    case 'SET_CURRENT_QUIZ':
      return { 
        ...state, 
        currentQuiz: action.payload,
        currentQuestion: 0,
        userAnswers: [],
        score: 0
      };
    case 'NEXT_QUESTION':
      return { ...state, currentQuestion: state.currentQuestion + 1 };
    case 'PREV_QUESTION':
      return { ...state, currentQuestion: Math.max(0, state.currentQuestion - 1) };
    case 'SUBMIT_ANSWER':
      const { questionIndex, answer } = action.payload;
      const newUserAnswers = [...state.userAnswers];
      newUserAnswers[questionIndex] = answer;
      return { ...state, userAnswers: newUserAnswers };
    case 'CALCULATE_SCORE':
      const { quiz, answers } = action.payload;
      let newScore = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          newScore += 1;
        }
      });
      return { ...state, score: newScore };
    case 'ADD_QUIZ':
      return { ...state, quizzes: [...state.quizzes, action.payload] };
    case 'START_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create the context
const QuizContext = createContext();

// Create a custom hook for using the quiz context
export const useQuizContext = () => useContext(QuizContext);

// Create the provider component
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Define actions that components can use
  const actions = {
    fetchQuizzes: async () => {
      dispatch({ type: 'START_LOADING' });
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data that will be imported elsewhere
        const quizzes = []; // This will be replaced with actual data
        dispatch({ type: 'SET_QUIZZES', payload: quizzes });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    },
    setCurrentQuiz: (quiz) => {
      dispatch({ type: 'SET_CURRENT_QUIZ', payload: quiz });
    },
    nextQuestion: () => {
      dispatch({ type: 'NEXT_QUESTION' });
    },
    prevQuestion: () => {
      dispatch({ type: 'PREV_QUESTION' });
    },
    submitAnswer: (questionIndex, answer) => {
      dispatch({ 
        type: 'SUBMIT_ANSWER', 
        payload: { questionIndex, answer } 
      });
    },
    calculateScore: () => {
      dispatch({ 
        type: 'CALCULATE_SCORE', 
        payload: { quiz: state.currentQuiz, answers: state.userAnswers } 
      });
    },
    createQuiz: (newQuiz) => {
      dispatch({ type: 'ADD_QUIZ', payload: newQuiz });
    },
    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

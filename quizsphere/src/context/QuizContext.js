// Only import what we're actually using
import { createContext, useContext } from 'react';

// Initial state for the quiz context
const initialState = {
  // [Previous initialState implementation remains the same...]
};

// Action Types
const ActionTypes = {
  // [Previous ActionTypes implementation remains the same...]
};

// Create the context
const QuizContext = createContext(initialState);

// Create a custom hook for using the quiz context
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

// Also export the provider directly from the context
export const QuizProvider = QuizContext.Provider;

// Default export
export default QuizProvider;

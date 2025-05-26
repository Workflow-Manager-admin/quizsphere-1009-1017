import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// [Previous initialState and ActionTypes remain the same...]

// Create the context
export const QuizContext = createContext();

// Create a custom hook for using the quiz context
export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};

// Create the provider component
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  
  // [Previous implementation remains the same...]
  
  const value = {
    ...state,
    ...actions,
  };
  
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

// Make sure we export everything needed
export { ActionTypes, initialState };
export default QuizProvider;

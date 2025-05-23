import { useState, useCallback } from 'react';

/**
 * Custom hook for managing container loading and error states
 * 
 * This hook provides functions to manage loading states and errors
 * for components that are rendered within the MainContainer.
 * 
 * @returns {Object} Object containing state and state management functions
 */
const useContainerState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Start loading state
   */
  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);
  
  /**
   * Stop loading state
   */
  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);
  
  /**
   * Set error with message and stop loading
   * 
   * @param {string} message - Error message to display
   */
  const setErrorMessage = useCallback((message) => {
    setError(message || 'An error occurred');
    setLoading(false);
  }, []);
  
  /**
   * Clear any error messages
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Execute an async function with loading state management
   * 
   * @param {Function} asyncFn - Async function to execute
   * @param {Object} options - Additional options
   * @param {boolean} options.showLoading - Whether to show loading state
   * @param {boolean} options.handleError - Whether to handle errors automatically
   * @returns {Promise<*>} Result of the async function
   */
  const executeWithLoading = useCallback(async (
    asyncFn, 
    { showLoading = true, handleError = true } = {}
  ) => {
    if (showLoading) startLoading();
    
    try {
      const result = await asyncFn();
      stopLoading();
      return result;
    } catch (err) {
      console.error('Operation failed:', err);
      
      if (handleError) {
        setErrorMessage(err.message || 'Operation failed');
      } else {
        stopLoading();
      }
      
      throw err;
    }
  }, [startLoading, stopLoading, setErrorMessage]);
  
  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setError: setErrorMessage,
    clearError,
    executeWithLoading
  };
};

export default useContainerState;

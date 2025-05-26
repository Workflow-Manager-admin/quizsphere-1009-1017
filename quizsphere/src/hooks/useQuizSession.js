/* global setTimeout, clearTimeout */
import { useState, useCallback, useEffect } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { formatTime } from '../utils/quizHelpers';

// PUBLIC_INTERFACE
/**
 * Custom hook for managing quiz session state and functionality
 * Handles quiz timing, answer tracking, navigation, and completion
 * 
 * @param {Object} config - Configuration object
 * @param {number} config.timeLimit - Time limit in minutes
 * @param {Function} config.onTimeUp - Callback when timer expires
 * @returns {Object} Quiz session state and control methods
 */
const useQuizSession = ({
  timeLimit = 0,
  onTimeUp = null
} = {}) => {
  // Local state
  const [remainingTime, setRemainingTime] = useState(timeLimit * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Get quiz context
  const {
    quizStatus,
    currentQuestion,
    totalQuestions,
    userAnswers,
    setCurrentQuestion,
    submitAnswer,
    completeQuiz,
    updateTime
  } = useQuizContext();

  // Start the timer
  const startTimer = useCallback(() => {
    if (timeLimit <= 0) return;
    
    setIsTimerRunning(true);
    const startTime = Date.now();
    const endTime = startTime + (remainingTime * 1000);

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      
      setRemainingTime(remaining);
      updateTime(remaining);

      if (remaining <= 0) {
        setIsTimerRunning(false);
        if (onTimeUp) onTimeUp();
        return;
      }

      const newTimeoutId = setTimeout(tick, 1000);
      setTimeoutId(newTimeoutId);
    };

    tick();
  }, [timeLimit, remainingTime, onTimeUp, updateTime]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  // Handle quiz status changes
  useEffect(() => {
    if (quizStatus === 'completed' || quizStatus === 'paused') {
      pauseTimer();
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [quizStatus, timeoutId, pauseTimer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return {
    // Timer state
    remainingTime,
    isTimerRunning,
    formattedTime: formatTime(remainingTime),
    
    // Timer controls
    startTimer,
    pauseTimer,
    
    // Quiz progress
    currentQuestion,
    totalQuestions,
    progress: (currentQuestion + 1) / totalQuestions * 100,
    answeredQuestions: Object.keys(userAnswers).length,
    
    // Quiz status
    isComplete: quizStatus === 'completed',
    isPaused: quizStatus === 'paused',
    
    // Quiz controls
    setCurrentQuestion,
    submitAnswer,
    completeQuiz
  };
};

export default useQuizSession;

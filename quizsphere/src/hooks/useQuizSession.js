import { useState, useCallback, useEffect } from 'react';
import { useQuizContext } from '../context/QuizContext';
import { formatTime, calculatePercentage, formatQuizResults } from '../utils/quizHelpers';

// PUBLIC_INTERFACE
/**
 * Custom hook for managing quiz session state and functionality
 * Handles progress tracking, timing, answer management, and navigation
 * 
 * @param {Object} config - Configuration object
 * @param {number} config.timePerQuestion - Time allowed per question in seconds (default: 60)
 * @param {boolean} config.autoProgress - Whether to auto-progress after answering (default: false)
 * @param {function} config.onSessionComplete - Callback when quiz session completes
 * @returns {Object} Quiz session state and handlers
 * @throws {Error} If config parameters are invalid
 */
const useQuizSession = ({
  timePerQuestion = 60,
  autoProgress = false,
  onSessionComplete = null
} = {}) => {
  // Type validation for config params
  if (typeof timePerQuestion !== 'number' || timePerQuestion <= 0) {
    throw new Error('timePerQuestion must be a positive number');
  }
  if (typeof autoProgress !== 'boolean') {
    throw new Error('autoProgress must be a boolean');
  }
  if (onSessionComplete !== null && typeof onSessionComplete !== 'function') {
    throw new Error('onSessionComplete must be a function or null');
  }

  // Access quiz context
  const {
    currentQuiz,
    currentQuestion,
    userAnswers,
    setCurrentQuiz,
    nextQuestion,
    prevQuestion,
    submitAnswer,
    calculateScore,
    updateStatistics
  } = useQuizContext();

  // Local state for session management
  const [sessionState, setSessionState] = useState({
    isActive: false,
    isPaused: false,
    timeRemaining: timePerQuestion,
    progress: 0,
    hasAnswered: false,
    isComplete: false
  });

  // Reset session state when quiz changes
  useEffect(() => {
    if (currentQuiz) {
      setSessionState(prev => ({
        ...prev,
        isActive: false,
        isPaused: false,
        timeRemaining: timePerQuestion,
        progress: 0,
        hasAnswered: false,
        isComplete: false
      }));
    }
  }, [currentQuiz, timePerQuestion]);

  // Update progress when question changes
  useEffect(() => {
    if (currentQuiz) {
      const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
      setSessionState(prev => ({
        ...prev,
        progress,
        timeRemaining: timePerQuestion,
        hasAnswered: Boolean(userAnswers[currentQuestion])
      }));
    }
  }, [currentQuestion, currentQuiz, userAnswers, timePerQuestion]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (sessionState.isActive && !sessionState.isPaused && !sessionState.hasAnswered && currentQuiz) {
      timer = setInterval(() => {
        setSessionState(prev => {
          if (prev.timeRemaining <= 1) {
            clearInterval(timer);
            if (!prev.hasAnswered) {
              submitAnswer(currentQuestion, null);
              if (autoProgress && currentQuestion < currentQuiz.questions.length - 1) {
                nextQuestion();
              }
            }
            return { ...prev, timeRemaining: 0, hasAnswered: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [
    sessionState.isActive,
    sessionState.isPaused,
    sessionState.hasAnswered,
    currentQuestion,
    currentQuiz,
    submitAnswer,
    autoProgress,
    nextQuestion
  ]);

  // Session control handlers
  const startSession = useCallback(() => {
    if (!currentQuiz) {
      throw new Error('Cannot start session: no quiz is selected');
    }
    setSessionState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      timeRemaining: timePerQuestion
    }));
  }, [currentQuiz, timePerQuestion]);

  const pauseSession = useCallback(() => {
    setSessionState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeSession = useCallback(() => {
    setSessionState(prev => ({ ...prev, isPaused: false }));
  }, []);

  // Navigation handlers
  const submitQuestionAnswer = useCallback((answer) => {
    if (!currentQuiz) return;
    
    submitAnswer(currentQuestion, answer);
    setSessionState(prev => ({ ...prev, hasAnswered: true }));

    if (autoProgress && currentQuestion < currentQuiz.questions.length - 1) {
      nextQuestion();
    }
  }, [submitAnswer, currentQuestion, autoProgress, currentQuiz, nextQuestion]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuiz && currentQuestion < currentQuiz.questions.length - 1) {
      nextQuestion();
      setSessionState(prev => ({
        ...prev,
        timeRemaining: timePerQuestion,
        hasAnswered: Boolean(userAnswers[currentQuestion + 1])
      }));
    }
  }, [currentQuiz, currentQuestion, nextQuestion, timePerQuestion, userAnswers]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      prevQuestion();
      setSessionState(prev => ({
        ...prev,
        timeRemaining: timePerQuestion,
        hasAnswered: Boolean(userAnswers[currentQuestion - 1])
      }));
    }
  }, [currentQuestion, prevQuestion, timePerQuestion, userAnswers]);

  // Session completion handler
  const completeSession = useCallback(() => {
    if (!currentQuiz) return;

    calculateScore();
    const results = formatQuizResults(
      currentQuiz,
      userAnswers,
      userAnswers.filter((answer, index) => 
        answer === currentQuiz.questions[index].correctAnswer
      ).length
    );
    
    updateStatistics(results);
    setSessionState(prev => ({ ...prev, isComplete: true, isActive: false }));
    
    if (onSessionComplete) {
      onSessionComplete(results);
    }
  }, [
    currentQuiz,
    userAnswers,
    calculateScore,
    updateStatistics,
    onSessionComplete
  ]);

  // Status helper
  const getSessionStatus = useCallback(() => {
    if (!currentQuiz) return null;

    const answeredCount = userAnswers.filter(answer => answer !== undefined).length;
    const totalQuestions = currentQuiz.questions.length;
    const currentProgress = calculatePercentage(answeredCount, totalQuestions);

    return {
      currentQuestionIndex: currentQuestion,
      totalQuestions,
      answeredCount,
      remainingCount: totalQuestions - answeredCount,
      progress: currentProgress,
      formattedTimeRemaining: formatTime(sessionState.timeRemaining),
      canGoBack: currentQuestion > 0,
      canGoForward: currentQuestion < totalQuestions - 1,
      isLastQuestion: currentQuestion === totalQuestions - 1,
      isComplete: sessionState.isComplete
    };
  }, [currentQuiz, currentQuestion, userAnswers, sessionState.timeRemaining, sessionState.isComplete]);

  return {
    // Session state
    isActive: sessionState.isActive,
    isPaused: sessionState.isPaused,
    timeRemaining: sessionState.timeRemaining,
    progress: sessionState.progress,
    hasAnswered: sessionState.hasAnswered,
    isComplete: sessionState.isComplete,

    // Session controls
    startSession,
    pauseSession,
    resumeSession,
    completeSession,

    // Navigation and answer submission
    submitAnswer: submitQuestionAnswer,
    goToNextQuestion,
    goToPreviousQuestion,

    // Status helpers
    getSessionStatus,

    // Current question and answers
    currentQuestion,
    userAnswers
  };
};

export default useQuizSession;

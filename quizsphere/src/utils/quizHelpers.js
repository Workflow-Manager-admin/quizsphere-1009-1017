/**
 * Format a time value in seconds to a display string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatTime = (seconds) => {
  if (!Number.isInteger(seconds) || seconds < 0) {
    return '00:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Filter quizzes based on category, difficulty and search term
 * @param {Array} quizzes - Array of quiz objects to filter
 * @param {Object} filters - Filter criteria
 * @param {string} filters.category - Category to filter by
 * @param {string} filters.difficulty - Difficulty level to filter by
 * @param {string} filters.searchTerm - Search term to filter by
 * @returns {Array} Filtered quizzes
 */
export const filterQuizzes = (quizzes, filters) => {
  if (!Array.isArray(quizzes)) return [];
  
  const { category, difficulty, searchTerm } = filters || {};
  
  return quizzes.filter(quiz => {
    // Category filter
    if (category && quiz.category !== category) {
      return false;
    }
    
    // Difficulty filter
    if (difficulty && quiz.difficulty !== difficulty) {
      return false;
    }
    
    // Search term filter
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = quiz.title.toLowerCase().includes(searchLower);
      const descriptionMatch = quiz.description && quiz.description.toLowerCase().includes(searchLower);
      const categoryMatch = quiz.category.toLowerCase().includes(searchLower);
      
      if (!titleMatch && !descriptionMatch && !categoryMatch) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Format quiz results into a standardized object
 * @param {Object} quiz - Quiz data object
 * @param {Array} userAnswers - Array of user answers
 * @param {number} correctCount - Number of correct answers
 * @returns {Object} Formatted quiz results
 */
export const formatQuizResults = (quiz, userAnswers, correctCount) => {
  if (!quiz || !Array.isArray(userAnswers)) {
    throw new Error('Invalid quiz data or user answers');
  }
  
  const totalQuestions = quiz.questions.length;
  const score = calculatePercentage(correctCount, totalQuestions);
  
  return {
    quizId: quiz.id,
    title: quiz.title,
    totalQuestions,
    correctAnswers: correctCount,
    incorrectAnswers: totalQuestions - correctCount,
    score,
    timeTaken: quiz.timeLimit ? quiz.timeLimit - quiz.timeRemaining : null,
    completedAt: new Date().toISOString(),
    answers: userAnswers.map((answer, index) => ({
      questionIndex: index,
      question: quiz.questions[index].text,
      userAnswer: answer,
      correctAnswer: quiz.questions[index].correctAnswer,
      isCorrect: answer === quiz.questions[index].correctAnswer
    }))
  };
};

/**
 * Get difficulty level color
 * @param {string} difficulty - Difficulty level ('Easy', 'Medium', 'Hard')
 * @returns {string} Color code for the difficulty level
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: '#4CAF50',    // Green
    Medium: '#FF9800',  // Orange
    Hard: '#F44336'     // Red
  };
  
  return colors[difficulty] || '#757575'; // Default gray
};

/**
 * Calculate quiz statistics
 * @param {Object} results - Quiz results object
 * @returns {Object} Quiz statistics
 */
export const calculateQuizStatistics = (results) => {
  if (!results || !results.answers) {
    throw new Error('Invalid results object');
  }
  
  const totalQuestions = results.answers.length;
  const correctAnswers = results.answers.filter(a => a.isCorrect).length;
  
  return {
    accuracy: calculatePercentage(correctAnswers, totalQuestions),
    timePerQuestion: results.timeTaken ? Math.round(results.timeTaken / totalQuestions) : null,
    score: results.score,
    performance: calculatePerformanceLevel(results.score)
  };
};

/**
 * Calculate performance level based on score
 * @param {number} score - Quiz score (0-100)
 * @returns {string} Performance level description
 */
const calculatePerformanceLevel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Satisfactory';
  if (score >= 40) return 'Needs Improvement';
  return 'Poor';
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
export const generateId = () => {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Validate quiz data structure
 * @param {Object} quiz - Quiz data object to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateQuizData = (quiz) => {
  if (!quiz || typeof quiz !== 'object') return false;
  
  const requiredFields = ['id', 'title', 'questions'];
  if (!requiredFields.every(field => field in quiz)) return false;
  
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) return false;
  
  const validQuestion = (q) => (
    q &&
    typeof q === 'object' &&
    'text' in q &&
    'correctAnswer' in q &&
    Array.isArray(q.options) &&
    q.options.length > 0
  );
  
  return quiz.questions.every(validQuestion);
};

/**
 * Parse quiz duration into seconds
 * @param {number|string} duration - Duration in minutes or "MM:SS" format
 * @returns {number} Duration in seconds
 */
export const parseQuizDuration = (duration) => {
  if (typeof duration === 'number') {
    return duration * 60; // Convert minutes to seconds
  }
  
  if (typeof duration === 'string') {
    const [minutes, seconds] = duration.split(':').map(Number);
    if (!isNaN(minutes) && !isNaN(seconds)) {
      return (minutes * 60) + seconds;
    }
  }
  
  throw new Error('Invalid duration format');
};

/**
 * Validate quiz and return validation result with errors
 * @param {Object} quiz - Quiz data to validate
 * @returns {Object} Result with isValid flag and any errors
 */
export const validateQuiz = (quiz) => {
  const errors = {};
  
  // Check required fields
  if (!quiz.title || quiz.title.trim() === '') {
    errors.title = 'Quiz title is required';
  }
  
  if (!quiz.category) {
    errors.category = 'Category is required';
  }
  
  if (!quiz.difficulty) {
    errors.difficulty = 'Difficulty level is required';
  }
  
  if (!quiz.timeLimit || quiz.timeLimit < 60) {
    errors.timeLimit = 'Time limit must be at least 60 seconds';
  }
  
  // Check questions
  if (!quiz.questions || quiz.questions.length === 0) {
    errors.questions = 'At least one question is required';
  } else {
    // Validate each question
    quiz.questions.forEach((question, index) => {
      if (!question.text || question.text.trim() === '') {
        errors.questions = errors.questions || {};
        errors.questions[index] = errors.questions[index] || {};
        errors.questions[index].text = 'Question text is required';
      }
      
      if (!question.options || question.options.length < 2) {
        errors.questions = errors.questions || {};
        errors.questions[index] = errors.questions[index] || {};
        errors.questions[index].options = 'At least two options are required';
      }
      
      if (!question.correctAnswer) {
        errors.questions = errors.questions || {};
        errors.questions[index] = errors.questions[index] || {};
        errors.questions[index].correctAnswer = 'Correct answer must be selected';
      }
    });
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Utility functions for working with quizzes in the application
 */

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Format time from seconds to minutes and seconds
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Calculate percentage score
export const calculatePercentage = (score, total) => {
  return Math.round((score / total) * 100);
};

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '#4CAF50'; // green
    case 'medium':
      return '#FF9800'; // orange
    case 'hard':
      return '#F44336'; // red
    default:
      return '#9E9E9E'; // grey
  }
};

// Filter quizzes by category and/or difficulty
export const filterQuizzes = (quizzes, { category, difficulty, searchTerm }) => {
  return quizzes.filter(quiz => {
    const categoryMatch = !category || quiz.category === category;
    const difficultyMatch = !difficulty || quiz.difficulty === difficulty;
    const searchMatch = !searchTerm || 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && difficultyMatch && searchMatch;
  });
};

// Generate a unique ID for new quizzes or questions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate a quiz object
export const validateQuiz = (quiz) => {
  const errors = {};

  if (!quiz.title || quiz.title.trim() === '') {
    errors.title = 'Quiz title is required';
  }

  if (!quiz.category) {
    errors.category = 'Category is required';
  }

  if (!quiz.difficulty) {
    errors.difficulty = 'Difficulty level is required';
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    errors.questions = 'At least one question is required';
  } else {
    const questionErrors = [];
    quiz.questions.forEach((question, index) => {
      const qErrors = {};
      
      if (!question.text || question.text.trim() === '') {
        qErrors.text = 'Question text is required';
      }
      
      if (!question.options || question.options.length < 2) {
        qErrors.options = 'At least two options are required';
      }
      
      if (!question.correctAnswer) {
        qErrors.correctAnswer = 'Correct answer must be selected';
      }
      
      if (Object.keys(qErrors).length > 0) {
        questionErrors[index] = qErrors;
      }
    });
    
    if (questionErrors.length > 0) {
      errors.questionErrors = questionErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format quiz results for display or sharing
export const formatQuizResults = (quiz, userAnswers, score) => {
  const percentage = calculatePercentage(score, quiz.questions.length);
  const correctCount = score;
  const incorrectCount = quiz.questions.length - score;
  
  let performance = 'Poor';
  if (percentage >= 80) {
    performance = 'Excellent';
  } else if (percentage >= 60) {
    performance = 'Good';
  } else if (percentage >= 40) {
    performance = 'Fair';
  }
  
  return {
    quizTitle: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty,
    questionsCount: quiz.questions.length,
    correctCount,
    incorrectCount,
    score,
    percentage,
    performance,
    date: new Date().toISOString(),
    details: quiz.questions.map((question, index) => ({
      questionText: question.text,
      userAnswer: userAnswers[index] || 'Not answered',
      correctAnswer: question.correctAnswer,
      isCorrect: userAnswers[index] === question.correctAnswer
    }))
  };
};

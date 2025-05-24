import React from 'react';
import { Box, LinearProgress, Typography, useTheme, alpha } from '@mui/material';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * QuizProgress component for displaying current quiz progress
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentQuestion - Current question index (0-based)
 * @param {number} props.totalQuestions - Total number of questions
 * @param {boolean} props.showNumbers - Whether to show question numbers
 * @param {boolean} props.showPercentage - Whether to show percentage complete
 * @param {Object} props.sx - Additional custom styles
 * @returns {React.ReactElement} Rendered component
 */
const QuizProgress = ({
  currentQuestion = 0,
  totalQuestions = 1,
  showNumbers = true,
  showPercentage = true,
  sx = {}
}) => {
  const theme = useTheme();
  
  // Avoid division by zero
  if (totalQuestions <= 0) return null;
  
  // Calculate progress percentage
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  // Get color based on progress
  const getProgressColor = () => {
    if (progress < 33) return theme.palette.info.main;
    if (progress < 66) return theme.palette.warning.main;
    return theme.palette.success.main;
  };
  
  const progressColor = getProgressColor();

  return (
    <Box 
      sx={{ 
        width: '100%',
        mb: 4,
        mt: 1,
        ...sx 
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0.5
        }}
      >
        {showNumbers && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Question {currentQuestion + 1} of {totalQuestions}
          </Typography>
        )}
        
        {showPercentage && (
          <Typography 
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {Math.round(progress)}% Complete
          </Typography>
        )}
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.background.paper, 0.3),
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: progressColor,
            backgroundImage: `linear-gradient(
              90deg, 
              ${alpha(progressColor, 0.8)} 0%, 
              ${progressColor} 50%, 
              ${alpha(progressColor, 0.9)} 100%
            )`,
            transition: 'transform 0.4s ease-in-out',
          }
        }}
      />
    </Box>
  );
};

QuizProgress.propTypes = {
  currentQuestion: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  showNumbers: PropTypes.bool,
  showPercentage: PropTypes.bool,
  sx: PropTypes.object
};

export default QuizProgress;

import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
  showNumbers,
  showPercentage,
  sx
}) {
  const progress = Math.min(((currentQuestion + 1) / totalQuestions) * 100, 100);

  return (
    <Box sx={{ width: '100%', mt: 2, mb: 2, ...sx }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        {showNumbers && (
          <Typography variant="body2">
            Question {currentQuestion + 1} of {totalQuestions}
          </Typography>
        )}
        {showPercentage && (
          <Typography variant="body2">
            {Math.round(progress)}% Complete
          </Typography>
        )}
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}

QuizProgress.defaultProps = {
  currentQuestion: 0,
  totalQuestions: 1,
  showNumbers: true,
  showPercentage: true,
  sx: {}
};

QuizProgress.propTypes = {
  currentQuestion: PropTypes.number,
  totalQuestions: PropTypes.number,
  showNumbers: PropTypes.bool,
  showPercentage: PropTypes.bool,
  sx: PropTypes.object
};

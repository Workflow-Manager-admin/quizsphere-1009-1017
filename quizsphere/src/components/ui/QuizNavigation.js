import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DoneIcon from '@mui/icons-material/Done';
import PropTypes from 'prop-types';

export default function QuizNavigation({
  showPrevious,
  showNext,
  showFinish,
  canGoNext,
  canGoBack,
  onPrevious,
  onNext,
  onFinish,
  isLastQuestion,
  sx
}) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
      mb={2}
      {...sx}
    >
      {showPrevious && (
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onPrevious}
          disabled={!canGoBack}
        >
          Previous
        </Button>
      )}
      
      <Box display="flex" gap={1}>
        {showNext && !isLastQuestion && (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={onNext}
            disabled={!canGoNext}
          >
            Next
          </Button>
        )}
        {(showFinish || isLastQuestion) && (
          <Button
            variant="contained"
            color="primary"
            endIcon={<DoneIcon />}
            onClick={onFinish}
          >
            Finish
          </Button>
        )}
      </Box>
    </Box>
  );
}

QuizNavigation.defaultProps = {
  showPrevious: true,
  showNext: true,
  showFinish: false,
  canGoNext: true,
  canGoBack: true,
  isLastQuestion: false,
  sx: {}
};

QuizNavigation.propTypes = {
  showPrevious: PropTypes.bool,
  showNext: PropTypes.bool,
  showFinish: PropTypes.bool,
  canGoNext: PropTypes.bool,
  canGoBack: PropTypes.bool,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  onFinish: PropTypes.func,
  isLastQuestion: PropTypes.bool,
  sx: PropTypes.object
};

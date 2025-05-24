import React from 'react';
import { Box, Button, IconButton, Tooltip, useTheme, useMediaQuery, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DoneIcon from '@mui/icons-material/Done';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * QuizNavigation component for navigating between quiz questions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showPrevious - Whether to show previous button
 * @param {boolean} props.showNext - Whether to show next button
 * @param {boolean} props.showFinish - Whether to show finish button
 * @param {boolean} props.canGoNext - Whether user can proceed to next question
 * @param {boolean} props.canGoBack - Whether user can go back to previous question
 * @param {Function} props.onPrevious - Callback when previous button is clicked
 * @param {Function} props.onNext - Callback when next button is clicked
 * @param {Function} props.onFinish - Callback when finish button is clicked
 * @param {boolean} props.isLastQuestion - Whether this is the last question
 * @param {Object} props.sx - Additional custom styles
 * @returns {React.ReactElement} Rendered component
 */
const QuizNavigation = ({
  showPrevious = true,
  showNext = true,
  showFinish = false,
  canGoNext = true,
  canGoBack = true,
  onPrevious,
  onNext,
  onFinish,
  isLastQuestion = false,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        mt: 3,
        mb: 2,
        ...sx
      }}
    >
      {/* Previous button */}
      {showPrevious ? (
        <Button
          variant="outlined"
          color="inherit"
          disabled={!canGoBack}
          onClick={onPrevious}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderColor: alpha(theme.palette.divider, 0.5),
            '&:hover': {
              borderColor: alpha(theme.palette.primary.main, 0.5),
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }
          }}
        >
          {!isMobile ? 'Previous' : ''}
        </Button>
      ) : (
        <Box /> // Empty spacer
      )}

      {/* Next/Finish button */}
      {(showNext || showFinish) && (
        <Box>
          {/* Next Button */}
          {showNext && !isLastQuestion && (
            <Button
              variant="contained"
              color="primary"
              disabled={!canGoNext}
              onClick={onNext}
              endIcon={<ArrowForwardIcon />}
            >
              {!isMobile ? 'Next' : ''}
            </Button>
          )}
          
          {/* Finish Button */}
          {(showFinish || isLastQuestion) && (
            <Button
              variant="contained"
              color="primary"
              onClick={onFinish}
              endIcon={<DoneIcon />}
            >
              {!isMobile ? 'Finish Quiz' : 'Finish'}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
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

export default QuizNavigation;

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, useTheme, alpha } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * QuizTimer component for displaying countdown timer during quizzes
 * 
 * @param {Object} props - Component props
 * @param {number} props.duration - Timer duration in seconds
 * @param {Function} props.onTimeUp - Callback when timer expires
 * @param {boolean} props.active - Whether the timer is active
 * @param {boolean} props.showIcon - Whether to show the timer icon
 * @param {Object} props.sx - Additional custom styles
 * @returns {React.ReactElement} Rendered component
 */
const QuizTimer = ({
  duration = 60,
  onTimeUp,
  active = true,
  showIcon = true,
  sx = {}
}) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(!active);
  
  // Format seconds to MM:SS
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Calculate progress for circular indicator
  const calculateProgress = useCallback(() => {
    return (timeLeft / duration) * 100;
  }, [timeLeft, duration]);
  
  // Get color based on time left
  const getTimerColor = useCallback(() => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage > 50) return theme.palette.info.main; // Blue for plenty of time
    if (percentage > 20) return theme.palette.warning.main; // Orange/yellow for running low
    return theme.palette.error.main; // Red for critical time
  }, [timeLeft, duration, theme]);
  
  // Effect for countdown
  useEffect(() => {
    // Set initial time
    setTimeLeft(duration);
  }, [duration]);
  
  // Effect for countdown
  useEffect(() => {
    // Update pause status when active prop changes
    setIsPaused(!active);
  }, [active]);
  
  // Effect for timer logic
  useEffect(() => {
    if (isPaused) return;
    
    // Create interval to update timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        // If time is up, clear interval and call callback
        if (prevTime <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [isPaused, onTimeUp]);
  
  // Get timer color
  const timerColor = getTimerColor();
  const progress = calculateProgress();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        ...sx
      }}
    >
      {showIcon && <TimerIcon sx={{ color: timerColor }} />}
      
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={60}
          thickness={4}
          sx={{
            color: timerColor,
            // Add track for progress indicator
            '& circle': {
              strokeLinecap: 'round',
            },
            // Add shadow for effect
            filter: `drop-shadow(0 0 2px ${alpha(timerColor, 0.5)})`,
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{ 
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '1rem',
              color: timerColor
            }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

QuizTimer.propTypes = {
  duration: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func.isRequired,
  active: PropTypes.bool,
  showIcon: PropTypes.bool,
  sx: PropTypes.object
};

export default QuizTimer;

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import TimerIcon from '@mui/icons-material/Timer';
import PropTypes from 'prop-types';

export default function QuizTimer({
  duration,
  onTimeUp,
  active,
  showIcon,
  sx
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!active) return undefined;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100;

  return (
    <Box display="flex" alignItems="center" gap={2} {...sx}>
      {showIcon && <TimerIcon />}
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={progress} />
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
          top={0}
          left={0}
          bottom={0}
          right={0}
        >
          <Typography variant="body2">
            {`${minutes}:${seconds.toString().padStart(2, '0')}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

QuizTimer.defaultProps = {
  duration: 60,
  active: true,
  showIcon: true,
  sx: {}
};

QuizTimer.propTypes = {
  duration: PropTypes.number,
  onTimeUp: PropTypes.func.isRequired,
  active: PropTypes.bool,
  showIcon: PropTypes.bool,
  sx: PropTypes.object
};

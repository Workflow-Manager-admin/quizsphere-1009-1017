import React from 'react';
import { 
  Box, 
  ToggleButtonGroup, 
  ToggleButton, 
  Typography, 
  useTheme, 
  useMediaQuery,
  alpha
} from '@mui/material';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * DifficultySelector component for selecting quiz difficulty level
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.difficultyLevels - Array of available difficulty levels
 * @param {string|null} props.selectedDifficulty - Currently selected difficulty
 * @param {Function} props.onDifficultyChange - Callback when difficulty selection changes
 * @param {boolean} props.showLabel - Whether to show the "Difficulty:" label
 * @param {Object} props.sx - Additional custom styles
 * @returns {React.ReactElement} Rendered component
 */
const DifficultySelector = ({
  difficultyLevels = ['Easy', 'Medium', 'Hard'],
  selectedDifficulty = null,
  onDifficultyChange,
  showLabel = true,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDifficultyChange = (event, newDifficulty) => {
    // Allow deselection (null)
    onDifficultyChange(newDifficulty);
  };

  // Calculate color for difficulty level
  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return theme.palette.grey[500];
    
    switch(difficulty.toLowerCase()) {
      case 'easy':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'hard':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: 1.5,
        ...sx
      }}
    >
      {showLabel && (
        <Typography
          variant="subtitle2"
          fontWeight="500"
          sx={{ 
            whiteSpace: 'nowrap',
            color: 'text.secondary',
            mr: 1
          }}
        >
          Difficulty:
        </Typography>
      )}

      <ToggleButtonGroup
        value={selectedDifficulty}
        exclusive
        onChange={handleDifficultyChange}
        aria-label="quiz difficulty"
        size={isMobile ? "small" : "medium"}
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, 0.3),
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            borderRadius: 1,
            mx: 0.5,
            px: 2,
            '&.Mui-selected': {
              backgroundColor: (theme) => 
                selectedDifficulty ? 
                alpha(getDifficultyColor(selectedDifficulty), 0.15) : 
                theme.palette.action.selected
            },
          }
        }}
      >
        <ToggleButton 
          value={null} 
          aria-label="all difficulties"
          sx={{
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'text.primary',
            }
          }}
        >
          All
        </ToggleButton>

        {difficultyLevels.map((difficulty) => (
          <ToggleButton
            key={difficulty}
            value={difficulty}
            aria-label={`${difficulty} difficulty`}
            sx={{
              color: 'text.secondary',
              '&.Mui-selected': {
                color: getDifficultyColor(difficulty),
              }
            }}
          >
            {difficulty}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

DifficultySelector.propTypes = {
  difficultyLevels: PropTypes.arrayOf(PropTypes.string),
  selectedDifficulty: PropTypes.string,
  onDifficultyChange: PropTypes.func.isRequired,
  showLabel: PropTypes.bool,
  sx: PropTypes.object
};

export default DifficultySelector;

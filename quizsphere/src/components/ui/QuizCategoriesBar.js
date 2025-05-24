import React from 'react';
import { Box, Chip, Typography, useTheme, useMediaQuery, alpha } from '@mui/material';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * QuizCategoriesBar component for filtering quizzes by category
 * Displays available quiz categories as clickable chips
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.categories - Array of available categories
 * @param {string|null} props.selectedCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Callback when category selection changes
 * @param {boolean} props.showLabel - Whether to show the "Categories:" label
 * @param {Object} props.sx - Additional custom styles
 * @returns {React.ReactElement} Rendered component
 */
const QuizCategoriesBar = ({
  categories = [],
  selectedCategory = null,
  onCategoryChange,
  showLabel = true,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle category selection
  const handleCategoryClick = (category) => {
    // If the category is already selected, clear the selection
    if (selectedCategory === category) {
      onCategoryChange(null);
    } else {
      onCategoryChange(category);
    }
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: 1.5,
        width: '100%',
        overflowX: 'auto',
        pb: isMobile ? 1 : 0,
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
          Categories:
        </Typography>
      )}

      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 1,
          flex: 1
        }}
      >
        <Chip
          label="All Categories"
          clickable
          color={selectedCategory === null ? 'primary' : 'default'}
          onClick={() => onCategoryChange(null)}
          sx={{
            fontWeight: selectedCategory === null ? 600 : 400,
            bgcolor: selectedCategory === null 
              ? alpha(theme.palette.primary.main, 0.15)
              : alpha(theme.palette.background.paper, 0.4),
            '&:hover': {
              bgcolor: selectedCategory === null 
                ? alpha(theme.palette.primary.main, 0.25)
                : alpha(theme.palette.background.paper, 0.6),
            }
          }}
        />
        
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            clickable
            color={selectedCategory === category ? 'primary' : 'default'}
            onClick={() => handleCategoryClick(category)}
            sx={{
              fontWeight: selectedCategory === category ? 600 : 400,
              bgcolor: selectedCategory === category 
                ? alpha(theme.palette.primary.main, 0.15)
                : alpha(theme.palette.background.paper, 0.4),
              '&:hover': {
                bgcolor: selectedCategory === category 
                  ? alpha(theme.palette.primary.main, 0.25)
                  : alpha(theme.palette.background.paper, 0.6),
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

QuizCategoriesBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
  showLabel: PropTypes.bool,
  sx: PropTypes.object
};

export default QuizCategoriesBar;

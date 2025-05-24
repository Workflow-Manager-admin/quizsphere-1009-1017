import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton,
  useTheme, 
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
/**
 * SearchQuizzes component for searching quizzes
 * 
 * @param {Object} props - Component props
 * @param {string} props.initialValue - Initial search value
 * @param {Function} props.onSearch - Callback when search is submitted
 * @param {string} props.placeholder - Placeholder text for search input
 * @param {Object} props.sx - Additional custom styles
 * @returns {React.ReactElement} Rendered component
 */
const SearchQuizzes = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search quizzes...',
  sx = {}
}) => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    onSearch(searchValue);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: 'flex',
        width: '100%',
        mb: 3,
        ...sx
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {searchValue && (
                <IconButton
                  aria-label="clear search"
                  onClick={handleClear}
                  edge="end"
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
          sx: {
            backgroundColor: alpha(theme.palette.background.paper, 0.4),
            borderRadius: 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
            },
            '&.Mui-focused': {
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
            }
          }
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.divider, 0.3),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.primary.main, 0.3),
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          }
        }}
      />
    </Box>
  );
};

SearchQuizzes.propTypes = {
  initialValue: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  sx: PropTypes.object
};

export default SearchQuizzes;

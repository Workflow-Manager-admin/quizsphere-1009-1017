import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Pagination,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { useQuizContext } from '../context/QuizContext';
import { filterQuizzes, getDifficultyColor } from '../utils/quizHelpers';
import { useNavigate, useLocation } from 'react-router-dom';
import mockQuizData from '../data/mockQuizData';

// PUBLIC_INTERFACE
/**
 * QuizBrowser component for finding and selecting quizzes
 * Allows filtering by category, difficulty, and search term
 */
const QuizBrowser = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, difficultyLevels } = useQuizContext();
  
  // Initialize filters from URL search params if available
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  
  const [filters, setFilters] = useState({
    category: categoryParam || '',
    difficulty: '',
    searchTerm: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Mock loading data - in a real app, this would come from context or API
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setQuizzes(mockQuizData);
      setLoading(false);
    }, 500);
  }, []);
  
  // Filter quizzes based on current filters
  const filteredQuizzes = filterQuizzes(quizzes, filters);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const displayedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
    
    // Update URL parameters
    const newParams = new URLSearchParams(location.search);
    if (value) {
      newParams.set(filterName, value.toLowerCase().replace(' ', '-'));
    } else {
      newParams.delete(filterName);
    }
    
    navigate({
      pathname: location.pathname,
      search: newParams.toString()
    }, { replace: true });
  };
  
  const handleQuizSelect = (quiz) => {
    // In a real app, this would set the current quiz in context and navigate
    navigate(`/quiz/${quiz.id}`);
  };
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ mb: 6, pt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Browse Quizzes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover quizzes across various categories and difficulty levels.
        </Typography>
      </Box>
      
      {/* Filters Section */}
      <Box 
        sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filters.difficulty}
                label="Difficulty"
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <MenuItem value="">All Difficulties</MenuItem>
                {difficultyLevels.map((level, index) => (
                  <MenuItem key={index} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Applied Filters */}
      {(filters.category || filters.difficulty || filters.searchTerm) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            Applied filters:
          </Typography>
          
          {filters.category && (
            <Chip 
              label={`Category: ${filters.category}`} 
              onDelete={() => handleFilterChange('category', '')}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          
          {filters.difficulty && (
            <Chip 
              label={`Difficulty: ${filters.difficulty}`} 
              onDelete={() => handleFilterChange('difficulty', '')}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          
          {filters.searchTerm && (
            <Chip 
              label={`Search: ${filters.searchTerm}`} 
              onDelete={() => handleFilterChange('searchTerm', '')}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      )}
      
      {/* Results count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'} found
        </Typography>
      </Box>
      
      {/* Quizzes Grid */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading quizzes...</Typography>
        </Box>
      ) : filteredQuizzes.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {displayedQuizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      height: 100,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontWeight: 'bold' 
                      }}
                    >
                      {quiz.category}
                    </Typography>
                    
                    {/* Difficulty badge */}
                    <Chip
                      label={quiz.difficulty}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: getDifficultyColor(quiz.difficulty),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {quiz.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {quiz.description}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        {quiz.questions.length} Questions
                      </Typography>
                      <Typography variant="body2">
                        {Math.floor(quiz.timeLimit / 60)} min
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={() => handleQuizSelect(quiz)}
                    >
                      Start Quiz
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 1
          }}
        >
          <Typography variant="h6" gutterBottom>
            No quizzes found matching your filters
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filter criteria to see more results.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => {
              setFilters({ category: '', difficulty: '', searchTerm: '' });
              navigate('/browse');
            }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default QuizBrowser;

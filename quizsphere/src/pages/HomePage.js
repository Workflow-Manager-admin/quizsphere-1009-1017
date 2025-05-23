import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';

// PUBLIC_INTERFACE
/**
 * HomePage component for QuizSphere
 * Displays featured quizzes and main navigation options
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { categories } = useQuizContext();

  const handleCategoryClick = (category) => {
    navigate(`/browse?category=${category.toLowerCase().replace(' ', '-')}`);
  };

  const featuredCategories = categories.slice(0, 6);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 8,
          mt: 2,
          pt: 2
        }}
      >
        <Box sx={{ maxWidth: { xs: '100%', md: '50%' }, mb: { xs: 4, md: 0 } }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Test Your Knowledge with{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              QuizSphere
            </Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Create, share, and participate in quizzes across various categories and difficulty levels. Challenge yourself and others with engaging questions.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/browse')}
            >
              Browse Quizzes
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => navigate('/create')}
            >
              Create Quiz
            </Button>
          </Box>
        </Box>
        
        <Box 
          sx={{
            width: { xs: '100%', md: '45%' },
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box 
            component="img" 
            src="/quiz-illustration.png" 
            alt="Quiz Illustration" 
            sx={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: 2,
              boxShadow: 3,
              // Fallback background if image doesn't load
              bgcolor: 'rgba(232, 122, 65, 0.1)',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Fallback content if image doesn't load */}
            <Typography sx={{ color: '#E87A41' }}>Quiz Illustration</Typography>
          </Box>
        </Box>
      </Box>

      {/* Categories Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Explore Categories
        </Typography>
        
        <Grid container spacing={3}>
          {featuredCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleCategoryClick(category)}
                  sx={{ height: '100%' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 140,
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.5rem'
                    }}
                  >
                    {category}
                  </CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Test your knowledge in {category.toLowerCase()} with our challenging quizzes.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                1
              </Box>
              <Typography variant="h6" gutterBottom>
                Browse Quizzes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore quizzes in various categories and difficulty levels.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                2
              </Box>
              <Typography variant="h6" gutterBottom>
                Take Quizzes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Challenge yourself with our interactive quizzes and test your knowledge.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                3
              </Box>
              <Typography variant="h6" gutterBottom>
                Create Quizzes
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create your own quizzes and share them with friends and the community.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper', 
          p: 4, 
          borderRadius: 2,
          textAlign: 'center',
          boxShadow: 1
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Ready to Test Your Knowledge?
        </Typography>
        <Typography variant="body1" paragraph>
          Start exploring quizzes or create your own to challenge others.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => navigate('/browse')}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;

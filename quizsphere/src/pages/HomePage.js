import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import PageContainer from '../components/layout/PageContainer';
import FadeInSection from '../components/ui/FadeInSection';
import StatisticsDashboard from '../components/ui/StatisticsDashboard';

// PUBLIC_INTERFACE
/**
 * HomePage component for QuizSphere
 * Displays featured quizzes and main navigation options
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { categories } = useQuizContext();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleCategoryClick = (category) => {
    navigate(`/browse?category=${category.toLowerCase().replace(' ', '-')}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const featuredCategories = categories.slice(0, 6);

  return (
    <PageContainer>
      {/* Tabs for navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="home page tabs"
          centered
        >
          <Tab label="Welcome" />
          <Tab label="My Statistics" />
        </Tabs>
      </Box>

      {/* Content based on active tab */}
      {activeTab === 0 ? (
        <>
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
      <FadeInSection animation="slide">
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
                <FadeInSection 
                  animation="scale" 
                  duration={0.4} 
                  threshold={0.2}
                >
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
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </Box>
      </FadeInSection>

      {/* How It Works Section */}
      <FadeInSection animation="slide">
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
            {[
              {
                step: 1,
                title: "Browse Quizzes",
                description: "Explore quizzes in various categories and difficulty levels."
              },
              {
                step: 2,
                title: "Take Quizzes",
                description: "Challenge yourself with our interactive quizzes and test your knowledge."
              },
              {
                step: 3,
                title: "Create Quizzes",
                description: "Create your own quizzes and share them with friends and the community."
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <FadeInSection animation="scale" duration={0.4} threshold={0.2}>
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
                      {item.step}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </FadeInSection>
              </Grid>
            ))}
          </Grid>
        </Box>
      </FadeInSection>

      {/* Call to Action */}
      <FadeInSection animation="fade" duration={0.8}>
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
      </FadeInSection>
      </>
      ) : (
        <StatisticsDashboard />
      )}
    </PageContainer>
  );
};

export default HomePage;

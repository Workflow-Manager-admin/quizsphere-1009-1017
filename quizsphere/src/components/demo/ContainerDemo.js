import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, ButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainContainer from '../layout/MainContainer';
import { useQuizContext } from '../../context/QuizContext';
import mockQuizData from '../../data/mockQuizData';

/**
 * Demo component for showcasing MainContainer features
 * This component demonstrates the different capabilities and modes of the enhanced MainContainer
 */
const ContainerDemo = () => {
  const navigate = useNavigate();
  const [containerMode, setContainerMode] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeDifficulty, setActiveDifficulty] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Demo handlers
  const toggleLoading = () => setLoading(prev => !prev);
  const toggleError = () => setError(error ? null : "This is a demo error message");
  const toggleFilters = () => setShowFilters(prev => !prev);
  
  // Category and difficulty change handlers
  const handleCategoryChange = (category) => {
    setActiveCategory(prev => prev === category ? null : category);
  };
  
  const handleDifficultyChange = (difficulty) => {
    setActiveDifficulty(prev => prev === difficulty ? null : difficulty);
  };
  
  // Mode button rendering
  const renderModeButtons = () => {
    const modes = [
      { name: 'default', label: 'Standard' },
      { name: 'browse', label: 'Browse Quizzes' },
      { name: 'create', label: 'Create Quiz' },
      { name: 'participate', label: 'Take Quiz' },
      { name: 'results', label: 'Results' }
    ];
    
    return (
      <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
        {modes.map(mode => (
          <Button
            key={mode.name}
            onClick={() => setContainerMode(mode.name)}
            variant={containerMode === mode.name ? 'contained' : 'outlined'}
          >
            {mode.label}
          </Button>
        ))}
      </ButtonGroup>
    );
  };
  
  // Feature toggle button rendering
  const renderFeatureToggles = () => {
    const features = [
      { name: 'loading', label: 'Loading', state: loading, action: toggleLoading },
      { name: 'error', label: 'Error', state: error, action: toggleError },
      { name: 'filters', label: 'Filters', state: showFilters, action: toggleFilters }
    ];
    
    return (
      <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
        {features.map(feature => (
          <Button
            key={feature.name}
            onClick={feature.action}
            variant={feature.state ? 'contained' : 'outlined'}
            color={feature.state ? 'primary' : 'inherit'}
          >
            {feature.label}
          </Button>
        ))}
      </ButtonGroup>
    );
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        MainContainer Demo
      </Typography>
      <Typography variant="body1" paragraph>
        This page demonstrates the features of the enhanced MainContainer component.
        Toggle the different modes and options to see how the container adapts.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Container Modes
        </Typography>
        {renderModeButtons()}
        
        <Typography variant="h6" gutterBottom>
          Features
        </Typography>
        {renderFeatureToggles()}
      </Box>
      
      <Box
        sx={{
          border: '1px dashed grey',
          borderRadius: 2,
          p: 2,
          mb: 4
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Container Preview:
        </Typography>
        
        <MainContainer
          containerMode={containerMode}
          showFilters={showFilters}
          activeCategory={activeCategory}
          activeDifficulty={activeDifficulty}
          loading={loading}
          error={error ? error : null}
          onCategoryChange={handleCategoryChange}
          onDifficultyChange={handleDifficultyChange}
          quizData={containerMode === 'participate' ? mockQuizData[0] : null}
          showNavigation={true}
        >
          {containerMode === 'default' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" gutterBottom>
                Standard Container Content
              </Typography>
              <Typography variant="body1">
                This is the default container mode without any special features.
              </Typography>
            </Box>
          )}
          
          {containerMode === 'browse' && (
            <Grid container spacing={3}>
              {mockQuizData.map(quiz => (
                <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {quiz.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {quiz.description}
                      </Typography>
                      <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Category: {quiz.category}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Difficulty: {quiz.difficulty}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </MainContainer>
      </Box>
      
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ContainerDemo;

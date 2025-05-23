import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Switch, 
  FormGroup,
  FormControlLabel,
  Divider,
  Paper,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import FadeInSection from '../ui/FadeInSection';
import MainContainer from '../layout/MainContainer';
import PageContainer from '../layout/PageContainer';

/**
 * Demo component for showcasing MainContainer features and animations
 * 
 * Provides controls to test various container features including:
 * - Loading states
 * - Error handling
 * - Animation types
 * - Background patterns
 */
const ContainerDemo = () => {
  // State for controlling demo features
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [disableAnimations, setDisableAnimations] = useState(false);
  const [backgroundPattern, setBackgroundPattern] = useState(true);
  const [animationType, setAnimationType] = useState('fade');
  const [animationDuration, setAnimationDuration] = useState(0.4);
  
  // Toggle loading state
  const handleToggleLoading = () => {
    setLoading(prev => !prev);
    setError(null);
    
    // Auto-disable loading after 3 seconds
    if (!loading) {
      setTimeout(() => setLoading(false), 3000);
    }
  };
  
  // Toggle error state
  const handleToggleError = () => {
    if (error) {
      setError(null);
    } else {
      setError('This is a sample error message for demonstration purposes.');
      setLoading(false);
    }
  };
  
  // Reset demo to default state
  const handleReset = () => {
    setLoading(false);
    setError(null);
  };
  
  return (
    <Box>
      <PageContainer 
        title="Container Demo" 
        subtitle="Showcase of the enhanced MainContainer features including animations, loading states, and error handling."
        disableAnimation={disableAnimations}
      >
        {/* Demo controls */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Demo Controls</Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={loading}
                      onChange={handleToggleLoading}
                      color="primary"
                    />
                  }
                  label="Toggle Loading State"
                />
              </FormGroup>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!error}
                      onChange={handleToggleError}
                      color="error"
                    />
                  }
                  label="Toggle Error State"
                />
              </FormGroup>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={disableAnimations}
                      onChange={() => setDisableAnimations(prev => !prev)}
                    />
                  }
                  label="Disable Animations"
                />
              </FormGroup>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={backgroundPattern}
                      onChange={() => setBackgroundPattern(prev => !prev)}
                      color="primary"
                    />
                  }
                  label="Background Pattern"
                />
              </FormGroup>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Animation Type</InputLabel>
                <Select
                  value={animationType}
                  label="Animation Type"
                  onChange={(e) => setAnimationType(e.target.value)}
                  disabled={disableAnimations}
                >
                  <MenuItem value="fade">Fade</MenuItem>
                  <MenuItem value="slide">Slide</MenuItem>
                  <MenuItem value="scale">Scale</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Animation Duration: {animationDuration}s
              </Typography>
              <Slider
                value={animationDuration}
                min={0.1}
                max={2}
                step={0.1}
                onChange={(_, value) => setAnimationDuration(value)}
                valueLabelDisplay="auto"
                disabled={disableAnimations}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Tooltip title="Reset Demo">
                <IconButton onClick={handleReset} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Demo content */}
        <Typography variant="h5" gutterBottom>
          Demo Content
        </Typography>
        
        <Typography variant="body1" paragraph>
          This demo showcases the enhanced MainContainer with animated transitions,
          loading states, and error handling. Try toggling the options above to see
          different container behaviors.
        </Typography>
        
        <FadeInSection 
          animation={animationType} 
          duration={animationDuration} 
          disabled={disableAnimations}
        >
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sample Card {item}
                    </Typography>
                    <Typography variant="body2">
                      This card demonstrates how content is animated within the container.
                      Different animation types provide different visual experiences.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </FadeInSection>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
          >
            Simulate Loading (2s)
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ ml: 2 }}
            onClick={() => {
              setError('This is a simulated error message');
              setTimeout(() => setError(null), 3000);
            }}
          >
            Simulate Error (3s)
          </Button>
        </Box>
      </PageContainer>
    </Box>
  );
};

export default ContainerDemo;

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  useTheme
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  BarChart as BarChartIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useQuizContext } from '../../context/QuizContext';
import { getPerformanceSummary, getCategoryPerformanceData, formatTime } from '../../utils/quizHelpers';

// PUBLIC_INTERFACE
/**
 * StatisticsDashboard component that displays user's quiz statistics and performance
 */
const StatisticsDashboard = () => {
  const theme = useTheme();
  const { statistics } = useQuizContext();
  
  const performance = getPerformanceSummary(statistics);
  const categoryPerformance = getCategoryPerformanceData(statistics.categoryPerformance);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get color based on score percentage
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.primary.main;
    if (percentage >= 40) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          Your Quiz Statistics
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your performance and progress across different quiz categories
        </Typography>
      </Box>
      
      {/* Performance summary cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Average Score
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {performance.averageScore}%
              </Typography>
              <LinearProgress 
                value={performance.averageScore} 
                variant="determinate" 
                sx={{ mt: 1, mb: 0.5 }}
                color={performance.averageScore >= 70 ? "success" : performance.averageScore >= 40 ? "primary" : "error"}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Quizzes Taken
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {performance.totalQuizzes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Correct Answers
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {performance.totalCorrect}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                out of {performance.totalQuestions} questions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <QuestionAnswerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                {performance.accuracy}%
              </Typography>
              <LinearProgress 
                value={performance.accuracy} 
                variant="determinate" 
                sx={{ mt: 1, mb: 0.5 }} 
                color={performance.accuracy >= 70 ? "success" : performance.accuracy >= 40 ? "primary" : "error"}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Category Performance & Recent Quizzes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Category Performance
            </Typography>
            {categoryPerformance.length > 0 ? (
              <Box>
                {categoryPerformance.map((category, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{category.category}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {category.averageScore}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={category.averageScore} 
                      sx={{ height: 8, borderRadius: 4 }}
                      color={
                        category.averageScore >= 80 ? "success" : 
                        category.averageScore >= 60 ? "primary" : 
                        category.averageScore >= 40 ? "warning" : "error"
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      {category.totalQuizzes} {category.totalQuizzes === 1 ? 'quiz' : 'quizzes'} taken
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No category data available yet. Take some quizzes to see your performance.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Quizzes
            </Typography>
            {statistics.quizHistory && statistics.quizHistory.length > 0 ? (
              <List disablePadding>
                {statistics.quizHistory.slice(0, 5).map((quiz, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" component="div" fontWeight="medium">
                              {quiz.quizTitle}
                            </Typography>
                            <Chip 
                              label={`${quiz.percentage}%`} 
                              size="small"
                              sx={{ 
                                bgcolor: getScoreColor(quiz.percentage),
                                color: 'white'
                              }} 
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {quiz.category} • {quiz.difficulty} • {quiz.correctCount}/{quiz.questionsCount} correct
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: '0.875rem', color: 'text.disabled', mr: 0.5 }} />
                              <Typography variant="caption" color="text.disabled">
                                {formatDate(quiz.date)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No quiz history available yet. Take some quizzes to see your recent activity.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsDashboard;

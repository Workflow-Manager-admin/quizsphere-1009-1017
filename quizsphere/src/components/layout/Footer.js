import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';

// PUBLIC_INTERFACE
/**
 * Footer component for the QuizSphere application
 * Contains links, copyright information, and additional navigation
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              <span style={{ color: '#E87A41', fontSize: '1.5rem' }}>Q</span>
              QuizSphere
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create, share, and participate in quizzes across various categories and difficulty levels.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Features
            </Typography>
            <Link href="/browse" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Browse Quizzes
            </Link>
            <Link href="/create" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Create Quiz
            </Link>
            <Link href="/my-quizzes" color="text.secondary" display="block" sx={{ mb: 1 }}>
              My Quizzes
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Categories
            </Typography>
            <Link href="/browse?category=general" color="text.secondary" display="block" sx={{ mb: 1 }}>
              General Knowledge
            </Link>
            <Link href="/browse?category=science" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Science
            </Link>
            <Link href="/browse?category=technology" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Technology
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link href="/privacy" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
            <Link href="/terms" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Terms of Use
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} QuizSphere. All rights reserved.
          </Typography>
          <Box>
            <Link href="#" color="text.secondary" sx={{ pl: 1 }}>
              Facebook
            </Link>
            <Link href="#" color="text.secondary" sx={{ pl: 2 }}>
              Twitter
            </Link>
            <Link href="#" color="text.secondary" sx={{ pl: 2 }}>
              Instagram
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

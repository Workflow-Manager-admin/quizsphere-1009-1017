import React from 'react';
import { Box, Paper, Divider, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import FadeInSection from '../ui/FadeInSection';

// PUBLIC_INTERFACE
/**
 * PageContainer component for wrapping individual pages with consistent styling
 * Provides consistent page layout structure with optional heading and animations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Optional page title
 * @param {string} props.subtitle - Optional page subtitle
 * @param {React.ReactNode} props.headerActions - Optional actions to display in the header
 * @param {boolean} props.paper - Whether to wrap content in Paper component
 * @param {string} props.maxWidth - Max width for the container ('xs', 'sm', 'md', 'lg', 'xl', false)
 * @param {boolean} props.disableAnimation - Whether to disable entrance animations 
 * @param {Object} props.sx - Additional styles
 * @returns {React.ReactElement} Rendered page container
 */
const PageContainer = ({
  children,
  title,
  subtitle,
  headerActions,
  paper = false,
  maxWidth = false,
  disableAnimation = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const hasHeader = title || subtitle || headerActions;

  // Wrapper for content based on paper prop
  const ContentWrapper = ({ children }) => {
    if (!paper) return children;
    
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        {children}
      </Paper>
    );
  };

  // Animation settings
  const animationProps = disableAnimation ? {} : {
    animation: 'slide',
    duration: 0.5,
    threshold: 0.1
  };

  return (
    <Box
      sx={{
        width: '100%',
        mb: 4,
        maxWidth: maxWidth,
        mx: maxWidth ? 'auto' : 0,
        ...sx
      }}
      {...props}
    >
      {/* Page header section with title and actions */}
      {hasHeader && (
        <FadeInSection {...animationProps}>
          <Box sx={{ mb: 3, mt: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                {title && (
                  <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                    {title}
                  </Typography>
                )}
                
                {subtitle && (
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary" 
                    sx={{ mb: 2, maxWidth: '100%' }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
              
              {headerActions && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  flex: { xs: '1 0 100%', sm: '0 0 auto' }
                }}>
                  {headerActions}
                </Box>
              )}
            </Box>
            
            <Divider sx={{ mt: 2, mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          </Box>
        </FadeInSection>
      )}
      
      {/* Main content */}
      <FadeInSection 
        {...animationProps}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          transition: 'all 0.3s ease'
        }}
      >
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </FadeInSection>
    </Box>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  headerActions: PropTypes.node,
  paper: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  disableAnimation: PropTypes.bool,
  sx: PropTypes.object
};

export default PageContainer;

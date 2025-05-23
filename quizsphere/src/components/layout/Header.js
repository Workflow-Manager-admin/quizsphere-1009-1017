import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Home as HomeIcon, 
  Search as SearchIcon, 
  Add as AddIcon, 
  QuestionAnswer as QuizIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
/**
 * Header component for the QuizSphere application
 * Provides navigation and responsive design with mobile menu
 */
const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Browse Quizzes', path: '/browse', icon: <SearchIcon /> },
    { text: 'Create Quiz', path: '/create', icon: <AddIcon /> },
    { text: 'My Quizzes', path: '/my-quizzes', icon: <QuizIcon /> },
    { text: 'Demo', path: '/demo', icon: <CodeIcon /> }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const renderNavItems = () => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {navigationItems.map((item) => (
        <Button
          key={item.text}
          component={Link}
          to={item.path}
          color={isActive(item.path) ? "primary" : "inherit"}
          sx={{ 
            ml: 2, 
            fontWeight: isActive(item.path) ? 'bold' : 'normal',
            borderBottom: isActive(item.path) ? '2px solid' : 'none',
            borderRadius: 0,
            '&:hover': { 
              backgroundColor: 'transparent', 
              borderBottom: '2px solid', 
              transition: 'all 0.3s' 
            }
          }}
        >
          {item.text}
        </Button>
      ))}
    </Box>
  );

  const renderDrawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={isActive(item.path)}
            sx={{
              backgroundColor: isActive(item.path) ? 'rgba(232, 122, 65, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(232, 122, 65, 0.05)',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: isActive(item.path) ? theme.palette.primary.main : 'inherit' 
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                color: isActive(item.path) ? theme.palette.primary.main : 'inherit'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'text.primary',
            }}
          >
            <span style={{ color: '#E87A41', fontSize: '1.5rem' }}>Q</span>
            QuizSphere
          </Typography>

          {/* Desktop navigation */}
          {!isMobile && renderNavItems()}
        </Box>
        
        {/* User buttons */}
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
        >
          Sign In
        </Button>
        
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={toggleDrawer(true)}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {renderDrawerList()}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

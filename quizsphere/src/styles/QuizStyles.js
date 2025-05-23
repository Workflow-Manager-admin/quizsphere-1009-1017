import { createTheme } from '@mui/material';

// Define custom theme for QuizSphere application
const QuizStyles = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E87A41', // Our brand orange
      light: '#FF9D6B',
      dark: '#C85A21',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3CBCC3', // Teal accent
      light: '#70EEFF',
      dark: '#008C93',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4CAF50',
      light: '#80E27E',
      dark: '#087F23',
    },
    error: {
      main: '#F44336',
      light: '#FF7961',
      dark: '#BA000D',
    },
    warning: {
      main: '#FF9800',
      light: '#FFC947',
      dark: '#C66900',
    },
    info: {
      main: '#2196F3',
      light: '#6EC6FF',
      dark: '#0069C0',
    },
    background: {
      default: '#1A1A1A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1.1rem',
      lineHeight: 1.5,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  
  shape: {
    borderRadius: 8,
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '10px 20px',
          fontSize: '1rem',
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          },
        },
        containedPrimary: {
          backgroundColor: '#E87A41',
          '&:hover': {
            backgroundColor: '#FF8B4D',
          },
        },
        outlinedPrimary: {
          borderColor: '#E87A41',
          '&:hover': {
            borderColor: '#FF8B4D',
            backgroundColor: 'rgba(232, 122, 65, 0.08)',
          },
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
        },
      },
    },
    
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#E87A41',
          },
        },
      },
    },
    
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.5)',
          '&.Mui-checked': {
            color: '#E87A41',
          },
        },
      },
    },
    
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          backgroundColor: '#E87A41',
        },
      },
    },
    
    MuiCircularProgress: {
      styleOverrides: {
        circle: {
          strokeLinecap: 'round',
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.85rem',
        },
        colorPrimary: {
          backgroundColor: 'rgba(232, 122, 65, 0.15)',
          color: '#E87A41',
          '&.MuiChip-outlined': {
            borderColor: '#E87A41',
            color: '#E87A41',
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minWidth: 'auto',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#E87A41',
            fontWeight: 600,
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          backgroundColor: '#262626',
        },
      },
    },
    
    MuiSnackbar: {
      styleOverrides: {
        root: {
          maxWidth: '80%',
          bottom: '24px',
        },
      },
    },
    
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
  },
});

export default QuizStyles;

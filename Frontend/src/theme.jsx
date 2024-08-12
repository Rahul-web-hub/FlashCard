// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffcc01', // LeetCode's signature orange color
    },
    secondary: {
      main: '#4b5563', // A neutral grey color
    },
    background: {
      default: '#f7f8fa', // Light grey background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
});

export default theme;

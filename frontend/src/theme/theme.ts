import { createTheme } from '@mui/material/styles';

// Colors inspired by the Kubernetes / Prow / TestGrid palette
const PROW_BLUE = '#326CE5'; // Kubernetes blue
const TESTGRID_GREEN = '#2E7D32';
const SIDEBAR_BG = '#1E293B';
const SIDEBAR_TEXT = '#CBD5E1';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PROW_BLUE,
    },
    secondary: {
      main: TESTGRID_GREEN,
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: SIDEBAR_BG,
          color: SIDEBAR_TEXT,
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(50, 108, 229, 0.15)',
          },
        },
      },
    },
  },
});

export { PROW_BLUE, TESTGRID_GREEN, SIDEBAR_BG, SIDEBAR_TEXT };
export default theme;

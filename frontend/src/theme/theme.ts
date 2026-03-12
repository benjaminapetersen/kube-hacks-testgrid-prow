import { alpha, darken, lighten, createTheme, type Theme } from '@mui/material/styles';
import type { PaletteName, ThemeMode } from '../stores/appStore';

interface PaletteColors {
  primary: string;
  secondary: string;
  label: string;
}

export const palettes: Record<PaletteName, PaletteColors> = {
  kubernetes: { primary: '#326CE5', secondary: '#2E7D32', label: 'Kubernetes' },
  ocean:     { primary: '#0077B6', secondary: '#00B4D8', label: 'Ocean' },
  sunset:    { primary: '#E65100', secondary: '#F9A825', label: 'Sunset' },
  forest:    { primary: '#2E7D32', secondary: '#66BB6A', label: 'Forest' },
  slate:     { primary: '#546E7A', secondary: '#78909C', label: 'Slate' },
};

export function buildTheme(mode: ThemeMode, paletteName: PaletteName): Theme {
  const colors = palettes[paletteName];
  const isDark = mode === 'dark';

  // Derive sidebar and background tones from the primary color
  const sidebarBg = isDark
    ? darken(colors.primary, 0.75)
    : lighten(colors.primary, 0.92);
  const sidebarText = isDark
    ? lighten(colors.primary, 0.6)
    : darken(colors.primary, 0.4);
  const pageBg = isDark
    ? darken(colors.primary, 0.85)
    : lighten(colors.primary, 0.97);
  const paperBg = isDark
    ? darken(colors.primary, 0.7)
    : '#FFFFFF';

  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      background: { default: pageBg, paper: paperBg },
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
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? darken(colors.primary, 0.4)
              : colors.primary,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: sidebarBg,
            color: sidebarText,
            borderRight: 'none',
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: isDark
              ? lighten(colors.primary, 0.4)
              : darken(colors.primary, 0.1),
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
            '&:hover': {
              backgroundColor: alpha(colors.primary, isDark ? 0.15 : 0.08),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(colors.primary, isDark ? 0.25 : 0.15),
              '&:hover': {
                backgroundColor: alpha(colors.primary, isDark ? 0.3 : 0.2),
              },
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: alpha(colors.primary, isDark ? 0.15 : 0.12),
          },
        },
      },
    },
  });
}

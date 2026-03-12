import { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ButtonBase from '@mui/material/ButtonBase';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import { useAppStore, type PaletteName } from '../../stores/appStore';
import { palettes } from '../../theme/theme';
import GlobalSearch from '../common/GlobalSearch';

const paletteNames = Object.keys(palettes) as PaletteName[];

function useContextBranding() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/prow')) {
    return { logo: '/prow-icon.png', alt: 'Prow', title: 'Prow' };
  }
  if (pathname.startsWith('/testgrid')) {
    return { logo: '/testgrid-icon.png', alt: 'TestGrid', title: 'TestGrid' };
  }
  return { logo: '/prow-icon.png', alt: 'Kube Test Viewer', title: 'Kube Test Viewer' };
}

export default function TopBar() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const themeMode = useAppStore((s) => s.themeMode);
  const toggleThemeMode = useAppStore((s) => s.toggleThemeMode);
  const currentPalette = useAppStore((s) => s.palette);
  const setPalette = useAppStore((s) => s.setPalette);
  const history = useHistory();
  const branding = useContextBranding();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <ButtonBase
          onClick={() => history.push('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexGrow: 1,
            justifyContent: 'flex-start',
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <img src={branding.logo} alt={branding.alt} height={28} />
          <Typography variant="h6" noWrap component="div" color="inherit"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {branding.title}
          </Typography>
        </ButtonBase>

        {/* Global search */}
        <Box sx={{ mr: 1, display: { xs: 'none', md: 'block' } }}>
          <GlobalSearch />
        </Box>

        {/* Theme controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            color="inherit"
            onClick={toggleThemeMode}
            aria-label="toggle light/dark mode"
            title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-label="change color palette"
            title="Color palette"
          >
            <PaletteIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {paletteNames.map((name) => (
              <MenuItem
                key={name}
                selected={name === currentPalette}
                onClick={() => { setPalette(name); setAnchorEl(null); }}
              >
                <ListItemIcon>
                  <CircleIcon sx={{ color: palettes[name].primary, fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText>{palettes[name].label}</ListItemText>
                {name === currentPalette && (
                  <CheckIcon fontSize="small" sx={{ ml: 1 }} />
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

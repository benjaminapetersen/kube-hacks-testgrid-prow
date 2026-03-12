import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppStore } from '../../stores/appStore';

export default function TopBar() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img src="/favicon.png" alt="Prow" height={28} />
          <Typography variant="h6" noWrap component="div">
            Kube Test Viewer
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

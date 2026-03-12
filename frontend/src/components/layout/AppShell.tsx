import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import TopBar from './TopBar';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import Breadcrumbs from '../common/Breadcrumbs';
import { useAppStore } from '../../stores/appStore';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: 'margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1)',
          p: 3,
        }}
      >
        {/* Spacer for the AppBar height */}
        <Toolbar />
        <Breadcrumbs />
        {children}
      </Box>
    </Box>
  );
}

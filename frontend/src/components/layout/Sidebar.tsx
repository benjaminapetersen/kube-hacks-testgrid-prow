import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import GridViewIcon from '@mui/icons-material/GridView';
import { useAppStore } from '../../stores/appStore';

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const prowItems: NavItem[] = [
  { label: 'Jobs', path: '/prow/jobs', icon: <WorkIcon /> },
];

const testgridItems: NavItem[] = [
  { label: 'Dashboards', path: '/testgrid/dashboards', icon: <GridViewIcon /> },
];

export default function Sidebar() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const location = useLocation();
  const history = useHistory();

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: 64, // below AppBar
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 1 }}>
        <List>
          <ListItemButton
            selected={location.pathname === '/'}
            onClick={() => history.push('/')}
          >
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItemButton>
        </List>

        <Divider sx={{ my: 1 }} />

        <List
          subheader={
            <ListSubheader sx={{ bgcolor: 'transparent', color: 'text.secondary' }}>
              Prow
            </ListSubheader>
          }
        >
          {prowItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname.startsWith(item.path)}
              onClick={() => history.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <List
          subheader={
            <ListSubheader sx={{ bgcolor: 'transparent', color: 'text.secondary' }}>
              TestGrid
            </ListSubheader>
          }
        >
          {testgridItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname.startsWith(item.path)}
              onClick={() => history.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };

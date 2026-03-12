import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useTestGridDashboards } from '../../api/testgrid';
import { useTestGridStore } from '../../stores/testgridStore';

export default function DashboardListPage() {
  const { data, isLoading, error, refetch } = useTestGridDashboards();
  const { searchTerm, setSearchTerm } = useTestGridStore();
  const history = useHistory();

  const filtered = useMemo(() => {
    const dashboards = data?.dashboards ?? [];
    if (!searchTerm) return dashboards;
    const lower = searchTerm.toLowerCase();
    return dashboards.filter((d) => d.name.toLowerCase().includes(lower));
  }, [data, searchTerm]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        TestGrid Dashboards
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search dashboards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {isLoading ? '...' : `${filtered.length} dashboards`}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={() => refetch()}>Retry</Button>}>
          Failed to load dashboards: {(error as Error).message}
        </Alert>
      )}

      <Paper>
        <List dense>
          {isLoading &&
            Array.from({ length: 15 }).map((_, i) => (
              <ListItemButton key={i}>
                <ListItemText primary={<Skeleton width={`${40 + Math.random() * 40}%`} />} />
              </ListItemButton>
            ))}
          {!isLoading &&
            filtered.slice(0, 200).map((d) => (
              <ListItemButton
                key={d.name}
                onClick={() => history.push(`/testgrid/dashboards/${encodeURIComponent(d.name)}`)}
              >
                <ListItemText
                  primary={d.name}
                  secondary={d.dashboard_tab ? `${d.dashboard_tab.length} tabs` : undefined}
                />
              </ListItemButton>
            ))}
          {!isLoading && filtered.length === 0 && !error && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No dashboards found.
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
}

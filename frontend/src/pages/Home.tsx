import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Kube Test Viewer
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A unified dashboard for Prow CI jobs and TestGrid results across
        Kubernetes projects.
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Prow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse CI jobs, view build logs, and inspect ProwJob details.
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            TestGrid
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View dashboard grids, track test health, and drill into failures.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

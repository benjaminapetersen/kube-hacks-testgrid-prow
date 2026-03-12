import { useParams, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTestGridSummary } from '../../api/testgrid';
import TestGrid from '../../components/testgrid/TestGrid';

export default function DashboardPage() {
  const { dashboard } = useParams<{ dashboard: string }>();
  const history = useHistory();
  const decodedName = decodeURIComponent(dashboard || '');
  const { data, isLoading, error, refetch } = useTestGridSummary(decodedName);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.push('/testgrid/dashboards')}>
          Dashboards
        </Button>
        <Typography variant="h5" noWrap>
          {decodedName}
        </Typography>
      </Box>

      {isLoading && (
        <Box>
          <Skeleton variant="rectangular" height={300} />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button onClick={() => refetch()}>Retry</Button>}
        >
          Failed to load dashboard: {(error as Error).message}
        </Alert>
      )}

      {data && (
        <Paper sx={{ p: 2, overflow: 'auto' }}>
          <TestGrid
            dashboard={decodedName}
            summary={data}
            onTabClick={(tabName) =>
              history.push(`/testgrid/dashboards/${encodeURIComponent(decodedName)}/${encodeURIComponent(tabName)}`)
            }
          />
        </Paper>
      )}
    </Box>
  );
}

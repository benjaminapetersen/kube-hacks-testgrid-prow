import { useParams, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTestGridSummary } from '../../api/testgrid';
import type { DashboardSummary } from '../../types/testgrid';

const statusColors: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  PASSING: 'success',
  FAILING: 'error',
  FLAKY: 'warning',
  STALE: 'default',
};

export default function TestDetailPage() {
  const { dashboard, tab } = useParams<{ dashboard: string; tab: string }>();
  const history = useHistory();
  const decodedDashboard = decodeURIComponent(dashboard || '');
  const decodedTab = decodeURIComponent(tab || '');
  const { data, isLoading, error, refetch } = useTestGridSummary(decodedDashboard);

  const tabData: DashboardSummary | undefined = data?.[decodedTab];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.push(`/testgrid/dashboards/${encodeURIComponent(decodedDashboard)}`)}
        >
          {decodedDashboard}
        </Button>
        <Typography variant="h5" noWrap>
          {decodedTab}
        </Typography>
      </Box>

      {isLoading && <Skeleton variant="rectangular" height={200} />}

      {error && (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
          Failed to load tab data: {(error as Error).message}
        </Alert>
      )}

      {!isLoading && !error && !tabData && (
        <Alert severity="info">No data available for tab &quot;{decodedTab}&quot;.</Alert>
      )}

      {tabData && (
        <Paper>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 160 }}>Status</TableCell>
                <TableCell>
                  <Chip
                    label={tabData.overall_status || tabData.status || 'unknown'}
                    color={statusColors[tabData.overall_status ?? ''] ?? 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Total Tests</TableCell>
                <TableCell>{tabData.tests ?? '—'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Passing</TableCell>
                <TableCell>{tabData.passing_tests ?? '—'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Failing</TableCell>
                <TableCell>{tabData.failing_tests ?? '—'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Flaky</TableCell>
                <TableCell>{tabData.flaky_tests ?? '—'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Stale</TableCell>
                <TableCell>{tabData.stale_tests ?? '—'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                <TableCell>
                  {tabData.last_update_timestamp
                    ? new Date(tabData.last_update_timestamp).toLocaleString()
                    : '—'}
                </TableCell>
              </TableRow>
              {tabData.alert && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Alert</TableCell>
                  <TableCell>{tabData.alert}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}

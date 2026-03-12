import { useMemo, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useProwJobs } from '../../api/prow';
import { useProwStore } from '../../stores/prowStore';
import type { ProwJob, ProwJobState } from '../../types/prow';

const stateColors: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  success: 'success',
  failure: 'error',
  error: 'error',
  pending: 'warning',
  triggered: 'info',
  aborted: 'default',
};

const jobStates: ProwJobState[] = ['success', 'failure', 'pending', 'triggered', 'aborted', 'error'];
const jobTypes = ['presubmit', 'postsubmit', 'periodic', 'batch'] as const;

function formatRepo(job: ProwJob): string {
  if (!job.refs) return '—';
  return `${job.refs.org}/${job.refs.repo}`;
}

function formatTime(iso?: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ProwJobsPage() {
  const { data, isLoading, error, refetch } = useProwJobs();
  const { searchTerm, stateFilter, typeFilter, setSearchTerm, setStateFilter, setTypeFilter, clearFilters } = useProwStore();
  const history = useHistory();
  const location = useLocation();

  // Initialize filters from URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const state = params.get('state');
    const type = params.get('type');
    if (q) setSearchTerm(q);
    if (state) setStateFilter(state as ProwJobState);
    if (type) setTypeFilter(type as typeof jobTypes[number]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync filters back to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (stateFilter) params.set('state', stateFilter);
    if (typeFilter) params.set('type', typeFilter);
    const search = params.toString();
    const newSearch = search ? `?${search}` : '';
    if (location.search !== newSearch) {
      history.replace({ pathname: location.pathname, search: newSearch });
    }
  }, [searchTerm, stateFilter, typeFilter, history, location.pathname, location.search]);

  const filtered = useMemo(() => {
    if (!data?.items) return [];
    let items = data.items;
    if (stateFilter) {
      items = items.filter((j) => j.state === stateFilter);
    }
    if (typeFilter) {
      items = items.filter((j) => j.type === typeFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      items = items.filter(
        (j) =>
          j.job.toLowerCase().includes(lower) ||
          formatRepo(j).toLowerCase().includes(lower),
      );
    }
    return items;
  }, [data, searchTerm, stateFilter, typeFilter]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Prow Jobs
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <TextField
          select
          size="small"
          label="State"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value as ProwJobState | '')}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="">All</MenuItem>
          {jobStates.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof jobTypes[number] | '')}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="">All</MenuItem>
          {jobTypes.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>
        {(searchTerm || stateFilter || typeFilter) && (
          <Button size="small" onClick={clearFilters}>Clear</Button>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {isLoading ? '...' : `${filtered.length} jobs`}
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} action={<Button onClick={() => refetch()}>Retry</Button>}>
          Failed to load jobs: {(error as Error).message}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 240px)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Job</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Repo</TableCell>
              <TableCell>Started</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, c) => (
                    <TableCell key={c}><Skeleton /></TableCell>
                  ))}
                </TableRow>
              ))}
            {!isLoading &&
              filtered.slice(0, 200).map((job, i) => (
                <TableRow key={`${job.job}-${job.build_id ?? i}`} hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => history.push(`/prow/job/${encodeURIComponent(job.job)}`)}
                >
                  <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.url ? (
                      <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                        {job.job}
                      </a>
                    ) : (
                      job.job
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={job.state || 'unknown'}
                      size="small"
                      color={stateColors[job.state] ?? 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>{formatRepo(job)}</TableCell>
                  <TableCell>{formatTime(job.started)}</TableCell>
                </TableRow>
              ))}
            {!isLoading && filtered.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No jobs found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

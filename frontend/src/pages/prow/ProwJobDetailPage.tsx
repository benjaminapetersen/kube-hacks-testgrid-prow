import { useParams, useHistory } from 'react-router-dom';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useProwJobs } from '../../api/prow';
import type { ProwJob } from '../../types/prow';

const stateColors: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  success: 'success',
  failure: 'error',
  error: 'error',
  pending: 'warning',
  triggered: 'info',
  aborted: 'default',
};

function formatTime(iso?: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function duration(started?: string, finished?: string): string {
  if (!started || !finished) return '—';
  try {
    const ms = new Date(finished).getTime() - new Date(started).getTime();
    if (ms < 0) return '—';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  } catch {
    return '—';
  }
}

export default function ProwJobDetailPage() {
  const { jobName } = useParams<{ jobName: string }>();
  const history = useHistory();
  const { data, isLoading, error, refetch } = useProwJobs();

  const job: ProwJob | undefined = useMemo(() => {
    if (!data?.items || !jobName) return undefined;
    return data.items.find((j) => j.job === decodeURIComponent(jobName));
  }, [data, jobName]);

  if (isLoading) {
    return (
      <Box>
        <Skeleton width={300} height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        Failed to load job data: {(error as Error).message}
      </Alert>
    );
  }

  if (!job) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.push('/prow/jobs')}>
          Back to Jobs
        </Button>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Job &quot;{jobName}&quot; not found in the current data set.
        </Alert>
      </Box>
    );
  }

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'Job Name', value: job.job },
    {
      label: 'State',
      value: (
        <Chip
          label={job.state || 'unknown'}
          color={stateColors[job.state] ?? 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    { label: 'Type', value: job.type },
    { label: 'Cluster', value: job.cluster ?? '—' },
    { label: 'Agent', value: job.agent ?? '—' },
    { label: 'Build ID', value: job.build_id ?? '—' },
    { label: 'Started', value: formatTime(job.started) },
    { label: 'Finished', value: formatTime(job.finished) },
    { label: 'Duration', value: duration(job.started, job.finished) },
    {
      label: 'Repo',
      value: job.refs
        ? `${job.refs.org}/${job.refs.repo}` + (job.refs.base_ref ? ` (${job.refs.base_ref})` : '')
        : '—',
    },
    { label: 'Description', value: job.description ?? '—' },
  ];

  if (job.refs?.pulls?.length) {
    rows.push({
      label: 'Pull Requests',
      value: (
        <Box>
          {job.refs.pulls.map((pr) => (
            <Box key={pr.number} sx={{ mb: 0.5 }}>
              <Link
                href={`https://github.com/${job.refs!.org}/${job.refs!.repo}/pull/${pr.number}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                #{pr.number}
              </Link>
              {' '}
              {pr.title ?? ''} — {pr.author} ({pr.sha.slice(0, 7)})
            </Box>
          ))}
        </Box>
      ),
    });
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.push('/prow/jobs')}>
          Back
        </Button>
        <Typography variant="h5" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {job.job}
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Table size="small">
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell sx={{ fontWeight: 600, width: 160, whiteSpace: 'nowrap' }}>
                  {row.label}
                </TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {job.url && (
        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mr: 2 }}
        >
          View in Prow
        </Button>
      )}
      {job.url && (
        <Button
          variant="outlined"
          onClick={() => history.push(`/prow/spyglass?url=${encodeURIComponent(job.url!)}`)}
        >
          View Logs (Spyglass)
        </Button>
      )}
    </Box>
  );
}

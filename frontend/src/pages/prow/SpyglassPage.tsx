import { useLocation, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from '@tanstack/react-query';

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

export default function SpyglassPage() {
  const query = useQueryParams();
  const history = useHistory();
  const logUrl = query.get('url');

  // Attempt to fetch the build log from the Prow job URL
  // Prow artifacts are typically at {job_url}/build-log.txt
  const buildLogUrl = logUrl ? `/api/prow${new URL(logUrl).pathname}/build-log.txt` : null;

  const { data: logContent, isLoading, error } = useQuery({
    queryKey: ['spyglass', 'log', buildLogUrl],
    queryFn: async () => {
      if (!buildLogUrl) throw new Error('No log URL');
      const res = await fetch(buildLogUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    },
    enabled: !!buildLogUrl,
    retry: 1,
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()}>
          Back
        </Button>
        <Typography variant="h5">Build Log</Typography>
      </Box>

      {!logUrl && (
        <Alert severity="info">
          No job URL provided. Navigate here from a Prow job detail page.
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Could not load build log. The artifacts may not be available at the expected path.
          {logUrl && (
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                href={logUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open original Prow link
              </Button>
            </Box>
          )}
        </Alert>
      )}

      {logContent && (
        <Paper
          sx={{
            p: 2,
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            maxHeight: 'calc(100vh - 220px)',
            overflow: 'auto',
            bgcolor: 'background.default',
          }}
        >
          {logContent}
        </Paper>
      )}
    </Box>
  );
}

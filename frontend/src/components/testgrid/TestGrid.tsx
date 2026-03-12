import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import type { DashboardSummaryResponse } from '../../types/testgrid';

interface TestGridProps {
  dashboard: string;
  summary: DashboardSummaryResponse;
  onTabClick?: (tabName: string) => void;
}

function statusColor(status?: string, isDark = true): string {
  switch (status?.toUpperCase()) {
    case 'PASSING':
      return isDark ? '#2E7D32' : '#4CAF50';
    case 'FAILING':
      return isDark ? '#C62828' : '#EF5350';
    case 'FLAKY':
      return isDark ? '#E65100' : '#FF9800';
    case 'STALE':
      return isDark ? '#546E7A' : '#90A4AE';
    case 'ACCEPTABLE':
      return isDark ? '#1565C0' : '#42A5F5';
    default:
      return isDark ? '#37474F' : '#CFD8DC';
  }
}

const CELL_SIZE = 36;
const GAP = 2;

export default function TestGrid({ dashboard, summary, onTabClick }: TestGridProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const tabs = useMemo(() => {
    return Object.entries(summary).map(([name, data]) => ({
      name,
      status: data.overall_status || data.status || '',
      passing: data.passing_tests ?? 0,
      failing: data.failing_tests ?? 0,
      flaky: data.flaky_tests ?? 0,
    }));
  }, [summary]);

  if (tabs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        No tab data available for this dashboard.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        {dashboard} — {tabs.length} tabs
      </Typography>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {['PASSING', 'FAILING', 'FLAKY', 'STALE'].map((s) => (
          <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '2px',
                bgcolor: statusColor(s, isDark),
              }}
            />
            <Typography variant="caption">{s}</Typography>
          </Box>
        ))}
      </Box>

      {/* Grid of cells */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: `${GAP}px`,
        }}
      >
        {tabs.map((tab) => (
          <Tooltip
            key={tab.name}
            title={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{tab.name}</Typography>
                <Typography variant="caption">
                  Status: {tab.status || 'unknown'}
                </Typography>
                <br />
                <Typography variant="caption">
                  Pass: {tab.passing} | Fail: {tab.failing} | Flaky: {tab.flaky}
                </Typography>
              </Box>
            }
            arrow
          >
            <Box
              onClick={() => onTabClick?.(tab.name)}
              sx={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                bgcolor: statusColor(tab.status, isDark),
                borderRadius: '4px',
                cursor: onTabClick ? 'pointer' : 'default',
                transition: 'transform 0.1s, box-shadow 0.1s',
                '&:hover': {
                  transform: 'scale(1.15)',
                  boxShadow: 3,
                  zIndex: 1,
                },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}

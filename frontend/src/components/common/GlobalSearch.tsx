import { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Fuse from 'fuse.js';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import GridViewIcon from '@mui/icons-material/GridView';
import { useProwJobs } from '../../api/prow';
import { useTestGridDashboards } from '../../api/testgrid';

interface SearchItem {
  type: 'prow' | 'testgrid';
  name: string;
  detail?: string;
  path: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const history = useHistory();

  const { data: prowData } = useProwJobs();
  const { data: tgData } = useTestGridDashboards();

  const items = useMemo<SearchItem[]>(() => {
    const result: SearchItem[] = [];
    const seenJobs = new Set<string>();

    if (prowData?.items) {
      for (const job of prowData.items) {
        if (!seenJobs.has(job.job)) {
          seenJobs.add(job.job);
          result.push({
            type: 'prow',
            name: job.job,
            detail: job.refs ? `${job.refs.org}/${job.refs.repo}` : undefined,
            path: `/prow/job/${encodeURIComponent(job.job)}`,
          });
        }
      }
    }

    if (tgData?.dashboards) {
      for (const d of tgData.dashboards) {
        result.push({
          type: 'testgrid',
          name: d.name,
          detail: d.dashboard_tab ? `${d.dashboard_tab.length} tabs` : undefined,
          path: `/testgrid/dashboards/${encodeURIComponent(d.name)}`,
        });
      }
    }

    return result;
  }, [prowData, tgData]);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['name', 'detail'],
        threshold: 0.4,
        minMatchCharLength: 2,
      }),
    [items],
  );

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    return fuse.search(query, { limit: 15 }).map((r) => r.item);
  }, [fuse, query]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setQuery('');
      setOpen(false);
      history.push(item.path);
    },
    [history],
  );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative' }}>
        <TextField
          size="small"
          placeholder="Search jobs & dashboards..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(e.target.value.length >= 2);
          }}
          onFocus={(e) => {
            setAnchorEl(e.currentTarget);
            if (query.length >= 2) setOpen(true);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'inherit', opacity: 0.7 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 220,
            '& .MuiOutlinedInput-root': {
              color: 'inherit',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.7)' },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'inherit',
              opacity: 0.6,
            },
          }}
        />
        <Popper
          open={open && results.length > 0}
          anchorEl={anchorEl}
          placement="bottom-start"
          sx={{ zIndex: 1400, width: anchorEl?.offsetWidth ?? 300 }}
        >
          <Paper elevation={8} sx={{ mt: 0.5, maxHeight: 400, overflow: 'auto' }}>
            <List dense>
              {results.map((item) => (
                <ListItemButton key={`${item.type}-${item.name}`} onClick={() => handleSelect(item)}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {item.type === 'prow' ? <WorkIcon fontSize="small" /> : <GridViewIcon fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {item.type === 'prow' ? 'Prow' : 'TestGrid'}
                        {item.detail ? ` · ${item.detail}` : ''}
                      </Typography>
                    }
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: { fontSize: '0.85rem' },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

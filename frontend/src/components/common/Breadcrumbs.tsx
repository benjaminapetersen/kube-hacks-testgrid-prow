import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Crumb {
  label: string;
  path: string;
}

function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [];
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, path: currentPath });
  }

  return crumbs;
}

export default function Breadcrumbs() {
  const location = useLocation();
  const history = useHistory();
  const crumbs = buildCrumbs(location.pathname);

  if (crumbs.length <= 1) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: 'pointer' }}
          onClick={() => history.push('/')}
        >
          Home
        </Link>
        {crumbs.map((crumb, i) =>
          i === crumbs.length - 1 ? (
            <Typography key={crumb.path} color="text.primary" variant="body2">
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={crumb.path}
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => history.push(crumb.path)}
            >
              {crumb.label}
            </Link>
          ),
        )}
      </MuiBreadcrumbs>
    </Box>
  );
}

import { useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { buildTheme } from './theme/theme';
import { useAppStore } from './stores/appStore';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import ProwJobsPage from './pages/prow/ProwJobsPage';
import ProwJobDetailPage from './pages/prow/ProwJobDetailPage';
import SpyglassPage from './pages/prow/SpyglassPage';
import DashboardListPage from './pages/testgrid/DashboardListPage';
import DashboardPage from './pages/testgrid/DashboardPage';
import TestDetailPage from './pages/testgrid/TestDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export default function App() {
  const themeMode = useAppStore((s) => s.themeMode);
  const palette = useAppStore((s) => s.palette);
  const theme = useMemo(() => buildTheme(themeMode, palette), [themeMode, palette]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppShell>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/prow/jobs" component={ProwJobsPage} />
              <Route exact path="/prow/job/:jobName" component={ProwJobDetailPage} />
              <Route exact path="/prow/spyglass" component={SpyglassPage} />
              <Route exact path="/testgrid/dashboards" component={DashboardListPage} />
              <Route exact path="/testgrid/dashboards/:dashboard" component={DashboardPage} />
              <Route exact path="/testgrid/dashboards/:dashboard/:tab" component={TestDetailPage} />
            </Switch>
          </AppShell>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

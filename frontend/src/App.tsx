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
import DashboardListPage from './pages/testgrid/DashboardListPage';

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
              <Route path="/prow/jobs" component={ProwJobsPage} />
              <Route path="/testgrid/dashboards" component={DashboardListPage} />
            </Switch>
          </AppShell>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

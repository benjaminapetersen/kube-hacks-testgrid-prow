import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';
import type { DashboardsResponse, DashboardSummaryResponse } from '../types/testgrid';

export function useTestGridDashboards() {
  return useQuery({
    queryKey: ['testgrid', 'dashboards'],
    queryFn: () => apiFetch<DashboardsResponse>('/testgrid/api/v1/dashboards'),
  });
}

export function useTestGridSummary(dashboard: string) {
  return useQuery({
    queryKey: ['testgrid', 'summary', dashboard],
    queryFn: () => apiFetch<DashboardSummaryResponse>(`/testgrid/api/v1/dashboards/${encodeURIComponent(dashboard)}/summary`),
    enabled: !!dashboard,
  });
}

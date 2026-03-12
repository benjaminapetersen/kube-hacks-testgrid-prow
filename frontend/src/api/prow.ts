import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';
import type { ProwJobsResponse } from '../types/prow';

export function useProwJobs() {
  return useQuery({
    queryKey: ['prow', 'prowjobs'],
    queryFn: () => apiFetch<ProwJobsResponse>('/prow/prowjobs.js'),
  });
}

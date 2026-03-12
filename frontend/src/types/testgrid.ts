// Types based on TestGrid's API response shapes.

export type TestStatus = 'PASS' | 'FAIL' | 'FLAKY' | 'NO_RESULT' | 'RUNNING' | '';

export interface DashboardGroup {
  name: string;
  dashboard_names?: string[];
}

export interface DashboardSummary {
  name: string;
  overall_status?: string;
  status?: string;
  tests?: number;
  passing_tests?: number;
  failing_tests?: number;
  flaky_tests?: number;
  stale_tests?: number;
  last_update_timestamp?: string;
  alert?: string;
}

export interface DashboardTab {
  name: string;
  test_group_name?: string;
  bug_component?: number;
}

export interface Dashboard {
  name: string;
  dashboard_tab?: DashboardTab[];
}

// TestGrid /api/v1/dashboards returns a list
export interface DashboardsResponse {
  dashboards?: Dashboard[];
  dashboard_groups?: DashboardGroup[];
}

// TestGrid summary for a specific dashboard
export interface DashboardSummaryResponse {
  [tabName: string]: DashboardSummary;
}

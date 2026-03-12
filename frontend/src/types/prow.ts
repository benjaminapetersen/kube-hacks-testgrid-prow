// Types based on Prow's prowjobs.js API response shape.
// These are simplified — we can extend as we discover more fields.

export type ProwJobState = 'triggered' | 'pending' | 'success' | 'failure' | 'aborted' | 'error' | '';

export type ProwJobType = 'presubmit' | 'postsubmit' | 'periodic' | 'batch';

export interface ProwJobRef {
  org: string;
  repo: string;
  base_ref?: string;
  base_sha?: string;
  pulls?: Array<{
    number: number;
    author: string;
    sha: string;
    title?: string;
  }>;
}

export interface ProwJob {
  job: string;
  state: ProwJobState;
  type: ProwJobType;
  build_id?: string;
  url?: string;
  refs?: ProwJobRef;
  started?: string;
  finished?: string;
  cluster?: string;
  agent?: string;
  description?: string;
}

// The prowjobs.js endpoint returns { items: ProwJob[] } (simplified)
export interface ProwJobsResponse {
  items: ProwJob[];
}

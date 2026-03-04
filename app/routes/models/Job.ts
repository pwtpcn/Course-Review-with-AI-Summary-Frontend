import type { ReccommendCourse } from "./Course";

export interface Job {
  id: string;
  name: string;
  details: string;
}

export interface CreateJob {
  name: string;
  details: string;
}

export interface UpdateJob {
  name: string;
  details: string;
}

export interface JobSummary {
  jobId: string;
  jobName: string;
  aiSummary: string;
  recommendedCourses: ReccommendCourse[];
}

import type { Job, CreateJob, UpdateJob } from "../models/Job";

export class JobRepositories {
  public async GetAllJobs(sortBy?: "newest" | "oldest"): Promise<Job[] | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const url = sortBy
        ? `${BACKEND_URL}/job/getall?sortBy=${sortBy}`
        : `${BACKEND_URL}/job/getall`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await res.json();
      return data.jobs;
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
      return null;
    }
  }

  public async GetJobById(id: string): Promise<Job | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/job/getbyid/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch job");
      }
      const data = await res.json();
      return data.job;
    } catch (e) {
      console.error("Failed to fetch job:", e);
      return null;
    }
  }

  public async CreateJob(job: CreateJob): Promise<Job | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/job/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });
      if (!res.ok) {
        throw new Error("Failed to create job");
      }
      const data = await res.json();
      return data.job;
    } catch (e) {
      console.error("Failed to create job:", e);
      return null;
    }
  }

  public async UpdateJob(
    id: string,
    job: UpdateJob | Partial<Job>,
  ): Promise<Job | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/job/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });
      if (!res.ok) {
        throw new Error("Failed to update job");
      }
      const data = await res.json();
      return data.job;
    } catch (e) {
      console.error("Failed to update job:", e);
      return null;
    }
  }

  public async DeleteJob(id: string): Promise<Job | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/job/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete job");
      }
      const data = await res.json();
      return data.job;
    } catch (e) {
      console.error("Failed to delete job:", e);
      return null;
    }
  }
}

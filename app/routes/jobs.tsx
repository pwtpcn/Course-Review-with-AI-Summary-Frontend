import { Navbar } from "~/component/Navbar";
import { Await, useLoaderData } from "react-router";
import { Suspense } from "react";
import { JobsSearchBar } from "~/component/JobsSearchBar";
import { JobRepositories } from "./repositories/JobRepositories";
import { AIRepositories } from "./repositories/AIRepositories";
import { JobsCard } from "~/component/JobsCard";
import { JobSkeletonCard } from "~/component/JobSkeletonCard";
import type { Job, JobSummary } from "./models/Job";

export const loader = async () => {
  const jobRepositories = new JobRepositories();
  const aiRepositories = new AIRepositories();
  const jobs = await jobRepositories.GetAllJobs();

  const deferredData: Record<string, any> = { jobs: jobs || [] };

  if (jobs) {
    jobs.forEach((job) => {
  // Map each job summary promise individually to allow independent streaming
      deferredData[`summary_${job.id}`] = aiRepositories
        .GetAIJobSummary(job.id)
        .catch((e: Error) => {
          console.error(`Failed to load summary for job ${job.id}`, e);
          return null;
        });
    });
  }

  return deferredData;
};

export default function JobPage() {
  const data = useLoaderData<typeof loader>();
  const jobs = data.jobs as Job[];

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-8 flex flex-col items-center">
        {/* Search Bar */}
        <JobsSearchBar />

        {/* Job List */}
        <div className="w-full pb-20 flex flex-col gap-6">
          {jobs.map((job: Job) => (
            <Suspense key={job.id} fallback={<JobSkeletonCard job={job} />}>
              <Await resolve={(data as any)[`summary_${job.id}`]}>
                {(resolvedSummary: JobSummary | null) => (
                  <JobsCard
                    job={job}
                    jobSummary={resolvedSummary}
                  />
                )}
              </Await>
            </Suspense>
          ))}
        </div>
      </div>
    </div>
  );
}

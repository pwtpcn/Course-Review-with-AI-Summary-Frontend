import { Navbar } from "~/component/Navbar";
import { useLoaderData } from "react-router";
import { JobsSearchBar } from "~/component/JobsSearchBar";
import { JobRepositories } from "./repositories/JobRepositories";
import { AIRepositories } from "./repositories/AIRepositories";
import { JobsCard } from "~/component/JobsCard";
import type { Job, JobSummary } from "./models/Job";

export const loader = async () => {
  const jobRepositories = new JobRepositories();
  const aiRepositories = new AIRepositories();
  const jobs = await jobRepositories.GetAllJobs();

  const jobSummaries: Record<string, JobSummary | null> = {};

  if (jobs) {
    await Promise.all(
      jobs.map(async (job) => {
        try {
          const summary = await aiRepositories.GetAIJobSummary(job.id);
          jobSummaries[job.id] = summary;
        } catch (e) {
          console.error(`Failed to load summary for job ${job.id}`, e);
          jobSummaries[job.id] = null;
        }
      }),
    );
  }

  return { jobs: jobs || [], jobSummaries };
};

export default function JobPage() {
  const { jobs, jobSummaries } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-8 flex flex-col items-center">
        {/* Search Bar */}
        <JobsSearchBar />

        {/* Job List */}
        <div className="w-full pb-20 flex flex-col gap-6">
          {jobs.map((job: Job) => (
            <JobsCard
              key={job.id}
              job={job}
              jobSummary={jobSummaries[job.id] as any}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

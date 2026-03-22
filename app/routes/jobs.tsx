import { Navbar } from "~/component/Navbar";
import ScrollToTopButton from "~/component/ScrollToTopButton";
import { Await, useLoaderData } from "react-router";
import { Suspense, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.name.toLowerCase().includes(term) ||
      job.details.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-8 flex flex-col items-center">
        {/* Search Bar */}
        <JobsSearchBar onSearch={setSearchTerm} />

        {/* Job List */}
        <div className="w-full pb-20 flex flex-col gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job: Job) => (
              <Suspense key={job.id} fallback={<JobSkeletonCard job={job} />}>
                <Await resolve={(data as any)[`summary_${job.id}`]}>
                  {(resolvedSummary: JobSummary | null) => (
                    <JobsCard job={job} jobSummary={resolvedSummary} />
                  )}
                </Await>
              </Suspense>
            ))
          ) : (
            <div className="w-full max-w-4xl mx-auto text-center border-2 border-[#1BE1F3]/50 bg-[#1BE1F3]/5 rounded-2xl p-12 mt-8">
              <h3 className="text-[#FCFC00] text-xl md:text-2xl mb-4 font-chakra-petch">NO JOBS FOUND</h3>
              <p className="text-[#1BE1F3] text-sm md:text-base font-chakra-petch tracking-wider leading-relaxed opacity-80">
                We couldn't find any job titles or descriptions matching <br />
                <span className="text-white italic bg-white/10 px-2 py-1 rounded mt-2 inline-block">"{searchTerm}"</span>
              </p>
            </div>
          )}
        </div>
        <ScrollToTopButton />
      </div>
    </div>
  );
}

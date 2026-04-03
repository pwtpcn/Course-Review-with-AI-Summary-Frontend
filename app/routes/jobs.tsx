import { Navbar } from "~/component/Navbar";
import ScrollToTopButton from "~/component/ScrollToTopButton";
import { useLoaderData } from "react-router";
import { useState, useEffect, useRef } from "react";
import { JobsSearchBar } from "~/component/JobsSearchBar";
import { JobRepositories } from "./repositories/JobRepositories";
import { AIRepositories } from "./repositories/AIRepositories";
import { JobsCard } from "~/component/JobsCard";
import { JobSkeletonCard } from "~/component/JobSkeletonCard";
import type { Job, JobSummary } from "./models/Job";

export const loader = async () => {
  const jobRepositories = new JobRepositories();
  const jobs = await jobRepositories.GetAllJobs();
  return { jobs: jobs || [] };
};

// Fetches AI summary on the client side to avoid server timeout
function JobCardWithSummary({ job }: { job: Job }) {
  const [jobSummary, setJobSummary] = useState<JobSummary | null | undefined>(
    undefined,
  );
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (fetchedRef.current === job.id) return;
    fetchedRef.current = job.id;

    const aiRepository = new AIRepositories();
    aiRepository
      .GetAIJobSummary(job.id)
      .then((summary) => setJobSummary(summary))
      .catch((error) => {
        console.error(`Failed to fetch AI summary for job ${job.id}:`, error);
        setJobSummary(null);
      });
  }, [job.id]);

  if (jobSummary === undefined) {
    return <JobSkeletonCard job={job} />;
  }

  return <JobsCard job={job} jobSummary={jobSummary} />;
}

export default function JobPage() {
  const { jobs } = useLoaderData<typeof loader>();
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

        <div className="w-full max-w-4xl mx-auto text-left mb-5 mt-2">
          <h2 className="text-[#FCFC00] text-sm md:text-base">Jobs recommended by Admin</h2>
        </div>
        {/* Job List */}
        <div className="w-full pb-20 flex flex-col gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job: Job) => (
              <JobCardWithSummary key={job.id} job={job} />
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

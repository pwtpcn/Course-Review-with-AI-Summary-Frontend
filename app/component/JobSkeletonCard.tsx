import type { Job } from "~/routes/models/Job";

export const JobSkeletonCard = ({ job }: { job: Job }) => {
  const borderColor = "border-[#1BE1F3]";
  const headerBg = "bg-[#1BE1F3]";
  const textColor = "text-black";

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 ">
      <div
        className={`${headerBg} ${textColor} px-4 py-2 text-xs md:text-sm lg:text-md inline-block opacity-80`}
      >
        {job.name}
      </div>
      <div
        className={`border-2 ${borderColor} p-6 bg-black text-[#FCFC00] min-h-[200px] text-xs md:text-sm lg:text-md leading-loose relative overflow-hidden`}
      >
        <div className="grid gap-4 relative z-10">
          <div>
            Job Description :{" "}
            <span className="text-white font-chakra-petch">{job.details}</span>
          </div>

          {/* Skeleton for AI Summary */}
          <div className="mt-4 text-[#1BE1F3]/80 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-4 h-4 border-2 border-[#1BE1F3] border-t-transparent animate-spin rounded-full"></span>
              <span className="tracking-widest">AI SUMMARY GENERATION IN PROGRESS...</span>
            </div>
            
            {/* AI Summary Text Skeletons */}
            <div className="space-y-3 mt-4 opacity-70">
              <div className="h-3 bg-[#1BE1F3]/30 rounded w-full"></div>
              <div className="h-3 bg-[#1BE1F3]/30 rounded w-full"></div>
              <div className="h-3 bg-[#1BE1F3]/30 rounded w-5/6"></div>
              <div className="h-3 bg-[#1BE1F3]/30 rounded w-4/6"></div>
            </div>

            {/* Recommended Courses Skeletons */}
            <div className="mt-6 border-t border-[#1BE1F3]/30 pt-6">
               <div className="h-3 bg-[#1BE1F3]/30 rounded w-1/4 mb-5"></div>
               <div className="flex flex-col gap-3 ml-2">
                 <div className="h-8 bg-[#1BE1F3]/10 border border-[#1BE1F3]/30 rounded-lg w-1/2"></div>
                 <div className="h-8 bg-[#1BE1F3]/10 border border-[#1BE1F3]/30 rounded-lg w-2/3"></div>
                 <div className="h-8 bg-[#1BE1F3]/10 border border-[#1BE1F3]/30 rounded-lg w-1/3"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Scanline effect to add to the cyberpunk feel */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-size-[100%_4px] opacity-20"></div>
      </div>
    </div>
  );
};

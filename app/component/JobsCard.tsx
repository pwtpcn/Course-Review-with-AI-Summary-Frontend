import type { Job, JobSummary } from "~/routes/models/Job";
import { Link } from "react-router";

export const JobsCard = ({
  job,
  jobSummary,
}: {
  job: Job;
  jobSummary?: JobSummary | null;
}) => {
  const borderColor = "border-[#1BE1F3]";
  const headerBg = "bg-[#1BE1F3]";
  const textColor = "text-black";

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 ">
      <div
        className={`${headerBg} ${textColor} px-4 py-2 text-xs md:text-sm lg:text-md inline-block`}
      >
        {job.name}
      </div>
      <div
        className={`border-2 ${borderColor} p-6 bg-black text-[#FCFC00] min-h-[200px] text-xs md:text-sm lg:text-md leading-loose`}
      >
        <div className="grid gap-4">
          <div>
            Job Description :{" "}
            <span className="text-white font-chakra-petch">{job.details}</span>
          </div>

          {jobSummary ? (
            <>
              {jobSummary.aiSummary && (
                <div>
                  AI Recommendations :{" "}
                  <span className="text-white font-chakra-petch leading-relaxed block mt-2 whitespace-pre-line">
                    {jobSummary.aiSummary}
                  </span>
                </div>
              )}

              {jobSummary.recommendedCourses &&
                jobSummary.recommendedCourses.length > 0 && (
                  <div className="mt-4 border-t border-[#1BE1F3]/30 pt-4">
                    Recommended Courses :
                    <ul className="list-disc pl-5 mt-4 space-y-4">
                      {[...jobSummary.recommendedCourses]
                        .sort((a, b) =>
                          a.originalId
                            .trim()
                            .localeCompare(b.originalId.trim()),
                        )
                        .map((course, index) => (
                          <li
                            key={`${course.originalId}-${index}`}
                            className="text-white font-chakra-petch"
                          >
                            <Link
                              to={`/review/subjectReview/${course.originalId}`}
                              className="text-white hover:text-[#fcfc00] transition-colors duration-200 block p-2 -ml-2 rounded-lg hover:bg-[#1BE1F3]/10"
                            >
                              <span className="text-[#1BE1F3] font-bold tracking-wide group-hover:text-[#fcfc00]">
                                {course.originalId}
                              </span>{" "}
                              | {course.nameEn || course.nameTh}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
            </>
          ) : (
            <div className="text-gray-400 text-xs italic">
              AI recommendations are not available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

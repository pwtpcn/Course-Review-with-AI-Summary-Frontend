import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { NavLink, useFetcher, useLoaderData, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { UserRepository } from "../repositories/UserRepositories";
import { CautionPopup } from "~/component/CautionPopup";
import { JobRepositories } from "../repositories/JobRepositories";
import type { Job } from "../models/Job";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const jobId = params.jobId;
  if (!jobId) {
    throw new Response("Job ID Not Found", { status: 404 });
  }
  const jobRepository = new JobRepositories();
  const job = await jobRepository.GetJobById(jobId);
  if (!job) {
    throw new Response("Job Not Found", { status: 404 });
  }
  return { job };
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  let accessToken = "";
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      }),
    );
    accessToken = cookies["access_token"];
  }

  if (!accessToken) {
    return { message: "Unauthorized", error: "Unauthorized", data: null };
  }

  const user = await UserRepository.getUser(accessToken);
  if (!user || user.role !== "admin") {
    // Only Admin can add course (optional check if you have role)
    // return { message: "Unauthorized", error: "Unauthorized", data: null };
  }

  const formData = await request.formData();
  const jobId = request.url.split("/").pop(); // Or passed via hidden input
  const name = formData.get("name") as string;
  const details = formData.get("details") as string;

  let errors: Record<string, string> = {};
  if (!name) errors.name = "Job Name is required";
  if (!details) errors.details = "Details is required";

  if (Object.keys(errors).length > 0) {
    return {
      message: "Validation error",
      error: errors,
      data: null,
    };
  }

  const jobRepository = new JobRepositories();
  const newJob: Partial<Job> = {
    name: name,
    details: details,
  };

  const updateJob = await jobRepository.UpdateJob(jobId as string, newJob);

  if (!updateJob) {
    return {
      message: "Failed to update job",
      error: { form: "Failed to update job. It might already exist." },
      data: null,
    };
  }

  return { message: "Job submitted", error: "", data: updateJob };
};

export default function EditJob() {
  const { job } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const errors = fetcher.data?.error || {};

  const [showRecheckedConfirm, setShowRecheckedConfirm] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState(job?.name || "");
  const [details, setDetails] = useState(job?.details || "");

  const isFormValid = name.length > 0 && details.length > 0;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.message === "Job submitted") {
      navigate(`/admin/jobManage`, {
        state: { jobSubmitted: true },
      });
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] flex flex-col items-center py-12 px-4 relative">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-[#FCFC00] text-xl md:text-3xl mb-4 ">
          Edit Job Information
        </h1>
      </div>

      <fetcher.Form method="post" className="w-full max-w-2xl space-y-8">
        {errors.form && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl text-xs">
            {errors.form}
          </div>
        )}

        {/* Job Name Field */}
        <div className="space-y-2">
          <label className="text-white text-xs md:text-sm block">
            Job Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white font-chakra-petch placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        {/* Details Field */}
        <div className="space-y-2">
          <label className="text-white text-xs md:text-sm block">Details</label>
          <textarea
            name="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full h-32 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white font-chakra-petch placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
          />
          {errors.details && (
            <p className="text-[#D80004] text-xs">{errors.details}</p>
          )}
        </div>

        <p className="text-[#FCFC00] text-[14px] pt-4">
          Caution! : Please recheck your job information before save!
        </p>

        {/* Buttons */}
        <div className="flex justify-between pt-8">
          <NavLink to={`/admin/jobsManage`}>
            <button
              type="button"
              className="btn-cancel-add-data btn-cancel-add-data:hover text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase"
            >
              Cancel
            </button>
          </NavLink>

          <button
            type="button"
            disabled={!isFormValid}
            onClick={() => setShowRecheckedConfirm(true)}
            className={`btn-auth-add-data text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase
                ${
                  isFormValid
                    ? "btn-auth-add-data:hover"
                    : "opacity-50 cursor-not-allowed"
                }`}
          >
            Save
          </button>
        </div>

        {/* Re confirm Popup */}
        <CautionPopup
          isOpen={showRecheckedConfirm}
          onClose={() => setShowRecheckedConfirm(false)}
          isSubmitting={fetcher.state !== "idle"}
        />
      </fetcher.Form>
    </div>
  );
}

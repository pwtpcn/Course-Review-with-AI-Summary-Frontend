import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { NavLink, useFetcher, useLoaderData, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { JobRepositories } from "../repositories/JobRepositories";
import { requireAdmin, getAccessToken } from "../../lib/auth";
import type { CreateJob } from "../models/Job";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireAdmin(request);
    return null;
};

export const action: ActionFunction = async ({ request }) => {
    await requireAdmin(request);
    const accessToken = getAccessToken(request) || "";

    const formData = await request.formData();
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
    const newJob: CreateJob = {
        name: name,
        details: details,
    };

    const createdJob = await jobRepository.CreateJob(newJob, accessToken);

    if (!createdJob) {
        return {
            message: "Failed to create job",
            error: { form: "Failed to create job. It might already exist." },
            data: null,
        };
    }

    return { message: "Job submitted", error: "", data: createdJob };
};

export default function AddJob() {
    const fetcher = useFetcher();
    const errors = fetcher.data?.error || {};

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [details, setDetails] = useState("");

    const isFormValid =
        name.length > 0 &&
        details.length > 0;

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            if (fetcher.data.message === "Job submitted") {
                navigate(`/admin/jobsManage`, {
                    state: { jobSubmitted: true },
                });
            }
        }
    }, [fetcher.state, fetcher.data, navigate]);

    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] flex flex-col items-center py-12 px-4 relative">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-[#FCFC00] text-xl md:text-3xl mb-4 ">
                    Add Job
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
                    <label className="text-white text-lg md:text-xl block font-chakra-petch">Job Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="font-chakra-petch w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-s"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>

                {/* Details Field */}
                <div className="space-y-2">
                    <label className="text-white text-lg md:text-xl block font-chakra-petch">Details</label>
                    <textarea
                        name="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="font-chakra-petch w-full h-32 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-s leading-relaxed resize-none"
                    />
                    {errors.details && (
                        <p className="text-[#D80004] text-xs">{errors.details}</p>
                    )}
                </div>

                <p className="text-[#FCFC00] text-[14px] pt-4">
                    Caution! : Please recheck your job information before add!
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
                        type="submit"
                        disabled={!isFormValid || fetcher.state !== "idle"}
                        className={`btn-auth-add-data text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase
                ${isFormValid && fetcher.state === "idle"
                                ? "btn-auth-add-data:hover"
                                : "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        {fetcher.state !== "idle" ? "Submitting..." : "Add"}
                    </button>
                </div>

            </fetcher.Form>
        </div>
    );
}

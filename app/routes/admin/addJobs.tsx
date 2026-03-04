import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { NavLink, useFetcher, useLoaderData, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { CourseRepositories } from "../repositories/JobRepositories";
import { UserRepository } from "../repositories/UserRepositories";
import type { CreateReview } from "../models/Review";
import { CautionPopup } from "~/component/CautionPopup";


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
    const id = formData.get("id") as string;
    const nameTh = formData.get("nameTh") as string;
    const nameEn = formData.get("nameEn") as string;
    const details = formData.get("details") as string;

    let errors: Record<string, string> = {};

    if (!id) errors.id = "Job ID is required";
    if (!nameTh) errors.nameTh = "Job Name (TH) is required";
    if (!nameEn) errors.nameEn = "Job Name (EN) is required";
    if (!details) errors.details = "Details is required";

    if (Object.keys(errors).length > 0) {
        return {
            message: "Validation error",
            error: errors,
            data: null,
        };
    }

    const jobRepository = new JobRepositories();
    const newJob: import("../models/Job").Job = {
        id: id,
        nameTh: nameTh,
        nameEn: nameEn,
        details: details,
    } as any;

    const createdJob = await jobRepository.CreateJob(newJob);

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

    const [showRecheckedConfirm, setShowRecheckedConfirm] = useState(false);
    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [nameTh, setNameTh] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [details, setDetails] = useState("");

    const isFormValid =
        id.length > 0 &&
        nameTh.length > 0 &&
        nameEn.length > 0 &&
        details.length > 0;

    useEffect(() => {
        if (
            fetcher.state === "idle" &&
            fetcher.data?.message === "Job submitted"
        ) {
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
                    Add Job
                </h1>
            </div>

            <fetcher.Form method="post" className="w-full max-w-2xl space-y-8">
                {errors.form && (
                    <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl text-xs">
                        {errors.form}
                    </div>
                )}

                {/* Job ID Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Job ID</label>
                    <input
                        type="text"
                        name="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                        placeholder="e.g. 01234567"
                        maxLength={10}
                    />
                    {errors.id && <p className="text-red-500 text-xs">{errors.id}</p>}
                </div>

                {/* Job Name (TH) Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Job Name (TH)</label>
                    <input
                        type="text"
                        name="nameTh"
                        value={nameTh}
                        onChange={(e) => setNameTh(e.target.value)}
                        className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                    />
                    {errors.nameTh && <p className="text-red-500 text-xs">{errors.nameTh}</p>}
                </div>

                {/* Job Name (EN) Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Job Name (EN)</label>
                    <input
                        type="text"
                        name="nameEn"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                    />
                    {errors.nameEn && <p className="text-red-500 text-xs">{errors.nameEn}</p>}
                </div>

                {/* Details Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Details</label>
                    <textarea
                        name="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full h-32 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
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
                    <NavLink to={`/admin/jobManage`}>
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
                ${isFormValid
                                ? "btn-auth-add-data:hover"
                                : "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Add
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

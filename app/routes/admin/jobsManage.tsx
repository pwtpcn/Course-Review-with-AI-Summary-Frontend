import { useLoaderData } from "react-router";
import { JobRepositories } from "../repositories/JobRepositories";
import type { Job } from "../models/Job";
import { AdminNavBar } from "../../component/AdminNavBar";
import { NavLink } from "react-router";

export const loader = async () => {
    const jobRepository = new JobRepositories();
    // Fetch all courses, we can sort by newest or leave default
    const jobs = await jobRepository.GetAllJobs({ sortBy: "newest" });
    return { jobs };
};

export default function JobsManage() {
    const { jobs } = useLoaderData<typeof loader>();

    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
            <AdminNavBar />

            <div className="flex-1 px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-7xl mx-auto mb-8">
                    <div className="flex flex-col gap-6 items-start">
                        <h2 className="text-xl md:text-2xl text-[#FCFC00] border-b-2 border-[#1BE1F3] inline-block pb-2">
                            Course Management
                        </h2>
                        <p className="text-xs text-gray-400">View and manage all courses</p>

                        <NavLink to={`/admin/addJob`}>
                            <button
                                type="button"
                                className="btn-auth-add-course btn-auth-add-course:hover text-white py-3 px-6 rounded-lg text-xs md:text-sm transition-colors"
                            >
                                Add Job
                            </button>
                        </NavLink>
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#111] text-[#1BE1F3] text-[10px] md:text-xs">
                                    <th className="p-4 whitespace-nowrap">ID</th>
                                    <th className="p-4 min-w-[150px]">Course Name (TH)</th>
                                    <th className="p-4 min-w-[150px]">Course Name (EN)</th>
                                    <th className="p-4 min-w-[200px]">Description</th>
                                    <th className="p-4 text-center whitespace-nowrap">Credits</th>
                                    <th className="p-4 text-center whitespace-nowrap">Year</th>
                                    <th className="p-4 text-center whitespace-nowrap">Category</th>
                                </tr>
                            </thead>
                            <tbody className="text-[10px] md:text-xs font-sans">
                                {!jobs || jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500 font-['Press_Start_2P'] text-[10px]">
                                            No jobs found.
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job: Job) => (
                                        <tr
                                            key={job.id}
                                            className="border-b border-[#2A2A2A]/50 hover:bg-[#1A1A1A] transition-colors"
                                        >
                                            <td className="p-4 font-mono text-[#FCFC00]">{job.id}</td>
                                            <td className="p-4">{job.nameTh}</td>
                                            <td className="p-4">{job.nameEn}</td>
                                            <td className="p-4">
                                                <div className="line-clamp-2 text-gray-400 text-[11px]" title={job.details}>
                                                    {job.details}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
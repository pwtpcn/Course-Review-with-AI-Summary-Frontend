import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { JobRepositories } from "../repositories/JobRepositories";
import type { Job } from "../models/Job";
import { AdminNavBar } from "../../component/AdminNavBar";
import { NavLink } from "react-router";
import { requireAdmin } from "../../lib/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireAdmin(request);
    const jobRepository = new JobRepositories();
    const jobs = await jobRepository.GetAllJobs();

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
                            Jobs Management
                        </h2>
                        <p className="text-xs text-gray-400">View and manage all jobs</p>

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
                                    <th className="p-4 min-w-[150px]">Job Name</th>
                                    <th className="p-4 min-w-[200px]">Details</th>
                                    <th className="p-4 text-center whitespace-nowrap">Edit</th>
                                    <th className="p-4 text-center whitespace-nowrap">Delete</th>
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
                                            <td className="p-4">{job.name}</td>
                                            <td className="p-4">
                                                <div className="line-clamp-2 text-gray-400 text-[11px]" title={job.details}>
                                                    {job.details}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <NavLink to={`/admin/editJob/${job.id}`}>
                                                    <button
                                                        type="button"
                                                        className="text-gray-light"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" /></svg>
                                                    </button>
                                                </NavLink>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    className="text-danger"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                </button>
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
import { useLoaderData } from "react-router";
import { CourseRepositories } from "../repositories/CourseRepositories";
import type { Course } from "../models/Course";
import { AdminNavBar } from "../../component/AdminNavBar";
import { NavLink } from "react-router";

export const loader = async () => {
    const courseRepository = new CourseRepositories();
    // Fetch all courses, we can sort by newest or leave default
    const courses = await courseRepository.GetAllCourses({ sortBy: "newest" });
    return { courses };
};

export default function CourseManage() {
    const { courses } = useLoaderData<typeof loader>();

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

                        <NavLink to={`/admin/addCourse`}>
                            <button
                                type="button"
                                className="btn-auth-add-course btn-auth-add-course:hover text-white py-3 px-6 rounded-lg text-xs md:text-sm transition-colors"
                            >
                                Add Course
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
                                {!courses || courses.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500 font-['Press_Start_2P'] text-[10px]">
                                            No courses found.
                                        </td>
                                    </tr>
                                ) : (
                                    courses.map((course: Course) => (
                                        <tr
                                            key={course.id}
                                            className="border-b border-[#2A2A2A]/50 hover:bg-[#1A1A1A] transition-colors"
                                        >
                                            <td className="p-4 font-mono text-[#FCFC00]">{course.id}</td>
                                            <td className="p-4">{course.nameTh}</td>
                                            <td className="p-4">{course.nameEn}</td>
                                            <td className="p-4">
                                                <div className="line-clamp-2 text-gray-400 text-[11px]" title={course.description}>
                                                    {course.description}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">{course.credits}</td>
                                            <td className="p-4 text-center">{course.year}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-['Press_Start_2P'] border ${course.category === 'Core'
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    }`}>
                                                    {course.category}
                                                </span>
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
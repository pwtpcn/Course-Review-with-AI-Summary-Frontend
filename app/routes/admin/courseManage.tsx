import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, Form, useFetcher } from "react-router";
import { CourseRepositories } from "../repositories/CourseRepositories";
import type { Course, CourseFilter } from "../models/Course";
import { AdminNavBar } from "../../component/AdminNavBar";
import { NavLink } from "react-router";
import { getAccessToken, requireAdmin } from "../../lib/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireAdmin(request);
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || undefined;
    const sortBy = url.searchParams.get("sortBy") || "idAsc";
    const category = url.searchParams.get("category") || undefined;
    const year = url.searchParams.get("year");

    const filter: CourseFilter = {
        search,
        sortBy: sortBy as "newest" | "oldest" | "idAsc",
        category: category as "Core" | "Elective" | undefined,
        year: year ? Number(year) : undefined,
    };

    const courseRepository = new CourseRepositories();
    const courses = await courseRepository.GetAllCourses(filter);
    
    return { courses, search, sortBy, category, year};
};

export const action = async ({ request }:  ActionFunctionArgs) => {
    await requireAdmin(request);
    const accessToken = getAccessToken(request) || "";

    const formData = await request.formData();
    const intent = formData.get("intent");
    const courseId = formData.get("courseId");

    if (intent === "delete" && courseId && accessToken) {
        const courseRepository = new CourseRepositories();
        const ok = await courseRepository.DeleteCourse(courseId.toString(), accessToken);
        return { ok, intent };
    }

    return { ok: false, intent };
};

export default function CourseManage() {
    const { courses, search, sortBy, category, year } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();

    const handleQuickDelete = (e: React.MouseEvent, course: Course) => {
            e.stopPropagation();
            if (!confirm(`หากลบแล้วจะไม่สามารถกู้คืนข้อมูล คุณต้องการลบรายวิชานี้ใช่หรือไม่?`)) return;
            fetcher.submit(
                { intent: "delete", courseId: course.id, accessToken: "" },
                { method: "post" }
            );
        };

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

                <div className="w-full max-w-7xl mx-auto mb-6">
                    <Form method="get" className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-2">
                            <label htmlFor="search" className="text-xs text-gray-400">Search</label>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                defaultValue={search || ""}
                                placeholder="Course ID or Name..."
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white focus:outline-none focus:border-[#1BE1F3] text-xs font-chakra-petch"
                            />
                        </div>
                        
                        <div className="w-full md:w-48 space-y-2">
                            <label htmlFor="category" className="text-xs text-gray-400">Category</label>
                            <select
                                name="category"
                                id="category"
                                defaultValue={category || ""}
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white focus:outline-none focus:border-[#1BE1F3] text-xs font-chakra-petch appearance-none"
                            >
                                <option value="">All Categories</option>
                                <option value="Core">Core</option>
                                <option value="Elective">Elective</option>
                            </select>
                        </div>
                        
                        <div className="w-full md:w-32 space-y-2">
                            <label htmlFor="year" className="text-xs text-gray-400">Year</label>
                            <select
                                name="year"
                                id="year"
                                defaultValue={year || ""}
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white focus:outline-none focus:border-[#1BE1F3] text-xs font-chakra-petch appearance-none"
                            >
                                <option value="">All</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>

                        <div className="w-full md:w-48 space-y-2">
                            <label htmlFor="sortBy" className="text-xs text-gray-400">Sort By</label>
                            <select
                                name="sortBy"
                                id="sortBy"
                                defaultValue={sortBy || "idAsc"}
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white focus:outline-none focus:border-[#1BE1F3] text-xs font-chakra-petch appearance-none"
                            >
                                <option value="idAsc">Course ID (Asc)</option>
                                <option value="newest">Newest Added</option>
                                <option value="oldest">Oldest Added</option>
                            </select>
                        </div>

                        <div className="w-full md:w-auto pt-2 md:pt-0">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-[#1BE1F3]/10 hover:bg-[#1BE1F3]/20 text-[#1BE1F3] border border-[#1BE1F3]/30 py-3 px-6 rounded-lg text-xs md:text-sm transition-colors"
                            >
                                Filter
                            </button>
                        </div>
                    </Form>
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
                                    <th className="p-4 text-center whitespace-nowrap">Edit</th>
                                    <th className="p-4 text-center whitespace-nowrap">Delete</th>
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
                                            <td className="p-4 text-center">
                                                <NavLink to={`/admin/editCourse/${course.id}`}>
                                                    <button
                                                        type="button"
                                                        className="text-gray-light"
                                                        title="Edit Course"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" /></svg>
                                                    </button>
                                                </NavLink>
                                            </td>
                                            <td className="p-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleQuickDelete(e, course)}
                                                        className="text-danger"
                                                        title="Delete Course"
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
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, NavLink } from "react-router";
import { AdminNavBar } from "../../component/AdminNavBar";
import { AdminKpiCard } from "../../component/AdminKpiCard";
import { ReviewTrendChart } from "../../component/ReviewTrendChart";
import { requireAdmin } from "../../lib/auth";
import { JobRepositories } from "../repositories/JobRepositories";
import { CourseRepositories } from "../repositories/CourseRepositories";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { ReportRepositories } from "../repositories/ReportRepositories";
import { UserRepositories } from "../repositories/UserRepositories";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);

  const [jobs, courses, reviews, pendingReports, users] = await Promise.all([
    new JobRepositories().GetAllJobs(),
    new CourseRepositories().GetAllCourses({ sortBy: "newest" }),
    new ReviewRepositories().GetAllReviews({ sortBy: "newest" }),
    new ReportRepositories().GetAllReports({ status: "pending" }),
    new UserRepositories().GetAllUsers(),
  ]);

  return {
    stats: {
      totalJobs: jobs?.length || 0,
      totalCourses: courses?.length || 0,
      totalReviews: reviews?.length || 0,
      pendingReports: pendingReports?.length || 0,
      totalUsers: users?.length || 0,
    },
    latestCourses: courses?.slice(0, 4) || [],
    latestReviews: reviews?.slice(0, 4) || [],
    allReviews: reviews || [],
  };
};

export default function AdminDashboard() {
  const { stats, latestCourses, latestReviews, allReviews } =
    useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
      <AdminNavBar />

      <div className="flex-1 px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto mb-8">
          <div className="flex flex-col gap-2 items-start">
            <h2 className="text-xl md:text-2xl text-[#FCFC00] border-b-2 border-[#1BE1F3] inline-block pb-2">
              SYSTEM OVERVIEW
            </h2>
            <p className="text-xs text-gray-400 font-chakra-petch tracking-wider">
              Welcome to the Admin Control Center
            </p>
          </div>
        </div>

        {/* KPIs Section */}
        <div className="w-full max-w-7xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          <AdminKpiCard 
            title="Total Users" 
            value={stats.totalUsers} 
            containerClasses="border border-[#2A2A2A] hover:border-[#FF00E6]"
            blurClasses="bg-[#FF00E6] w-16 h-16 opacity-20 group-hover:opacity-40"
            titleClasses="text-gray-400"
            valueClasses="text-[#FF00E6] drop-shadow-[0_0_10px_rgba(255,0,230,0.5)]"
          />
          <AdminKpiCard 
            title="Total Courses" 
            value={stats.totalCourses} 
            containerClasses="border border-[#2A2A2A] hover:border-[#FCFC00]"
            blurClasses="bg-[#FCFC00] w-16 h-16 opacity-20 group-hover:opacity-40"
            titleClasses="text-gray-400"
            valueClasses="text-[#FCFC00] drop-shadow-[0_0_10px_rgba(252,252,0,0.5)]"
          />
          <AdminKpiCard 
            title="Total Jobs" 
            value={stats.totalJobs} 
            containerClasses="border border-[#2A2A2A] hover:border-[#1BE1F3]"
            blurClasses="bg-[#1BE1F3] w-16 h-16 opacity-20 group-hover:opacity-40"
            titleClasses="text-gray-400"
            valueClasses="text-[#1BE1F3] drop-shadow-[0_0_10px_rgba(27,225,243,0.5)]"
          />
          <AdminKpiCard 
            title="Total Reviews" 
            value={stats.totalReviews} 
            containerClasses="border border-[#2A2A2A] hover:border-green-400"
            blurClasses="bg-green-400 w-16 h-16 opacity-10 group-hover:opacity-30"
            titleClasses="text-gray-400"
            valueClasses="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"
          />
          <AdminKpiCard 
            title="Pending Reports" 
            value={stats.pendingReports} 
            link="/admin/ManageReport"
            containerClasses="border-2 border-red-500/50 hover:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            blurClasses="bg-red-500 w-24 h-24 opacity-20 group-hover:opacity-40"
            titleClasses="text-red-400"
            valueClasses="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
          />
        </div>

        {/* Chart Section */}
        <ReviewTrendChart allReviews={allReviews} />

        {/* Content Sections */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Courses */}
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm md:text-base text-[#1BE1F3]">
                Latest Courses
              </h3>
              <NavLink
                to="/admin/courseManage"
                className="text-[8px] md:text-[10px] text-gray-400 hover:text-white transition-colors"
              >
                View All {">"}
              </NavLink>
            </div>

            <div className="space-y-4">
              {latestCourses.length > 0 ? (
                latestCourses.map((course: any) => (
                  <div
                    key={course.id}
                    className="border-l-2 border-[#1BE1F3] bg-[#111] p-4 rounded-r-lg hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-[#FCFC00]">
                        {course.id}
                      </span>
                      <span className="text-[10px] text-gray-400 font-chakra-petch">
                        {course.category} | Year {course.year}
                      </span>
                    </div>
                    <div className="text-xs md:text-sm font-chakra-petch truncate">
                      {course.nameEn}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-center py-6 text-gray-500">
                  No courses available
                </div>
              )}
            </div>
          </div>

          {/* Latest Reviews */}
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm md:text-base text-green-400">
                Recent Reviews
              </h3>
              <NavLink
                to="/admin/reviewManage"
                className="text-[8px] md:text-[10px] text-gray-400 hover:text-white transition-colors"
              >
                View All {">"}
              </NavLink>
            </div>

            <div className="space-y-4">
              {latestReviews.length > 0 ? (
                latestReviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-l-2 border-green-400 bg-[#111] p-4 rounded-r-lg hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-[#1BE1F3]">
                        {review.courseId}
                      </span>
                      <span className="text-[10px] text-gray-400 font-chakra-petch">
                        {review.rating} / 5
                      </span>
                    </div>
                    <div className="text-xs md:text-sm font-chakra-petch text-gray-300 line-clamp-2">
                      {review.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-center py-6 text-gray-500">
                  No reviews available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

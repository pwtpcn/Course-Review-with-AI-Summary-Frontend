import { Navbar } from "~/component/Navbar";
import { useState, useEffect } from "react";
import { CourseSearchBar } from "~/component/CourseSearchBar";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { CourseRepositories } from "../repositories/CourseRepositories";
import type { Course } from "../models/Course";
import { CourseCard } from "~/component/CourseCard";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const courseRepository = new CourseRepositories();
  const courses = await courseRepository.GetAllCourses();
  return { courses: courses || [] };
};

export default function CoursePage() {
  const { courses } = useLoaderData<typeof loader>();
  const [selectedYear, setSelectedYear] = useState<string>("Year 1");
  const [selectedType, setSelectedType] = useState<string | null>("All");

  const yearNumber = parseInt(selectedYear.replace("Year ", ""), 10) || 1;

  const mainCourses = courses
    .filter(
      (c: Course) =>
        c.category === "Core" &&
        c.year === yearNumber &&
        (!selectedType || selectedType === "Main" || selectedType === "All"),
    )
    .sort((a: Course, b: Course) => a.id.trim().localeCompare(b.id.trim()));

  const optionalCourses = courses
    .filter(
      (c: Course) =>
        c.category === "Elective" &&
        c.year === yearNumber &&
        (!selectedType ||
          selectedType === "Optional" ||
          selectedType === "All"),
    )
    .sort((a: Course, b: Course) => a.id.trim().localeCompare(b.id.trim()));

  const [activeMainCourseId, setActiveMainCourseId] = useState<string>("");
  const [activeOptionalCourseId, setActiveOptionalCourseId] =
    useState<string>("");

  useEffect(() => {
    setActiveMainCourseId(mainCourses[0]?.id || "");
    setActiveOptionalCourseId(optionalCourses[0]?.id || "");
  }, [selectedYear, selectedType, courses]);

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
      <Navbar />

      <div className="flex-1 w-full flex flex-col">
        {/* Top Section: Search Bar & Filters */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col items-center">
          {/* Search Bar */}
          <CourseSearchBar />

          {/* Filters */}
          <div className="w-full max-w-2xl text-[#FCFC00] text-xs sm:text-sm mb-12 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p>Choose year to filter</p>
              <div className="flex flex-wrap gap-4 sm:gap-8">
                {["Year 1", "Year 2", "Year 3", "Year 4"].map((year) => (
                  <label
                    key={year}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="year"
                      value={year}
                      checked={selectedYear === year}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-3 h-3 appearance-none border border-[#FCFC00] rounded-full checked:bg-[#FCFC00]"
                    />
                    <span>{year}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p>Choose type of course to filter</p>
              <div className="flex flex-wrap gap-4 sm:gap-8">
                {["All", "Main", "Optional"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={selectedType === type}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-3 h-3 appearance-none border border-[#FCFC00] rounded-full checked:bg-[#FCFC00]"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Courses (Wider Container) */}
        <div className="w-full px-4 sm:px-6 lg:px-12 mx-auto flex flex-col gap-12 pb-20">
          {/* Main Course Section */}
          <section className="flex items-start flex-col w-full overflow-hidden">
            <h2 className="text-[#FCFC00] text-sm sm:text-base mb-6">
              Main course
            </h2>
            <h3 className="text-[#FCFC00] text-sm sm:text-base mb-6">
              {selectedYear}
            </h3>

            <div className="flex overflow-x-auto gap-6 sm:gap-8 w-full pb-6 pt-2 px-2 -mx-2 scrollbar-hide snap-x">
              {mainCourses.length > 0 ? (
                mainCourses.map((course: Course) => (
                  <div
                    key={course.id}
                    className="w-[250px] sm:w-[350px] snap-start flex-shrink-0"
                  >
                    <CourseCard
                      course={course}
                      isActive={activeMainCourseId === course.id}
                      onClick={() => setActiveMainCourseId(course.id)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-[#FCFC00]/70 text-sm py-4">
                  No main courses found for the selected filters.
                </p>
              )}
            </div>
          </section>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#FCFC00]/50 my-4"></div>

          {/* Optional Course Section */}
          <section className="flex items-start flex-col w-full overflow-hidden">
            <h2 className="text-[#FCFC00] text-sm sm:text-base mb-6">
              Optional course
            </h2>

            <div className="flex overflow-x-auto gap-6 sm:gap-8 w-full pb-6 pt-2 px-2 -mx-2 scrollbar-hide snap-x">
              {optionalCourses.length > 0 ? (
                optionalCourses.map((course: Course) => (
                  <div
                    key={course.id}
                    className="w-[250px] sm:w-[350px] snap-start flex-shrink-0"
                  >
                    <CourseCard
                      course={course}
                      isActive={activeOptionalCourseId === course.id}
                      onClick={() => setActiveOptionalCourseId(course.id)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-[#FCFC00]/70 text-sm py-4">
                  No optional courses found for the selected filters.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

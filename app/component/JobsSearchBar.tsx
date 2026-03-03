import { Search } from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import { useState } from "react";
import type { Course } from "~/routes/models/Course";

export const JobsSearchBar = () => {
    const fetcher = useFetcher<{ courses: Course[] }>();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > 2) {
            fetcher.load(`/api/search-courses?search=${value}`);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelectCourse = (courseId: string) => {
        setShowDropdown(false);
        navigate(`/review/subjectReview/${courseId}`);
    };

    return (
        <div className="w-full max-w-2xl mb-12 relative z-50">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
                <input
                    type="text"
                    placeholder="Search jobs you interest"
                    onChange={handleSearchChange}
                    className="w-full bg-[#000B72] border-2 border-[#000B72] rounded-full py-4 pl-12 pr-4 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 text-xs md:text-sm"
                />

                {/* Dropdown Results */}
                {showDropdown &&
                    fetcher.data?.courses &&
                    fetcher.data.courses.length > 0 && (
                        <div className="absolute w-full mt-2 bg-[#000B72] border-2 border-[#1BE1F3] rounded-xl overflow-hidden shadow-lg max-h-60 overflow-y-auto">
                            {fetcher.data.courses.map((course) => (
                                <div
                                    key={course.id}
                                    onClick={() => handleSelectCourse(course.id)}
                                    className="px-4 py-3 hover:bg-[#1BE1F3] hover:text-black cursor-pointer text-xs md:text-sm border-b border-[#001dae] last:border-none transition-colors"
                                >
                                    <div className="font-bold">{course.id}</div>
                                    <div className="truncate">{course.nameEn}</div>
                                    <div className="text-[10px] opacity-80">{course.nameTh}</div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </div>
    );
};

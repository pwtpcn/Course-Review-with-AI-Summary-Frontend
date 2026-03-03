import { Search } from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import type { Course } from "~/routes/models/Course";

export const CourseSearchBar = () => {
  const fetcher = useFetcher<{ courses: Course[] }>();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const activeItem = dropdownRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (activeItem) {
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        if (itemRect.bottom > dropdownRect.bottom) {
          dropdownRef.current.scrollTop +=
            itemRect.bottom - dropdownRect.bottom;
        } else if (itemRect.top < dropdownRect.top) {
          dropdownRef.current.scrollTop -= dropdownRect.top - itemRect.top;
        }
      }
    }
  }, [selectedIndex]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSelectedIndex(-1);
    if (value.length > 2) {
      fetcher.load(`/api/search-courses?search=${value}`);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const courses = fetcher.data?.courses || [];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showDropdown && courses.length > 0) {
        setSelectedIndex((prev) =>
          prev < courses.length - 1 ? prev + 1 : prev,
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showDropdown && courses.length > 0) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && courses.length > 0) {
        if (selectedIndex >= 0 && selectedIndex < courses.length) {
          handleSelectCourse(courses[selectedIndex].id);
        } else {
          handleSelectCourse(courses[0].id);
        }
      }
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setShowDropdown(false);
    setSearchValue(""); // Clear input
    navigate(`/review/subjectReview/${courseId}`);
  };

  return (
    <div className="w-full max-w-2xl mb-12 relative z-50" ref={searchBarRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
        <input
          type="text"
          placeholder="Search subject (ID or Name)"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-[#000B72] border-2 border-[#000B72] rounded-full py-4 pl-12 pr-4 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 text-xs md:text-sm"
        />

        {/* Dropdown Results */}
        {showDropdown &&
          fetcher.data?.courses &&
          fetcher.data.courses.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute w-full mt-2 bg-[#000B72] border-2 border-[#1BE1F3] rounded-xl overflow-hidden shadow-lg max-h-60 overflow-y-auto"
            >
              {fetcher.data.courses.map((course, index) => (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-4 py-3 cursor-pointer text-xs md:text-sm border-b border-[#001dae] last:border-none transition-colors ${
                    selectedIndex === index
                      ? "bg-[#1BE1F3] text-black"
                      : "hover:bg-[#1BE1F3] hover:text-black"
                  }`}
                >
                  <div className="font-bold">{course.id}</div>
                  <div className="truncate">{course.nameEn}</div>
                  <div className="text-xs opacity-80 font-chakra-petch">
                    {course.nameTh}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

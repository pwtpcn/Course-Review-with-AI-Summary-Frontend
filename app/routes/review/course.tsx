import { Navbar } from "~/component/Navbar";
import { useState } from "react";
import { CourseSearchBar } from "~/component/CourseSearchBar";  

// Mock data based on the image
const mainCourses = [
    {
        id: "01417111",
        name: "Calculus 1",
        credit: 3,
        rating: 3,
    },
    {
        id: "01418111",
        name: "Introduction to Computer Science",
        credit: 2,
        rating: 4.5,
    },
    {
        id: "01418112",
        name: "Fundamental Programming Concepts",
        credit: 3,
        rating: 2,
    },
    {
        id: "01418113",
        name: "Computer Programming",
        credit: 3,
        rating: 4
    },
    {
        id: "01418231",
        name: "Data Structures and Algorithms",
        credit: 3,
        rating: 3.5
    }
];

const optionalCourses = [
    {
        id: "01418421",
        name: "User Experience and User Interface Design",
        credit: 3,
        rating: 4.8,
    },
    {
        id: "01418353",
        name: "Cloud Computing Concepts and Services",
        credit: 3,
        rating: 4.5,
    },
    {
        id: "01418363",
        name: "Natural Language Processing",
        credit: 3,
        rating: 4.2,
    },
    {
        id: "01418342",
        name: "Mobile Application Design and Development",
        credit: 3,
        rating: 3.6
    },
    {
        id: "01418472",
        name: "Integrated Agile Process and DevOps",
        credit: 3,
        rating: 4.5
    }
];

const CourseCard = ({ course, isActive, onClick }: { course: any, isActive?: boolean, onClick?: () => void }) => {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer bg-[#0010A5] rounded-xl p-4 sm:p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[250px] min-w-[250px] sm:min-w-[350px] relative w-full border transition-all duration-300 ${isActive ? "border-[#FCFC00] shadow-[0_0_15px_#FCFC00] scale-[1.02]" : "border-blue-500/30 hover:border-blue-400"
                }`}
        >
            <div>
                <h3 className="text-[#FCFC00] text-sm sm:text-base leading-normal mb-4 h-[7.5rem] sm:h-[8.5rem] line-clamp-4 overflow-hidden text-ellipsis">
                    {course.id} | {course.name}
                </h3>
                <p className="text-[#FCFC00] text-xs sm:text-sm">Credit : {course.credit}</p>
            </div>
            <div className="absolute right-4 bottom-4 flex items-center gap-2">
                <span className="text-[#FCFC00] text-xs sm:text-sm">rating {course.rating}/5</span>
                <span className="text-[#B91313] text-lg">♥</span>
            </div>
        </div>
    );
};

export default function JobsHome() {
    const [selectedYear, setSelectedYear] = useState<string>("Year 1");
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Default active courses are the first in the list
    const [activeMainCourseId, setActiveMainCourseId] = useState<string>(mainCourses[0].id);
    const [activeOptionalCourseId, setActiveOptionalCourseId] = useState<string>(optionalCourses[0].id);

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
                                    <label key={year} className="flex items-center gap-2 cursor-pointer">
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
                                {["Main", "Optional"].map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
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
                        <h2 className="text-[#FCFC00] text-sm sm:text-base mb-6">Main course</h2>
                        <h3 className="text-[#FCFC00] text-sm sm:text-base mb-6">{selectedYear}</h3>

                        <div className="flex overflow-x-auto gap-6 sm:gap-8 w-full pb-6 pt-2 px-2 -mx-2 scrollbar-hide snap-x">
                            {mainCourses.map(course => (
                                <div key={course.id} className="w-[250px] sm:w-[350px] snap-start flex-shrink-0">
                                    <CourseCard
                                        course={course}
                                        isActive={activeMainCourseId === course.id}
                                        onClick={() => setActiveMainCourseId(course.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-[#FCFC00]/50 my-4"></div>

                    {/* Optional Course Section */}
                    <section className="flex items-start flex-col w-full overflow-hidden">
                        <h2 className="text-[#FCFC00] text-sm sm:text-base mb-6">Optional course</h2>

                        <div className="flex overflow-x-auto gap-6 sm:gap-8 w-full pb-6 pt-2 px-2 -mx-2 scrollbar-hide snap-x">
                            {optionalCourses.map(course => (
                                <div key={course.id} className="w-[250px] sm:w-[350px] snap-start flex-shrink-0">
                                    <CourseCard
                                        course={course}
                                        isActive={activeOptionalCourseId === course.id}
                                        onClick={() => setActiveOptionalCourseId(course.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

            </div>
        </div >
    );
}

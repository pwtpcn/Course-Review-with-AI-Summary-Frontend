import { Navbar } from "~/component/Navbar";
import { Search } from "lucide-react";
import { SubjectReviewList } from "~/component/SubjectReviewList";
import { NavLink } from "react-router";

// Mock Data
const subjectData = {
    code: "01418490",
    name: "Cooperative Education",
    description: "Course Description :",
    aiSummary: {
        content: "Content summary...",
        hardLevel: "Medium",
        prepare: "Read textbook",
        pros: "Good experience",
        cons: "Time consuming"
    },
    reviews: [
        {
            id: 1,
            content: "Great course!",
            hardLevel: "Easy",
            prepare: "Just study",
            pros: "Fun",
            cons: "None"
        }
    ]
};

export default function SubjectReview() {
    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
            <Navbar />

            <div className="flex-1 px-4 py-8 flex flex-col items-center w-full max-w-6xl mx-auto">
                {/* Search Bar */}
                <div className="w-full max-w-2xl mb-12 relative">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
                        <input
                            type="text"
                            placeholder="Search subject"
                            className="w-full bg-[#000B72] border-2 border-[#000B72] rounded-full py-4 pl-12 pr-4 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 text-xs md:text-sm"
                        />
                    </div>
                </div>

                {/* Subject Header */}
                <div className="w-full mb-8 text-[#FCFC00]">
                    <h1 className="text-sm md:text-base mb-4 leading-relaxed">
                        {subjectData.code} | {subjectData.name}
                    </h1>
                    <p className="text-xs md:text-sm mb-6">
                        {subjectData.description}
                    </p>


                    <NavLink to="/review/writereview">
                        <button className="btn-auth-write-review btn-auth-write-review:hover text-white py-3 px-6 rounded-lg h-15 w-100 text-xs md:text-sm transition-colors mb-12">
                            Write your review
                        </button>
                    </NavLink>
                </div>

                {/* AI Summary Card */}
                <div className="w-full">
                    <h2 className="text-[#FCFC00] mb-6 md:text-base text-sm">Review Summarize by AI</h2>
                </div>
                <div className="w-full mb-12 border-3 border-[#001dae] p-4 relative">
                    <div className="btn-ai-summarize-cards p-6 text-[#FCFC00] text-[10px] md:text-sm leading-loose">

                        <div className="grid gap-4">
                            <div>Content : <span className="text-white">{subjectData.aiSummary.content}</span></div>
                            <div>Hard level : <span className="text-white">{subjectData.aiSummary.hardLevel}</span></div>
                            <div>How to prepare for test ? : <span className="text-white">{subjectData.aiSummary.prepare}</span></div>
                            <div>Pros. : <span className="text-white">{subjectData.aiSummary.pros}</span></div>
                            <div>Cons. : <span className="text-white">{subjectData.aiSummary.cons}</span></div>
                        </div>
                    </div>
                </div>

                {/* All Reviews Section */}
                <SubjectReviewList reviews={subjectData.reviews} />

            </div>
        </div>
    );
}
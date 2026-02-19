import { Navbar } from "~/component/Navbar";
import { SubjectReviewList } from "~/component/SubjectReviewList";
import { NavLink, useLoaderData, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { CourseRepositories } from "../repositories/CourseRepositories";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { CourseSearchBar } from "~/component/CourseSearchBar";
import { ConfirmPopup } from "~/component/ConfirmPopup";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const courseId = params.courseId;
    if (!courseId) {
        throw new Response("Course ID Not Found", { status: 404 });
    }

    const courseRepository = new CourseRepositories();
    const reviewRepository = new ReviewRepositories();

    const course = await courseRepository.GetCourseById(courseId);
    const reviews = await reviewRepository.GetReviewByCourseId(
        courseId,
        "newest",
    );

    if (!course) {
        throw new Response("Course Not Found", { status: 404 });
    }

    return { course, reviews: reviews || [] };
};

export default function SubjectReview() {
    const { course, reviews } = useLoaderData<typeof loader>();
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.reviewSubmitted) {
            setShowConfirm(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
            <Navbar />

            <div className="flex-1 px-4 py-8 flex flex-col items-center w-full max-w-6xl mx-auto">
                {/* Search Bar */}
                <CourseSearchBar />

                {/* Subject Header */}
                <div className="w-full mb-8 text-[#FCFC00]">
                    <h1 className="text-sm md:text-base mb-4 leading-relaxed">
                        {course.id} | {course.nameEn}
                    </h1>
                    <p className="text-xs md:text-sm mb-6">
                        {course.description || "No description available."}
                    </p>

                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className="btn-auth-write-review btn-auth-write-review:hover text-white py-3 px-6 rounded-lg h-15 w-100 text-xs md:text-sm transition-colors mb-12">
                        Write your review
                    </button>
                </div>

                {/* AI Summary Card*/}
                <div className="w-full">
                    <h2 className="text-[#FCFC00] mb-6 md:text-base text-sm">
                        Review Summarize by AI
                    </h2>
                </div>
                <div className="w-full mb-12 border-3 border-[#001dae] p-4 relative">
                    <div className="btn-ai-summarize-cards p-6 text-[#FCFC00] text-[10px] md:text-sm leading-loose">
                        <div className="grid gap-4">
                            <div className="text-center text-gray-400">
                                AI Summary coming soon...
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="w-full">
          <h2 className="text-[#FCFC00] mb-6 md:text-base text-sm">
            Review Summarize by AI
          </h2>
        </div>
        <div className="w-full mb-12 border-3 border-[#001dae] p-4 relative">
          <div className="btn-ai-summarize-cards p-6 text-[#FCFC00] text-[10px] md:text-sm leading-loose">
            <div className="grid gap-4">
              <div>
                Content :{" "}
                <span className="text-white">
                  {subjectData.aiSummary.content}
                </span>
              </div>
              <div>
                Hard level :{" "}
                <span className="text-white">
                  {subjectData.aiSummary.hardLevel}
                </span>
              </div>
              <div>
                How to prepare for test ? :{" "}
                <span className="text-white">
                  {subjectData.aiSummary.prepare}
                </span>
              </div>
              <div>
                Pros. :{" "}
                <span className="text-white">{subjectData.aiSummary.pros}</span>
              </div>
              <div>
                Cons. :{" "}
                <span className="text-white">{subjectData.aiSummary.cons}</span>
              </div>
            </div>
          </div>
        </div> */}

                {/* All Reviews Section */}
                <SubjectReviewList reviews={reviews} />

                {/* Reviews List */}
                {/* <div className="w-full pb-20">
          {reviews &&
            reviews.map((review: Review) => (
              <ReviewCard key={review.id} data={review} />
            ))}
        </div> */}

                {/* confirm Popup */}
                {/* confirm Popup */}
                <ConfirmPopup isOpen={showConfirm} onClose={() => setShowConfirm(false)} />
            </div>
        </div>
    );
}

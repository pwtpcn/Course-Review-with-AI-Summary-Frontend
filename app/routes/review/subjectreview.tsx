import { Navbar } from "~/component/Navbar";
import { SubjectReviewList } from "~/component/SubjectReviewList";
import ScrollToTopButton from "~/component/ScrollToTopButton";
import {
  NavLink,
  useLoaderData,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import { useState, useEffect, useRef } from "react";
import type { LoaderFunctionArgs } from "react-router";
import type { ReviewSummary } from "../models/Review";
import { CourseRepositories } from "../repositories/CourseRepositories";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { CourseSearchBar } from "~/component/CourseSearchBar";
import { ConfirmPopup } from "~/component/ConfirmPopup";
import type { User } from "../models/User";
import { AIRepositories } from "../repositories/AIRepositories";
import {
  AISummaryCard,
  AISummaryCardSkeleton,
} from "~/component/AISummaryCard";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const courseId = params.courseId;
  if (!courseId) {
    throw new Response("Course ID Not Found", { status: 404 });
  }

  const courseRepository = new CourseRepositories();
  const reviewRepository = new ReviewRepositories();

  const [course, reviews] = await Promise.all([
    courseRepository.GetCourseById(courseId),
    reviewRepository.GetReviewByCourseId(courseId, "newest"),
  ]);

  if (!course) {
    throw new Response("Course Not Found", { status: 404 });
  }

  return { course, reviews: reviews || [] };
};

export default function SubjectReview() {
  const { course, reviews } = useLoaderData<typeof loader>();
  const [aiSummary, setAiSummary] = useState<ReviewSummary | null | undefined>(
    undefined,
  );
  const aiSummaryFetched = useRef<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();
  const rootData = useRouteLoaderData("root") as
    | { user: User | null }
    | undefined;
  const user = rootData?.user;

  useEffect(() => {
    if (aiSummaryFetched.current === course.id) return;
    aiSummaryFetched.current = course.id;

    const aiRepository = new AIRepositories();

    aiRepository
      .GetAISummary(course.id)
      .then((summary) => {
        setAiSummary(summary);
      })
      .catch((error) => {
        console.error("Failed to fetch AI summary in useEffect:", error);
        setAiSummary(null);
      });
  }, [course.id]);

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
          <p className="text-xs md:text-sm mb-6 font-chakra-petch">
            {course.description || "No description available."}
          </p>

          {user ? (
            <NavLink to={`/review/writeReview/${course.id}`}>
              <button
                type="button"
                className="btn-auth-write-review btn-auth-write-review:hover text-white py-3 px-6 rounded-lg h-15 w-100 text-xs md:text-sm transition-colors mb-12"
              >
                Write your review
              </button>
            </NavLink>
          ) : (
            <button
              type="button"
              disabled
              className="btn-auth-write-review opacity-50 cursor-not-allowed text-white py-3 px-6 rounded-lg h-15 w-100 text-xs md:text-sm mb-12"
            >
              Write your review
            </button>
          )}
        </div>

        {aiSummary === undefined ? (
          <AISummaryCardSkeleton />
        ) : (
          <AISummaryCard aiSummary={aiSummary} rating={course.rating} />
        )}

        {/* All Reviews Section */}
        <SubjectReviewList reviews={reviews} />

        {/* confirm Popup */}
        <ConfirmPopup
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
        />
        <ScrollToTopButton />
      </div>
    </div>
  );
}

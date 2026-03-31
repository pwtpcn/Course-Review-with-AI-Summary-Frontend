import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { NavLink, useFetcher, useLoaderData, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { redirect } from "react-router";
import { Heart } from "lucide-react";
import { CourseRepositories } from "../repositories/CourseRepositories";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { requireUser, getAccessToken } from "../../lib/auth";
import type { UpdateReview } from "../models/Review";
import { CautionPopup } from "~/component/CautionPopup";
import { ratingLabels } from "../models/Rating-lable";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  const reviewId = params.reviewId;
  if (!reviewId) {
    throw new Response("Review ID Not Found", { status: 404 });
  }

  const courseRepository = new CourseRepositories();
  const reviewRepository = new ReviewRepositories();

  const review = await reviewRepository.GetReviewById(reviewId);

  if (!review) {
    throw new Response("Review Not Found", { status: 404 });
  }

  // Ensure user owns this review
  if (review.userId !== user.id) {
    throw new Response("Forbidden", { status: 403 });
  }

  const course = await courseRepository.GetCourseById(review.courseId);

  if (!course) {
    throw new Response("Course Not Found", { status: 404 });
  }

  if (review.isEdited) {
    throw new Response("Review has already been edited", { status: 403 });
  }

  return { review };
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  const accessToken = getAccessToken(request) || "";
  const reviewId = params.reviewId;
  if (!reviewId) {
    return {
      message: "Review ID missing",
      error: "Review ID missing",
      data: null,
    };
  }

  const reviewRepository = new ReviewRepositories();
  const existingReview = await reviewRepository.GetReviewById(reviewId);

  if (!existingReview) {
    return {
      message: "Original review not found",
      error: "Review not found",
      data: null,
    };
  }

  // Ensure user owns this review before updating
  if (existingReview.userId !== user.id) {
    return {
      message: "Forbidden",
      error: "Forbidden",
      data: null,
    };
  }

  const formData = await request.formData();
  const content = formData.get("content") as string;
  const prepare = (formData.get("prepare") as string) || "-";
  const pros = formData.get("pros") as string;
  const cons = (formData.get("cons") as string) || "-";
  const hardLevel = formData.get("hardLevel");
  const rating = hardLevel ? Number(hardLevel) : 0;

  let errors: Record<string, string> = {};

  if (!content) {
    errors.content = "Content is required";
  } else if (errors.content && content.length > 0) {
    delete errors.content;
  }

  if (!rating) {
    errors.rating = "Rating is required";
  } else if (errors.rating && rating > 0) {
    delete errors.rating;
  }

  if (!pros) {
    errors.pros = "Pros is required";
  } else if (errors.pros && pros.length > 0) {
    delete errors.pros;
  }

  if (Object.keys(errors).length > 0) {
    return {
      message: "Validation error",
      error: errors,
      data: null,
    };
  }

  const reviewRepositoryInput = new ReviewRepositories();
  const updatedReviewData: UpdateReview = {
    content: content,
    pros: pros,
    cons: cons,
    rating: rating,
    testPrepare: prepare,
  };

  const updatedReview = await reviewRepositoryInput.UpdateReview(
    existingReview.id,
    updatedReviewData,
    accessToken,
  );

  if (!updatedReview) {
    return {
      message: "Failed to update review",
      error: "Failed to update review",
      data: null,
    };
  }

  const courseRepo = new CourseRepositories();
  await courseRepo.RecalculateCourseRating(existingReview.courseId);

  return redirect("/user/profile");
};

export default function EditReview() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.error || {};

  const { review } = useLoaderData<typeof loader>();
  const [showRecheckedConfirm, setShowRecheckedConfirm] = useState(false);
  const navigate = useNavigate();

  const [rating, setRating] = useState(review.rating || 0);
  const [content, setContent] = useState(review.content || "");
  const [pros, setPros] = useState(review.pros || "");
  const [prepare, setPrepare] = useState(
    review.testPrepare && review.testPrepare !== "-" ? review.testPrepare : "",
  );
  const [cons, setCons] = useState(
    review.cons && review.cons !== "-" ? review.cons : "",
  );

  const isFormValid = content.length > 0 && pros.length > 0 && rating > 0;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && fetcher.data.error) {
      setShowRecheckedConfirm(false);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] flex flex-col items-center py-12 px-4 relative">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-[#FCFC00] text-xl md:text-3xl mb-4 ">
          Edit your review
        </h1>
        <p className="text-[#FCFC00] text-sm md:text-base">
          {review.courseId} | {review.course?.nameEn}
        </p>
      </div>

      <fetcher.Form method="post" className="w-full max-w-2xl space-y-8">
        {/* Content Field */}
        <div className="space-y-2">
          <label className="text-white text-s md:text-sm block">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={content}
            required
            placeholder="อธิบายประสบการณ์เรียนวิชานี้"
            maxLength={350}
            onChange={(e) => setContent(e.target.value)}
            className="font-chakra-petch w-full h-32 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-s leading-relaxed resize-y"
          />
          {errors.content && (
            <p className="text-red-500 text-xs">{errors.content}</p>
          )}
          <p
            className={`text-right text-xs font-chakra-petch ${content.length >= 350 ? "text-red-500" : "text-gray-500"}`}
          >
            {content.length}/350
          </p>
        </div>

        {/* Hard Level (Hearts) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-s md:text-sm">
            <span className="text-white">
              Hard level <span className="text-red-500">*</span>
            </span>
            <span className="text-gray-400 text-[10px]">
              ( <span className="text-red-500">♥</span> = {rating > 0 ? ratingLabels[rating] : "easy"} )
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transform hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-6 h-6 ${
                    star <= rating
                      ? "fill-red-600 text-red-600"
                      : "text-red-600"
                  }`}
                />
              </button>
            ))}
            <input type="hidden" name="hardLevel" value={rating} />
          </div>
        </div>

        {/* How to prepare Field */}
        <div className="space-y-2">
          <label className="text-white text-s md:text-sm block">
            How to prepare for test ? <span className="text-[#A2A2A2] text-xs font-normal">(optional)</span>
          </label>
          <textarea
            name="prepare"
            value={prepare}
            placeholder="แนะนำวิธีการเตรียมตัวสอบ"
            maxLength={350}
            onChange={(e) => setPrepare(e.target.value)}
            className="font-chakra-petch w-full h-24 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-s leading-relaxed resize-y"
          />
          <p
            className={`text-right text-xs font-chakra-petch ${prepare.length >= 350 ? "text-red-500" : "text-gray-500"}`}
          >
            {prepare.length}/350
          </p>
        </div>

        {/* Pros Field */}
        <div className="space-y-2">
          <label className="text-white text-s md:text-sm block">
            Pros <span className="text-red-500">*</span>
          </label>
          <textarea
            name="pros"
            value={pros}
            required
            placeholder="ข้อดีของวิชานี้"
            maxLength={350}
            onChange={(e) => setPros(e.target.value)}
            className="font-chakra-petch w-full h-24 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-s leading-relaxed resize-y"
          />
          {errors.pros && <p className="text-red-500 text-xs">{errors.pros}</p>}
          <p
            className={`text-right text-xs font-chakra-petch ${pros.length >= 350 ? "text-red-500" : "text-gray-500"}`}
          >
            {pros.length}/350
          </p>
        </div>

        {/* Cons Field */}
        <div className="space-y-2">
          <label className="text-white text-s md:text-sm block">
            Cons <span className="text-[#A2A2A2] text-xs font-normal">(optional)</span>
          </label>
          <textarea
            name="cons"
            value={cons}
            placeholder="ข้อเสียของวิชานี้"
            maxLength={350}
            onChange={(e) => setCons(e.target.value)}
            className="font-chakra-petch w-full h-24 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-s leading-relaxed resize-y"
          />
          <p
            className={`text-right text-xs font-chakra-petch ${cons.length >= 350 ? "text-red-500" : "text-gray-500"}`}
          >
            {cons.length}/350
          </p>
        </div>

        <p className="text-[#FCFC00] text-[14px] pt-4">
          Caution! : You can only edit this review one time, please recheck your review again before save
        </p>

        {/* Buttons */}
        <div className="flex justify-between pt-8">
          <NavLink to={`/user/profile`}>
            <button
              type="button"
              className="btn-cancel-review btn-cancel-review:hover text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase"
            >
              Cancel
            </button>
          </NavLink>

          <button
            type="button"
            disabled={!isFormValid}
            onClick={() => setShowRecheckedConfirm(true)}
            className={`btn-submit-review text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase
                ${
                  isFormValid
                    ? "btn-submit-review:hover"
                    : "opacity-50 cursor-not-allowed"
                }`}
          >
            Save
          </button>
        </div>

        {/* Re confirm Popup */}
        <CautionPopup
          isOpen={showRecheckedConfirm}
          onClose={() => setShowRecheckedConfirm(false)}
          isSubmitting={fetcher.state !== "idle"}
          message="You can only edit this review one time"
        />
      </fetcher.Form>
    </div>
  );
}

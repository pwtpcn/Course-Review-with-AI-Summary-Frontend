import type { ActionFunctionArgs } from "react-router";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { CourseRepositories } from "../repositories/CourseRepositories";
import { getAccessToken } from "~/lib/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return Response.json(
      { error: "Unauthorized. Please log in first." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const reviewId = formData.get("reviewId") as string;

  if (!reviewId) {
    return Response.json({ error: "Review ID is required" }, { status: 400 });
  }

  const reviewRepository = new ReviewRepositories();
  const courseRepository = new CourseRepositories();
  try {
    const review = await reviewRepository.GetReviewById(reviewId);
    if (!review) {
      return Response.json({ error: "Review not found" }, { status: 404 });
    }

    const success = await reviewRepository.DeleteReview(reviewId, accessToken);
    if (!success) {
      throw new Error("Failed to delete review");
    }

    await courseRepository.RecalculateCourseRating(review.courseId);

    return Response.json({ success: true, action: "delete" });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to delete review" },
      { status: 500 },
    );
  }
};

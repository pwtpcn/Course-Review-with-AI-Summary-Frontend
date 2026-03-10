import type { ActionFunctionArgs } from "react-router";
import { ReviewRepositories } from "../repositories/ReviewRepositories";

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  let accessToken = "";

  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      }),
    );
    accessToken = cookies["access_token"] || "";
  }

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
  try {
    const success = await reviewRepository.DeleteReview(reviewId, accessToken);
    if (!success) {
      throw new Error("Failed to delete review");
    }
    return Response.json({ success: true, action: "delete" });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to delete review" },
      { status: 500 },
    );
  }
};

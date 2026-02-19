import type { CreateReview, Review } from "../models/Review";

export class ReviewRepositories {
  public async GetAllReviews(
    sortBy?: "newest" | "oldest",
    includeHidden = "false",
  ): Promise<Review[] | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    const queryParams = new URLSearchParams();

    if (sortBy) queryParams.append("sortBy", sortBy);
    if (includeHidden) queryParams.append("includeHidden", includeHidden);

    try {
      const res = await fetch(
        `${BACKEND_URL}/review/getall?${queryParams.toString()}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await res.json();
      return data.reviews;
    } catch (e) {
      console.error("Failed to fetch reviews:", e);
      return null;
    }
  }

  public async GetReviewByCourseId(
    courseId: string,
    sortBy?: "newest" | "oldest",
    includeHidden = "false",
  ): Promise<Review[] | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    const queryParams = new URLSearchParams();

    if (sortBy) queryParams.append("sortBy", sortBy);
    if (includeHidden) queryParams.append("includeHidden", includeHidden);

    try {
      const res = await fetch(
        `${BACKEND_URL}/review/getbycourseid/${courseId}?${queryParams.toString()}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await res.json();
      return data.reviews;
    } catch (e) {
      console.error("Failed to fetch reviews:", e);
      return null;
    }
  }

  public async CreateReview(
    newReview: CreateReview,
    accessToken: string,
  ): Promise<Review | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/review/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) {
        throw new Error("Failed to create review");
      }
      const data = await res.json();
      return data.review;
    } catch (e) {
      console.error("Failed to create review:", e);
      return null;
    }
  }
}

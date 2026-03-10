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

  public async GetReviewById(id: string): Promise<Review | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/review/getbyid/${id}`);
      if (!res.ok) {
        const errText = await res.text();
        console.error(
          "Backend error text for getbyid:",
          errText,
          "Status:",
          res.status,
        );
        throw new Error("Failed to fetch review");
      }
      const data = await res.json();
      return data.review;
    } catch (e) {
      console.error("Failed to fetch review:", e);
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

  public async GetReviewByUserId(
    userId: string,
    sortBy?: "newest" | "oldest",
    includeHidden = "false",
  ): Promise<Review[] | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    const queryParams = new URLSearchParams();

    if (sortBy) queryParams.append("sortBy", sortBy);
    if (includeHidden) queryParams.append("includeHidden", includeHidden);

    try {
      const res = await fetch(
        `${BACKEND_URL}/review/getbyuserid/${userId}?${queryParams.toString()}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch user's reviews");
      }
      const data = await res.json();
      return data.reviews;
    } catch (e) {
      console.error("Failed to fetch user's reviews:", e);
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

  public async UpdateReview(
    id: string,
    updatedReview: Partial<CreateReview>,
    accessToken: string,
  ): Promise<Review | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/review/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReview),
      });
      if (!res.ok) {
        throw new Error("Failed to update review");
      }
      const data = await res.json();
      return data.review;
    } catch (e) {
      console.error("Failed to update review:", e);
      return null;
    }
  }

  public async DeleteReview(id: string, accessToken: string): Promise<boolean> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/review/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete review");
      }
      return true;
    } catch (e) {
      console.error("Failed to delete review:", e);
      return false;
    }
  }
}

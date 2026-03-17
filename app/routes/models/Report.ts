import type { User } from "./User";
import type { Review } from "./Review";

export interface Report {
    id: string;
    content: string;
    reason: "spam" | "inappropriate" | "irrelevant" | "other";
    status: "pending" | "rejected" | "approved";
    userId: string;
    user?: User;
    reviewId: string;
    review?: Review;
    createdAt: string;
    updatedAt: string;
}

export interface ReportFilter {
    search?: string;
    status?: "pending" | "approved" | "rejected";
    reason?: "spam" | "inappropriate" | "irrelevant" | "other";
    sortBy?: "newest" | "oldest";
}

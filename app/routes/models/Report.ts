export interface Report {
    id: string;
    content: string;
    reason: "spam" | "inappropriate" | "irrelevant" | "other";
    status: "pending" | "rejected" | "approved";
    userId: string;
    reviewId: string;
    createdAt: string;
    updatedAt: string;
}

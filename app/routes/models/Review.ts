import type { Course } from "./Course";
import type { User } from "./User";

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  content: string;
  pros: string;
  cons?: string;
  rating: number;
  testPrepare?: string;
  like: number;
  dislike: number;
  isEdited: boolean;
  status: "active" | "hidden";
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  course?: Course;
  reports?: any[];
  reactions?: { userId: string; type: "like" | "dislike" }[];
}

export interface CreateReview {
  courseId: string;
  content: string;
  pros: string;
  cons?: string;
  rating: number;
  testPrepare?: string;
}

export type UpdateReview = Omit<CreateReview, "courseId">;

export interface ReviewSummary {
  content: string;
  pros: string[];
  cons?: string[];
  testPrepare?: string[];
  note?: string;
}

export interface ReviewFilter {
  search?: string;
  status?: "active" | "hidden";
  sortBy?: "newest" | "oldest";
}
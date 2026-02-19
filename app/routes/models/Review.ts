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
}

export interface CreateReview{
  courseId: string;
  content: string;
  pros: string;
  cons?: string;
  rating: number;
  testPrepare?: string;
}
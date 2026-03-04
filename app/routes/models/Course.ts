export interface Course {
  id: string;
  nameTh: string;
  nameEn: string;
  description: string;
  credits: number;
  year: number;
  category: "Core" | "Elective";
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateCourse = Partial<
  Omit<Course, "id" | "createdAt" | "updatedAt">
>;

export interface CourseFilter {
  search?: string;
  category?: "Core" | "Elective";
  year?: number;
  sortBy?: "newest" | "oldest";
}
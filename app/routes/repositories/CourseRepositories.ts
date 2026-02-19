import type { Course, CourseFilter } from "../models/Course";

export class CourseRepositories {
  public async CreateCourse(course: Course) {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/course/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      if (!res.ok) {
        throw new Error("Failed to create course");
      }
      const data = await res.json();
      return data.course;
    } catch (e) {
      console.error("Failed to create course:", e);
      return null;
    }
  }

  public async GetAllCourses(filter?: CourseFilter) {
    const BACKEND_URL = process.env.BACKEND_URL;
    const queryParams = new URLSearchParams();

    if (filter?.sortBy) queryParams.append("sortBy", filter.sortBy);
    if (filter?.category) queryParams.append("category", filter.category);
    if (filter?.year) queryParams.append("year", filter.year.toString());
    if (filter?.search) queryParams.append("search", filter.search);

    try {
      const res = await fetch(
        `${BACKEND_URL}/course/getall?${queryParams.toString()}`,
      );
      if (!res.ok) {
        console.error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
        throw new Error("Failed to fetch courses");
      }
      const data = await res.json();
      return data.courses;
    } catch (e) {
      console.error("Failed to fetch courses:", e);
      return null;
    }
  }

  public async GetCourseById(id: string) {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/course/getbyid/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch course");
      }
      const data = await res.json();
      return data.course;
    } catch (e) {
      console.error("Failed to fetch course:", e);
      return null;
    }
  }

  public async UpdateCourse(id: string, course: Course) {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/course/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      if (!res.ok) {
        throw new Error("Failed to update course");
      }
      const data = await res.json();
      return data.course;
    } catch (e) {
      console.error("Failed to update course:", e);
      return null;
    }
  }

  public async DeleteCourse(id: string) {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/course/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete course");
      }
      const data = await res.json();
      return data.course;
    } catch (e) {
      console.error("Failed to delete course:", e);
      return null;
    }
  }
}

import { type LoaderFunctionArgs } from "react-router";
import { CourseRepositories } from "../repositories/CourseRepositories";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  if (!search) {
    return { courses: [] };
  }

  const courseRepository = new CourseRepositories();
  const courses = await courseRepository.GetAllCourses({ search });

  return { courses: courses || [] };
};

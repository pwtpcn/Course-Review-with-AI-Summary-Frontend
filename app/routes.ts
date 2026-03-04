import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  //สร้างหน้าใหม่แล้วมาเพิ่ม route ที่นี่
  index("routes/home.tsx"),

  //Overall
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/jobs", "routes/jobs.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/course", "routes/review/course.tsx"),

  //Review
  route("/review", "routes/review/review.tsx"),
  route("/review/subjectReview/:courseId", "routes/review/subjectreview.tsx"),
  route("/review/writeReview/:courseId", "routes/review/writereview.tsx"),
  route("/review/editReview/:courseId", "routes/review/editReview.tsx"),

  //API
  route("/api/search-courses", "routes/api/search-courses.ts"),

  //User
  route("/user/profile", "routes/user/profile.tsx"),

  //Admin
  route("/admin/courseManage", "routes/admin/courseManage.tsx"),
  route("/admin/jobsManage", "routes/admin/jobsManage.tsx"),
  route("/admin/ManageReport", "routes/admin/ManageReport.tsx"),
  route("/admin/addCourse", "routes/admin/addCourse.tsx"),
  route("/admin/addJob", "routes/admin/addJob.tsx"),
] satisfies RouteConfig;

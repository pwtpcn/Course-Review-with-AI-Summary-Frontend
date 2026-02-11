import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    //สร้างหน้าใหม่แล้วมาเพิ่ม route ที่นี่
    index("routes/home.tsx"),

    //Overall
    route("/login", "routes/login.tsx"),
    route("/jobs", "routes/jobs.tsx"),

    //Review
    route("/review", "routes/review/review.tsx"),

    //User
    // route("userpage1", "routes/user/userpage1.tsx"),

    //Admin
    // route("adminpage1", "routes/admin/adminpage1.tsx"),
] satisfies RouteConfig;

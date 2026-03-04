import { NavLink, useRouteLoaderData, useFetcher } from "react-router";

export function AdminNavBar() {
  const data = useRouteLoaderData("root");
  const user = data?.user;
  const fetcher = useFetcher();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition-all hover:underline decoration-1 underline-offset-7 ${isActive ? "underline decoration-1 underline-offset-7" : ""}`;

  return (
    <nav className="w-full p-6 flex justify-between items-center text-[10px] md:text-xs z-50 uppercase tracking-widest font-['Press_Start_2P']">
      <div className="text-[#FCFC00] font-bold">
        {user ? user.username : "Admin"}
      </div>

      <div className="flex items-center gap-6 md:gap-18">
        <NavLink to="/admin/courseManage" className={linkClasses} end>
          Course
        </NavLink>
        <NavLink to="/admin/jobsManage" className={linkClasses}>
          Jobs
        </NavLink>
        <NavLink to="/admin/ManageReport" className={linkClasses}>
          Report
        </NavLink>
        <nav className="gap-5 flex">
          {user ? (
            <fetcher.Form method="post" action="/logout">
              <button
                type="submit"
                className="btn-auth-login uppercase md:text-xs z-20 text-lg px-6 py-2 hover:scale-105 transition-all duration-200 btn-auth-login:hover h-10"
              >
                Log out
              </button>
            </fetcher.Form>
          ) : (
            <>
              <NavLink to="/login">
                <button className="btn-auth-login uppercase md:text-xs z-20 text-lg px-6 py-2 hover:scale-105 transition-all duration-200 btn-auth-login:hover h-10">
                  Log in
                </button>
              </NavLink>
              <NavLink to="/signup">
                <button className="btn-auth-signup uppercase md:text-xs z-20 text-lg px-6 py-2 hover:scale-105 transition-all duration-200 btn-auth-signup:hover h-10">
                  Sign up
                </button>
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </nav>
  );
}
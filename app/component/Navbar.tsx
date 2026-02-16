import { NavLink } from "react-router";

export function Navbar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition-all hover:underline decoration-1 underline-offset-7 ${isActive ? "underline decoration-1 underline-offset-7" : ""}`;

  return (
    <nav className="w-full p-6 flex justify-between items-center text-[10px] md:text-xs z-50 uppercase tracking-widest font-['Press_Start_2P']">
      <div className="text-[#FCFC00] font-bold">
        Username
      </div>

      <div className="flex items-center gap-6 md:gap-18">
        <NavLink to="/" className={linkClasses} end>
          Home
        </NavLink>
        <NavLink to="/review" className={linkClasses}>
          Review
        </NavLink>
        <NavLink to="/jobs" className={linkClasses}>
          Jobs
        </NavLink>
        <nav className="gap-5 flex">
          <NavLink to="/login">
            <button className="btn-auth-login uppercase md:text-xs z-20 text-lg md:text-xl px-6 py-2 hover:scale-105 transition-all duration-200 btn-auth-login:hover h-10">
              Log in
            </button>
          </NavLink>
          <NavLink to="/signup">
            <button className="btn-auth-signup uppercase md:text-xs z-20 text-lg md:text-xl px-6 py-2 hover:scale-105 transition-all duration-200 btn-auth-signup:hover h-10">
              Sign up
            </button>
          </NavLink>
        </nav>
      </div>
    </nav>
  );
}

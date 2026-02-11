import { NavLink } from "react-router";

export function Navbar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition-all hover:underline decoration-1 underline-offset-7 ${isActive ? "underline decoration-1 underline-offset-7" : ""}`;

  return (
    <nav className="w-full p-6 flex justify-end items-center gap-6 md:gap-20 text-[10px] md:text-xs z-50 uppercase tracking-widest">
      <NavLink to="/" className={linkClasses} end>
        Home
      </NavLink>
      <NavLink to="/review" className={linkClasses}>
        Review
      </NavLink>
      <NavLink to="/jobs" className={linkClasses}>
        Jobs
      </NavLink>
      <NavLink to="/login">
        <button className="btn-auth uppercase md:text-xs z-20 text-lg md:text-xl px-6 py-2 hover:scale-105 transition-all duration-200 hover:bg-white hover:text-[#0016D8] border border-transparent hover:border-[#0016D8]">
          Sign in
        </button>
      </NavLink>
    </nav>
  );
}

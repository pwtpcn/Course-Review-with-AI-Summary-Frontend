import { useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useRouteLoaderData, useFetcher } from "react-router";
import { ArrowLeftRight, Menu, X } from "lucide-react";

export function AdminNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const data = useRouteLoaderData("root");
  const user = data?.user;
  const fetcher = useFetcher();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `transition-all hover:underline decoration-1 underline-offset-7 ${isActive ? "underline decoration-1 underline-offset-7" : ""}`;

  return (
    <nav 
      className="w-full p-4 md:p-6 text-[10px] md:text-xs uppercase tracking-widest font-['Press_Start_2P'] sticky top-0 bg-black/95 backdrop-blur-md border-b border-[#1BE1F3]/20"
      style={{ zIndex: 100 }}
    >
      <div className="flex justify-between items-center w-full">
        
        {/* LEFT SECTION: Hamburger + Username */}
        <div className="flex items-center gap-2 md:gap-4 text-[#FCFC00] font-bold">
          <button 
            className="lg:hidden text-white hover:text-cyan-400 transition-colors" 
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2 md:gap-4 lg:ml-0">
            <span className="cursor-default">{user ? user.username : "Admin"}</span>
            {user?.role === "admin" && (
              <NavLink 
                to="/" 
                className="flex items-center gap-1 md:gap-2 text-white/70 hover:text-white transition-colors bg-white/10 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px]"
                title="Switch to User View"
              >
                ADMIN <ArrowLeftRight size={10} className="md:w-3 md:h-3" /> USER
              </NavLink>
            )}
          </div>
        </div>

        {/* CENTER SECTION: Links (Desktop) */}
        <div className="hidden lg:flex flex-row items-center justify-center gap-6 xl:gap-18">
          <NavLink to="/admin/dashboard" className={linkClasses}>Dashboard</NavLink>
          <NavLink to="/admin/reviewManage" className={linkClasses}>Review</NavLink>
          <NavLink to="/admin/courseManage" className={linkClasses} end>Course</NavLink>
          <NavLink to="/admin/jobsManage" className={linkClasses}>Jobs</NavLink>
          <NavLink to="/admin/ManageReport" className={linkClasses}>Report</NavLink>
        </div>

        {/* RIGHT SECTION: Auth */}
        <div className="flex items-center gap-2 md:gap-5 justify-end">
          {user ? (
            <fetcher.Form method="post" action="/logout">
              <button
                type="submit"
                className="btn-auth-login uppercase text-[8px] md:text-[10px] lg:text-xs z-20 px-2 py-1.5 md:px-6 md:py-2 hover:scale-105 transition-all duration-200 h-8 md:h-10 flex items-center justify-center"
              >
                Log out
              </button>
            </fetcher.Form>
          ) : (
            <div className="flex gap-2">
              <NavLink to="/login">
                <button className="btn-auth-login uppercase text-[8px] md:text-[10px] lg:text-xs z-20 px-2 py-1.5 md:px-6 md:py-2 hover:scale-105 transition-all duration-200 h-8 md:h-10 flex items-center justify-center">
                  Log in
                </button>
              </NavLink>
              <NavLink to="/signup">
                <button className="btn-auth-signup uppercase text-[8px] md:text-[10px] lg:text-xs z-20 px-2 py-1.5 md:px-6 md:py-2 hover:scale-105 transition-all duration-200 h-8 md:h-10 flex items-center justify-center">
                  Sign up
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SLIDE-OUT MENU — rendered via portal to escape nav stacking context */}
      {typeof document !== "undefined" && createPortal(
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black/80 transition-opacity duration-300 lg:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            style={{ zIndex: 9998 }}
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div 
            className={`fixed top-0 left-0 h-full w-[250px] sm:w-[300px] bg-black border-r border-[#1BE1F3]/50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            style={{ zIndex: 9999 }}
          >
            <div className="p-6 flex flex-col h-full uppercase tracking-widest font-['Press_Start_2P'] text-[10px] sm:text-xs">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/20">
                <span className="text-[#FCFC00] font-bold">MENU</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-red-400 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                <NavLink to="/admin/dashboard" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/reviewManage" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
                  Review
                </NavLink>
                <NavLink to="/admin/courseManage" className={linkClasses} end onClick={() => setIsMenuOpen(false)}>
                  Course
                </NavLink>
                <NavLink to="/admin/jobsManage" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
                  Jobs
                </NavLink>
                <NavLink to="/admin/ManageReport" className={linkClasses} onClick={() => setIsMenuOpen(false)}>
                  Report
                </NavLink>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </nav>
  );
}
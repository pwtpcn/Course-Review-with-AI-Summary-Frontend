import { useState } from "react";
import type { ActionFunction } from "react-router";
import { NavLink, useFetcher } from "react-router";
import { supabase } from "../lib/supabase";
import { UserRepositories } from "./repositories/UserRepositories";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please enter your email", success: false };
  }

  const userRepo = new UserRepositories();
  const existEmail = await userRepo.getUserByEmail(email);
  if (!existEmail) {
    return { error: "Email not found", success: false };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:5173/update-password",
  });

  if (error) {
    console.error("Forgot password error:", error.message);
    return { error: error.message, success: false };
  }

  return { success: true };
};

export default function ForgotPassword() {
  const fetcher = useFetcher();
  const [email, setEmail] = useState("");
  const isSuccess = fetcher.data?.success;
  const error = fetcher.data?.error;

  return (
    <div className="bg-[#000000] h-screen flex flex-col justify-center items-center overflow-auto px-4">
      {isSuccess ? (
        <div className="flex flex-col justify-center items-center w-full max-w-[90%] sm:max-w-[500px] h-fit space-y-6 md:space-y-8 p-8 md:p-12 rounded-2xl border-4 border-[#0016D8] shadow-[0_0_15px_#0016D8] bg-black/50">
          <div className="text-[#FCFC00] text-[20px] md:text-[28px] font-['Press_Start_2P'] uppercase text-center mb-2 leading-tight">
            Check Your Email
          </div>
          <p className="text-white text-center font-['Press_Start_2P'] text-[10px] md:text-[12px] leading-loose">
            We have sent a password reset link to this email: <br/>
            <span className="text-[#1BE1F3]">{email}</span><br/><br/>
            Please click the link in the email to set a new password
          </p>
          <div className="flex justify-center w-full mt-8">
            <NavLink to="/login">
              <button
                type="button"
                className="border-[#0016D8] border-2 rounded-xl px-6 py-3 h-12 md:h-14 text-[#FFFFFF] text-[10px] md:text-[12px] font-['Press_Start_2P'] uppercase hover:bg-[#0016D8] transition-colors flex justify-center items-center shadow-[0_0_10px_#0016D8] hover:shadow-[0_0_20px_#0016D8]"
              >
                Go to Login
              </button>
            </NavLink>
          </div>
        </div>
      ) : (
        <fetcher.Form
          method="post"
          className="flex flex-col justify-center items-center w-full max-w-[90%] sm:max-w-[400px] h-fit space-y-6 md:space-y-8 p-6 md:p-10 rounded-2xl"
        >
          <div className="text-[#FCFC00] text-[20px] md:text-[28px] font-['Press_Start_2P'] uppercase text-center mb-4 leading-tight">
            Reset Password
          </div>

          <p className="text-white/70 text-center text-[10px] md:text-xs font-['Press_Start_2P'] mb-4 leading-loose">
            Enter your email to receive<br/>a reset link
          </p>

          <div className="w-full">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-[#0016D8] bg-transparent border-2 rounded-xl p-3 w-full text-[#FFFFFF] text-sm md:text-base focus:outline-none focus:border-[#1BE1F3]"
            />
            {error && (
              <div className="text-red-500 text-[10px] md:text-xs font-['Press_Start_2P'] mt-2 leading-tight">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-between w-full mt-4">
            <NavLink to="/login">
              <button
                type="button"
                className="border-[#D80004] border-2 rounded-xl px-4 py-2 md:w-28 h-10 md:h-12 text-[#FFFFFF] text-[10px] md:text-[12px] font-['Press_Start_2P'] uppercase hover:bg-[#D80004] transition-colors flex justify-center items-center"
              >
                Back
              </button>
            </NavLink>

            <button
              type="submit"
              disabled={!email}
              className={`border-[#0016D8] border-2 rounded-xl px-4 py-2 md:w-28 h-10 md:h-12 text-[#FFFFFF] text-[10px] md:text-[12px] font-['Press_Start_2P'] uppercase transition-colors flex justify-center items-center ${
                email
                  ? "hover:bg-[#0016D8] cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Send
            </button>
          </div>
        </fetcher.Form>
      )}
    </div>
  );
}

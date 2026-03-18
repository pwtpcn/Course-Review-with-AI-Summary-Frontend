import { useState } from "react";
import type { ActionFunction } from "react-router";
import { NavLink, useFetcher, redirect } from "react-router";
import { supabase } from "../lib/supabase";
import { UserRepository } from "./repositories/UserRepositories";

interface ActionMessage {
  message: string;
  error: string;
  data: any;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const actionMessage: ActionMessage = {
    message: "",
    error: "",
    data: null,
  };

  if (!email || !password) {
    actionMessage.error = "Please enter email and password";
    return actionMessage;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    actionMessage.error = error.message;
    return actionMessage;
  }

  const user = await UserRepository.getUser(data.session.access_token);
  const redirectPath = user?.role === "admin" ? "/admin/reviewManage" : "/review";

  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": `access_token=${data.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${data.session.expires_in}`,
    },
  });
};

export default function Login() {
  const fetcher = useFetcher<ActionMessage>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <div className="bg-[#000000] h-screen flex flex-col justify-center items-center overflow-auto">
      <fetcher.Form
        method="post"
        className="flex flex-col justify-center items-center w-full max-w-[90%] sm:max-w-[400px] h-fit space-y-6 md:space-y-8 p-6 md:p-10 rounded-2xl"
      >
        <div className="text-[#FCFC00] text-[32px] md:text-[48px] font-['Press_Start_2P'] uppercase text-center mb-4">
          Login
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-[#0016D8] bg-transparent border-2 rounded-xl p-3 w-full text-[#FFFFFF] text-sm md:text-base focus:outline-none focus:border-[#1BE1F3]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-[#0016D8] bg-transparent border-2 rounded-xl p-3 w-full text-[#FFFFFF] text-sm md:text-base focus:outline-none focus:border-[#1BE1F3]"
        />

        {fetcher.data?.error && (
          <div className="text-red-500 text-xs font-['Press_Start_2P']">
            {fetcher.data.error}
          </div>
        )}

        <div className="flex justify-between w-full mt-4">
          <NavLink to="/">
            <button
              type="button"
              className="border-[#D80004] border-2 rounded-xl px-4 py-2 md:w-28 h-10 md:h-12 text-[#FFFFFF] text-[10px] md:text-[12px] font-['Press_Start_2P'] uppercase hover:bg-[#D80004] transition-colors flex justify-center items-center"
            >
              Back
            </button>
          </NavLink>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`border-[#0016D8] border-2 rounded-xl px-4 py-2 md:w-28 h-10 md:h-12 text-[#FFFFFF] text-[10px] md:text-[12px] font-['Press_Start_2P'] uppercase transition-colors flex justify-center items-center ${
              isFormValid
                ? "hover:bg-[#0016D8] cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            Enter
          </button>
        </div>
        
        <div className="pt-6 w-full text-center flex flex-col gap-3">
          <span className="text-white/70 text-[10px] md:text-[12px] font-['Press_Start_2P'] leading-tight">
            don't have an account?
          </span>
          <NavLink to="/signup" className="text-[#FCFC00] text-[10px] md:text-[12px] font-['Press_Start_2P'] uppercase hover:underline hover:text-white transition-colors">
            Create Account
          </NavLink>
        </div>
      </fetcher.Form>
    </div>
  );
}

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
        className="flex flex-col justify-center items-center w-fit h-fit space-y-4 p-10 rounded-2xl "
      >
        <div className="text-[#FCFC00] text-[48px] font-['Press_Start_2P'] uppercase">
          Login
        </div>

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-[#0016D8] border-2 rounded-2xl p-2 w-200 text-[#FFFFFF]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-[#0016D8] border-2 rounded-2xl p-2 w-200 text-[#FFFFFF]"
        />

        {fetcher.data?.error && (
          <div className="text-red-500 text-xs font-['Press_Start_2P']">
            {fetcher.data.error}
          </div>
        )}

        <div className="flex justify-between w-full">
          <NavLink to="/">
            <button
              type="button"
              name="back"
              className="border-[#D80004] border-2 rounded-xl p-2 w-25 h-10 text-[#FFFFFF] text-[12px] font-['Press_Start_2P'] uppercase hover:bg-[#D80004]"
            >
              Back
            </button>
          </NavLink>

          <button
            type="submit"
            name="enter"
            disabled={!isFormValid}
            className={`border-[#0016D8] border-2 rounded-xl p-2 w-25 h-10 text-[#FFFFFF] text-[12px] font-['Press_Start_2P'] uppercase ${
              isFormValid
                ? "hover:bg-[#0016D8] cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            Enter
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}

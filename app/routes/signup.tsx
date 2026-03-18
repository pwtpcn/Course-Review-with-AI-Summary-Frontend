import type { ActionFunction } from "react-router";
import { NavLink, useFetcher, redirect } from "react-router";
import { supabase } from "../lib/supabase";
import { UserRepository } from "./repositories/UserRepositories";
import { useState } from "react";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  let errors: Record<string, any> = {};

  if (!email) {
    errors.email = "Email is required";
  } else {
    const userRepo = new UserRepository();
    const existEmail = await userRepo.getUserByEmail(email);
    if (existEmail) {
      errors.email = "Email already used";
    }
  }

  if (!username || username.length < 3 || username.length > 20) {
    errors.username = "Username must be between 3 and 20 characters";
  } else {
    const userRepo = new UserRepository();
    const existUsername = await userRepo.getUserByUsername(username);
    if (existUsername) {
      errors.username = "Username already used";
    } else {
      delete errors.username;
    }
  }

  if (!password) {
    errors.password = "Please input your password";
  } else {
    let validPassword: boolean =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,12}$/.test(
        password,
      );
    if (!validPassword) {
      errors.password =
        "Password should contain 8-12 characters with\n Upper case, Lower case, numeric and special characters";
    } else {
      delete errors.password;
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  } else {
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    } else {
      delete errors.confirmPassword;
    }
  }

  if (Object.keys(errors).length > 0) {
    console.log("Errors: ", errors);
    return { errors };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
    options: {
      data: {
        username: username as string,
      },
    },
  });

  console.log("Create New User: ", data);
  console.log("Error: ", error);

  return redirect("/login");
};

export default function signup() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors || {};

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormValid = email.length > 0 && 
                      username.length > 0 && 
                      password.length > 0 && 
                      confirmPassword.length > 0;

  return (
    <div className="bg-[#000000] h-screen flex flex-col justify-center items-center overflow-auto">
      <fetcher.Form
        method="post"
        className="flex flex-col justify-center items-center w-full max-w-[90%] sm:max-w-[400px] h-fit space-y-4 md:space-y-6 py-10 md:p-10 rounded-2xl flex-shrink-0"
      >
        <div className="text-[#FCFC00] text-[28px] sm:text-[32px] md:text-[40px] font-['Press_Start_2P'] uppercase text-center mb-6 leading-tight">
          Sign up
        </div>

        <div className="w-full">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[#0016D8] bg-transparent border-2 rounded-xl p-3 w-full text-[#FFFFFF] text-sm md:text-base focus:outline-none focus:border-[#1BE1F3]"
          />
          {errors.email && (
            <div className="text-red-500 text-[10px] md:text-xs font-['Press_Start_2P'] mt-2 leading-tight">
              {errors.email}
            </div>
          )}
        </div>

        <div className="w-full">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-[#0016D8] bg-transparent border-2 rounded-xl p-3 w-full text-[#FFFFFF] text-sm md:text-base focus:outline-none focus:border-[#1BE1F3]"
          />
          {errors.username && (
            <div className="text-red-500 text-[10px] md:text-xs font-['Press_Start_2P'] mt-2 leading-tight">
              {errors.username}
            </div>
          )}
        </div>

        <div className="w-full">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[#0016D8] bg-transparent border-2 rounded-xl p-3 w-full text-[#FFFFFF] text-sm md:text-base focus:outline-none focus:border-[#1BE1F3]"
          />
          {errors.password && (
            <div className="text-red-500 text-[10px] md:text-xs font-['Press_Start_2P'] mt-2 leading-tight">
              {errors.password}
            </div>
          )}
        </div>

        <div className="w-full">
          <input
            type="password"
            name="confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-[#0016D8] bg-transparent border-2 rounded-xl p-3 w-full text-[#FFFFFF] text-sm md:text-base focus:outline-none focus:border-[#1BE1F3]"
          />
          {errors.confirmPassword && (
            <div className="text-red-500 text-[10px] md:text-xs font-['Press_Start_2P'] mt-2 leading-tight">
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <div className="flex justify-between w-full mt-6">
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
            Save
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}

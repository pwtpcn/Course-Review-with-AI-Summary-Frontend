import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { supabase } from "../lib/supabase";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!session) {
        setError(
          "No session found (link might be expired) Please request new link",
        );
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" || session) {
          console.log("Session established");
          setError(""); // clear error message if session is established
        }
      },
    );
    
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const validPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,12}$/.test(
        password,
      );
    if (!validPassword) {
      setError(
        "Password should contain 8-12 characters with Upper case, Lower case, numeric and special characters",
      );
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      if (
        error.message.includes("session missing") ||
        error.message.includes("AuthSessionMissingError") ||
        error.message.includes("not authenticated")
      ) {
        setError("Session Expired Please request new link");
      } else {
        setError("Update failed: " + error.message);
      }
    } else {
      setIsSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#000000] h-screen flex flex-col justify-center items-center overflow-auto px-4">
      {isSuccess ? (
        <div className="flex flex-col justify-center items-center w-full max-w-[90%] sm:max-w-[500px] h-fit space-y-6 md:space-y-8 p-8 md:p-12 rounded-2xl border-4 border-[#1BE1F3] shadow-[0_0_15px_#1BE1F3] bg-black/50">
          <div className="text-[#FCFC00] text-[20px] md:text-[28px] font-['Press_Start_2P'] uppercase text-center mb-2 leading-tight">
            Success!
          </div>
          <p className="text-white text-center font-['Press_Start_2P'] text-[10px] md:text-[12px] leading-loose">
            Password changed successfully!
            <br />
            <br />
            You can login with new password now
          </p>
          <div className="flex justify-center w-full mt-8">
            <NavLink to="/login">
              <button
                type="button"
                className="border-[#1BE1F3] border-2 rounded-xl px-6 py-3 h-12 md:h-14 text-[#FFFFFF] text-[10px] md:text-[12px] font-['Press_Start_2P'] uppercase hover:bg-[#1BE1F3] hover:text-black transition-colors flex justify-center items-center shadow-[0_0_10px_#1BE1F3] hover:shadow-[0_0_20px_#1BE1F3]"
              >
                Login Now
              </button>
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full max-w-[90%] sm:max-w-[400px] h-fit space-y-4 md:space-y-6 py-10 md:p-10 rounded-2xl shrink-0">
          <div className="text-[#FCFC00] text-[20px] md:text-[28px] font-['Press_Start_2P'] uppercase text-center mb-6 leading-tight">
            New Password
          </div>

          <div className="w-full">
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-[#0016D8] bg-transparent border-2 rounded-xl p-3 w-full text-[#FFFFFF] text-sm md:text-base focus:outline-none focus:border-[#1BE1F3]"
            />
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
          </div>

          {error && (
            <div className="w-full text-red-500 text-[10px] md:text-xs font-['Press_Start_2P'] mt-2 leading-tight">
              {error}
            </div>
          )}

          <div className="flex justify-between w-full mt-6">
            <button
              type="button"
              disabled={loading}
              onClick={handleUpdatePassword}
              className={`border-[#0016D8] border-2 rounded-xl px-4 py-2 w-full h-10 md:h-12 text-[#FFFFFF] text-[10px] md:text-[12px] font-['Press_Start_2P'] uppercase transition-colors flex justify-center items-center ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#0016D8] cursor-pointer"
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

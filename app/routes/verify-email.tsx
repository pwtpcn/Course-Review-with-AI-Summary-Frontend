import { NavLink } from "react-router";

export default function VerifyEmail() {
  return (
    <div className="bg-[#000000] h-screen flex flex-col justify-center items-center overflow-auto px-4">
      <div className="flex flex-col justify-center items-center w-full max-w-[90%] sm:max-w-[500px] h-fit space-y-6 md:space-y-8 p-8 md:p-12 rounded-2xl border-4 border-[#0016D8] shadow-[0_0_15px_#0016D8] bg-black/50">
        <div className="text-[#FCFC00] text-[20px] md:text-[28px] font-['Press_Start_2P'] uppercase text-center mb-2 leading-tight">
          Check Your Email
        </div>
        
        <p className="text-white text-center font-['Press_Start_2P'] text-[10px] md:text-[12px] leading-loose">
          We have sent a verification link to your email<br/><br/>
          <span className="text-[#1BE1F3]">Please click the link in the email to activate your account</span>
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
    </div>
  );
}

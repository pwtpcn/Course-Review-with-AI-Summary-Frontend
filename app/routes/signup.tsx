import type { ActionFunction } from "react-router";
import { NavLink, useFetcher } from "react-router";

interface ActionMessage {
  message: string;
  error: string;
  data: any;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const actionMessage: ActionMessage = {
    message: "",
    error: "",
    data: null,
  };
  if (!email || !password) {
    actionMessage.error = "Please enter email and password";
    return actionMessage;
  }
  return actionMessage;
};

export default function signup() {
  const fetcher = useFetcher<ActionMessage>();
  return (
    <div className="bg-[#000000] h-screen flex flex-col justify-center items-center overflow-auto">
      <fetcher.Form
        method="post"
        className="flex flex-col justify-center items-center w-fit h-fit space-y-4 p-10 rounded-2xl "
      >
        <div className="text-[#FCFC00] text-[48px] font-['Press_Start_2P'] uppercase">Sign up</div>
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="border-[#0016D8] border-2 rounded-2xl p-2 w-200 text-[#FFFFFF]"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border-[#0016D8] border-2 rounded-2xl p-2 w-200 text-[#FFFFFF]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-[#0016D8] border-2 rounded-2xl p-2 w-200 text-[#FFFFFF]"
        />
        <input
          type="password"
          name="confirm-password"
          placeholder="Confirm Password"
          className="border-[#0016D8] border-2 rounded-2xl p-2 w-200 text-[#FFFFFF]"
        />
        <div className="flex justify-between w-full">
        <NavLink to="/">
         <button
            type="submit"
            name="back"
            className="border-[#D80004] border-2 rounded-xl p-2 w-25 h-10 text-[#FFFFFF] text-[12px] font-['Press_Start_2P'] uppercase hover:bg-[#D80004]"
          >
            Back
          </button>
        </NavLink>
        <NavLink to="/login">
          <button
            type="submit"
            name="save"
            className="border-[#0016D8] border-2 rounded-xl p-2 w-25 h-10 text-[#FFFFFF] text-[12px] font-['Press_Start_2P'] uppercase hover:bg-[#0016D8]"
          >
            Save
          </button>
        </NavLink>
        </div>
      </fetcher.Form>
    </div>
  );
}

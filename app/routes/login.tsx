import type { ActionFunction } from "react-router";
import { useFetcher } from "react-router";

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

export default function Login() {
  const fetcher = useFetcher<ActionMessage>();
  return (
    <div className="bg-[#000000] h-screen flex flex-col justify-center items-center overflow-auto">
      <fetcher.Form
        method="post"
        className="flex flex-col justify-center items-center w-fit h-fit space-y-4 p-10 rounded-2xl border-amber-400 border-2"
      >
        <div className="text-[#FCFC00] text-[64px] font-normal">Login</div>
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="border-[#0016D8] border-2 rounded-2xl p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-[#0016D8] border-2 rounded-2xl p-2"
        />
        <button
          type="submit"
          className="border-[#0016D8] border-2 rounded-xl p-2"
        >
          Enter
        </button>
      </fetcher.Form>
    </div>
  );
}

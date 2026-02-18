import { redirect, type ActionFunctionArgs } from "react-router";
import { supabase } from "../lib/supabase";

export const action = async ({ request }: ActionFunctionArgs) => {
  await supabase.auth.signOut();

  return redirect("/", {
    headers: {
      "Set-Cookie": "access_token=; Path=/; HttpOnly; Max-Age=0",
    },
  });
};

export const loader = async () => redirect("/");

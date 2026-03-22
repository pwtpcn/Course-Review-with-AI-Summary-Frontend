import { redirect } from "react-router";
import type { User } from "../routes/models/User";
import { UserRepositories } from "../routes/repositories/UserRepositories";

export function getAccessToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [key, ...v] = c.split("=");
      return [key, v.join("=")];
    }),
  );

  return cookies["access_token"] || null;
}

export async function getAuthUser(request: Request): Promise<User | null> {
  const accessToken = getAccessToken(request);
  if (!accessToken) return null;

  return await UserRepositories.getUser(accessToken);
}

export async function requireUser(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
}

export async function requireAdmin(request: Request) {
  const user = await getAuthUser(request);

  if (!user) {
    throw redirect("/login");
  }

  if (user.role !== "admin") {
    throw redirect("/");
  }

  return user;
}

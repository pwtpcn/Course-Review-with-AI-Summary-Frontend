import type { User } from "../models/User";

export class UserRepository {
  static async getUser(accessToken: string): Promise<User | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
      return null;
    } catch (e) {
      console.error("Failed to fetch user:", e);
      return null;
    }
  }
}

import type { User } from "../models/User";

export class UserRepositories {
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

  public async getUserByEmail(email: string): Promise<User | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/user/getbyemail/${email}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      return data.user;
    } catch (e) {
      console.error("Failed to fetch user:", e);
      return null;
    }
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/user/getbyusername/${username}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      return data.user;
    } catch (e) {
      console.error("Failed to fetch user:", e);
      return null;
    }
  }

  public async getUserById(id: string): Promise<User | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/user/getbyid/${id}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      return data.user;
    } catch (e) {
      console.error("Failed to fetch user by id:", e);
      return null;
    }
  }

  public async GetAllUsers(): Promise<User[] | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/user/getall`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch all users");
      }

      const data = await res.json();
      return data.users;
    } catch (e) {
      console.error("Failed to fetch all users:", e);
      return null;
    }
  }
}

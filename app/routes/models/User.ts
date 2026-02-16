export interface User {
  id: string; // Metadata
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
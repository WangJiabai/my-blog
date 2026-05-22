import client from "./client";
import type { AuthResponse, LoginData, RegisterData, User } from "../types";

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await client.post("/api/auth/login", data);
  return res.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await client.post("/api/auth/register", data);
  return res.data;
}

export async function refreshToken(
  refresh_token: string
): Promise<{ access_token: string }> {
  const res = await client.post("/api/auth/refresh", { refresh_token });
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await client.get("/api/auth/me");
  return res.data;
}

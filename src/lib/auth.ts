import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "ufy_admin_session";
export const VOLUNTEER_COOKIE_NAME = "ufy_volunteer_session";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "ufy-default-insecure-secret-please-change-in-env-file-2026";
  return new TextEncoder().encode(secret);
};

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface VolunteerSessionUser {
  id: string;
  email: string;
  fullName: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: AdminSessionUser): Promise<string> {
  const secret = getSecretKey();
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    type: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<AdminSessionUser | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    if (payload.type && payload.type !== "admin") return null;
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminSessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function createVolunteerSessionToken(vol: VolunteerSessionUser): Promise<string> {
  const secret = getSecretKey();
  return new SignJWT({
    id: vol.id,
    email: vol.email,
    fullName: vol.fullName,
    type: "volunteer",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function getCurrentVolunteer(): Promise<VolunteerSessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(VOLUNTEER_COOKIE_NAME)?.value;
    if (!token) return null;
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    if (payload.type !== "volunteer") return null;
    return {
      id: payload.id as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
    };
  } catch {
    return null;
  }
}

import "server-only";
import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {};

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload, expiresAt?: Date) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt ?? "1h")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
  secret = encodedKey
) {
  try {
    const result = await jwtVerify(session, secret, {
      algorithms: ["HS256"],
    });
    return result.payload;
  } catch {
    console.log("Failed to verify session");
  }
}

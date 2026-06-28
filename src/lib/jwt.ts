import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "college-discovery-super-secret-key-12345";

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  // Expires in 7 days
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

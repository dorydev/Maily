import crypto from "node:crypto";

export function hashRefreshToken(refreshToken: string): string {
  return crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
}

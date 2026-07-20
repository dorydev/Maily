import {
  createAccessToken,
  createRefreshToken
} from "../../utils/jwt";
import { getOrCreateDefaultUser } from "../../database/repositories/user.repository";

type CreateSessionResult = {
  user_id: string;
  displayName: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

const ACCESS_TOKEN_EXPIRES_IN_MS = 15 * 60 * 1000;

export function createLocalSession(): CreateSessionResult {
  const user = getOrCreateDefaultUser();

  const accessToken = createAccessToken({
    user_id: user.id
  });

  const refreshToken = createRefreshToken({
    user_id: user.id
  });

  return {
    user_id: user.id,
    displayName: user.displayName,
    accessToken,
    refreshToken,
    expiresAt: Date.now() + ACCESS_TOKEN_EXPIRES_IN_MS
  };
}

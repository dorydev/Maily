import { Router } from "express";

import {
  createAccessToken,
  verifyRefreshToken
} from "../../utils/jwt";

import {
  requireAuth
} from "../../handlers/auth.middleware";

export const refreshRouter = Router();

refreshRouter.post("/refresh", (req, res) => {
  const refreshToken = req.body.refresh_token;

  if (typeof refreshToken !== "string") {
    return res.status(400).json({
      success: false,
      error: "Missing refresh_token"
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const accessToken = createAccessToken({
      user_id: payload.user_id,
    });

    return res.status(200).json({
      success: true,
      access_token: accessToken,
      expires_at: Date.now() + 15 * 60 * 1000
    });
  } catch {
    return res.status(401).json({
      success: false,
      error: "Invalid refresh token"
    });
  }
});

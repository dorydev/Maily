import { Router } from "express";
import { createLocalSession } from "../../modules/auth/auth.services";
import {
  AuthenticatedRequest,
  requireAuth
} from "../../handlers/auth.middleware";

export const authRouter = Router();

authRouter.get("/me", requireAuth, (req, res) => {
  const authenticatedReq = req as AuthenticatedRequest;

  res.status(200).json({
    success: true,
    user_id: authenticatedReq.user.user_id
  });
});

authRouter.post("/session", (_req, res) => {
  const session = createLocalSession();
  return res.status(200).json({
    success: true,
    user_id: session.user_id,
    display_name: session.displayName,
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
    expires_at: session.expiresAt

  });

});

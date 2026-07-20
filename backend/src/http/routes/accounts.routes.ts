import { Router } from "express";

import {
  getAccounts,
  registerSmtpAccount,
  testSmtpAccountConnection
} from "../../modules/accounts/accounts.services";
import { validateCreateSmtpAccountInput } from "../../modules/accounts/accounts.validation";
import {
  requireAuth,
  type AuthenticatedRequest
} from "../../handlers/auth.middleware";

export const accountsRouter = Router();

accountsRouter.get("/accounts", requireAuth, (req, res) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const userId = authenticatedReq.user.user_id;

  const accounts = getAccounts(userId);

  return res.status(200).json({
    success: true,
    accounts
  });
});

accountsRouter.post("/accounts/smtp", requireAuth, async (req, res) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user.user_id;

    const validation = validateCreateSmtpAccountInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const accountId = await registerSmtpAccount(userId, validation.data);

    return res.status(201).json({
      success: true,
      account_id: accountId
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create SMTP account";

    return res.status(400).json({
      success: false,
      error: errorMessage
    });
  }
});

accountsRouter.post("/accounts/:accountId/test", requireAuth, async (req, res) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user.user_id;

    const rawAccountId = req.params.accountId;

    if (typeof rawAccountId !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid accountId"
      });
    }

    const accountId = rawAccountId;

    await testSmtpAccountConnection(userId, accountId);

    return res.status(200).json({
      success: true,
      message: "Account connection successful"
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to test account connection";

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

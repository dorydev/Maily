import { Router } from "express";

import {
  requireAuth,
  type AuthenticatedRequest
} from "../../handlers/auth.middleware";
import { sendMailWithAccount } from "../../modules/mail/mail.services";

export const mailRouter = Router();

mailRouter.post("/emails/send", requireAuth, async (req, res) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user.user_id;

    const result = await sendMailWithAccount(userId, req.body);

    return res.status(200).json({
      success: true,
      provider_message_id: result.providerMessageId,
      raw_response: result.rawResponse
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send email";

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

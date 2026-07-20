//TODO : 1. Décode token + recup id 2. rechercher l'user correspondant 3. éviter d'aller chercher l'user_id à chaques fois.

import type {NextFunction, Request, Response } from "express";
import { findAccountById } from "../database/repositories/accounts.repository";
import { verifyAccessToken } from "../utils/jwt";


export type AuthenticatedRequest = Request & {
  user: {
    user_id: string;
  };
};

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Missing access token"
    });
    return;
  }

  const token = authorization.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);

    (req as AuthenticatedRequest).user = {
      user_id: payload.user_id
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: "Invalid access token"
    });
  }
}

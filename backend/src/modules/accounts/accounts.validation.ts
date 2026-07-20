import type { CreateSmtpAccountInput } from "./accounts.types";

type ValidationResult =
  | { valid: true; data: CreateSmtpAccountInput }
  | { valid: false; error: string };

export function validateCreateSmtpAccountInput(data: unknown): ValidationResult {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const body = data as Record<string, unknown>;

  if (typeof body.label !== "string" || body.label.trim() === "") {
    return { valid: false, error: "Missing or invalid 'label'" };
  }

  if (typeof body.fromEmail !== "string" || body.fromEmail.trim() === "") {
    return { valid: false, error: "Missing or invalid 'fromEmail'" };
  }

  if (typeof body.host !== "string" || body.host.trim() === "") {
    return { valid: false, error: "Missing or invalid 'host'" };
  }

  if (typeof body.port !== "number" || !Number.isInteger(body.port)) {
    return { valid: false, error: "Missing or invalid 'port'" };
  }

  if (typeof body.secure !== "boolean") {
    return { valid: false, error: "Missing or invalid 'secure'" };
  }

  if (typeof body.username !== "string" || body.username.trim() === "") {
    return { valid: false, error: "Missing or invalid 'username'" };
  }

  if (body.authType !== "password" && body.authType !== "app_password") {
    return { valid: false, error: "Invalid 'authType'" };
  }

  if (typeof body.password !== "string" || body.password === "") {
    return { valid: false, error: "Missing or invalid 'password'" };
  }

  return {
    valid: true,
    data: {
      label: body.label.trim(),
      fromEmail: body.fromEmail.trim(),
      fromName:
        typeof body.fromName === "string" && body.fromName.trim() !== ""
          ? body.fromName.trim()
          : undefined,
      host: body.host.trim(),
      port: body.port,
      secure: body.secure,
      username: body.username.trim(),
      authType: body.authType,
      password: body.password
    }
  };
}

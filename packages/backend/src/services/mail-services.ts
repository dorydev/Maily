import dotenv from "dotenv"
import { marked } from "marked";

dotenv.config();

export interface SendMailRequest {
  to: string;
  subject: string;
  content: string;
  format: "md" | "html" | "txt";
  variables: { key: string; label: string }[];
}

export function validateRequest(data: any): { valid: boolean; error?: string } {
  if (!data.to || typeof data.to !== "string") {
    return { valid: false, error: "Missing or invalid 'to'" };
  }

  if (!data.subject || typeof data.subject !== "string") {
    return { valid: false, error: "Missing or invalid 'subject'" };
  }

  if (!data.content || typeof data.content !== "string") {
    return { valid: false, error: "Missing or invalid 'content'" };
  }

  if (!["md", "html", "txt"].includes(data.format)) {
    return { valid: false, error: "Invalid format (must be 'md', 'html', or 'txt')" };
  }
  return { valid: true };
}

export async function prepareMailOptions(request: SendMailRequest) {
  const from = process.env.MAILY_USER_EMAIL;
  
  const baseMailOptions: { from?: string; to: string; subject: string; text?: string; html?: string } = {
    from,
    to: request.to,
    subject: request.subject,
  };

  if (request.format === "txt") {
    baseMailOptions.text = request.content;
  } else if (request.format === "html") {
    baseMailOptions.html = request.content;
  } else if (request.format === "md") {
    baseMailOptions.html = await marked(request.content);
  }

  return baseMailOptions;
}

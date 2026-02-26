import type { Options as SMTPTransportOptions } from "nodemailer/lib/smtp-transport";

export const mailyConfig: SMTPTransportOptions = {
  host: process.env.MAILY_SMTP_CUSTOM_HOST,
  port: Number(process.env.MAILY_SMTP_CUSTOM_PORT),
  auth: {
    user: process.env.MAILY_USER_INFO,
    pass: process.env.MAILY_USER_PASSWOR,
  },
};

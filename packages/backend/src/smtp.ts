import nodemailer, { type SendMailOptions } from "nodemailer";

import { mailyConfig } from "./config";

export const sendEmail = async (options: SendMailOptions) => {
  const transporter = nodemailer.createTransport(mailyConfig);

  const mailOptions: SendMailOptions = {
    from: process.env.MAILY_USER_EMAIL,
    to: process.env.RECEIVER_EMAIL,
    subject : "test",
    
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { sendEmail } from "./smtp";
import { validateRequest, prepareMailOptions, type SendMailRequest } from "./services/mail-services";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Maily API is running !");
});

// Send email endpoint
app.post("/send", async (req: Request, res: Response) => {
  try {
    const validation = validateRequest(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }
    const mailOptions = await prepareMailOptions(req.body as SendMailRequest);

    await sendEmail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

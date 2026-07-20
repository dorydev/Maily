import dotenv from "dotenv";

import { createServer } from "./http/server";

dotenv.config();

const port = Number(process.env.PORT ?? 3000);
const app = createServer();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

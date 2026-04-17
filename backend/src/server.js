import express from "express";
import cors from "cors";
import { serve } from "inngest/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Inngest serve handler - mounted at /api/inngest via vercel routes
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

app.get("/api/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// Local development only - start the server with app.listen
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(ENV.PORT || 5000, () =>
        console.log("Server is running on port:", ENV.PORT || 5000)
      );
    } catch (error) {
      console.error("💥 Error starting the server", error);
    }
  };
  startServer();
}

// Vercel Serverless Function handler (production)
export default async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Critical error during serverless execution:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

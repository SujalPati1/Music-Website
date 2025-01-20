// // server.js
// import dotenv from "dotenv";
// import path, { dirname } from "path";
// import express from "express";
// import mongoose from "mongoose";
// import { fileURLToPath } from "url";
// // import songRoutes from "./routes/songRoutes.js";
// // import albumRoutes from "./routes/albumRoutes.js";


// // Environment variable setup
// dotenv.config();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const directory = __dirname;

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static folders
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected!"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Routes
// // app.use("/songs", songRoutes);
// // app.use("/albums", albumRoutes);

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));

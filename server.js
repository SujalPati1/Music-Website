import dotenv from "dotenv";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import songRoutes from "./routes/songRoutes.js"
import albumRoutes from "./routes/albumRoutes.js";

import { uploadSong } from "./controllers/songController.js";

// Environment variable setup
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const directory = __dirname;

const app = express()

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//static folder
app.use(express.static(path.join(__dirname, "public")));


// MongoDB Connection
let a = mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected!"))
.catch((err)=> console.error("MongoDB connection error: ",err))


//Routes
app.use("/songs", songRoutes);
app.use("/album", albumRoutes);



//Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Server running on http://127.0.0.1:${PORT}`));
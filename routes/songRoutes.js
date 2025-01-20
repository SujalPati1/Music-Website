// routes/songRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { directory } from "../server.js";
import { getSongs, getSongsByAlbum, uploadSong } from "../controllers/songController.js";
import upload from "../controllers/songController.js";


const router = express.Router();

// Define the routes for songs
router.get("/", getSongs); // Fetch all songs
router.get("/:folder", getSongsByAlbum); // Fetch songs from a specific album/folder


// Route to upload a song to an existing album
router.post("/:albumName/uploadSong", upload,uploadSong)

router.post("/:newAlbumName/uploadSong", upload,uploadSong);


export default router;



// router.post("/createNewAlbum/uploadSong", upload.single("song"),uploadSong)

// try {
//     // Assuming song upload logic here
//     res.set("Content-Type","application/json");
//     res.json({ success: true, message: "Song uploaded successfully!" });
// } catch (error) {
//     console.error("Error uploading song:", error);
//     res.set("Content-Type","application/json");
//     res.status(500).json({ success: false, message: "Failed to upload song" });
// }

// const newAlbumName = req.body.albumName

// // Create a new folder for the new album
// const newAlbumFolderPath = path.join(directory, "public", "songs", newAlbumName);
// if (!fs.existsSync(newAlbumFolderPath)) {
//     fs.mkdirSync(newAlbumFolderPath, { recursive: true });
// }
// // Now save the uploaded song to the new folder
// const filePath = path.join(newAlbumFolderPath, req.file.originalname);

// res.json({ success: true, message: "New album created and song uploaded!" });


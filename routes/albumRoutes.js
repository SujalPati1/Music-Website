// routes/albumRoutes.js
import express from "express";
import { getAllAlbums } from "../controllers/albumController.js";
import { Song, Album } from "../models/spotify.js";

const router = express.Router();

// Define the route for fetching all albums
router.get("/", getAllAlbums); // Fetch all albums

router.get("/albumDetails/:albumName", async (req, res) => {
    try {
        const albumName = req.params.albumName;

        // Find the album in the database
        const album = await Album.findOne({ title: albumName });
        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found" });
        }

        // Find all songs in this album
        const songs = await Song.find({ album: albumName });

        res.json({
            success: true,
            album: {
                title: album.title,
                description: album.description,
                coverPath: album.coverPath,
            },
            songs: songs.map(song => ({
                title: song.title,
                artist: song.artist,
                duration: song.duration,
                filePath: song.filePath,
            })),
        });
    } catch (err) {
        console.error("Error fetching album details:", err);
        res.status(500).json({ success: false, message: "Error fetching album details" });
    }
});

export default router;

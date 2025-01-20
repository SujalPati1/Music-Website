// controllers/songController.js
import { Song, Album } from "../models/spotify.js";
import fs from "fs";
import path from "path";
import { directory } from "../server.js";
import { getAudioDurationInSeconds } from "get-audio-duration";
import multer from "multer";
import { fileURLToPath } from "url";
import { console } from "inspector";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const direct = path.resolve(__dirname, "../public");



// Get all songs from the 'songs' folder
export const getSongs = async (req, res) => {

    try {
        const songs = await Song.find({});
        res.json({
            success: true,
            songs: songs.map(song => ({
                title: song.title,
                artist: song.artist,
                duration: song.duration,
                filePath: song.filePath,
            })),
        });
    } catch (err) {
        console.error("Error fetching songs:", err);
        res.status(500).json({ success: false, message: "Error fetching songs" });
    }

};

// Get songs by album (folder)
export const getSongsByAlbum = (req, res) => {
    const songPath = path.join(directory, 'public', 'songs', req.params.folder);
    fs.readdir(songPath, (err, files) => {
        if (err) {
            return res.status(404).send({ error: 'Folder not found' });
        }
        const songs = files.filter(file => file.endsWith(".mp3"));
        res.json(songs);
    });
};


export const uploadSong = async (req, res) => {
    try {
        const { title, artist, newAlbumTitle, newAlbumDescription } = req.body;
        const albumName = req.params.albumName || newAlbumTitle;

        if (!albumName) {
            return res.status(400).json({ success: false, message: "Album name is required." });
        }

        // Ensure album folder exists
        const albumFolder = path.join("public","songs", albumName);
        if (!fs.existsSync(albumFolder)) {
            fs.mkdirSync(albumFolder, { recursive: true });
        }
        
        const albumFolderPath = path.join("songs", albumName);
        // Handle cover image upload
        try {
            if (req.files.cover && req.files.cover[0]) {
                const coverFile = req.files.cover[0];
                const coverPath = path.join("public",albumFolderPath, "cover.jpg");
                await fs.promises.rename(coverFile.path, coverPath);
                console.log("Cover image uploaded to:", coverPath);
                console.log(coverFile.path)
            } else {
                console.log("No cover image provided.");
            }
        } catch (err) {
            console.error("Error uploading cover image:", err);
        }

        // Create or find the album in the database
        let album = await Album.findOne({ title: albumName });
        if (!album) {
            album = new Album({
                title: albumName,
                description: newAlbumDescription || "No description provided",
                coverPath: path.join(albumFolderPath, "cover.jpg"),
            });
            await album.save();
        }

        // Handle song upload
        if (!req.files.song || !req.files.song[0]) {
            return res.status(400).json({ success: false, message: "Song file is required." });
        }

        const songFile = req.files.song[0];
        const songPath = path.join(albumFolderPath, songFile.originalname);

        // Calculate the duration of the uploaded song
        const duration = await getAudioDurationInSeconds(songFile.path);

        // Save the song in the database
        const newSong = new Song({
            title: title || songFile.originalname,
            artist: artist || "Unknown Artist",
            album: album.title,
            filePath: songPath,
            duration: `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, "0")}`,
        });
        await newSong.save();

        res.status(201).json({
            success: true,
            message: "Song uploaded successfully!",
            song: newSong,
            album: album,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error uploading song." });
    }
};




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const albumName = req.params.albumName || req.body.albumName;

        if (!albumName) {
            return cb(new Error("Album name is required for file upload."));
        }

        const albumFolderPath = path.join(direct, "songs", albumName);

        if (!fs.existsSync(albumFolderPath)) {
            fs.mkdirSync(albumFolderPath, { recursive: true });
        }

        cb(null, albumFolderPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = {
        song: ["audio/mpeg", "audio/wav", "audio/mp3"],
        cover: ["image/jpeg", "image/png", "image/jpg"],
    };

    if (file.fieldname === "song" && allowedFileTypes.song.includes(file.mimetype)) {
        cb(null, true);
    } else if (file.fieldname === "cover" && allowedFileTypes.cover.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for field ${file.fieldname}.`));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
}).fields([
    { name: "song", maxCount: 1 },
    { name: "cover", maxCount: 1 },
]);

export default upload;


// controllers/albumController.js
import { Album } from "../models/spotify.js";

// Get all albums

export const getAllAlbums = async(req,res)=>{
    try {
        const albums = await Album.find();
        res.json(albums);
    } catch (err) {
        res.status(500).send("Error fetching albums")
    }
}
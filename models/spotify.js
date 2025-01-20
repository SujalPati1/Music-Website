import mongoose from "mongoose";

const songsSchema = new mongoose.Schema({
    title: String,
    artist: String,
    duration: String,
    album: String,
    filePath: String
})

const albumSchema = new mongoose.Schema({
    title: String,
    description: String,
    coverPath: String
})

export const Song = mongoose.model("Song",songsSchema)
export const Album = mongoose.model("Album",albumSchema)
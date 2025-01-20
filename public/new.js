let currentSong = new Audio();
let songs;
let currfolder;


function formatTime(seconds) {
    const roundedSeconds = Math.floor(seconds); // Convert floating-point to integer by flooring
    const minutes = Math.floor(roundedSeconds / 60); // Get the number of minutes
    const remainingSeconds = roundedSeconds % 60; // Get the remaining seconds

    // Pad single-digit minutes and seconds with leading zeros
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

// div.innerHTML = response;
// let as = div.getElementsByTagName("a")
// for (let i = 0; i < as.length; i++) {
//     const element = as[i];
//     if (element.href.endsWith(".mp3")) {
//         songs.push(element.href.split(`/${folder}/`)[1])
//     }
// }

async function getSongs(albumName) {
    try {
        let response = await fetch(`/album/albumDetails/${albumName}`)
        let data = await response.json();
        console.log(data);

        if (!response.ok) {
            console.error("Error fetching songs:", data.message);
            return [];
        }

        const songs = data.songs || []; // Default to an empty array if no songs are found


        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""

        if (songs.length === 0) {
            songUL.innerHTML = `<li>No songs available in this album.</li>`;
            return;
        }

        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML +
                `<li>    
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.title}</div>
                <div>${song.artist}</div>  
            </div>
            <div class="playNow">
                <span>Play now</span>
            </div>
            <img class="invert" src="img/play.svg" alt="">
        </li>`;
        }

        // Attach an event listner to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
            e.addEventListener("click", element => {
                const songTitle = e.querySelector(".info").firstElementChild.innerHTML;
                console.log("Playing song:", songTitle);
                const songPath = songs[index].filePath;

                playMusic(songPath);
            })
        })
        return songs;
    } catch (err) {
        console.error("Error fetching songs:", err);
        return [];
    }
}

const playMusic = (track, pause = false) => {

    if (!track) {
        console.error("Track is undefined or empty.");
        return;
    }

    console.log('Track:', track);

    currentSong.src = `${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg"
    }

    const songName = decodeURI(currentSong.src).split('/').pop().replace(".mp3", "");

    document.querySelector(".songinfo").innerHTML = decodeURI(songName)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbum() {
    let response = await fetch(`/album`)
    let album = await response.json();

    let div = document.createElement("div")
    let cardContainer = document.querySelector(".cardContainer")


    // div.innerHTML = response;
    // let anchor = div.getElementsByTagName("a")
    // console.log(anchor);
    // let array = Array.from(anchor)

    for (let folder of album) {

        // const e = array[index];
        // if (e.href.includes("/songs")) {
        //     let folder = e.href.split("/").slice(-2)[0];
        //get the metadata of the folder

        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder.title}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" color="#18ff00" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#18ff00" stroke="currentColor" stroke-width="1.5" />
                                <path d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z" fill="black" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="${folder.coverPath}" alt="">
                        <h3>${folder.title}</h3>
                        <p>${folder.description}</p>
                    </div>`
    }

    //Load the playlist when clicked on the card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset);
            const folderName = item.currentTarget.dataset.folder;
            currfolder = folderName;
            songs = await getSongs(folderName);
            playMusic(songs[0].filePath)
        })
    })

}

async function main() {
    //song list
    songs = await getSongs("1.chill");
    // console.log(songs);

    if (songs && songs.length > 0) {
        // Play the first song in the album
        playMusic(songs[0].filePath, true); // Pass the first song's filePath and pause set to true
    } else {
        console.error("No songs available to play.");
    }
    //Display all the albums on the page
    displayAlbum();

    //Attach an event listner to play next and prev
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    document.addEventListener("keydown", (event) => {
        // Check if the Spacebar (keyCode 32) is pressed and not on an input field
        if ((event.code === "Space" || event.code === "Enter" || event.code === "NumpadEnter") && !event.target.matches("input, textarea")) {
            event.preventDefault(); // Prevent default Spacebar behavior (like scrolling)
            if (currentSong.paused) {
                currentSong.play();
                play.src = "img/pause.svg";
            } else {
                currentSong.pause();
                play.src = "img/play.svg";
            }
        }
    });

    //Listen for time update event
    const seekbar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");
    let isDragging = false;
    let lastPercent = 0;

    currentSong.addEventListener("timeupdate", () => {
        const progress = (currentSong.currentTime / currentSong.duration) * 100; // Calculate progress percentage


        if (!isDragging) {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
            circle.style.left = progress + "%";
            if (seekbar.matches(":hover")) {
                seekbar.style.background = `linear-gradient(to right, #1db954 ${progress}%, #4d4d4d ${progress}%)`;
            } else {
                seekbar.style.background = `linear-gradient(to right, white ${progress}%, #4d4d4d ${progress}%)`;
            }
        }
    });

    seekbar.addEventListener("mouseenter", () => {
        const progress = (currentSong.currentTime / currentSong.duration) * 100;
        seekbar.style.background = `linear-gradient(to right, #1db954 ${progress}%, #4d4d4d ${progress}%)`;
    });

    seekbar.addEventListener("mouseleave", () => {
        const progress = (currentSong.currentTime / currentSong.duration) * 100;
        seekbar.style.background = `linear-gradient(to right, white ${progress}%, #4d4d4d ${progress}%)`;
    });

    //Add event listner to seekbar



    seekbar.addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        updateSeekbar(percent)
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })
    circle.addEventListener("mousedown", () => {
        isDragging = true; // Enable dragging
    });
    seekbar.addEventListener("mousedown", () => {
        isDragging = true; // Enable dragging
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const seekbarRect = seekbar.getBoundingClientRect();
            const offsetX = e.clientX - seekbarRect.left;

            // Ensure dragging stays within the seekbar bounds
            let percent = Math.max(0, Math.min(100, (offsetX / seekbarRect.width) * 100));
            updateSeekbar(percent);

            if (Math.abs(percent - lastPercent) > 0.1) {
                lastPercent = percent;
                updateSeekbar(percent);

                // Update song time while dragging
                const newTime = (currentSong.duration * percent) / 100;
                document.querySelector(".songtime").innerHTML = `${formatTime(newTime)}/${formatTime(currentSong.duration)}`;
            }
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = "default"; // Reset cursor

            // Update the song's current time when drag ends
            const percent = parseFloat(circle.style.left);
            currentSong.currentTime = (currentSong.duration * percent) / 100;
        }
    });

    function updateSeekbar(percent) {
        circle.style.left = percent + "%";
        seekbar.style.background = `linear-gradient(to right, #1db954 ${percent}%, #4d4d4d ${percent}%)`;
    }

    //Add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%";
    })

    //Add an event listner to prev n next

    prev.addEventListener("click", () => {
        const currentFileName = decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3", ""));
        const index = songs.findIndex(song => song.filePath.split("\\").pop().replace(".mp3", "") === currentFileName);

        if (index > 0) {
            const prevSong = songs[index - 1].filePath.replace("\\", "/"); // Fix file path for URL
            playMusic(`${prevSong}`);
        }
    });

    next.addEventListener("click", () => {
        const currentFileName = decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3", ""));
        const index = songs.findIndex(song => song.filePath.split("\\").pop().replace(".mp3", "") === currentFileName);

        if (index >= 0 && index + 1 < songs.length) {
            const nextSong = songs[index + 1].filePath.replace("\\", "/"); // Fix file path for URL
            playMusic(`${nextSong}`);
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        if (currentSong.currentTime === currentSong.duration) {
            const currentFileName = decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3", ""));
            const index = songs.findIndex(song => song.filePath.split("\\").pop().replace(".mp3", "") === currentFileName);

            if (index >= 0 && index + 1 < songs.length) {
                const nextSong = songs[index + 1].filePath.replace("\\", "/"); // Fix file path for URL
                playMusic(`${nextSong}`);
            }
        }
    });


    const volumeBar = document.querySelector('.volume-bar');
    const volumeTrack = document.querySelector('.volume-track');
    const volumeCircle = document.querySelector('.volume-circle');
    let isDraggingVolume = false;
    let temp;

    // Handle click events on the volume bar
    volumeBar.addEventListener('click', (e) => {
        const percent = e.offsetX / volumeBar.clientWidth;
        updateVolume(percent);
    });

    // Start dragging the circle
    volumeCircle.addEventListener('mousedown', () => {
        isDraggingVolume = true;
    });

    // Handle dragging of the circle
    document.addEventListener('mousemove', (e) => {
        if (isDraggingVolume) {
            const volumeRect = volumeBar.getBoundingClientRect();
            let percent = (e.clientX - volumeRect.left) / volumeRect.width;
            percent = Math.max(0, Math.min(1, percent)); // Ensure percent stays within bounds
            updateVolume(percent);
        }
    });

    // Stop dragging the circle
    document.addEventListener('mouseup', () => {
        isDraggingVolume = false;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            adjustVolume(0.05); // Increase volume by 5%
        } else if (e.key === 'ArrowDown') {
            adjustVolume(-0.05); // Decrease volume by 5%
        }
    });

    // Adjust the volume and update the UI
    function adjustVolume(change) {
        const newVolume = Math.max(0, Math.min(1, currentSong.volume + change)); // Clamp the volume between 0 and 1
        updateVolume(newVolume);
    }

    // Update the track and circle positions
    function updateVolume(percent) {
        const newWidth = percent * 100; // Calculate percentage
        volumeTrack.style.width = `${newWidth}%`; // Update the track width
        // Move the circle to the end of the track
        currentSong.volume = percent; // Update audio volume
    }

    //To make volume bar visible in mobile
    const volumeIcon = document.querySelector(".volume-icon");


    volumeIcon.addEventListener("click", toggleMute);

    document.addEventListener("keydown", (e) => {
        if (e.key === "m") {
            toggleMute();
        }
    })

    function toggleMute() {
        if (volumeIcon.src.includes("img/volume.svg")) {
            temp = currentSong.volume;
            volumeIcon.src = "img/mute.svg"
            updateVolume(0);
        }
        else {
            volumeIcon.src = "img/volume.svg"
            updateVolume(temp);
        }
    }

    //Home button

    home = document.querySelector(".homered");

    home.addEventListener("click", () => {
        console.log(home);
        window.location.href = "http://127.0.0.1:3000/index.html";

    });

    logo = document.querySelector(".logo");

    logo.addEventListener("click", () => {
        console.log(home);
        window.location.href = "http://127.0.0.1:3000/index.html";

    });

    //Upload button
    const modal = document.getElementById('uploadModal');

    document.getElementById("openUploadModal").addEventListener("click", async () => {
        modal.style.display = "block";

        // Fetch existing albums from the server
        try {
            let response = await fetch(`/album`)
            let albums = await response.json();


            const albumDropDown = document.getElementById("albumId")
            albumDropDown.innerHTML = `
        <option value="" disabled selected>Select an album</option>
        ${albums.map(album => `<option value="${album._id}">${album.title}</option>`).join(``)}
        <option value="new">Create New Album</option>`;

        } catch (err) {
            console.error("Error fetching albums", err);
            alert("Failed to load albums. Please try again later.");
        }

    });

    document.getElementById("closeModal").addEventListener("click", async () => {
        document.getElementById("uploadModal").style.display = "none";
    });


    document.getElementById("albumId").addEventListener("change", (e) => {
        const newAlbumForm = document.getElementById("newAlbumForm")
        if (e.target.value === "new") {
            newAlbumForm.style.display = "block"
            document.getElementById("newAlbumName").required = true;
            document.getElementById("cover").required = true;
            document.getElementById("newAlbumDescription").required = true;
        }
        else {
            newAlbumForm.style.display = "none"
            document.getElementById("newAlbumName").required = false;
            document.getElementById("cover").required = false;
            document.getElementById("newAlbumDescription").required = false;

        }
    });

    document.getElementById("uploadForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const songFile = document.getElementById("song").files[0];
        const songTitle = document.getElementById("songTitle").value;
        const artistName = document.getElementById("artistName").value;
        const albumId = document.getElementById("albumId").value;

        const formData = new FormData();
        formData.append("song", songFile);
        formData.append("title", songTitle);
        formData.append("artist", artistName);

        // let url = "";

        if (albumId === "new") {
            const newAlbumName = document.getElementById("newAlbumName").value;
            const newAlbumCover = document.getElementById("cover").files[0];
            const newAlbumDescription = document.getElementById("newAlbumDescription").value;

            formData.append("newAlbumName", newAlbumName);
            // formData.append("newAlbumCover", newAlbumCover);
            formData.append("cover", newAlbumCover);
            formData.append("newAlbumDescription", newAlbumDescription);

            // url = `/songs/${newAlbumName}/uploadSong`;
        }
        else {
            formData.append("albumId", albumId);

            // url = `/songs/${document.querySelector("#albumId option:checked").textContent}/uploadSong`;
        }

        // let url = albumName === "new" ? `/songs/createNewAlbum/uploadSong` : `/songs/${albumName}/uploadSong`;
        // let url = albumId === "new"
        //     ? `/songs/${newAlbumName}/uploadSong`
        //     : `/songs/${document.querySelector("#albumId option:checked").textContent}/uploadSong`;

        let url;
        if (albumId === "new") {
            const newAlbumName = document.getElementById("newAlbumName").value;
            if (!newAlbumName) {
                alert("New album name is required.");
                return;
            }
            url = `/songs/${newAlbumName}/uploadSong`;
        } else {
            const albumName = document.querySelector("#albumId option:checked").textContent;
            if (!albumName) {
                alert("Please select an album.");
                return;
            }
            url = `/songs/${albumName}/uploadSong`;
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });


            let data = await response.json();
            if (data.success) {
                alert('Song uploaded successfully!');
                document.getElementById('uploadModal').style.display = 'none';
            }
            else {
                alert("Failed to upload song." + data.message)
            }

        } catch (err) {
            console.error('Error uploading song:', err);
            alert('An error occurred. Please try again.');
        }
    });


}

main();

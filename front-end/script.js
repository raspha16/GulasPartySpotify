var serviceHost = "https://spotify.henryvaun.workers.dev";
var spotifyUser = "Dj Spotify";

var songData;

function updatePlayer() {
    fetch(`${serviceHost}/get-now-playing`)
        .then((response) => response.json())
        .then((data) => {
            // 1. Check if data exists and if a track is actually actively playing
            if (!data || data.is_playing === false || !data.item) {
                document.getElementById("player-song").innerHTML = `${spotifyUser} isn't playing anything now.`;
                document.getElementById("player-artist").innerHTML = " ";
                document.getElementById("player-album-art").setAttribute("src", "");
                return;
            }

            songData = data;

            // 2. Handle standard music tracks
            if (data.currently_playing_type === "track") {
                // Extract artist names from the array and join them with commas
                const artistNames = data.item.artists.map(artist => artist.name).join(", ");
                // Safely grab the first high-res album image
                const albumArt = data.item.album.images[0] ? data.item.album.images[0].url : "";

                document.getElementById("player-song").innerHTML = data.item.name;
                document.getElementById("player-artist").innerHTML = artistNames;
                document.getElementById("player-album-art").setAttribute("src", albumArt);

                // Update progress bar
                document.getElementById("player-progress").style.width = `${(data.progress_ms * 100) / data.item.duration_ms}%`;
            } 
            
            // 3. Handle podcast episodes
            else if (data.currently_playing_type === "episode") {
                const episodeArt = data.item.images[0] ? data.item.images[0].url : "";

                document.getElementById("player-song").innerHTML = data.item.name;
                document.getElementById("player-artist").innerHTML = data.item.show ? data.item.show.name : "Podcast";
                document.getElementById("player-album-art").setAttribute("src", episodeArt);

                // Update progress bar
                document.getElementById("player-progress").style.width = `${(data.progress_ms * 100) / data.item.duration_ms}%`;
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            document.getElementById("player-song").innerHTML = "Error fetching data.";
        });
}

// Load player for the first time
updatePlayer();

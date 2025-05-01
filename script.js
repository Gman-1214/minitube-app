let currentUser = null;

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "{}");
}

function register() {
    const username = document.getElementById("authUsername").value;
    const password = document.getElementById("authPassword").value;
    const users = getUsers();

    if (users[username]) {
        alert("User already exists!");
        return;
    }

    users[username] = { password };
    saveUsers(users);
    alert("Registered successfully! You can now log in.");
}

function login() {
    const username = document.getElementById("authUsername").value;
    const password = document.getElementById("authPassword").value;
    const users = getUsers();

    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem("currentUser", username);
        loadApp();
    } else {
        alert("Invalid login.");
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    document.getElementById("appSection").style.display = "none";
    document.getElementById("authSection").style.display = "block";
}

function loadApp() {
    document.getElementById("currentUser").textContent = currentUser;
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    displayVideos();
}

function uploadVideo() {
    const fileInput = document.getElementById("videoUpload");
    const title = document.getElementById("videoTitle").value.trim();
    const description = document.getElementById("videoDescription").value.trim();
    const file = fileInput.files[0];

    if (!file || !currentUser) return alert("Login and select a video!");

    const videoURL = URL.createObjectURL(file);
    const videoId = Date.now();
    const videoData = {
        id: videoId,
        title: title || "Untitled",
        description: description || "No description.",
        uploader: currentUser,
        url: videoURL,
        likes: 0
    };

    const videos = getVideos();
    videos.push(videoData);
    saveVideos(videos);
    displayVideos();

    fileInput.value = "";
    document.getElementById("videoTitle").value = "";
    document.getElementById("videoDescription").value = "";
}

function getVideos() {
    return JSON.parse(localStorage.getItem("videos") || "[]");
}

function saveVideos(videos) {
    localStorage.setItem("videos", JSON.stringify(videos));
}

function displayVideos() {
    const videoList = document.getElementById("videoList");
    videoList.innerHTML = "";

    getVideos().forEach(video => {
        const card = document.createElement("div");
        card.className = "videoCard";

        card.innerHTML = `
            <h3>${video.title}</h3>
            <p>${video.description}</p>
            <p><strong>Uploaded by:</strong> ${video.uploader}</p>
            <video src="${video.url}" controls></video>
            <button onclick="likeVideo(${video.id})">👍 ${video.likes} Likes</button>
        `;

        videoList.appendChild(card);
    });
}

function likeVideo(id) {
    if (!currentUser) {
        alert("You must be logged in to like videos!");
        return;
    }

    const videos = getVideos();
    const video = videos.find(v => v.id === id);
    if (!video) return;

    video.likes++;
    saveVideos(videos);
    displayVideos();
}

function toggleTheme() {
    const darkMode = document.getElementById("themeToggle").checked;
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
}

function searchVideos() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const videoCards = document.querySelectorAll(".videoCard");

    videoCards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(searchValue) ? "block" : "none";
    });
}

window.onload = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeToggle").checked = true;
    }

    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
        currentUser = savedUser;
        loadApp();
    }
};

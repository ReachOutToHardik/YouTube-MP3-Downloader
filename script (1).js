const apiKey = "7350a6b1e1msh72420d6adbdc779p1bf8fcjsnddbf943c1614";
const apiHost = "yt-search-and-download-mp3.p.rapidapi.com";
const convertBtn = document.getElementById("convert-btn");
const loadingDiv = document.getElementById("loading");
const loadingText = document.getElementById("loading-text");
const refreshBtn = document.getElementById("refresh-btn");
const ytUrlInput = document.getElementById("yt-url");

const loadingMessages = [
  "Preparing your file...",
  "Almost there...",
  "Getting the MP3 ready...",
  "Just a moment, please...",
];

let loadingInterval;

convertBtn.addEventListener("click", function () {
  const videoUrl = ytUrlInput.value;
  if (!videoUrl) {
    alert("Please enter a YouTube URL.");
    return;
  }

  fetchMP3(videoUrl);
});

function fetchMP3(videoUrl) {
  showLoading();

  fetch(
    `https://yt-search-and-download-mp3.p.rapidapi.com/mp3?url=${encodeURIComponent(
      videoUrl
    )}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      if (data.success && data.download) {
        const fileName = formatTitle(data.title); // Format title to use as file name
        initiateDownload(data.download, fileName);
      } else {
        alert("Failed to retrieve MP3 link. Please try with a different URL.");
      }
    })
    .catch((error) => {
      hideLoading();
      console.error("Error fetching MP3:", error);
      alert("Failed to download MP3. Try again.");
    });
}

function showLoading() {
  loadingDiv.classList.remove("hidden");
  refreshBtn.classList.add("hidden");

  loadingInterval = setInterval(() => {
    loadingText.textContent =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }, 1000);
}

function hideLoading() {
  clearInterval(loadingInterval);
  loadingDiv.classList.add("hidden");
}

function formatTitle(title) {
  return title.replace(/[<>:"/\\|?*]+/g, "").trim() + ".mp3";
}

function initiateDownload(mp3Url, fileName) {
  const downloadLink = document.createElement("a");
  downloadLink.href = mp3Url;
  downloadLink.download = fileName; // Set formatted title as file name
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  refreshBtn.classList.remove("hidden");
}

refreshBtn.addEventListener("click", function () {
  ytUrlInput.value = "";
  refreshBtn.classList.add("hidden");
});

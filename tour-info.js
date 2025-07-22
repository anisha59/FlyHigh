document.addEventListener("DOMContentLoaded", () => {
  const title = localStorage.getItem('title') || 'Tour Title';
  const description = localStorage.getItem('description') || 'No description available.';
  const image = localStorage.getItem('image') || 'images/default.jpg';
  const itinerary = localStorage.getItem('itinerary') || 'No itinerary available.';
  const highlightsRaw = localStorage.getItem('highlights');
  const highlights = highlightsRaw ? JSON.parse(highlightsRaw) : [];

  document.getElementById("tour-title").innerText = title;
  document.getElementById("tour-description").innerText = description;
  document.getElementById("tour-image").src = image;
  document.getElementById("tour-itinerary").innerText = itinerary;

  const highlightsList = document.getElementById("tour-highlights");
  highlightsList.innerHTML = '';
  highlights.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    highlightsList.appendChild(li);
  });
});

// Animation toggle function
function toggleTourDetails() {
  const details = document.getElementById("details-container");
  const button = document.querySelector(".btn");
  const isShown = details.classList.contains("show");

  if (isShown) {
    details.classList.remove("show");
    button.innerText = "View Tour Details";
  } else {
    details.classList.add("show");
    button.innerText = "Hide Tour Details";
  }
}

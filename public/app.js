const searchForm = document.getElementById("search-form");
const query = document.getElementById("query");
const resultsContainer = document.getElementById("results-container");
const downloadBtn = document.getElementById("download-btn");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resultsContainer.innerHTML = null;
  fetch(`/search?query=${encodeURIComponent(query.value)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        downloadBtn.style.display = "block";
        downloadBtn.onclick = () => downloadJSON(data);
      } else {
        downloadBtn.style.display = "none";
      }
      
      data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.classList.add("result-item");
        listItem.innerHTML = `
          <a class="result-link" target="_blank" href="${item.link}">
              <h3 class="result-title">${item.title}</h3>
          </a>
          <p class="result-content">${item.snippet}</p>
        `;
        resultsContainer.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      downloadBtn.style.display = "none";
    });
});

function downloadJSON(data) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "results.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

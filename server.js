const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Nastavení cesty pro statické soubory
app.use(express.static(path.join(__dirname, "public")));

// Nastavení hlavní cesty
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint pro vyhledávání na Google
app.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    const results = await getGoogleResults(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Funkce pro získání výsledků z Google pomocí Google Search API
async function getGoogleResults(query) {
  const apiKey = "YOUR_GOOGLE_API_KEY";
  const cx = "YOUR_CUSTOM_SEARCH_ENGINE_ID";
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query
  )}&cx=${cx}&key=${apiKey}`;
  const response = await axios.get(url);
  return response.data.items.map((item) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
  }));
}

// Spuštění serveru
app.listen(port, () => {
  console.log(`Server běží na adrese http://localhost:${port}`);
});

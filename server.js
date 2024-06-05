const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000; // změna zde

// Servírování statických souborů
app.use(express.static(path.join(__dirname)));

app.get("/search", async (req, res) => {
  const query = req.query.query;
  const results = await getGoogleResults(query);
  res.json(results);
});

async function getGoogleResults(query) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`
  );

  const results = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll(".tF2Cxc").forEach((item) => {
      const title = item.querySelector("h3")?.innerText || "";
      const link = item.querySelector("a")?.href || "";
      const snippet = item.querySelector(".aCOpRe")?.innerText || "";
      items.push({ title, link, snippet });
    });
    return items;
  });

  await browser.close();
  return results;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

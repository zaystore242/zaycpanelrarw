const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const ua = (req.get("User-Agent") || "").toLowerCase();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const blockedAgents = ["curl", "wget", "python", "axios", "node-fetch", "go-http-client", "httpie"];
  if (blockedAgents.some(agent => ua.includes(agent))) {
    console.log(`🚫 BLOCKED BOT | IP: ${ip} | UA: ${ua}`);
    return res.status(403).send("🚫 Codes Tidak Dapat Diakses: Developer Kenzie 😴");
  }
  const forbiddenExt = [".js", ".css", ".json", ".html"];
  if (forbiddenExt.some(ext => req.path.toLowerCase().endsWith(ext))) {
    console.log(`🚷 BLOCKED FILE: ${req.path}`);
    return res.redirect("/404");
  }
  next();
});

app.use(express.static(path.join(__dirname)));

const protectUI = (req, res, next) => {
  const ua = (req.get("User-Agent") || "").toLowerCase();
  const ref = req.get("Referer") || "";
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const blockedAgents = ["curl", "wget", "python", "axios", "node-fetch", "go-http-client", "httpie"];
  if (blockedAgents.some(agent => ua.includes(agent))) {
    console.log(`🚫 BLOCKED BOT | IP: ${ip} | UA: ${ua}`);
    return res.status(403).send("🚫 Tidak Bisa GET File Ini 😎");
  }
  if (!ref) {
    console.log(`⚠️ Direct access to protected file: ${req.path}`);
    return res.status(403).send(`
      <html style="background:#000;color:#79c65f;font-family:monospace;text-align:center;padding-top:10%;">
      <h1>🚫 Akses Ditolak</h1>
      <p>File ini tidak dapat diakses langsung.</p>
      </html>
    `);
  }
  next();
};

app.get("/404", (req, res) => res.status(404).sendFile(path.join(__dirname, "404.html")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/val", protectUI, (req, res) => {
  try {
    const val = require("./login/login.js");
    res.setHeader("Content-Type", "application/json");
    res.json(val);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/set", protectUI, (req, res) => {
  try {
    const set = require("./configs/set.js");
    res.setHeader("Content-Type", "application/json");
    res.json(set);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/css", protectUI, (req, res) => res.sendFile(path.join(__dirname, "styles", "style.css")));
app.get("/js", protectUI, (req, res) => res.sendFile(path.join(__dirname, "styles", "script.js")));

app.get("/users", (req, res) => res.sendFile(path.join(__dirname, "users", "dashboard_user.html")));
app.get("/cuser", protectUI, (req, res) => res.sendFile(path.join(__dirname, "styles", "usercss.css")));
app.get("/juser", protectUI, (req, res) => res.sendFile(path.join(__dirname, "styles", "userjs.js")));

app.get("/admins", (req, res) => res.sendFile(path.join(__dirname, "users", "dashboard_admin.html")));
app.get("/cadmin", protectUI, (req, res) => res.sendFile(path.join(__dirname, "styles", "admincss.css")));
app.get("/jadmin", protectUI, (req, res) => res.sendFile(path.join(__dirname, "styles", "adminjs.js")));

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "404.html")));

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
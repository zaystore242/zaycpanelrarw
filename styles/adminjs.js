const u = localStorage.getItem("username"), r = localStorage.getItem("role");
if (!u || r !== "admin") window.location.href = "/";
document.getElementById("username").innerText = u;
document.getElementById("usernameHeader").innerText = u;

const sidebar = document.getElementById("sidebar");
const main = document.getElementById("mainContent");
const toggle = document.getElementById("toggleBtn");

window.addEventListener("load", () => {
  sidebar.classList.add("hidden");
  main.classList.add("sidebar-hidden");
});

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  main.classList.toggle("sidebar-hidden");
});

let startX = null;
document.body.addEventListener("touchstart", e => startX = e.touches[0].clientX);
document.body.addEventListener("touchmove", e => {
  if (!startX) return;
  let diff = e.touches[0].clientX - startX;
  if (diff > 100) { sidebar.classList.remove("hidden"); main.classList.remove("sidebar-hidden"); }
  if (diff < -100) { sidebar.classList.add("hidden"); main.classList.add("sidebar-hidden"); }
});

function logout() {
  localStorage.clear();
  window.location.href = "/";
}

function createPanel() {
  main.innerHTML = `
  <h1>Create Panel</h1>
  <div class="create-container">
    <div class="form-card">
      <h3>Input Data</h3>
      <input id="nameserver" placeholder="Nama Server">
      <input id="password" placeholder="Password" type="text">
      <input id="disk" placeholder="Disk (MB)" type="number">
      <input id="cpu" placeholder="CPU (%)" type="number">
      <button class="create-btn" onclick="sendCreate()">CREATE PANEL</button>
    </div>
    <div id="consoleOutput" class="console-box">
<b>Console Output:</b>\nMenunggu input admin...
    </div>
    <button id="copyBtn" class="copy-btn">Copy Output</button>
  </div>`;
}

async function sendCreate() {
  const name = document.getElementById("nameserver").value.trim();
  const pass = document.getElementById("password").value.trim();
  const disk = document.getElementById("disk").value.trim();
  const cpu = document.getElementById("cpu").value.trim();
  const consoleBox = document.getElementById("consoleOutput");
  const copyBtn = document.getElementById("copyBtn");

  if (!name || !pass || !disk || !cpu) {
    alert("⚠️ Semua field wajib diisi!");
    return;
  }

  consoleBox.innerText = "⏳ Memuat konfigurasi API...\n";

  try {
    const configRes = await fetch("/set");
    const config = await configRes.json();
    const { domain, apikeyptero, capikeyptero } = config;

    consoleBox.innerText = "⚙️ Mengirim permintaan ke API...\n";

    const url = `https://apiz.vsunsee.click/vsunseeV8/create?domain=${encodeURIComponent(domain)}&apikeyptero=${apikeyptero}&capikeyptero=${capikeyptero}&nameserver=${encodeURIComponent(name)}&password=${encodeURIComponent(pass)}&disk=${disk}&cpu=${cpu}&rootadmin=true`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === true && data.data) {
      const d = data.data;
      const output =
`✅ Panel Berhasil Dibuat!

🧱 ID User : ${d.id_user}
⚙️ ID Server : ${d.id_server}
🌐 Domain : ${d.domain_panel}
🧾 Nama Server : ${d.nama_server}
👤 Username : ${d.username}
🔑 Password : ${d.password}
🔒 Root Admin : ${d.root_admin}

Simpan data di atas dengan aman!`;
      consoleBox.innerText = output;
      copyBtn.style.display = "inline-block";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(output);
        alert("✅ Data panel berhasil disalin!");
      };
    } else {
      consoleBox.innerText = "⚠️ API Error:\n" + JSON.stringify(data, null, 2);
    }
  } catch (err) {
    consoleBox.innerText = "❌ Gagal memproses API:\n" + err;
  }
}

async function listServer() {
  main.innerHTML = "<h1>List Server</h1><div class='card'><p>⏳ Mengambil data server...</p></div>";
  try {
    const configRes = await fetch("/set");
    const config = await configRes.json();
    const { domain, capikeyptero } = config;

    const url = `https://apiz.vsunsee.click/vsunseeV8/listserver?domain=${encodeURIComponent(domain)}&capikey=${capikeyptero}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === true && data.result && data.result.length > 0) {
      let html = "<div class='card'><h3>Daftar Server Aktif</h3>";
      data.result.forEach(s => {
        html += `
        <div style='border-bottom:1px solid #444;margin-bottom:8px;padding-bottom:6px;font-size:9px'>
          🧱 <b>${s.name}</b><br>
          🆔 ID: ${s.id} | 👤 User ID: ${s.user_id}<br>
          🧩 Identifier: ${s.identifier}<br>
          🧬 UUID: ${s.uuid}<br>
          🛰️ Node: ${s.node} | ⚙️ Status: ${s.status}
        </div>`;
      });
      html += "</div>";
      main.innerHTML = "<h1>List Server</h1>" + html;
    } else {
      main.innerHTML = "<div class='card'><p>⚠️ Tidak ada server terdaftar.</p></div>";
    }
  } catch (err) {
    main.innerHTML = "<div class='card'><p>❌ Gagal memuat data server: " + err + "</p></div>";
  }
}
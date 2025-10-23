for (let i = 0; i < 80; i++) {
  const s = document.createElement("div");
  s.classList.add("star");
  s.style.top = Math.random() * 100 + "vh";
  s.style.left = Math.random() * 100 + "vw";
  s.style.animationDelay = Math.random() * 3 + "s";
  document.body.appendChild(s);
}

for (let i = 0; i < 25; i++) {
  const p = document.createElement("div");
  p.classList.add("particle");
  p.style.left = Math.random() * 100 + "vw";
  p.style.animationDuration = 3 + Math.random() * 5 + "s";
  p.style.animationDelay = Math.random() * 5 + "s";
  document.body.appendChild(p);
}

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loadingScreen").style.display = "none";
    autoRedirect(); 
  }, 2000);
});

function autoRedirect() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (username && role) {
    
    if (role === "admin") {
      window.location.href = "/admins";
    } else if (role === "user") {
      window.location.href = "/users";
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const u = document.querySelector('input[name="username"]').value.trim();
  const p = document.querySelector('input[name="password"]').value.trim();
  const r = document.querySelector('select[name="role"]').value;

  if (!u || !p || !r) {
    alert("⚠️ Lengkapi semua data login terlebih dahulu!");
    return false;
  }

  try {
    const res = await fetch("/val");
    const data = await res.json();

    let f = null;
    if (r === "admin") {
      f = data.admins?.find(a => a.username === u && a.password === p);
    } else if (r === "user") {
      f = data.users?.find(a => a.username === u && a.password === p);
    }

    if (f) {
      const loader = document.getElementById("loadingScreen");
      loader.style.display = "flex";
      loader.style.opacity = "1";

      localStorage.setItem("username", u);
      localStorage.setItem("role", r);

      setTimeout(() => {
        if (r === "admin") {
          window.location.href = "/admins";
        } else {
          window.location.href = "/users";
        }
      }, 1500);
    } else {
      alert("❌ Username atau password salah!");
    }
  } catch (err) {
    alert("🚫 Gagal memuat data login (/val):\n" + err);
  }

  return false;
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("roleSelect").addEventListener("change", function () {
  const c = document.getElementById("loginContainer");
  c.classList.remove("user", "admin");
  if (this.value === "admin") c.classList.add("admin");
  else if (this.value === "user") c.classList.add("user");
});
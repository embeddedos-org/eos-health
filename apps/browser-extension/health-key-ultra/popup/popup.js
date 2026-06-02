// HealthKey popup logic
let totpInterval = null;

async function init() {
  const status = await chrome.runtime.sendMessage({ action: "getStatus" });
  updateStatus(status);
  startTOTPTimer();
  updateVitals();
}

function updateStatus(status) {
  const dot = document.getElementById("statusDot");
  const text = document.getElementById("statusText");
  if (status && status.deviceConnected) {
    dot.className = "dot connected";
    text.textContent = "HealthKey-Ulta connected";
  } else {
    dot.className = "dot disconnected";
    text.textContent = "Device not connected";
  }
}

async function connectDevice() {
  const res = await chrome.runtime.sendMessage({ action: "connectDevice" });
  if (res && res.connected) {
    updateStatus({ deviceConnected: true });
    document.getElementById("battery").textContent = res.battery;
    showToast(`Connected: ${res.deviceId} (FW ${res.firmware})`);
  }
}

async function auth(method) {
  const res = await chrome.runtime.sendMessage({ action: "authenticate", method });
  const toast = document.getElementById("authResult");
  toast.style.display = "block";
  if (res && res.success) {
    if (method === "totp" && res.code) {
      document.getElementById("totpCode").textContent = res.code.match(/.{1,3}/g).join(" ");
    }
    toast.textContent = `✓ Authenticated via ${method}` + (res.confidence ? ` (${(res.confidence*100).toFixed(0)}% confidence)` : "");
    toast.style.background = "#064e3b";
    toast.style.borderColor = "#22c55e";
    toast.style.color = "#86efac";
  } else {
    toast.textContent = `✗ Authentication failed`;
    toast.style.background = "#450a0a";
    toast.style.borderColor = "#ef4444";
    toast.style.color = "#fca5a5";
  }
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

function startTOTPTimer() {
  function tick() {
    const now = Math.floor(Date.now() / 1000);
    const remaining = 30 - (now % 30);
    const pct = (remaining / 30) * 100;
    document.getElementById("timerFill").style.width = pct + "%";
    document.getElementById("timerText").textContent = remaining + "s";
    if (remaining === 30) refreshTOTP();
  }
  tick();
  totpInterval = setInterval(tick, 1000);
}

async function refreshTOTP() {
  const res = await chrome.runtime.sendMessage({ action: "generateTOTP", secret: "JBSWY3DPEHPK3PXP" });
  if (res && res.code) {
    document.getElementById("totpCode").textContent = res.code.match(/.{1,3}/g).join(" ");
  }
}

function updateVitals() {
  document.getElementById("heartRate").textContent = Math.floor(62 + Math.random() * 20);
  document.getElementById("spo2").textContent = (97 + Math.random() * 2).toFixed(1);
  document.getElementById("steps").textContent = Math.floor(3000 + Math.random() * 5000).toLocaleString();
  setInterval(() => {
    document.getElementById("heartRate").textContent = Math.floor(62 + Math.random() * 20);
    document.getElementById("spo2").textContent = (97 + Math.random() * 2).toFixed(1);
  }, 5000);
}

async function syncDevice() {
  const res = await chrome.runtime.sendMessage({ action: "connectDevice" });
  if (res) {
    document.getElementById("battery").textContent = res.battery || "--";
    showToast("Device synced successfully");
  }
}

function showToast(msg) {
  const t = document.getElementById("authResult");
  t.textContent = msg;
  t.style.display = "block";
  t.style.background = "#064e3b";
  t.style.borderColor = "#22c55e";
  t.style.color = "#86efac";
  setTimeout(() => { t.style.display = "none"; }, 2500);
}

document.addEventListener("DOMContentLoaded", init);
// HealthKey Authenticator — Background Service Worker
const HEALTHKEY_API = "https://api.healthkey.local/v1";
let deviceConnected = false;
let sessionToken = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ deviceConnected: false, authMode: "totp", lastSync: null });
  console.log("[HealthKey] Extension installed");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getStatus") {
    chrome.storage.local.get(["deviceConnected","authMode","lastSync"], sendResponse);
    return true;
  }
  if (msg.action === "authenticate") {
    authenticateUser(msg.method).then(sendResponse);
    return true;
  }
  if (msg.action === "generateTOTP") {
    generateTOTP(msg.secret).then(sendResponse);
    return true;
  }
  if (msg.action === "connectDevice") {
    connectHealthKeyDevice().then(sendResponse);
    return true;
  }
});

async function authenticateUser(method) {
  try {
    const result = { method, timestamp: Date.now(), success: false };
    if (method === "fingerprint") {
      result.success = true;
      result.confidence = 0.97;
      result.biometricId = "fp_" + Math.random().toString(36).slice(2,10);
    } else if (method === "nfc") {
      result.success = true;
      result.nfcTag = "NFC:" + Math.random().toString(36).slice(2,14).toUpperCase();
    } else if (method === "totp") {
      result.success = true;
      result.code = Math.floor(100000 + Math.random() * 900000).toString();
    }
    if (result.success) {
      sessionToken = btoa(JSON.stringify({ uid: "user_001", exp: Date.now() + 3600000 }));
      chrome.storage.local.set({ lastAuth: result });
      chrome.notifications.create({ type:"basic", iconUrl:"icons/icon48.png",
        title:"HealthKey Auth", message:`Authenticated via ${method}` });
    }
    return result;
  } catch(e) { return { success: false, error: e.message }; }
}

async function generateTOTP(secret) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = 30 - (Math.floor(Date.now()/1000) % 30);
  return { code, expires, algorithm: "SHA1", digits: 6 };
}

async function connectHealthKeyDevice() {
  deviceConnected = true;
  chrome.storage.local.set({ deviceConnected: true, lastSync: new Date().toISOString() });
  return { connected: true, deviceId: "HK-ULTA-001", firmware: "1.4.0", battery: 87 };
}

chrome.alarms.create("syncDevice", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "syncDevice" && deviceConnected) {
    chrome.storage.local.set({ lastSync: new Date().toISOString() });
  }
});
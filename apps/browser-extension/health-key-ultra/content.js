// HealthKey Authenticator — Content Script
(function() {
  'use strict';
  const SELECTORS = ['input[type="password"]','input[name*="pass"]','input[name*="auth"]','input[id*="otp"]'];

  function injectHealthKeyButton(input) {
    if (input.dataset.healthkeyInjected) return;
    input.dataset.healthkeyInjected = "true";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "🔑 HealthKey";
    btn.style.cssText = "margin-left:6px;padding:4px 10px;background:#0ea5e9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;";
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const res = await chrome.runtime.sendMessage({ action: "authenticate", method: "totp" });
      if (res && res.success && res.code) {
        input.value = res.code;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    input.parentNode.insertBefore(btn, input.nextSibling);
  }

  function scanAndInject() {
    SELECTORS.forEach(sel => document.querySelectorAll(sel).forEach(injectHealthKeyButton));
  }

  scanAndInject();
  const observer = new MutationObserver(scanAndInject);
  observer.observe(document.body, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "fillOTP" && msg.code) {
      const otp = document.querySelector('input[name*="otp"],input[id*="otp"],input[autocomplete="one-time-code"]');
      if (otp) { otp.value = msg.code; otp.dispatchEvent(new Event("input",{bubbles:true})); }
    }
  });
})();
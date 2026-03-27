let lastScanResult = null;

const statusElement = document.getElementById("status");
const resultCountElement = document.getElementById("result-count");
const resultsListElement = document.getElementById("results-list");
const exportButton = document.getElementById("export-button");

const profileInputs = {
  name: document.getElementById("name-input"),
  email: document.getElementById("email-input"),
  url: document.getElementById("url-input"),
  comment: document.getElementById("comment-input")
};

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    throw new Error("No active tab found.");
  }

  return tab;
}

async function sendMessageToActiveTab(message) {
  const tab = await getActiveTab();
  return chrome.tabs.sendMessage(tab.id, message);
}

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.color = isError ? "#fca5a5" : "#cbd5e1";
}

function renderResults(scanResult) {
  resultCountElement.textContent = String(scanResult?.matchedForms || 0);
  resultsListElement.innerHTML = "";

  if (!scanResult?.forms?.length) {
    resultsListElement.innerHTML = '<p class="empty">No forms with both email and URL fields were detected.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  scanResult.forms.forEach((form) => {
    const card = document.createElement("article");
    card.className = "result-card";

    const title = document.createElement("strong");
    title.textContent = form.id || form.selector || `Form #${form.formIndex + 1}`;

    const kind = document.createElement("p");
    kind.textContent = `Kind: ${form.formKind} | CMS: ${form.cmsGuess}`;

    const method = document.createElement("p");
    method.textContent = `Method: ${form.method.toUpperCase()} | Fields: ${form.fieldCount}`;

    const action = document.createElement("p");
    action.textContent = `Action: ${form.action}`;

    const tags = document.createElement("p");
    tags.textContent = `Email fields: ${form.emailFields.length} | URL fields: ${form.urlFields.length}`;

    const security = document.createElement("p");
    security.textContent = `Security: captcha=${form.securitySignals.hasCaptcha} | csrf-like=${form.securitySignals.hasCsrfLikeField} | password=${form.securitySignals.hasPasswordField}`;

    card.append(title, kind, method, action, tags, security);
    fragment.appendChild(card);
  });

  resultsListElement.appendChild(fragment);
}

async function handleScan() {
  setStatus("Scanning active page...");

  try {
    lastScanResult = await sendMessageToActiveTab({ type: "SCAN_FORMS" });
    exportButton.disabled = !lastScanResult?.forms?.length;
    renderResults(lastScanResult);

    const pageSignals = lastScanResult.pageSignals || {};
    const domObservation = lastScanResult.domObservation || {};
    const cmsSummary = pageSignals.generator || pageSignals.hostname || "current page";

    setStatus(
      `Scan finished. Found ${lastScanResult.matchedForms} matching form(s) on ${cmsSummary}. DOM mutations observed: ${domObservation.mutationCount || 0}.`
    );
  } catch (error) {
    exportButton.disabled = true;
    renderResults(null);

    const fallbackMessage =
      "Scan failed. Open a normal http/https page and make sure the content script is allowed there.";

    setStatus(error instanceof Error ? `${error.message} ${fallbackMessage}` : fallbackMessage, true);
  }
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url,
    filename,
    saveAs: true
  });

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function handleExport() {
  if (!lastScanResult) {
    setStatus("Run a scan before exporting.", true);
    return;
  }

  const hostname = lastScanResult.page?.hostname || "page";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  downloadJson(`form-research/${hostname}-${timestamp}.json`, lastScanResult);
  setStatus("JSON export started.");
}

async function handleAutofill() {
  setStatus("Sending autofill request...");

  try {
    const result = await sendMessageToActiveTab({
      type: "AUTOFILL_TEST_FIELDS",
      payload: {
        name: profileInputs.name.value.trim(),
        email: profileInputs.email.value.trim(),
        url: profileInputs.url.value.trim(),
        comment: profileInputs.comment.value.trim()
      }
    });

    if (!result?.ok) {
      throw new Error(result?.reason || result?.error || "Autofill failed.");
    }

    setStatus(`Autofill completed for ${result.filledForms} matching form(s) on ${result.hostname}.`);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Autofill failed.", true);
  }
}

document.getElementById("scan-button").addEventListener("click", handleScan);
document.getElementById("export-button").addEventListener("click", handleExport);
document.getElementById("autofill-button").addEventListener("click", handleAutofill);
document.addEventListener("DOMContentLoaded", () => {
  handleScan().catch(() => {
    setStatus("Ready. Run a manual scan if the page finishes rendering later.");
  });
});

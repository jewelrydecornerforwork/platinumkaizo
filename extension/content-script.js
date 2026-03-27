const EMAIL_HINTS = ["email", "e-mail", "mail"];
const URL_HINTS = ["url", "website", "site", "homepage", "web"];
const NAME_HINTS = ["name", "author", "nickname", "user"];
const COMMENT_HINTS = ["comment", "message", "content", "body"];

const TEST_SITE_ALLOWLIST = [
  "localhost",
  "127.0.0.1",
  ".localtest.me",
  "example.test"
];

const DEFAULT_AUTOFILL_PROFILE = {
  name: "Research Tester",
  email: "researcher@example.test",
  url: "https://example.test",
  comment: "Academic comment form structure test."
};

const CAPTCHA_SELECTORS = [
  ".g-recaptcha",
  ".h-captcha",
  "[id*='captcha']",
  "[class*='captcha']",
  "iframe[src*='recaptcha']",
  "iframe[src*='hcaptcha']"
];

const observedDomState = {
  observerStartedAt: null,
  mutationCount: 0,
  lastMutationAt: null
};

function escapeCssIdentifier(value) {
  return String(value || "").replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function getAssociatedLabelText(element) {
  const directLabel = typeof element.closest === "function" ? element.closest("label") : null;

  if (directLabel) {
    return normalizeText(directLabel.textContent);
  }

  if (element.labels?.length) {
    return normalizeText(
      Array.from(element.labels)
        .map((label) => label.textContent)
        .join(" ")
    );
  }

  if (element.id) {
    const escapedId = escapeCssIdentifier(element.id);
    const explicitLabel = document.querySelector(`label[for="${escapedId}"]`);
    if (explicitLabel) {
      return normalizeText(explicitLabel.textContent);
    }
  }

  const container = element.closest("p, div, li, td, section, article");
  if (!container) {
    return null;
  }

  const label = container.querySelector("label");
  return label ? normalizeText(label.textContent) : null;
}

function collectFieldCandidateStrings(element) {
  return [
    element.getAttribute("type"),
    element.getAttribute("name"),
    element.getAttribute("id"),
    element.getAttribute("placeholder"),
    element.getAttribute("autocomplete"),
    element.getAttribute("aria-label"),
    getAssociatedLabelText(element)
  ]
    .map(normalizeValue)
    .filter(Boolean);
}

function matchesHints(element, hints) {
  const candidates = collectFieldCandidateStrings(element);
  return hints.some((hint) => candidates.some((candidate) => candidate.includes(hint)));
}

function isEmailField(element) {
  return normalizeValue(element.getAttribute("type")) === "email" || matchesHints(element, EMAIL_HINTS);
}

function isUrlField(element) {
  return normalizeValue(element.getAttribute("type")) === "url" || matchesHints(element, URL_HINTS);
}

function isNameField(element) {
  return matchesHints(element, NAME_HINTS);
}

function isCommentField(element) {
  if (element.tagName.toLowerCase() === "textarea") {
    return true;
  }

  return matchesHints(element, COMMENT_HINTS);
}

function getElementAttributes(element) {
  return Array.from(element.attributes).reduce((attributes, attribute) => {
    attributes[attribute.name] = attribute.value;
    return attributes;
  }, {});
}

function buildDomPath(element) {
  const segments = [];
  let current = element;

  while (current && current.nodeType === Node.ELEMENT_NODE && segments.length < 6) {
    let segment = current.tagName.toLowerCase();

    if (current.id) {
      segment += `#${current.id}`;
      segments.unshift(segment);
      break;
    }

    if (current.classList.length > 0) {
      segment += `.${Array.from(current.classList).slice(0, 2).join(".")}`;
    }

    const siblings = current.parentElement
      ? Array.from(current.parentElement.children).filter(
          (sibling) => sibling.tagName === current.tagName
        )
      : [];

    if (siblings.length > 1) {
      const index = siblings.indexOf(current) + 1;
      segment += `:nth-of-type(${index})`;
    }

    segments.unshift(segment);
    current = current.parentElement;
  }

  return segments.join(" > ");
}

function getVisibleTextSnippet(element, maxLength = 240) {
  return normalizeText(element.textContent).slice(0, maxLength) || null;
}

function inferFieldRole(field) {
  if (isEmailField(field)) {
    return "email";
  }

  if (isUrlField(field)) {
    return "url";
  }

  if (isNameField(field)) {
    return "name";
  }

  if (isCommentField(field)) {
    return "comment";
  }

  return "other";
}

function getHiddenFieldNames(form) {
  return Array.from(form.querySelectorAll("input[type='hidden']"))
    .map((field) => field.getAttribute("name") || field.id || "")
    .map(normalizeText)
    .filter(Boolean);
}

function getSubmitControls(form) {
  return Array.from(
    form.querySelectorAll("button, input[type='submit'], input[type='button']")
  ).map((control) => ({
    tagName: control.tagName.toLowerCase(),
    type: normalizeValue(control.getAttribute("type")) || null,
    name: control.getAttribute("name"),
    id: control.id || null,
    className: control.className || null,
    text: normalizeText(control.textContent || control.getAttribute("value"))
  }));
}

function inferFormKind(form, controls) {
  const candidateStrings = [
    form.getAttribute("id"),
    form.getAttribute("class"),
    form.getAttribute("action"),
    getVisibleTextSnippet(form)
  ]
    .map(normalizeValue)
    .filter(Boolean)
    .join(" ");

  const roles = controls.map(inferFieldRole);

  if (
    candidateStrings.includes("comment") ||
    roles.includes("comment") ||
    (roles.includes("email") && roles.includes("url") && roles.includes("name"))
  ) {
    return "comment";
  }

  if (candidateStrings.includes("profile") || candidateStrings.includes("homepage")) {
    return "profile";
  }

  if (candidateStrings.includes("contact") || candidateStrings.includes("message")) {
    return "contact";
  }

  if (candidateStrings.includes("newsletter") || candidateStrings.includes("subscribe")) {
    return "newsletter";
  }

  return "generic";
}

function inferCmsGuess(form) {
  const pageSignals = [
    document.querySelector("meta[name='generator']")?.getAttribute("content"),
    form.getAttribute("action"),
    ...Array.from(document.scripts).slice(0, 20).map((script) => script.src),
    ...Array.from(document.querySelectorAll("link[rel='stylesheet']")).slice(0, 20).map(
      (link) => link.href
    )
  ]
    .map(normalizeValue)
    .filter(Boolean)
    .join(" ");

  const hiddenNames = getHiddenFieldNames(form).join(" ").toLowerCase();

  if (
    pageSignals.includes("wp-content") ||
    pageSignals.includes("wp-includes") ||
    pageSignals.includes("wp-comments-post") ||
    hiddenNames.includes("comment_post_id")
  ) {
    return "wordpress";
  }

  if (pageSignals.includes("ghost")) {
    return "ghost";
  }

  if (pageSignals.includes("blogger") || pageSignals.includes("blogspot")) {
    return "blogger";
  }

  if (pageSignals.includes("disqus")) {
    return "disqus";
  }

  return "unknown";
}

function extractSecuritySignals(form, controls) {
  const hiddenNames = getHiddenFieldNames(form);
  const flattenedNames = hiddenNames.join(" ").toLowerCase();
  const hasPasswordField = controls.some(
    (control) => normalizeValue(control.getAttribute("type")) === "password"
  );
  const hasCaptcha = CAPTCHA_SELECTORS.some(
    (selector) => form.matches(selector) || Boolean(form.querySelector(selector))
  );

  return {
    hasCaptcha,
    hasPasswordField,
    hasCsrfLikeField:
      flattenedNames.includes("csrf") ||
      flattenedNames.includes("token") ||
      flattenedNames.includes("nonce"),
    hiddenFieldNames: hiddenNames
  };
}

function getPageSignals() {
  return {
    generator: document.querySelector("meta[name='generator']")?.getAttribute("content") || null,
    language: document.documentElement.lang || null,
    title: document.title,
    hostname: window.location.hostname
  };
}

function ensureDomObserver() {
  if (observedDomState.observerStartedAt || !document.documentElement) {
    return;
  }

  observedDomState.observerStartedAt = new Date().toISOString();

  const observer = new MutationObserver((mutations) => {
    observedDomState.mutationCount += mutations.length;
    observedDomState.lastMutationAt = new Date().toISOString();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["id", "class", "name", "type", "placeholder", "autocomplete", "aria-label"]
  });
}

function summarizeField(field) {
  return {
    tagName: field.tagName.toLowerCase(),
    type: normalizeValue(field.getAttribute("type")) || null,
    roleGuess: inferFieldRole(field),
    name: field.getAttribute("name"),
    id: field.id || null,
    className: field.className || null,
    label: getAssociatedLabelText(field),
    placeholder: field.getAttribute("placeholder"),
    required: field.required,
    disabled: field.disabled,
    autocomplete: field.getAttribute("autocomplete"),
    selector: buildDomPath(field),
    attributes: getElementAttributes(field)
  };
}

function extractFormMetadata(form, index) {
  const controls = Array.from(form.querySelectorAll("input, textarea, select"));
  const emailFields = controls.filter(isEmailField);
  const urlFields = controls.filter(isUrlField);

  if (emailFields.length === 0 || urlFields.length === 0) {
    return null;
  }

  return {
    formIndex: index,
    selector: buildDomPath(form),
    action: form.getAttribute("action") || window.location.href,
    method: (form.getAttribute("method") || "get").toLowerCase(),
    id: form.id || null,
    className: form.className || null,
    formKind: inferFormKind(form, controls),
    cmsGuess: inferCmsGuess(form),
    textSnippet: getVisibleTextSnippet(form),
    attributes: getElementAttributes(form),
    securitySignals: extractSecuritySignals(form, controls),
    submitControls: getSubmitControls(form),
    fieldCount: controls.length,
    emailFields: emailFields.map(summarizeField),
    urlFields: urlFields.map(summarizeField),
    fields: controls.map(summarizeField)
  };
}

function scanPageForms() {
  ensureDomObserver();

  const forms = Array.from(document.querySelectorAll("form"))
    .map((form, index) => extractFormMetadata(form, index))
    .filter(Boolean);

  return {
    scannedAt: new Date().toISOString(),
    page: {
      url: window.location.href,
      title: document.title,
      hostname: window.location.hostname
    },
    pageSignals: getPageSignals(),
    domObservation: { ...observedDomState },
    totalFormsOnPage: document.forms.length,
    matchedForms: forms.length,
    forms
  };
}

function isWhitelistedHost(hostname) {
  return TEST_SITE_ALLOWLIST.some((entry) => {
    if (entry.startsWith(".")) {
      return hostname.endsWith(entry);
    }

    return hostname === entry;
  });
}

function updateFieldValue(field, value) {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  const textAreaSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;

  if (field instanceof HTMLTextAreaElement && textAreaSetter) {
    textAreaSetter.call(field, value);
  } else if (field instanceof HTMLInputElement && nativeSetter) {
    nativeSetter.call(field, value);
  } else {
    field.value = value;
  }

  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

function autofillCandidateForms(profile) {
  const hostname = window.location.hostname;

  if (!isWhitelistedHost(hostname)) {
    return {
      ok: false,
      reason: `Host "${hostname}" is not in the test allowlist.`,
      allowlist: TEST_SITE_ALLOWLIST
    };
  }

  const data = { ...DEFAULT_AUTOFILL_PROFILE, ...profile };
  const results = [];

  Array.from(document.querySelectorAll("form")).forEach((form, index) => {
    const controls = Array.from(form.querySelectorAll("input, textarea, select"));
    const emailField = controls.find(isEmailField);
    const urlField = controls.find(isUrlField);

    if (!emailField || !urlField) {
      return;
    }

    const nameField = controls.find(isNameField);
    const commentField = controls.find(isCommentField);

    updateFieldValue(emailField, data.email);
    updateFieldValue(urlField, data.url);

    if (nameField && data.name) {
      updateFieldValue(nameField, data.name);
    }

    if (commentField && data.comment) {
      updateFieldValue(commentField, data.comment);
    }

    results.push({
      formIndex: index,
      selector: buildDomPath(form),
      filled: {
        email: summarizeField(emailField),
        url: summarizeField(urlField),
        name: nameField ? summarizeField(nameField) : null,
        comment: commentField ? summarizeField(commentField) : null
      }
    });
  });

  return {
    ok: true,
    hostname,
    filledForms: results.length,
    results
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  try {
    if (message?.type === "SCAN_FORMS") {
      ensureDomObserver();
      sendResponse(scanPageForms());
      return false;
    }

    if (message?.type === "AUTOFILL_TEST_FIELDS") {
      sendResponse(autofillCandidateForms(message.payload));
      return false;
    }
  } catch (error) {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown content script error."
    });
  }

  return false;
});

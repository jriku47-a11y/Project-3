/* ============================================================
   DEVFORGE — CONTACT FORM
   Client-side validation, honeypot spam trap, and an honest
   submission result. A success message is shown ONLY when the
   mail service confirms it accepted the message.
   ============================================================ */

(function () {
  "use strict";

  const CFG = window.DEVFORGE;
  if (!CFG || !CFG.contact) return;

  const C = CFG.contact;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setStatus(text, kind) {
    const el = $("#contactStatus");
    el.textContent = text || "";
    el.className = "form-status" + (kind ? " " + kind : "");
  }

  function clearError(fieldId, errorId) {
    const field = $(fieldId).closest(".field");
    const err = $(errorId);
    if (field) field.classList.remove("invalid");
    if (err) {
      err.hidden = true;
      err.textContent = "";
    }
  }

  function showError(fieldId, errorId, message) {
    const field = $(fieldId).closest(".field");
    const err = $(errorId);
    if (field) field.classList.add("invalid");
    if (err) {
      err.textContent = message;
      err.hidden = false;
    }
    $(fieldId).setAttribute("aria-invalid", "true");
  }

  function relayReady() {
    const r = C.relay || {};
    return Boolean(r.enabled && r.accessKey && String(r.accessKey).trim() && r.endpoint);
  }

  /** Tell the visitor plainly which route is live, so nobody writes a
      message that has nowhere to go. */
  function showNotice(message) {
    const notice = $("#formNotice");
    const text = $("#formNoticeText");
    if (!notice || !text) return;
    if (message) text.textContent = message;
    notice.hidden = false;
    const link = $("#noticeLinkedin");
    if (link && CFG.profile.links.linkedin) link.href = CFG.profile.links.linkedin;
  }

  function hideNotice() {
    const notice = $("#formNotice");
    if (notice) notice.hidden = true;
  }

  function validate() {
    const name = $("#contactName").value.trim();
    const email = $("#contactEmail").value.trim();
    const subject = $("#contactSubject").value.trim();
    const message = $("#contactMessage").value.trim();

    ["#contactName", "#contactEmail", "#contactSubject", "#contactMessage"].forEach((id) => {
      $(id).removeAttribute("aria-invalid");
    });
    clearError("#contactName", "#contactNameError");
    clearError("#contactEmail", "#contactEmailError");
    clearError("#contactSubject", "#contactSubjectError");
    clearError("#contactMessage", "#contactMessageError");

    let firstBad = null;

    if (name === "") {
      showError("#contactName", "#contactNameError", C.errors.name);
      firstBad = firstBad || "#contactName";
    }

    if (email === "") {
      showError("#contactEmail", "#contactEmailError", C.errors.email);
      firstBad = firstBad || "#contactEmail";
    } else if (!EMAIL_RE.test(email)) {
      showError("#contactEmail", "#contactEmailError", email.indexOf("@") > -1 ? C.errors.emailShort : C.errors.email);
      firstBad = firstBad || "#contactEmail";
    }

    if (subject.length > 120) {
      showError("#contactSubject", "#contactSubjectError", C.errors.subjectLong);
      firstBad = firstBad || "#contactSubject";
    }

    if (message.length < 12) {
      showError("#contactMessage", "#contactMessageError", C.errors.message);
      firstBad = firstBad || "#contactMessage";
    } else if (message.length > 2000) {
      showError("#contactMessage", "#contactMessageError", C.errors.messageLong);
      firstBad = firstBad || "#contactMessage";
    }

    return { ok: !firstBad, firstBad: firstBad };
  }

  async function onSubmit(e) {
    e.preventDefault();

    const btn = $("#contactSubmit");
    const result = validate();

    if (!result.ok) {
      setStatus("Please fix the highlighted fields.", "err");
      $(result.firstBad).focus();
      return;
    }

    // Honeypot filled -> accept silently, send nothing.
    if ($("#contactCompany").value !== "") {
      setStatus(C.success, "ok");
      $("#contactForm").reset();
      return;
    }

    if (!relayReady()) {
      setStatus(C.errors.disconnected, "err");
      showNotice(C.errors.disconnected);
      return;
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setStatus(C.errors.offline, "err");
      return;
    }

    const payload = {
      access_key: C.relay.accessKey,
      name: $("#contactName").value.trim(),
      email: $("#contactEmail").value.trim(),
      subject: $("#contactSubject").value.trim() || "Portfolio enquiry",
      message: $("#contactMessage").value.trim(),
      botcheck: false
    };

    btn.disabled = true;
    btn.textContent = C.labels.sending;
    setStatus("Sending your message…", "sending");
    hideNotice();

    try {
      const res = await fetch(C.relay.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      let json = {};
      try { json = await res.json(); } catch (err) { /* not JSON */ }

      if (res.ok && json && json.success) {
        setStatus(C.success, "ok");
        $("#contactForm").reset();
        return;
      }

      // Anything other than a confirmed success is reported as a failure.
      setStatus(
        json && json.message ? C.errors.generic + " (" + String(json.message) + ")" : C.errors.unconfigured,
        "err"
      );
      showNotice(C.errors.unconfigured);
    } catch (err) {
      // Network error, offline browser or a blocked cross-origin request.
      setStatus(C.errors.generic, "err");
      showNotice(C.errors.generic);
    } finally {
      btn.disabled = false;
      btn.textContent = C.labels.send;
    }
  }

  function renderChannels() {
    const p = CFG.profile;
    const rows = [];
    if (p.showEmail && p.email) {
      rows.push({ icon: "✉", label: "Email", href: "mailto:" + p.email, value: p.email });
    }
    if (p.showPhone && p.phone) {
      rows.push({ icon: "☎", label: "Phone", href: "tel:" + p.phone, value: p.phone });
    }
    rows.push({ icon: "◍", label: "Location", href: "", value: p.location });
    if (p.links.github) rows.push({ icon: "⌁", label: "GitHub", href: p.links.github, value: p.links.github });
    if (p.links.linkedin) rows.push({ icon: "in", label: "LinkedIn", href: p.links.linkedin, value: p.links.linkedin });

    $("#contactChannels").innerHTML = rows.map((r) => {
      const shown = r.href
        ? `<a href="${escUrl(r.href)}" target="_blank" rel="noopener noreferrer">${esc(r.value)}</a>`
        : esc(r.value);
      return `<li><span class="ch-icon" aria-hidden="true">${esc(r.icon)}</span>` +
             `<span class="ch-label">${esc(r.label)}</span>` +
             `<span class="ch-value">${shown}</span></li>`;
    }).join("");
  }

  function init() {
    setText("#contactIntro", C.intro);
    setText("#channelsNote", C.channelsNote);
    setText("#contactNameError", "");
    $("#contactSubmit").textContent = C.labels.send;

    renderChannels();

    const form = $("#contactForm");
    form.addEventListener("submit", onSubmit);

    // Clear a field's error as soon as the visitor starts fixing it.
    [["#contactName", "#contactNameError"], ["#contactEmail", "#contactEmailError"],
     ["#contactSubject", "#contactSubjectError"], ["#contactMessage", "#contactMessageError"]
    ].forEach(([field, err]) => {
      $(field).addEventListener("input", () => {
        $(field).removeAttribute("aria-invalid");
        clearError(field, err);
      });
    });

    // Route disclosure. The relay is the shipped default; without a key the
    // page must say so instead of pretending to send.
    if (!relayReady()) {
      showNotice(C.errors.disconnected);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposed for the automated test suite.
  window.DevForgeContact = { relayReady: relayReady, validate: validate };
})();

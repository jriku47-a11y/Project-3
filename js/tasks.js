/* ============================================================
   DEVFORGE — TASK MANAGER
   Add, edit, complete, delete, search and filter tasks.
   Persistence: versioned localStorage (no server, no fake data).
   ============================================================ */

(function () {
  "use strict";

  const CFG = window.DEVFORGE;
  if (!CFG || !CFG.taskManager) return;

  const TM = CFG.taskManager;
  const KEY = TM.storageKey;
  const L = TM.labels;

  let tasks = [];
  let filter = "all";
  let query = "";
  let editingId = null;
  let pendingDeleteId = null;

  /* ============================================================
     STORAGE
     ============================================================ */
  function normalise(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((t) => t && typeof t === "object" && typeof t.title === "string" && t.title.trim() !== "")
      .map((t) => ({
        id: String(t.id || makeId()),
        title: String(t.title).slice(0, TM.limits.title),
        notes: String(t.notes || "").slice(0, TM.limits.notes),
        priority: ["low", "medium", "high"].indexOf(t.priority) > -1 ? t.priority : "medium",
        due: /^\d{4}-\d{2}-\d{2}$/.test(String(t.due || "")) ? t.due : "",
        done: Boolean(t.done),
        createdAt: Number(t.createdAt) || Date.now(),
        completedAt: t.completedAt ? Number(t.completedAt) : null
      }));
  }

  function load() {
    // Distinguish "never used this app" from "storage holds unreadable data".
    // A missing key seeds the demo tasks once; corrupt data must NOT silently
    // resurrect them, because that would destroy whatever the user had typed.
    let raw = null;
    try {
      raw = window.localStorage.getItem(KEY);
    } catch (err) {
      raw = null;
    }

    if (raw === null) {
      tasks = normalise((TM.seed || []).map((t) => ({ ...t, done: false })));
      persist();
      return;
    }

    let parsed = null;
    let usable = true;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      usable = false;
    }

    tasks = normalise(parsed);
    if (!usable) {
      // Replace the unreadable value with a clean, valid empty list.
      persist();
      setStatus("Saved tasks could not be read, so the list was reset.", "err");
    }
  }

  function persist() {
    const ok = Store.write(KEY, tasks);
    if (!ok) {
      setStatus("Your browser blocked local storage, so tasks will disappear when you close this tab.", "err");
    }
    return ok;
  }

  /* ============================================================
     FILTERING
     ============================================================ */
  function visibleTasks() {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const byStatus = filter === "all" || (filter === "completed" ? t.done : !t.done);
      if (!byStatus) return false;
      if (!q) return true;
      return (t.title + " " + t.notes).toLowerCase().indexOf(q) > -1;
    });
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function taskItem(t) {
    const label = L.edit + ": " + t.title;
    const overdue = !t.done && isOverdue(t.due);
    const prioLabel = (TM.priorities.find((p) => p.id === t.priority) || {}).label || t.priority;

    if (pendingDeleteId === t.id) {
      return `
        <li class="task-confirm" data-id="${esc(t.id)}">
          <span>${esc(L.confirmDelete)}</span>
          <button class="btn btn-danger btn-sm" type="button" data-act="confirm-delete" data-id="${esc(t.id)}">${esc(L.deleteYes)}</button>
          <button class="btn btn-ghost btn-sm" type="button" data-act="cancel-delete" data-id="${esc(t.id)}">${esc(L.deleteNo)}</button>
        </li>`;
    }

    return `
      <li class="task-item${t.done ? " is-done" : ""}${editingId === t.id ? " editing" : ""}" data-id="${esc(t.id)}" data-done="${String(t.done)}">
        <input class="task-check" type="checkbox" ${t.done ? "checked" : ""}
               data-act="toggle" data-id="${esc(t.id)}"
               aria-label="${esc((t.done ? L.reopen : L.complete) + ": " + t.title)}" />
        <div class="task-body">
          <span class="task-name">${esc(t.title)}</span>
          ${t.notes ? `<span class="task-notes">${esc(t.notes)}</span>` : ""}
          <span class="task-meta">
            <span class="prio prio-${esc(t.priority)}">${esc(prioLabel)}</span>
            ${t.due ? `<span class="task-due${overdue ? " overdue" : ""}">Due ${esc(formatDate(t.due))}${overdue ? " — overdue" : ""}</span>` : ""}
          </span>
        </div>
        <div class="task-actions">
          <button class="link-btn" type="button" data-act="edit" data-id="${esc(t.id)}" aria-label="${esc(label)}">${esc(L.edit)}</button>
          <button class="link-btn" type="button" data-act="delete" data-id="${esc(t.id)}" aria-label="${esc(L.delete + ": " + t.title)}">${esc(L.delete)}</button>
        </div>
      </li>`;
  }

  function renderFilters() {
    const counts = {
      all: tasks.length,
      active: tasks.filter((t) => !t.done).length,
      completed: tasks.filter((t) => t.done).length
    };
    $("#taskFilters").innerHTML = (TM.filters || []).map((f) => `
      <button class="filter-btn" type="button" data-task-filter="${esc(f.id)}"
              aria-pressed="${String(f.id === filter)}">${esc(f.label)}<span class="count">${counts[f.id]}</span></button>`).join("");
  }

  function render() {
    const visible = visibleTasks();

    $("#taskList").innerHTML = visible.map(taskItem).join("");

    // Empty state: distinguish "no tasks at all" from "nothing matches".
    const empty = $("#taskEmpty");
    const title = $("#taskEmptyTitle");
    const body = $("#taskEmptyBody");
    if (visible.length === 0) {
      empty.hidden = false;
      if (tasks.length === 0) {
        title.textContent = TM.empty.noTasks.title;
        body.textContent = TM.empty.noTasks.body;
      } else {
        title.textContent = TM.empty.noMatches.title;
        body.textContent = TM.empty.noMatches.body;
      }
    } else {
      empty.hidden = true;
    }

    // Counters
    const done = tasks.filter((t) => t.done).length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    $("#taskProgressBar").style.width = pct + "%";
    $("#taskProgress").setAttribute("aria-valuenow", String(pct));
    $("#taskProgressLabel").textContent = tasks.length
      ? done + " / " + tasks.length + " " + L.done + " (" + pct + "%)"
      : "0 " + L.done;

    $("#taskCount").textContent = visible.length === tasks.length
      ? tasks.length + " task" + (tasks.length === 1 ? "" : "s")
      : "Showing " + visible.length + " of " + tasks.length + " tasks";

    $("#taskClear").disabled = tasks.length === 0;
    renderFilters();
  }

  /* ============================================================
     FORM (add + edit share one form)
     ============================================================ */
  function setStatus(text, kind) {
    const el = $("#taskFormStatus");
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

  function resetForm() {
    $("#taskForm").reset();
    $("#taskTitle").removeAttribute("aria-invalid");
    clearError("#taskTitle", "#taskTitleError");
    setStatus("");
    editingId = null;
    $("#taskFormTitle").textContent = L.newTask;
    $("#taskSubmit").textContent = L.add;
    $("#taskCancel").hidden = true;
  }

  function startEdit(id) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    editingId = id;
    $("#taskFormTitle").textContent = L.editTask;
    $("#taskSubmit").textContent = L.save;
    $("#taskCancel").hidden = false;
    $("#taskTitle").value = t.title;
    $("#taskNotes").value = t.notes;
    $("#taskPriority").value = t.priority;
    $("#taskDue").value = t.due;
    setStatus("");
    render();
    $("#taskTitle").focus();
  }

  function validate() {
    const title = $("#taskTitle").value.trim();
    const notes = $("#taskNotes").value.trim();
    let ok = true;

    $("#taskTitle").removeAttribute("aria-invalid");
    clearError("#taskTitle", "#taskTitleError");

    if (title === "") {
      showError("#taskTitle", "#taskTitleError", TM.empty.noTasks.title ? "Please enter a task title." : "Required");
      ok = false;
    } else if (title.length > TM.limits.title) {
      showError("#taskTitle", "#taskTitleError", "Keep the title under " + TM.limits.title + " characters.");
      ok = false;
    }

    if (notes.length > TM.limits.notes) {
      setStatus("Notes were trimmed to " + TM.limits.notes + " characters.", "err");
    }
    return ok;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      setStatus("Fix the highlighted field first.", "err");
      $("#taskTitle").focus();
      return;
    }

    const title = $("#taskTitle").value.trim();
    const notes = $("#taskNotes").value.trim().slice(0, TM.limits.notes);
    const priority = $("#taskPriority").value;
    const due = $("#taskDue").value || "";

    if (editingId) {
      const t = tasks.find((x) => x.id === editingId);
      if (t) {
        t.title = title;
        t.notes = notes;
        t.priority = priority;
        t.due = due;
      }
      persist();
      resetForm();
      render();
      setStatus(TM.messages.updated, "ok");
      return;
    }

    tasks.unshift({
      id: makeId(),
      title: title,
      notes: notes,
      priority: priority,
      due: due,
      done: false,
      createdAt: Date.now(),
      completedAt: null
    });
    persist();
    resetForm();
    render();
    setStatus(TM.messages.added, "ok");
  }

  /* ============================================================
     ACTIONS
     ============================================================ */
  function toggle(id) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    t.done = !t.done;
    t.completedAt = t.done ? Date.now() : null;
    persist();
    render();
    setStatus(t.done ? TM.messages.completed : TM.messages.reopened, "ok");
  }

  function remove(id) {
    const index = tasks.findIndex((x) => x.id === id);
    if (index < 0) return;
    tasks.splice(index, 1);
    if (editingId === id) resetForm();
    pendingDeleteId = null;
    persist();
    render();
    setStatus(TM.messages.deleted, "ok");
  }

  function clearAll() {
    if (tasks.length === 0) return;
    tasks = [];
    resetForm();
    pendingDeleteId = null;
    persist();
    render();
    setStatus(TM.messages.cleared, "ok");
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    setText("#tasksIntro", TM.intro);
    setText("#taskFormTitle", L.newTask);
    setText("#taskTitleHint", L.titleHint);
    setText("#taskNotesHint", L.notesHint);
    setText("#taskSearchHint", L.searchHint);
    $("#taskSearch").placeholder = L.search;
    $("#taskSearch").setAttribute("aria-label", L.search);
    $("#taskClear").textContent = L.clearAll;
    $("#taskCancel").textContent = L.cancel;

    $("#taskPriority").innerHTML = (TM.priorities || [])
      .map((p) => `<option value="${esc(p.id)}">${esc(p.label)}</option>`)
      .join("");

    load();
    render();

    $("#taskForm").addEventListener("submit", onSubmit);
    $("#taskCancel").addEventListener("click", () => {
      resetForm();
      render();
    });
    $("#taskTitle").addEventListener("input", () => {
      $("#taskTitle").removeAttribute("aria-invalid");
      clearError("#taskTitle", "#taskTitleError");
    });

    $("#taskSearch").addEventListener("input", debounce((e) => {
      query = e.target.value || "";
      render();
    }, 120));

    $("#taskFilters").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filter = btn.dataset.taskFilter;
      render();
    });

    $("#taskList").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const id = btn.dataset.id;
      switch (btn.dataset.act) {
        case "edit": startEdit(id); break;
        case "delete": pendingDeleteId = id; render(); break;
        case "confirm-delete": remove(id); break;
        case "cancel-delete": pendingDeleteId = null; render(); break;
      }
    });

    $("#taskList").addEventListener("change", (e) => {
      const box = e.target.closest('input[data-act="toggle"]');
      if (box) toggle(box.dataset.id);
    });

    $("#taskClear").addEventListener("click", clearAll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposed for the automated test suite.
  window.DevForgeTasks = {
    getAll: () => tasks.slice(),
    getVisible: () => visibleTasks(),
    setFilter: (f) => { filter = f; render(); },
    setQuery: (q) => { query = q; render(); },
    reset: () => { tasks = []; resetForm(); pendingDeleteId = null; persist(); render(); },
    seed: (list) => { tasks = normalise(list); persist(); render(); },
    reload: () => { load(); render(); }
  };
})();

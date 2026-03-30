const STORAGE_KEY = "job-application-tracker-data-v1";

const stages = [
  "Saved",
  "Applied",
  "Interviewing",
  "Offer",
  "Closed",
];

const priorities = ["High", "Medium", "Low"];

const seedApplications = [
  {
    id: crypto.randomUUID(),
    company: "OpenAI",
    role: "Solutions Engineer",
    link: "https://openai.com/careers",
    salary: "$160k - $190k",
    appliedDate: "2026-03-18",
    stage: "Interviewing",
    priority: "High",
    recruiter: "Mia Johnson",
    followUp: "2026-04-02",
    notes: "Technical screen completed. Prepare architecture examples.",
  },
  {
    id: crypto.randomUUID(),
    company: "Cloudflare",
    role: "Data Product Analyst",
    link: "https://cloudflare.com/careers",
    salary: "$120k - $145k",
    appliedDate: "2026-03-21",
    stage: "Applied",
    priority: "Medium",
    recruiter: "Liam Torres",
    followUp: "2026-04-04",
    notes: "Need a concise follow-up if no response by Friday.",
  },
  {
    id: crypto.randomUUID(),
    company: "Stripe",
    role: "AI Operations Specialist",
    link: "https://stripe.com/jobs",
    salary: "$150k - $175k",
    appliedDate: "2026-03-10",
    stage: "Offer",
    priority: "High",
    recruiter: "Sophia Kim",
    followUp: "2026-04-01",
    notes: "Evaluate compensation package and remote policy.",
  },
  {
    id: crypto.randomUUID(),
    company: "Datadog",
    role: "Technical Program Manager",
    link: "https://www.datadoghq.com/careers",
    salary: "$135k - $155k",
    appliedDate: "2026-03-05",
    stage: "Closed",
    priority: "Low",
    recruiter: "Daniel Ross",
    followUp: "2026-03-28",
    notes: "Role paused. Keep relationship warm for future openings.",
  },
  {
    id: crypto.randomUUID(),
    company: "Anthropic",
    role: "Product Operations Manager",
    link: "https://www.anthropic.com/careers",
    salary: "$145k - $170k",
    appliedDate: "2026-03-24",
    stage: "Saved",
    priority: "Medium",
    recruiter: "Nina Patel",
    followUp: "2026-04-06",
    notes: "Customize resume before submitting.",
  },
];

const state = {
  applications: loadApplications(),
  filters: {
    search: "",
    stage: "All stages",
    priority: "All priorities",
    mode: "kanban",
  },
  editingId: null,
};

const elements = {
  statsGrid: document.getElementById("statsGrid"),
  stageFilter: document.getElementById("stageFilter"),
  priorityFilter: document.getElementById("priorityFilter"),
  viewMode: document.getElementById("viewMode"),
  searchInput: document.getElementById("searchInput"),
  kanbanSection: document.getElementById("kanbanSection"),
  tableSection: document.getElementById("tableSection"),
  kanbanBoard: document.getElementById("kanbanBoard"),
  applicationTableBody: document.getElementById("applicationTableBody"),
  insightsList: document.getElementById("insightsList"),
  dialog: document.getElementById("applicationDialog"),
  dialogTitle: document.getElementById("dialogTitle"),
  form: document.getElementById("applicationForm"),
  newApplicationButton: document.getElementById("newApplicationButton"),
  resetDataButton: document.getElementById("resetDataButton"),
  closeDialogButton: document.getElementById("closeDialogButton"),
  cancelButton: document.getElementById("cancelButton"),
  companyInput: document.getElementById("companyInput"),
  roleInput: document.getElementById("roleInput"),
  linkInput: document.getElementById("linkInput"),
  salaryInput: document.getElementById("salaryInput"),
  dateInput: document.getElementById("dateInput"),
  stageInput: document.getElementById("stageInput"),
  priorityInput: document.getElementById("priorityInput"),
  recruiterInput: document.getElementById("recruiterInput"),
  followUpInput: document.getElementById("followUpInput"),
  notesInput: document.getElementById("notesInput"),
};

function loadApplications() {
  const persisted = window.localStorage.getItem(STORAGE_KEY);
  if (!persisted) return seedApplications;
  try {
    return JSON.parse(persisted);
  } catch (error) {
    console.warn("Unable to parse stored applications", error);
    return seedApplications;
  }
}

function saveApplications() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.applications));
}

function populateSelect(select, values, defaultLabel) {
  select.innerHTML = "";
  if (defaultLabel) {
    const option = document.createElement("option");
    option.textContent = defaultLabel;
    option.value = defaultLabel;
    select.append(option);
  }
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function getFilteredApplications() {
  return state.applications.filter((application) => {
    const matchesSearch =
      application.company.toLowerCase().includes(state.filters.search) ||
      application.role.toLowerCase().includes(state.filters.search);
    const matchesStage =
      state.filters.stage === "All stages" ||
      application.stage === state.filters.stage;
    const matchesPriority =
      state.filters.priority === "All priorities" ||
      application.priority === state.filters.priority;
    return matchesSearch && matchesStage && matchesPriority;
  });
}

function renderStats() {
  const items = getFilteredApplications();
  const stats = [
    {
      label: "Tracked applications",
      value: items.length,
      detail: "Visible under the current filter scope",
    },
    {
      label: "Interviews or offers",
      value: items.filter((item) =>
        ["Interviewing", "Offer"].includes(item.stage)
      ).length,
      detail: "Pipeline momentum at the most critical stages",
    },
    {
      label: "High-priority follow-ups",
      value: items.filter((item) => item.priority === "High").length,
      detail: "Applications that deserve immediate attention",
    },
    {
      label: "Next follow-up",
      value:
        items
          .map((item) => item.followUp)
          .sort()[0]
          ?.slice(5)
          .replace("-", "/") || "--/--",
      detail: "Closest follow-up date in the filtered list",
    },
  ];

  elements.statsGrid.innerHTML = stats
    .map(
      (stat) => `
        <article class="panel stat-card">
          <h3>${stat.label}</h3>
          <strong>${stat.value}</strong>
          <p>${stat.detail}</p>
        </article>
      `
    )
    .join("");
}

function renderKanban() {
  const items = getFilteredApplications();
  elements.kanbanBoard.innerHTML = stages
    .map((stage) => {
      const stageItems = items.filter((item) => item.stage === stage);
      return `
        <section class="kanban-column">
          <div class="panel-heading">
            <h4>${stage}</h4>
            <span class="count-badge">${stageItems.length}</span>
          </div>
          ${stageItems
            .map(
              (application) => `
                <article class="application-card">
                  <div class="card-meta">
                    <span class="stage-pill">${application.stage}</span>
                    <span class="priority-pill priority-${application.priority.toLowerCase()}">${application.priority}</span>
                  </div>
                  <h5>${application.company}</h5>
                  <p>${application.role}</p>
                  <div class="card-meta">
                    <span>${application.salary || "Salary pending"}</span>
                    <span>Follow-up ${formatDate(application.followUp)}</span>
                  </div>
                  <p>${application.notes}</p>
                  <div class="card-actions">
                    <button class="button button-secondary" data-action="edit" data-id="${application.id}">Edit</button>
                    <button class="button button-secondary" data-action="delete" data-id="${application.id}">Delete</button>
                  </div>
                </article>
              `
            )
            .join("")}
        </section>
      `;
    })
    .join("");
}

function renderTable() {
  const items = getFilteredApplications();
  elements.applicationTableBody.innerHTML = items
    .map(
      (application) => `
        <tr>
          <td>${application.company}</td>
          <td>${application.role}</td>
          <td><span class="stage-pill">${application.stage}</span></td>
          <td><span class="priority-pill priority-${application.priority.toLowerCase()}">${application.priority}</span></td>
          <td>${application.salary || "Pending"}</td>
          <td>${formatDate(application.followUp)}</td>
          <td>
            <div class="table-actions">
              <button class="button button-secondary" data-action="edit" data-id="${application.id}">Edit</button>
              <button class="button button-secondary" data-action="delete" data-id="${application.id}">Delete</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderInsights() {
  const items = getFilteredApplications();
  const overdue = items.filter((item) => item.followUp < getToday()).length;
  const interviewing = items.filter((item) => item.stage === "Interviewing");
  const offers = items.filter((item) => item.stage === "Offer");
  const saved = items.filter((item) => item.stage === "Saved");

  const insights = [
    {
      title: `${overdue} overdue follow-ups`,
      text: "Use this queue to keep conversations warm and reduce silent drop-offs.",
    },
    {
      title: `${interviewing.length} active interview loops`,
      text: "Good moment to prepare stories, architecture examples, and compensation expectations.",
    },
    {
      title: `${offers.length} offers in review`,
      text: "Compare compensation, remote policy, growth path, and equity before deciding.",
    },
    {
      title: `${saved.length} opportunities not submitted yet`,
      text: "These roles may need resume tailoring and company-specific research before applying.",
    },
  ];

  elements.insightsList.innerHTML = insights
    .map(
      (insight) => `
        <article class="insight-card">
          <h4>${insight.title}</h4>
          <p>${insight.text}</p>
        </article>
      `
    )
    .join("");
}

function renderMode() {
  const showKanban = state.filters.mode === "kanban";
  elements.kanbanSection.classList.toggle("hidden", !showKanban);
  elements.tableSection.classList.toggle("hidden", showKanban);
}

function render() {
  renderStats();
  renderKanban();
  renderTable();
  renderInsights();
  renderMode();
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateString) {
  if (!dateString) return "--";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function openDialog(application) {
  state.editingId = application?.id || null;
  elements.dialogTitle.textContent = application
    ? "Edit application"
    : "New application";
  elements.companyInput.value = application?.company || "";
  elements.roleInput.value = application?.role || "";
  elements.linkInput.value = application?.link || "";
  elements.salaryInput.value = application?.salary || "";
  elements.dateInput.value = application?.appliedDate || getToday();
  elements.stageInput.value = application?.stage || "Saved";
  elements.priorityInput.value = application?.priority || "Medium";
  elements.recruiterInput.value = application?.recruiter || "";
  elements.followUpInput.value = application?.followUp || getToday();
  elements.notesInput.value = application?.notes || "";
  elements.dialog.showModal();
}

function closeDialog() {
  elements.dialog.close();
  state.editingId = null;
  elements.form.reset();
}

function upsertApplication(formValues) {
  const payload = {
    id: state.editingId || crypto.randomUUID(),
    company: formValues.get("company"),
    role: formValues.get("role"),
    link: formValues.get("link"),
    salary: formValues.get("salary"),
    appliedDate: formValues.get("appliedDate"),
    stage: formValues.get("stage"),
    priority: formValues.get("priority"),
    recruiter: formValues.get("recruiter"),
    followUp: formValues.get("followUp"),
    notes: formValues.get("notes"),
  };

  const existingIndex = state.applications.findIndex(
    (application) => application.id === payload.id
  );

  if (existingIndex >= 0) {
    state.applications.splice(existingIndex, 1, payload);
  } else {
    state.applications.unshift(payload);
  }

  saveApplications();
  render();
}

function deleteApplication(id) {
  state.applications = state.applications.filter(
    (application) => application.id !== id
  );
  saveApplications();
  render();
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value.toLowerCase().trim();
    render();
  });

  elements.stageFilter.addEventListener("change", (event) => {
    state.filters.stage = event.target.value;
    render();
  });

  elements.priorityFilter.addEventListener("change", (event) => {
    state.filters.priority = event.target.value;
    render();
  });

  elements.viewMode.addEventListener("change", (event) => {
    state.filters.mode = event.target.value;
    render();
  });

  elements.newApplicationButton.addEventListener("click", () => openDialog());
  elements.resetDataButton.addEventListener("click", () => {
    state.applications = [...seedApplications];
    saveApplications();
    render();
  });
  elements.closeDialogButton.addEventListener("click", closeDialog);
  elements.cancelButton.addEventListener("click", closeDialog);

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    upsertApplication(new FormData(elements.form));
    closeDialog();
  });

  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const { action, id } = button.dataset;
    const application = state.applications.find((item) => item.id === id);

    if (action === "edit" && application) openDialog(application);
    if (action === "delete" && application) deleteApplication(id);
  });
}

function initialize() {
  populateSelect(elements.stageFilter, stages, "All stages");
  populateSelect(elements.priorityFilter, priorities, "All priorities");
  populateSelect(elements.stageInput, stages);
  populateSelect(elements.priorityInput, priorities);
  elements.viewMode.value = state.filters.mode;
  bindEvents();
  render();
}

initialize();

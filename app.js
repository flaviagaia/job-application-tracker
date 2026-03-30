const STORAGE_KEY = "job-application-tracker-data-v1";

const stages = [
  "Salva",
  "Aplicada",
  "Entrevistas",
  "Oferta",
  "Encerrada",
];

const priorities = ["Alta", "Média", "Baixa"];
const stageDetails = {
  Salva: "Oportunidades mapeadas, ainda aguardando candidatura.",
  Aplicada: "Vagas já enviadas e monitoradas para retorno inicial.",
  Entrevistas: "Processos em andamento com conversas e etapas técnicas.",
  Oferta: "Propostas recebidas ou em fase final de negociação.",
  Encerrada: "Processos finalizados, pausados ou descartados.",
};

const seedApplications = [
  {
    id: crypto.randomUUID(),
    company: "OpenAI",
    role: "Solutions Engineer",
    link: "https://openai.com/careers",
    salary: "$160k - $190k",
    appliedDate: "2026-03-18",
    stage: "Entrevistas",
    priority: "Alta",
    recruiter: "Mia Johnson",
    followUp: "2026-04-02",
    notes: "Triagem técnica concluída. Preparar exemplos de arquitetura.",
  },
  {
    id: crypto.randomUUID(),
    company: "Cloudflare",
    role: "Data Product Analyst",
    link: "https://cloudflare.com/careers",
    salary: "$120k - $145k",
    appliedDate: "2026-03-21",
    stage: "Aplicada",
    priority: "Média",
    recruiter: "Liam Torres",
    followUp: "2026-04-04",
    notes: "Enviar follow-up curto se não houver resposta até sexta.",
  },
  {
    id: crypto.randomUUID(),
    company: "Stripe",
    role: "AI Operations Specialist",
    link: "https://stripe.com/jobs",
    salary: "$150k - $175k",
    appliedDate: "2026-03-10",
    stage: "Oferta",
    priority: "Alta",
    recruiter: "Sophia Kim",
    followUp: "2026-04-01",
    notes: "Avaliar pacote de remuneração e política remota.",
  },
  {
    id: crypto.randomUUID(),
    company: "Datadog",
    role: "Technical Program Manager",
    link: "https://www.datadoghq.com/careers",
    salary: "$135k - $155k",
    appliedDate: "2026-03-05",
    stage: "Encerrada",
    priority: "Baixa",
    recruiter: "Daniel Ross",
    followUp: "2026-03-28",
    notes: "Vaga pausada. Manter relacionamento para futuras oportunidades.",
  },
  {
    id: crypto.randomUUID(),
    company: "Anthropic",
    role: "Product Operations Manager",
    link: "https://www.anthropic.com/careers",
    salary: "$145k - $170k",
    appliedDate: "2026-03-24",
    stage: "Salva",
    priority: "Média",
    recruiter: "Nina Patel",
    followUp: "2026-04-06",
    notes: "Customizar currículo antes de enviar.",
  },
];

const state = {
  applications: loadApplications(),
  filters: {
    search: "",
    stage: "Todas as etapas",
    priority: "Todas as prioridades",
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

function toPriorityClass(priority) {
  return priority
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function loadApplications() {
  const persisted = window.localStorage.getItem(STORAGE_KEY);
  if (!persisted) return seedApplications;
  try {
    return JSON.parse(persisted);
  } catch (error) {
    console.warn("Não foi possível ler as candidaturas salvas", error);
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
      state.filters.stage === "Todas as etapas" ||
      application.stage === state.filters.stage;
    const matchesPriority =
      state.filters.priority === "Todas as prioridades" ||
      application.priority === state.filters.priority;
    return matchesSearch && matchesStage && matchesPriority;
  });
}

function renderStats() {
  const items = getFilteredApplications();
  const stats = [
    {
      label: "Candidaturas monitoradas",
      value: items.length,
      detail: "Visíveis no escopo atual de filtros",
    },
    {
      label: "Entrevistas ou ofertas",
      value: items.filter((item) =>
        ["Entrevistas", "Oferta"].includes(item.stage)
      ).length,
      detail: "Momento do pipeline nas etapas mais críticas",
    },
    {
      label: "Follow-ups de alta prioridade",
      value: items.filter((item) => item.priority === "Alta").length,
      detail: "Candidaturas que merecem atenção imediata",
    },
    {
      label: "Próximo follow-up",
      value:
        items
          .map((item) => item.followUp)
          .sort()[0]
          ?.slice(5)
          .replace("-", "/") || "--/--",
      detail: "Data mais próxima de follow-up na lista filtrada",
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
  const maxItems = Math.max(...stages.map((stage) => items.filter((item) => item.stage === stage).length), 1);
  elements.kanbanBoard.innerHTML = stages
    .map((stage) => {
      const stageItems = items.filter((item) => item.stage === stage);
      const progressWidth = Math.max((stageItems.length / maxItems) * 100, stageItems.length ? 18 : 0);
      return `
        <section class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-column-top">
              <h4>${stage}</h4>
              <span class="count-badge">${stageItems.length}</span>
            </div>
            <div class="kanban-column-copy">
              <p>${stageDetails[stage]}</p>
            </div>
            <div class="kanban-column-track">
              <div class="kanban-column-fill" style="width: ${progressWidth}%"></div>
            </div>
          </div>
          <div class="kanban-column-body">
          ${stageItems.length
            ? stageItems
            .map(
              (application) => `
                <article class="application-card">
                  <div class="card-meta">
                    <span class="priority-pill priority-${toPriorityClass(application.priority)}">${application.priority}</span>
                    <span class="${application.followUp < getToday() ? "follow-up-overdue" : ""}">
                      ${application.followUp < getToday() ? "Atrasado" : "Em dia"}
                    </span>
                  </div>
                  <h5>${application.company}</h5>
                  <p class="card-role">${application.role}</p>
                  <div class="card-detail-grid">
                    <div class="card-detail">
                      <span class="card-detail-label">Salário</span>
                      <span>${application.salary || "Pendente"}</span>
                    </div>
                    <div class="card-detail">
                      <span class="card-detail-label">Recrutador</span>
                      <span>${application.recruiter || "Não informado"}</span>
                    </div>
                    <div class="card-detail">
                      <span class="card-detail-label">Follow-up</span>
                      <span class="${application.followUp < getToday() ? "follow-up-overdue" : ""}">${formatDate(application.followUp)}</span>
                    </div>
                  </div>
                  <p class="card-notes">${application.notes}</p>
                  <div class="card-actions">
                    <button class="button button-secondary" data-action="edit" data-id="${application.id}">Editar</button>
                    <button class="button button-secondary" data-action="delete" data-id="${application.id}">Excluir</button>
                  </div>
                </article>
              `
            )
            .join("")
            : `<div class="empty-column">Nenhuma candidatura nesta etapa no filtro atual.</div>`}
          </div>
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
          <td><span class="priority-pill priority-${toPriorityClass(application.priority)}">${application.priority}</span></td>
          <td>${application.salary || "Pendente"}</td>
          <td>${formatDate(application.followUp)}</td>
          <td>
            <div class="table-actions">
              <button class="button button-secondary" data-action="edit" data-id="${application.id}">Editar</button>
              <button class="button button-secondary" data-action="delete" data-id="${application.id}">Excluir</button>
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
  const interviewing = items.filter((item) => item.stage === "Entrevistas");
  const offers = items.filter((item) => item.stage === "Oferta");
  const saved = items.filter((item) => item.stage === "Salva");

  const insights = [
    {
      title: `${overdue} follow-ups atrasados`,
      text: "Use essa fila para manter as conversas aquecidas e reduzir sumiços silenciosos.",
    },
    {
      title: `${interviewing.length} processos ativos de entrevista`,
      text: "Bom momento para preparar histórias, exemplos de arquitetura e expectativas de remuneração.",
    },
    {
      title: `${offers.length} ofertas em análise`,
      text: "Compare remuneração, política remota, trilha de crescimento e equity antes de decidir.",
    },
    {
      title: `${saved.length} oportunidades ainda não enviadas`,
      text: "Essas vagas podem precisar de currículo customizado e pesquisa específica da empresa antes da candidatura.",
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
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${dateString}T00:00:00`));
}

function openDialog(application) {
  state.editingId = application?.id || null;
  elements.dialogTitle.textContent = application
    ? "Editar candidatura"
    : "Nova candidatura";
  elements.companyInput.value = application?.company || "";
  elements.roleInput.value = application?.role || "";
  elements.linkInput.value = application?.link || "";
  elements.salaryInput.value = application?.salary || "";
  elements.dateInput.value = application?.appliedDate || getToday();
  elements.stageInput.value = application?.stage || "Salva";
  elements.priorityInput.value = application?.priority || "Média";
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
  populateSelect(elements.stageFilter, stages, "Todas as etapas");
  populateSelect(elements.priorityFilter, priorities, "Todas as prioridades");
  populateSelect(elements.stageInput, stages);
  populateSelect(elements.priorityInput, priorities);
  elements.viewMode.value = state.filters.mode;
  bindEvents();
  render();
}

initialize();

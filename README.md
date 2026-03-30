# Job Application Tracker

Um MVP de product interface inspirado em apps criados com Lovable para acompanhar vagas, entrevistas, follow-ups e ofertas em uma única interface moderna. O projeto foi desenhado como uma SPA leve, responsiva e sem backend obrigatório, usando `localStorage` para persistência e uma experiência de uso pronta para portfólio.

## Visão Geral

O app funciona como um mini CRM pessoal para candidatura a vagas. Ele organiza o pipeline em estágios, permite registrar recrutadores, faixa salarial, notas de entrevista e próxima ação, e oferece duas leituras complementares:

- `Kanban` para gestão visual do pipeline;
- `tabela estruturada` para revisão mais operacional e analítica.

## Funcionalidades

- cadastro, edição e exclusão de candidaturas;
- dashboard com métricas de pipeline;
- filtros por texto, estágio e prioridade;
- visualização em `Kanban` e em tabela;
- registro de recrutador, faixa salarial, notas e próxima data de follow-up;
- persistência local com `localStorage`;
- reset de dados demo para restaurar o estado inicial.

## Arquitetura Técnica

O projeto foi implementado como uma `Single Page Application` em frontend puro, sem etapa de build.

### Camadas

1. `Presentation layer`
   - [index.html](/Users/flaviagaia/Documents/CV_FLAVIA_CODEX/job-application-tracker/index.html)
   - Estrutura semântica da interface, painel lateral, dashboard, board, tabela e modal de edição.

2. `Styling layer`
   - [styles.css](/Users/flaviagaia/Documents/CV_FLAVIA_CODEX/job-application-tracker/styles.css)
   - Tema visual com glassmorphism, gradientes, tipografia expressiva e responsividade mobile-first adaptada.

3. `State and interaction layer`
   - [app.js](/Users/flaviagaia/Documents/CV_FLAVIA_CODEX/job-application-tracker/app.js)
   - Gerenciamento de estado, filtros, renderização, persistência e fluxos CRUD.

## Modelo de Dados

Cada candidatura contém os seguintes atributos:

```json
{
  "id": "uuid",
  "company": "OpenAI",
  "role": "Solutions Engineer",
  "link": "https://openai.com/careers",
  "salary": "$160k - $190k",
  "appliedDate": "2026-03-18",
  "stage": "Entrevistas",
  "priority": "Alta",
  "recruiter": "Mia Johnson",
  "followUp": "2026-04-02",
  "notes": "Triagem técnica concluída."
}
```

## Lógica de Estado

O arquivo [app.js](/Users/flaviagaia/Documents/CV_FLAVIA_CODEX/job-application-tracker/app.js) centraliza:

- `state.applications`: lista principal de candidaturas;
- `state.filters`: critério atual de busca, estágio, prioridade e modo de visualização;
- `state.editingId`: controle do item em edição no modal.

### Fluxo principal

1. carregar candidaturas do `localStorage`;
2. usar base demo caso o navegador esteja sem dados persistidos;
3. aplicar filtros;
4. recalcular cards de resumo;
5. renderizar board, tabela e insights;
6. salvar mudanças após cada operação CRUD.

## Técnicas Utilizadas

- `Vanilla JavaScript`
  - para estado local, renderização declarativa por template string e manipulação de eventos.
- `HTML5 dialog`
  - para modal nativo de edição com baixo custo de implementação.
- `localStorage`
  - para persistência client-side sem dependência de backend.
- `Responsive CSS Grid`
  - para reorganizar dashboard, board e formulários em diferentes breakpoints.
- `Design tokens`
  - uso de variáveis CSS para tema visual consistente.

## Como Executar

Como é uma SPA estática, você pode abrir o arquivo HTML diretamente ou servir o diretório com um servidor simples.

### Opção 1: abrir localmente

Abra [index.html](/Users/flaviagaia/Documents/CV_FLAVIA_CODEX/job-application-tracker/index.html) no navegador.

### Opção 2: servidor HTTP local

```bash
python3 -m http.server 8600
```

Depois abra:

- `http://localhost:8600/job-application-tracker/`

## Casos de Uso

- acompanhar candidaturas ativas;
- organizar follow-ups com recrutadores;
- comparar oportunidades em estágios diferentes;
- registrar entrevistas, notas e ofertas;
- demonstrar uma UI de produto com visual forte em portfólio.

## Próximas Evoluções

- autenticação por usuário;
- backend com banco relacional;
- calendário de entrevistas;
- lembretes automáticos;
- integração com e-mail e LinkedIn jobs;
- analytics de conversão por etapa.

---

# English Version

`Job Application Tracker` is a Lovable-style product MVP built as a lightweight SPA for managing job opportunities, recruiters, follow-ups, interviews, and offers through a modern responsive interface.

## What the app does

- stores job applications in a structured registry;
- displays stage progress in a `Kanban board`;
- supports filtering by search term, stage, and priority;
- provides a detailed table view for operational review;
- saves data locally through `localStorage`.

## Technical Design

The application uses a zero-build frontend stack:

- [index.html](/Users/flaviagaia/Documents/CV_FLAVIA_CODEX/job-application-tracker/index.html) for semantic layout;
- [styles.css](/Users/flaviagaia/Documents/CV_FLAVIA_CODEX/job-application-tracker/styles.css) for responsive visual design;
- [app.js](/Users/flaviagaia/Documents/CV_FLAVIA_CODEX/job-application-tracker/app.js) for state management, filtering, CRUD behavior, and UI rendering.

Core implementation characteristics:

- `Vanilla JavaScript` SPA architecture;
- native `dialog` component for modal editing;
- `localStorage` persistence layer;
- responsive `CSS Grid` layout;
- seeded demo dataset for immediate usability.

## Running locally

```bash
python3 -m http.server 8600
```

Open:

- `http://localhost:8600/job-application-tracker/`

## Why this project works well in a portfolio

It demonstrates:

- product thinking;
- polished UI execution;
- frontend state handling without framework overhead;
- responsive dashboard design;
- a realistic CRUD workflow for a personal productivity application.

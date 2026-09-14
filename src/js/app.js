import {
  fetchTasksApi,
  fetchCommentsApi,
  createTaskApi,
  updateTaskApi,
  updateTaskStatusApi,
  deleteTaskApi,
  createCommentApi
} from "./api.js";

let tasks = [];
let comments = [];

let columns = [
  { id: "todo", title: "Por hacer" },
  { id: "doing", title: "En proceso" },
  { id: "done", title: "Finalizado" }
];

const boardMain = document.querySelector(".board");
const modalCreate = document.getElementById("modalCreateTask");
const modalDetail = document.getElementById("modalTaskDetail");
const modalColumn = document.getElementById("modalCreateColumn");

const btnNewTask = document.getElementById("btn-newtask");
const btnNewColumn = document.getElementById("btn-newcolumn");
const searchInput = document.getElementById("searchinput");
const menuToggle = document.getElementById("menutoggle");
const navLinks = document.getElementById("navlinks");

document.addEventListener("DOMContentLoaded", () => {
  initLucideIcons();
  setupEventListeners();
  fetchTasks();
});

function initLucideIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

async function fetchTasks() {
  try {
    tasks = await fetchTasksApi();
    renderBoard();
  } catch (error) {
    console.error("Error al obtener tareas:", error);
  }
}

async function fetchComments(taskId) {
  try {
    comments = await fetchCommentsApi(taskId);
    renderComments();
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
  }
}

async function deleteTask(id) {
  if (!confirm("¿Seguro que deseas eliminar esta tarea permanentemente?")) return;

  try {
    await deleteTaskApi(id);
    tasks = tasks.filter((t) => t.id != id);
    renderBoard();
  } catch (err) {
    console.error("Error eliminando tarea:", err);
  }
}

function renderBoard(filterTerm = "") {
  boardMain.innerHTML = "";

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filterTerm.toLowerCase())
  );

  columns.forEach((col) => {
    const colContainer = document.createElement("container");
    colContainer.className = "column";
    colContainer.dataset.status = col.id;

    const colTasks = filteredTasks.filter((t) => t.status === col.id);

    colContainer.innerHTML = `
      <div class="column-header ${col.id}-header">
        <h2>${escapeHTML(col.title)}</h2>
        <span class="badge" id="count-${col.id}">${colTasks.length}</span>
      </div>
      <div class="task-list" id="list-${col.id}"></div>
    `;

    const taskListEl = colContainer.querySelector(".task-list");

    colTasks.forEach((task) => {
      taskListEl.appendChild(createTaskCard(task));
    });

    boardMain.appendChild(colContainer);
  });

  updateStats();
  setupDragAndDrop();
  initLucideIcons();
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.id = task.id;

  card.innerHTML = `
    <div class="task-header">
      <span class="task-title">${escapeHTML(task.title)}</span>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
        <button class="btn-card-delete" title="Eliminar tarea" style="background: transparent; border: none; color: #eb5757; cursor: pointer; padding: 2px;">
          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
        </button>
      </div>
    </div>
    <p class="task-description">${escapeHTML(task.description || "Sin descripción")}</p>
    <div class="task-footer">
      <span><i data-lucide="calendar" style="width: 12px;"></i> ${task.dueDate}</span>
    </div>
  `;

  card.addEventListener("click", () => openDetailModal(task));

  const btnDelete = card.querySelector(".btn-card-delete");
  btnDelete.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });

  return card;
}

function renderComments() {
  const container = document.getElementById("commentsList");
  container.innerHTML = "";

  if (comments.length === 0) {
    container.innerHTML = "<p style='font-size:0.8rem; color:#5e6c84;'>No hay comentarios aún.</p>";
    return;
  }

  comments.forEach((c) => {
    const item = document.createElement("div");
    item.className = "comment-item";
    const date = new Date(c.createdAt).toLocaleDateString();

    item.innerHTML = `
      <div class="comment-header">
        <span>${escapeHTML(c.author)}</span>
        <span>${date}</span>
      </div>
      <p class="comment-text">${escapeHTML(c.text)}</p>
    `;

    container.appendChild(item);
  });
}

function updateStats() {
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const doingCount = tasks.filter((t) => t.status === "doing").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;

  if (document.getElementById("statodo")) document.getElementById("statodo").textContent = todoCount;
  if (document.getElementById("statdoing")) document.getElementById("statdoing").textContent = doingCount;
  if (document.getElementById("statdone")) document.getElementById("statdone").textContent = doneCount;
  if (document.getElementById("stattotal")) document.getElementById("stattotal").textContent = totalCount;

  const percentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const percentageText = document.getElementById("progressPercentage");
  const progressBarFill = document.getElementById("progressBarFill");

  if (percentageText && progressBarFill) {
    percentageText.textContent = `${percentage}%`;
    progressBarFill.style.width = `${percentage}%`;
  }
}

function setupDragAndDrop() {
  if (boardMain) {
    new Sortable(boardMain, {
      animation: 150,
      handle: ".column-header",
      ghostClass: "sortable-ghost",
      onEnd: (evt) => {
        const movedColumn = columns.splice(evt.oldIndex, 1)[0];
        columns.splice(evt.newIndex, 0, movedColumn);
      }
    });
  }

  const taskLists = document.querySelectorAll(".task-list");
  taskLists.forEach((col) => {
    new Sortable(col, {
      group: "kanban",
      animation: 150,
      ghostClass: "sortable-ghost",
      onEnd: async (evt) => {
        const itemEl = evt.item;
        const taskId = itemEl.dataset.id;
        const newStatus = evt.to.closest(".column").dataset.status;

        const task = tasks.find((t) => t.id == taskId);
        if (task && task.status !== newStatus) {
          task.status = newStatus;
          updateStats();

          try {
            await updateTaskStatusApi(taskId, newStatus);
          } catch (error) {
            console.error("Error actualizando estado:", error);
            fetchTasks();
          }
        }
      }
    });
  });
}

function setupEventListeners() {
  menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));
  searchInput.addEventListener("input", (e) => renderBoard(e.target.value));

  btnNewTask.addEventListener("click", () => modalCreate.classList.add("active"));
  btnNewColumn.addEventListener("click", () => modalColumn.classList.add("active"));

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalCreate.classList.remove("active");
      modalDetail.classList.remove("active");
      modalColumn.classList.remove("active");
    });
  });

  document.getElementById("formCreateColumn").addEventListener("submit", (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("columnTitle").value.trim();
    if (!titleInput) return;

    const colId = titleInput
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (columns.some((c) => c.id === colId)) {
      alert("Ya existe una columna con un nombre similar.");
      return;
    }

    columns.push({ id: colId, title: titleInput });
    renderBoard(searchInput.value);

    modalColumn.classList.remove("active");
    e.target.reset();
  });

  document.getElementById("formCreateTask").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTask = {
      title: document.getElementById("createTitle").value,
      description: document.getElementById("createDescription").value,
      priority: document.getElementById("createPriority").value,
      dueDate: document.getElementById("createDueDate").value,
      status: columns[0] ? columns[0].id : "todo"
    };

    try {
      const createdTask = await createTaskApi(newTask);
      tasks.push(createdTask);
      renderBoard();
      modalCreate.classList.remove("active");
      e.target.reset();
    } catch (err) {
      console.error("Error creando tarea:", err);
    }
  });

  document.getElementById("formEditTask").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editTaskId").value;
    const currentTask = tasks.find((t) => t.id == id);

    const updatedData = {
      ...currentTask,
      title: document.getElementById("editTitle").value,
      description: document.getElementById("editDescription").value,
      priority: document.getElementById("editPriority").value,
      dueDate: document.getElementById("editDueDate").value
    };

    try {
      const data = await updateTaskApi(id, updatedData);
      const index = tasks.findIndex((t) => t.id == id);
      tasks[index] = data;
      renderBoard();
      modalDetail.classList.remove("active");
    } catch (err) {
      console.error("Error editando tarea:", err);
    }
  });

  document.getElementById("btnDeleteTask").addEventListener("click", async () => {
    const id = document.getElementById("editTaskId").value;
    await deleteTask(id);
    modalDetail.classList.remove("active");
  });

  // Listener corregido para agregar comentarios
  document.getElementById("formAddComment").addEventListener("submit", async (e) => {
    e.preventDefault();

    const rawTaskId = document.getElementById("editTaskId").value;
    // Convierte el ID a número si es numérico, de lo contrario lo mantiene como String
    const taskId = isNaN(rawTaskId) ? rawTaskId : Number(rawTaskId);

    const newComment = {
      taskId,
      author: document.getElementById("commentAuthor").value.trim(),
      text: document.getElementById("commentText").value.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const createdComment = await createCommentApi(newComment);
      comments.push(createdComment);
      renderComments();
      e.target.reset(); // Resetea los campos del formulario de comentarios
    } catch (err) {
      console.error("Error creando comentario:", err);
    }
  });
}

function openDetailModal(task) {
  document.getElementById("editTaskId").value = task.id;
  document.getElementById("editTitle").value = task.title;
  document.getElementById("editDescription").value = task.description || "";
  document.getElementById("editPriority").value = task.priority;
  document.getElementById("editDueDate").value = task.dueDate;

  const badge = document.getElementById("detailPriorityBadge");
  badge.textContent = task.priority;
  badge.className = `priority-badge priority-${task.priority}`;

  // Asegura consultar comentarios pasando el id con su tipo de dato original
  fetchComments(task.id);
  modalDetail.classList.add("active");
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, (tag) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag] || tag));
}
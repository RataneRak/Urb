// Variables globales pour l'application
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const taskList = document.getElementById("task-list");
const notification = document.getElementById("notification");
const searchInput = document.getElementById("search");
const filterPriority = document.getElementById("filter-priority");
const filterCategory = document.getElementById("filter-category");
const filterStatus = document.getElementById("filter-status");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("due_date");
const categoryInput = document.getElementById("category");
const clearFiltersBtn = document.getElementById("clear-filters");
const sortDateBtn = document.getElementById("sort-date");
const sortPriorityBtn = document.getElementById("sort-priority");
const sortNameBtn = document.getElementById("sort-name");
const bulkCompleteBtn = document.getElementById("bulk-complete");
const taskCountBadge = document.getElementById("task-count");
const completionProgress = document.getElementById("completion-progress");
const noTasksDiv = document.getElementById("no-tasks");
const loadingTasksDiv = document.getElementById("loading-tasks");

const ariaLive = document.createElement("div");
ariaLive.setAttribute("aria-live", "polite");
ariaLive.setAttribute("class", "visually-hidden");
document.body.appendChild(ariaLive);

let debounceTimeout = null;
let currentSort = "date";
let currentSortDirection = "desc";

function showNotification(message, type = "primary") {
  console.log("Notification:", message, type);

  const toast = document.getElementById("notification");
  if (!toast) {
    alert(message);
    return;
  }

  const toastBody = toast.querySelector(".toast-body");
  if (toastBody) {
  toastBody.textContent = message;
  }

  // Mapping des types pour Bootstrap
  const bootstrapTypes = {
    success: "success",
    danger: "danger",
    error: "danger",
    warning: "warning",
    info: "info",
    primary: "primary",
  };

  const bootstrapType = bootstrapTypes[type] || "primary";

  toast.className = `toast align-items-center text-bg-${bootstrapType} border-0 position-fixed bottom-0 end-0 m-4 animate__animated animate__fadeInUp`;
  toast.style.display = "block";
  ariaLive.textContent = message;

  try {
  const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
  bsToast.show();
  } catch (error) {
    console.error("Erreur lors de l'affichage de la notification:", error);
    // Fallback simple
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function animateTaskItem(li, animation, callback) {
  li.classList.add("animate__animated", animation);
  li.addEventListener("animationend", function handler() {
    li.classList.remove("animate__animated", animation);
    li.removeEventListener("animationend", handler);
    if (callback) callback();
  });
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
  if (!window.tasks) return;

  const total = window.tasks.length;
  const completed = window.tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const urgent = window.tasks.filter(
    (t) => t.priority === "haute" && !t.completed
  ).length;

  // Mettre à jour les cartes de stats
  const totalTasksEl = document.getElementById("total-tasks");
  const completedTasksEl = document.getElementById("completed-tasks");
  const pendingTasksEl = document.getElementById("pending-tasks");
  const urgentTasksEl = document.getElementById("urgent-tasks");

  if (totalTasksEl) totalTasksEl.textContent = total;
  if (completedTasksEl) completedTasksEl.textContent = completed;
  if (pendingTasksEl) pendingTasksEl.textContent = pending;
  if (urgentTasksEl) urgentTasksEl.textContent = urgent;

  // Mettre à jour le badge de compte
  if (taskCountBadge) {
    taskCountBadge.textContent = `${total} tâche${total > 1 ? "s" : ""}`;
  }

  // Mettre à jour la barre de progression
  if (completionProgress && total > 0) {
    const percentage = Math.round((completed / total) * 100);
    completionProgress.style.width = `${percentage}%`;
    completionProgress.setAttribute("aria-valuenow", percentage);
  }

  // Afficher/masquer le bouton "Tout terminer"
  if (bulkCompleteBtn) {
    bulkCompleteBtn.style.display = pending > 0 ? "block" : "none";
  }

  // Mettre à jour les options du filtre de catégorie
  updateCategoryFilter();
}

// Fonction pour mettre à jour le filtre de catégorie avec les catégories personnalisées
function updateCategoryFilter() {
  if (!window.tasks || !filterCategory) return;

  const predefinedCategories = [
    "travail",
    "personnel",
    "sante",
    "apprentissage",
  ];
  const customCategories = [
    ...new Set(
      window.tasks
        .map((task) => task.category)
        .filter(
          (category) => category && !predefinedCategories.includes(category)
        )
    ),
  ];

  // Sauvegarder la valeur actuelle
  const currentValue = filterCategory.value;

  // Réinitialiser les options
  filterCategory.innerHTML = '<option value="">Toutes</option>';

  // Ajouter les catégories prédéfinies
  predefinedCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    filterCategory.appendChild(option);
  });

  // Ajouter les catégories personnalisées
  customCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterCategory.appendChild(option);
  });

  // Restaurer la valeur si elle existe toujours
  if (
    currentValue &&
    Array.from(filterCategory.options).some((opt) => opt.value === currentValue)
  ) {
    filterCategory.value = currentValue;
  }
}

// Fonction pour trier les tâches
function sortTasks(tasks, sortBy = "date", direction = "desc") {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = new Date(a.created_at) - new Date(b.created_at);
        break;
      case "priority":
        const priorityOrder = { haute: 3, normale: 2, basse: 1 };
        comparison =
          (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
        break;
      case "name":
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        comparison = new Date(a.created_at) - new Date(b.created_at);
    }

    return direction === "desc" ? -comparison : comparison;
  });
}

// Fonction pour filtrer les tâches
function filterTasks(tasks) {
  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const priorityFilter = filterPriority ? filterPriority.value : "";
  const categoryFilter = filterCategory ? filterCategory.value : "";
  const statusFilter = filterStatus ? filterStatus.value : "";

  return tasks.filter((task) => {
    const matchesSearch =
      !search ||
      task.title.toLowerCase().includes(search) ||
      (task.description || "").toLowerCase().includes(search);

    const matchesPriority = !priorityFilter || task.priority === priorityFilter;

    const matchesCategory = !categoryFilter || task.category === categoryFilter;

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "pending" && !task.completed);

    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });
}

function renderTasks() {
  if (!taskList) {
    console.log("taskList non trouvé");
    return;
  }

  console.log("Rendu des tâches - window.tasks:", window.tasks);

  // Afficher l'état de chargement
  if (loadingTasksDiv) loadingTasksDiv.style.display = "block";
  if (noTasksDiv) noTasksDiv.style.display = "none";

  // Filtrer et trier les tâches
  const filtered = filterTasks(window.tasks || []);
  const sorted = sortTasks(filtered, currentSort, currentSortDirection);

  console.log("Tâches filtrées et triées:", sorted);

  // Masquer l'état de chargement
  if (loadingTasksDiv) loadingTasksDiv.style.display = "none";

  taskList.innerHTML = "";

  if (sorted.length === 0) {
    if (noTasksDiv) noTasksDiv.style.display = "block";
    return;
  }

  if (noTasksDiv) noTasksDiv.style.display = "none";

  sorted.forEach((task) => {
    const li = document.createElement("li");
    li.className = `list-group-item task-item animate__animated animate__fadeIn ${
      task.completed ? "completed bg-success-subtle" : ""
    }`;
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "listitem");

    const priorityClass =
      task.priority === "haute"
        ? "danger"
        : task.priority === "normale"
        ? "warning"
        : "info";

    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center mb-2">
            <h6 class="mb-0 ${
              task.completed ? "text-decoration-line-through text-muted" : ""
            }">
              ${task.title}
            </h6>
            <div class="ms-2">
              <span class="badge bg-${priorityClass} me-1">${
      task.priority
    }</span>
        ${
                task.category
                  ? `<span class="badge bg-secondary me-1">${task.category}</span>`
                  : ""
              }
              ${
      task.completed
                  ? '<span class="badge bg-success">Terminée</span>'
                  : ""
              }
            </div>
          </div>
          ${
            task.description
              ? `<p class="text-muted small mb-2">${task.description}</p>`
              : ""
          }
          <div class="text-muted small">
            <i class="fas fa-calendar me-1" aria-hidden="true"></i>
            Créée: ${formatDate(task.created_at)}
            ${
              task.completed
                ? `
              <span class="ms-3">
                <i class="fas fa-check-circle me-1" aria-hidden="true"></i>
                Terminée: ${formatDate(task.completed_at)}
      </span>
            `
                : ""
            }
          </div>
        </div>
        <div class="btn-group ms-3" role="group" aria-label="Actions pour la tâche">
          ${
            !task.completed
              ? `
            <button class="btn btn-success btn-sm" title="Terminer" aria-label="Marquer comme terminée" onclick="completeTask(${task.id})">
              <i class="fas fa-check"></i>
            </button>
          `
              : ""
          }
          <button class="btn btn-primary btn-sm" title="Modifier" aria-label="Modifier la tâche" onclick="editTask(${
          task.id
          })" ${task.completed ? "disabled" : ""} ${
      task.completed ? 'style="opacity: 0.5; cursor: not-allowed;"' : ""
    }>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm" title="Supprimer" aria-label="Supprimer la tâche" onclick="deleteTask(${
          task.id
          })">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    taskList.appendChild(li);
  });

  // Mettre à jour les statistiques
  updateStats();
}

// Fonction pour récupérer les tâches - utiliser celle de auth.js
async function fetchTasks() {
  console.log("fetchTasks appelé depuis app.js");

  if (window.fetchTasks && window.fetchTasks !== fetchTasks) {
    console.log("Utilisation de fetchTasks depuis auth.js");
    return window.fetchTasks();
  }

  try {
    const res = await api_fetch("/api/tasks");
  if (res.status === 401) {
    showNotification("Non authentifié", "danger");
    return;
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    showNotification(data.error || "Erreur d'authentification", "danger");
    return;
  }
    window.tasks = data;
    console.log("Tâches mises à jour dans app.js:", window.tasks);
  renderTasks();
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    showNotification("Erreur lors de la récupération des tâches.", "danger");
  }
}

// Gestion du formulaire d'ajout de tâche
if (taskForm) {
  taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

    if (!titleInput) {
      console.error("Champ titre non trouvé");
      return;
    }

  const title = titleInput.value.trim();
    const description = descInput ? descInput.value.trim() : "";
    const priority = priorityInput ? priorityInput.value : "normale";
    const due_date = dueDateInput ? dueDateInput.value : null;
    const category = categoryInput ? categoryInput.value : null;
    const customCategoryInput = document.getElementById("custom-category");

  if (!title) {
    showNotification("Le titre est requis.", "danger");
      titleInput.focus();
    return;
  }

    // Construction du body avec tous les champs
    const body = { title, description, priority };
    if (due_date) body.due_date = due_date;

    // Gérer la catégorie personnalisée
    if (
      category === "autre" &&
      customCategoryInput &&
      customCategoryInput.value.trim()
    ) {
      body.category = customCategoryInput.value.trim();
    } else if (category && category !== "autre") {
      body.category = category;
    }

    try {
      console.log("Ajout de tâche:", body);
      const res = await api_fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });

      console.log("Réponse ajout tâche:", res.status);

    if (res.status === 401) {
        showNotification(
          "Session expirée. Veuillez vous reconnecter.",
          "danger"
        );
        localStorage.removeItem("access_token");
        if (window.checkAuth) window.checkAuth();
      return;
    }

    if (res.status === 422) {
        const data = await res.json().catch(() => ({}));
        showNotification(
          data.error || "Erreur de saisie. Vérifiez les champs.",
          "danger"
        );
      return;
    }

    if (res.ok) {
      showNotification("Tâche ajoutée !", "success");
      titleInput.value = "";
        if (descInput) descInput.value = "";
        if (dueDateInput) dueDateInput.value = "";
        if (categoryInput) categoryInput.value = "";
        if (customCategoryInput) {
          customCategoryInput.value = "";
          customCategoryInput.style.display = "none";
        }
        titleInput.focus();

        // Récupérer la nouvelle tâche depuis la réponse
        const newTask = await res.json();

        // Ajouter immédiatement la nouvelle tâche aux données locales
        if (window.tasks && Array.isArray(window.tasks)) {
          window.tasks.push(newTask);
        }

        // Mettre à jour immédiatement les statistiques
        updateStats();

        // Rafraîchir la liste avec les nouvelles données
        renderTasks();

        // Rafraîchir également depuis le serveur pour s'assurer de la cohérence
        setTimeout(async () => {
          console.log("Rafraîchissement de la liste après ajout");
          if (window.fetchTasks) {
            await window.fetchTasks();
          } else {
            await fetchTasks();
          }
        }, 200);
    } else {
        const data = await res.json().catch(() => ({}));
        showNotification(data.error || "Erreur lors de l'ajout", "danger");
        console.error("Erreur backend:", data);
    }
  } catch (err) {
      console.error("Erreur lors de l'ajout de tâche:", err);
      showNotification("Erreur de connexion au serveur", "danger");
    }
  });
  }

// Fonctions globales pour les actions sur les tâches
window.completeTask = async (id) => {
  try {
    const res = await api_fetch(`/api/tasks/${id}/complete`, {
      method: "POST",
    });
  if (res.ok) {
    showNotification("Tâche terminée !", "success");

      // Mettre à jour immédiatement les données locales
      const taskIndex = window.tasks.findIndex((t) => t.id === id);
      if (taskIndex !== -1) {
        window.tasks[taskIndex].completed = true;
        window.tasks[taskIndex].completed_at = new Date().toISOString();
      }

      // Mettre à jour immédiatement les statistiques
      updateStats();

      // Rafraîchir la liste avec les nouvelles données
      renderTasks();

      // Rafraîchir également depuis le serveur pour s'assurer de la cohérence
      setTimeout(async () => {
        if (window.fetchTasks) {
          await window.fetchTasks();
        } else {
          await fetchTasks();
        }
      }, 200);
  } else {
      showNotification("Erreur lors de la finalisation", "danger");
    }
  } catch (error) {
    console.error("Erreur lors de la finalisation:", error);
    showNotification("Erreur lors de la finalisation", "danger");
  }
};

window.deleteTask = async (id) => {
  if (!taskList) return;

  const li = Array.from(taskList.children).find((el) =>
    el.querySelector('button[onclick*="deleteTask(' + id + ')"]')
  );
  if (!confirm("Supprimer cette tâche ?")) return;
  if (li) animateTaskItem(li, "animate__fadeOutLeft", () => li.remove());

  try {
    const res = await api_fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (res.ok) {
    showNotification("Tâche supprimée !", "success");

      // Mettre à jour immédiatement les données locales
      window.tasks = window.tasks.filter((t) => t.id !== id);

      // Mettre à jour immédiatement les statistiques
      updateStats();

      // Rafraîchir la liste avec les nouvelles données
      renderTasks();

      // Rafraîchir également depuis le serveur pour s'assurer de la cohérence
      setTimeout(async () => {
        if (window.fetchTasks) {
          await window.fetchTasks();
        } else {
          await fetchTasks();
        }
      }, 200);
  } else {
      showNotification("Erreur lors de la suppression", "danger");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    showNotification("Erreur lors de la suppression", "danger");
  }
};

if (searchInput) {
  searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(renderTasks, 200);
  });
}

if (filterPriority) {
  filterPriority.addEventListener("change", renderTasks);
}

if (filterCategory) {
  filterCategory.addEventListener("change", renderTasks);
}

if (filterStatus) {
  filterStatus.addEventListener("change", renderTasks);
}

if (sortDateBtn) {
  sortDateBtn.addEventListener("click", () => {
    currentSort = "date";
    currentSortDirection = currentSortDirection === "desc" ? "asc" : "desc";
    renderTasks();
  });
}

if (sortPriorityBtn) {
  sortPriorityBtn.addEventListener("click", () => {
    currentSort = "priority";
    currentSortDirection = currentSortDirection === "desc" ? "asc" : "desc";
    renderTasks();
  });
}

if (sortNameBtn) {
  sortNameBtn.addEventListener("click", () => {
    currentSort = "name";
    currentSortDirection = currentSortDirection === "desc" ? "asc" : "desc";
    renderTasks();
  });
}

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (filterPriority) filterPriority.value = "";
    if (filterCategory) filterCategory.value = "";
    if (filterStatus) filterStatus.value = "";
    renderTasks();
  });
}

if (bulkCompleteBtn) {
  bulkCompleteBtn.addEventListener("click", async () => {
    try {
      const res = await api_fetch("/api/tasks/bulk-complete", {
        method: "POST",
      });
      if (res.ok) {
        showNotification("Tâches terminées !", "success");

        // Mettre à jour immédiatement les données locales
        if (window.tasks && Array.isArray(window.tasks)) {
          window.tasks.forEach((task) => {
            if (!task.completed) {
              task.completed = true;
              task.completed_at = new Date().toISOString();
            }
          });
        }

        // Mettre à jour immédiatement les statistiques
        updateStats();

        // Rafraîchir la liste avec les nouvelles données
        renderTasks();

        // Rafraîchir également depuis le serveur pour s'assurer de la cohérence
        setTimeout(async () => {
          if (window.fetchTasks) {
            await window.fetchTasks();
          } else {
            await fetchTasks();
          }
        }, 200);
      } else {
        showNotification("Erreur lors de la finalisation", "danger");
      }
    } catch (error) {
      console.error("Erreur lors de la finalisation:", error);
      showNotification("Erreur lors de la finalisation", "danger");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (titleInput) titleInput.focus();
});

// Exposer les fonctions globalement
window.renderTasks = renderTasks;
window.showNotification = showNotification;

// Fonction pour éditer une tâche
window.editTask = async (id) => {
  try {
    // Récupérer les données de la tâche
    const task = window.tasks.find((t) => t.id === id);
    if (!task) {
      showNotification("Tâche non trouvée", "danger");
      return;
    }

    // Remplir le modal avec les données actuelles
    const editTitle = document.getElementById("edit-title");
    const editDescription = document.getElementById("edit-description");
    const editPriority = document.getElementById("edit-priority");
    const editCategory = document.getElementById("edit-category");
    const editCustomCategory = document.getElementById("edit-custom-category");
    const editTaskInfo = document.getElementById("edit-task-info");
    const saveEditBtn = document.getElementById("save-edit");

    if (editTitle) editTitle.value = task.title;
    if (editDescription) editDescription.value = task.description || "";
    if (editPriority) editPriority.value = task.priority;

    // Gérer la catégorie et la catégorie personnalisée
    if (editCategory && editCustomCategory) {
      const taskCategory = task.category || "";
      const predefinedCategories = [
        "travail",
        "personnel",
        "sante",
        "apprentissage",
      ];

      if (predefinedCategories.includes(taskCategory)) {
        editCategory.value = taskCategory;
        editCustomCategory.style.display = "none";
        editCustomCategory.value = "";
      } else if (taskCategory) {
        editCategory.value = "autre";
        editCustomCategory.value = taskCategory;
        editCustomCategory.style.display = "block";
      } else {
        editCategory.value = "travail";
        editCustomCategory.style.display = "none";
        editCustomCategory.value = "";
      }
    }

    // Si la tâche est terminée, désactiver les champs et afficher le message
    if (task.completed) {
      if (editTitle) editTitle.disabled = true;
      if (editDescription) editDescription.disabled = true;
      if (editPriority) editPriority.disabled = true;
      if (editCategory) editCategory.disabled = true;
      if (saveEditBtn) saveEditBtn.disabled = true;
      if (editTaskInfo) editTaskInfo.classList.remove("d-none");
    } else {
      if (editTitle) editTitle.disabled = false;
      if (editDescription) editDescription.disabled = false;
      if (editPriority) editPriority.disabled = false;
      if (editCategory) editCategory.disabled = false;
      if (saveEditBtn) saveEditBtn.disabled = false;
      if (editTaskInfo) editTaskInfo.classList.add("d-none");
    }

    // Stocker l'ID de la tâche en cours d'édition
    window.editingTaskId = id;

    // Ouvrir le modal
    const modal = new bootstrap.Modal(document.getElementById("taskEditModal"));
    modal.show();
  } catch (error) {
    console.error("Erreur lors de l'ouverture de l'édition:", error);
    showNotification("Erreur lors de l'ouverture de l'édition", "danger");
  }
};

// Fonction pour sauvegarder les modifications
window.saveTaskEdit = async () => {
  try {
    const taskId = window.editingTaskId;
    if (!taskId) {
      showNotification("Aucune tâche en cours d'édition", "danger");
      return;
    }

    // Vérifier si la tâche est terminée
    const task = window.tasks.find((t) => t.id === taskId);
    if (task && task.completed) {
      showNotification("Impossible de modifier une tâche terminée", "warning");
      return;
    }

    const editTitle = document.getElementById("edit-title");
    const editDescription = document.getElementById("edit-description");
    const editPriority = document.getElementById("edit-priority");
    const editCategory = document.getElementById("edit-category");
    const editCustomCategory = document.getElementById("edit-custom-category");

    const updatedData = {
      title: editTitle ? editTitle.value.trim() : "",
      description: editDescription ? editDescription.value.trim() : "",
      priority: editPriority ? editPriority.value : "normale",
      category: "",
    };

    // Gérer la catégorie personnalisée
    if (editCategory && editCustomCategory) {
      if (editCategory.value === "autre" && editCustomCategory.value.trim()) {
        updatedData.category = editCustomCategory.value.trim();
      } else if (editCategory.value !== "autre") {
        updatedData.category = editCategory.value;
      }
    }

    if (!updatedData.title) {
      showNotification("Le titre est requis", "danger");
      return;
    }

    console.log("Modification de tâche:", updatedData);
    const res = await api_fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });

    console.log("Réponse modification tâche:", res.status);

    if (res.status === 401) {
      showNotification("Session expirée. Veuillez vous reconnecter.", "danger");
      localStorage.removeItem("access_token");
      if (window.checkAuth) window.checkAuth();
      return;
    }

    if (res.status === 404) {
      showNotification("Tâche non trouvée", "danger");
      return;
    }

    if (res.ok) {
      showNotification("Tâche modifiée avec succès !", "success");

      // Fermer le modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("taskEditModal")
      );
      if (modal) modal.hide();

      // Mettre à jour immédiatement les données locales
      const taskIndex = window.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        window.tasks[taskIndex] = {
          ...window.tasks[taskIndex],
          ...updatedData,
        };
      }

      // Mettre à jour immédiatement les statistiques
      updateStats();

      // Rafraîchir la liste avec les nouvelles données
      renderTasks();

      // Rafraîchir également depuis le serveur pour s'assurer de la cohérence
      setTimeout(async () => {
        if (window.fetchTasks) {
          await window.fetchTasks();
        } else {
          await fetchTasks();
        }
      }, 200);
    } else {
      const data = await res.json().catch(() => ({}));
      showNotification(
        data.error || "Erreur lors de la modification",
        "danger"
      );
    }
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    showNotification("Erreur de connexion au serveur", "danger");
  }
};

// Gestion du bouton de sauvegarde dans le modal
document.addEventListener("DOMContentLoaded", () => {
  const saveEditBtn = document.getElementById("save-edit");
  if (saveEditBtn) {
    saveEditBtn.addEventListener("click", window.saveTaskEdit);
  }
});

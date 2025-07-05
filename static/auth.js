// Variables globales
const API_URL = "/api/tasks";
let tasks = [];

// Fonction checkAuth définie avant son utilisation
const checkAuth = () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    const authContainer = document.getElementById("auth-container");
    const appContainer = document.getElementById("app-container");
    if (authContainer) authContainer.style.display = "none";
    if (appContainer) appContainer.style.display = "block";
    // Récupérer l'email via l'API
    fetch("/api/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        const userEmail = document.getElementById("user-email");
        if (userEmail) {
          userEmail.textContent = data.email || "Utilisateur connecté";
        }
      })
      .catch(() => {
        const userEmail = document.getElementById("user-email");
        if (userEmail) {
          userEmail.textContent = "Utilisateur connecté";
        }
      });
    if (window.fetchTasks) window.fetchTasks();
  } else {
    const authContainer = document.getElementById("auth-container");
    const appContainer = document.getElementById("app-container");
    if (authContainer) authContainer.style.display = "block";
    if (appContainer) appContainer.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("login-view");
  const registerView = document.getElementById("register-view");
  const appContainer = document.getElementById("app-container");
  const authContainer = document.getElementById("auth-container");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("logout-btn");

  // Navigation entre login et register
  if (showRegister) {
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
      e.stopPropagation();
      if (loginView) loginView.style.display = "none";
      if (registerView) {
    registerView.style.display = "block";
        registerView.classList.add("animate__fadeIn");
      }
  });
  }

  if (showLogin) {
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
      e.stopPropagation();
      if (registerView) registerView.style.display = "none";
      if (loginView) {
    loginView.style.display = "block";
        loginView.classList.add("animate__fadeIn");
      }
  });
  }

  // Gestion du formulaire de connexion
  if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
      e.stopPropagation();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

      // Validation côté client
      if (!email || !password) {
        showNotification("Veuillez remplir tous les champs.", "danger");
        return;
      }

      try {
        console.log("Tentative de connexion...");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

        console.log("Réponse de connexion:", res.status);

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
          showNotification("Connexion réussie !", "success");
          setTimeout(() => {
      checkAuth();
          }, 1000);
    } else {
      const data = await res.json().catch(() => ({}));
      showNotification(
        data.error || "Email ou mot de passe incorrect.",
        "danger"
      );
        }
      } catch (error) {
        console.error("Erreur de connexion:", error);
        showNotification("Erreur de connexion au serveur.", "danger");
    }
  });
  }

  // Gestion du formulaire d'inscription
  if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
      e.stopPropagation();

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

      // Validation côté client
      if (!email || !password) {
        showNotification("Veuillez remplir tous les champs.", "danger");
        return;
      }

      if (password.length < 6) {
        showNotification(
          "Le mot de passe doit contenir au moins 6 caractères.",
          "danger"
        );
        return;
      }

      try {
        console.log("Envoi de la requête d'inscription...");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

        console.log("Réponse d'inscription:", res.status);

    if (res.ok) {
          const data = await res.json();
          console.log("Inscription réussie:", data);
          showNotification(
            "Inscription réussie ! Vous pouvez maintenant vous connecter.",
            "success"
          );
          setTimeout(() => {
            if (showLogin) showLogin.click();
          }, 2000);
    } else {
          const data = await res.json().catch(() => ({}));
          console.log("Erreur d'inscription:", data);
          showNotification(
            data.error || "Erreur lors de l'inscription.",
            "danger"
          );
        }
      } catch (error) {
        console.error("Erreur de connexion au serveur:", error);
        showNotification("Erreur de connexion au serveur.", "danger");
    }
  });
  }

  // Gestion de la déconnexion
  if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("access_token");
      showNotification("Déconnexion réussie.", "info");
      setTimeout(() => {
    checkAuth();
      }, 1000);
  });
  }

  // Initialisation
  checkAuth();
});

// Fonction pour récupérer les tâches
async function fetchTasks() {
  try {
  const res = await api_fetch(API_URL);
    console.log("Status fetchTasks:", res.status);

  if (res.status === 401) {
      console.log("Token expiré ou invalide");
    // Token invalide ou expiré, forcer la déconnexion
    localStorage.removeItem("access_token");
    if (window.checkAuth) window.checkAuth();
    return;
  }

  const data = await res.json();
    console.log("Données des tâches:", data);

  if (!Array.isArray(data)) {
    // Erreur côté API, afficher un message ou forcer la déconnexion
      showNotification(data.error || "Erreur d'authentification", "danger");
    localStorage.removeItem("access_token");
    if (window.checkAuth) window.checkAuth();
    return;
  }

    // Mettre à jour la variable globale
    window.tasks = data;
    console.log("Tâches mises à jour:", window.tasks);

    // Appeler renderTasks si elle existe
    if (window.renderTasks) {
      window.renderTasks();
    } else {
      console.log("renderTasks n'est pas disponible");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    showNotification("Erreur lors de la récupération des tâches.", "danger");
  }
}

// Fonction pour parser le JWT
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erreur lors du parsing du JWT:", e);
    return null;
  }
}

// Fonction de notification améliorée
function showNotification(message, type = "primary") {
  console.log("Notification:", message, type);

  const toast = document.getElementById("notification");
  if (!toast) {
    // Fallback si la notification n'existe pas
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

  try {
    const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
    bsToast.show();
  } catch (error) {
    console.error("Erreur lors de l'affichage de la notification:", error);
    // Fallback simple
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 4000);
  }
}

// Exposer les fonctions globalement
window.showNotification = showNotification;
window.fetchTasks = fetchTasks;
window.checkAuth = checkAuth;
window.parseJwt = parseJwt;

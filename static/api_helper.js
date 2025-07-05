function api_fetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(endpoint, { ...options, headers });
}

// Remplacer toutes les occurrences de fetch() dans app.js par api_fetch()
// Exemple:
// const res = await api_fetch(API_URL);
// const res = await api_fetch(API_URL, { method: "POST", body: JSON.stringify(...) });

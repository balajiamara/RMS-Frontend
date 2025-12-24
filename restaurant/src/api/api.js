// // src/api/api.js
// const API_BASE =
//   import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "https://rms-i0wj.onrender.com";

// function buildUrl(path) {
//   // allow "login" or "/login/" or "login/" - always return BASE + "/path/"
//   const p = String(path || "").replace(/^\/+|\/+$/g, ""); // trim slashes
//   return `${API_BASE}/${p}/`; // always ensure trailing slash
// }

// async function handleResponse(res) {
//   const text = await res.text();
//   let data = {};
//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch {
//     data = { raw: text };
//   }

//   if (!res.ok) {
//     const err = new Error(data.error || data.msg || res.statusText || "Request failed");
//     err.status = res.status;
//     err.data = data;
//     throw err;
//   }
//   return data;
// }

// export async function apiGet(path) {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     method: "GET",
//     credentials: "include",
//   });
//   return handleResponse(res);
// }

// export async function apiPost(path, body = {}) {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   return handleResponse(res);
// }

// export async function apiPostForm(path, formData) {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     method: "POST",
//     credentials: "include",
//     body: formData,
//   });
//   return handleResponse(res);
// }





// src/api/api.js (append or ensure you have this)
// const API_BASE =
//   import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "https://rms-i0wj.onrender.com";

// function buildUrl(path) {
//   const p = String(path || "").replace(/^\/+|\/+$/g, "");
//   return `${API_BASE}/${p}/`;
// }

// async function handleResponse(res) {
//   const text = await res.text();
//   let data = {};
//   try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

//   if (!res.ok) {
//     const err = new Error(data.error || data.msg || res.statusText || "Request failed");
//     err.status = res.status;
//     err.data = data;
//     throw err;
//   }
//   return data;
// }

// export async function apiPostForm(path, formData) {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     method: "POST",
//     credentials: "include", // send cookies
//     body: formData,         // DO NOT set Content-Type header
//   });
//   return handleResponse(res);
// }

// // (keep other helpers apiGet/apiPost if you use them)

// export async function apiGet(path) {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     method: "GET",
//     credentials: "include",
//   });
//   return handleResponse(res);
// }

// export async function apiPost(path, body = {}) {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   return handleResponse(res);
// }


const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "https://rms-i0wj.onrender.com";
  // "http://127.0.0.1:8000"

// Normalize URL
function buildUrl(path) {
  const p = String(path || "").replace(/^\/+|\/+$/g, "");
  return `${API_BASE}/${p}/`;
}

// Handle JSON or text safely
async function handleResponse(res) {
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = new Error(data.error || data.msg || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* -------------------------------------------
   🔵 GET REQUEST
-------------------------------------------- */
// export async function apiGet(path) {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     method: "GET",
//     credentials: "include",
//   });
//   return handleResponse(res);
// }

export async function apiGet(path) {
  const url = buildUrl(path);
  const token = localStorage.getItem("token"); // adjust key if needed

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  return handleResponse(res);
}

/* -------------------------------------------
   🟡 POST (JSON)
-------------------------------------------- */
export async function apiPost(path, body = {}) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

/* -------------------------------------------
   🟠 POST (FormData)
-------------------------------------------- */
export async function apiPostForm(path, formData) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData, // no Content-Type header
  });
  return handleResponse(res);
}

/* -------------------------------------------
   🟢 PUT (JSON)
-------------------------------------------- */
export async function apiPut(path, body = {}) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

/* -------------------------------------------
   🔵 PATCH (JSON)
-------------------------------------------- */
export async function apiPatch(path, body = {}) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

/* -------------------------------------------
   🔴 DELETE
-------------------------------------------- */
export async function apiDelete(path) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(res);
}


export async function apiPutForm(path, formData) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",
    body: formData, // Browser sets Content-Type automatically
  });
  return handleResponse(res);
}

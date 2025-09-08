// src/app/lib/api.ts

// Define interfaces para tipar correctamente la función
interface QueryPayload {
  tenant_id: string;
  query: string;
}

interface QueryResponse {
  answer: string;
}

// URL de tu API (puedes usar variable de entorno en Vercel)
const res = await fetch('/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  // quita credentials si no usas cookies/sesión
  credentials: 'include',
  body: JSON.stringify(payload)
});
  if (!response.ok) {
    throw new Error(`Error al consultar la API: ${response.statusText}`);
  }

  const data = await response.json();
  return data as QueryResponse;
}


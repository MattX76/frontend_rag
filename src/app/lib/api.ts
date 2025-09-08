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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://34.68.200.26:8000/query";

// Función para enviar la consulta a tu API
export async function sendQuery(payload: QueryPayload): Promise<QueryResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error al consultar la API: ${response.statusText}`);
  }

  const data = await response.json();
  return data as QueryResponse;
}


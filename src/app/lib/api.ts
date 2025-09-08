// src/app/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL no está definido. Revisa tus variables de entorno."
  );
}

export interface QueryRequest {
  tenant_id: string;
  query: string;
}

export interface QueryResponse {
  answer: string;
  sources: any[];
}

export async function sendQuery(
  request: QueryRequest
): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al consultar la API: ${res.status} ${text}`);
  }

  return res.json();
}

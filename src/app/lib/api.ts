// src/app/lib/api.ts

// Si usas cookies/sesión, pasa { includeCredentials: true } al llamar.
export async function queryBackend(
  payload: unknown,
  options?: { includeCredentials?: boolean }
) {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: options?.includeCredentials ? 'include' : 'same-origin',
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Error al consultar la API (${response.status}): ${text || response.statusText}`);
  }

  return response.json();
}


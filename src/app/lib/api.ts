// src/app/lib/api.ts

export type QueryResponse = {
  answer: string;
  sources: Array<{ title?: string; url?: string }>;
};

/**
 * Llama a tu backend a través del proxy /api/query
 * @param query    El texto que ingresa el usuario
 * @param tenantId El tenant (por defecto 'default')
 */
export async function queryBackend(query: string, tenantId: string): Promise<QueryResponse> {
  const res = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, tenant_id: tenantId })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error API (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}


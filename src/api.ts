const API_BASE = import.meta.env.VITE_API_URL ?? '';

export type Lead = {
  id: string;
  email: string;
  /** ISO 8601 string from API */
  createdAt: string;
};

export async function saveLead(email: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('save failed');
}

export async function loginAdmin(password: string): Promise<{ token: string; email: string }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('login failed');
  return res.json() as Promise<{ token: string; email: string }>;
}

export async function fetchLeads(token: string): Promise<Lead[]> {
  const res = await fetch(`${API_BASE}/api/leads`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('fetch failed');
  return res.json() as Promise<Lead[]>;
}

/** Polls the leads list while token is set; call cleanup on unmount. */
export function subscribeLeads(
  callback: (leads: Lead[]) => void,
  token: string | null,
  intervalMs = 4000
): () => void {
  if (!token) return () => {};

  let cancelled = false;
  const tick = async () => {
    if (cancelled) return;
    try {
      const leads = await fetchLeads(token);
      if (!cancelled) callback(leads);
    } catch (e) {
      console.error(e);
    }
  };

  void tick();
  const id = setInterval(() => void tick(), intervalMs);
  return () => {
    cancelled = true;
    clearInterval(id);
  };
}

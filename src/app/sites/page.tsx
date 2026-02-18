"use client";

import { useEffect, useState } from "react";

type NetlifySite = {
  id: string;
  name: string;
  ssl_url?: string;
  url?: string;
};

export default function SitesPage() {
  const [sites, setSites] = useState<NetlifySite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 8000);

        const res = await fetch("/api/netlify/sites", {
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(t);

        if (!res.ok) {
          setError(`Failed to load sites (${res.status})`);
          setSites([]);
          setLoading(false);
          return;
        }

        const data = (await res.json()) as NetlifySite[];
        setSites(data);
        setError(null);
        setLoading(false);
      } catch {
        setError("Failed to load sites (network error)");
        setSites([]);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Netlify Sites</h1>
      <p>Build: sites-page-v2</p>

      {loading && <p>Loading…</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && sites.length === 0 && <p>No sites found.</p>}

      {sites.length > 0 && (
        <ul>
          {sites.map((s) => (
            <li key={s.id}>
              <strong>{s.name}</strong>{" "}
              <a
                href={s.ssl_url ?? s.url ?? "#"}
                target="_blank"
                rel="noreferrer"
              >
                open
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

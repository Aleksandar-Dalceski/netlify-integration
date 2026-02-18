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

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/netlify/sites", { cache: "no-store" });
      if (!res.ok) {
        setError(`Failed to load sites (${res.status})`);
        return;
      }
      setSites(await res.json());
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Netlify Sites</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && sites.length === 0 ? (
        <p>Loading…</p>
      ) : (
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

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

  const DEMO_SITES = [
    { id: "1", name: "Demo Site A", ssl_url: "https://demo-a.netlify.app" },
    { id: "2", name: "Demo Site B", ssl_url: "https://demo-b.netlify.app" },
    { id: "3", name: "Demo Site C", ssl_url: "https://demo-c.netlify.app" },
  ];

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/netlify/sites", { cache: "no-store" });
      if (!res.ok) {
        setSites(DEMO_SITES); // 👈 fallback seed data
        return;
      }
      setSites(await res.json());
    })();
  }, []);

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

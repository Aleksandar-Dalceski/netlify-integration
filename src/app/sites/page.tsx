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
      try {
        // optional timeout (8s) so it won't hang forever
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 8000);

        const res = await fetch("/api/netlify/sites", {
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(t);

        if (!res.ok) {
          setSites(DEMO_SITES);
          setError(`Using demo data (API returned ${res.status}).`);
          return;
        }

        const data = (await res.json()) as NetlifySite[];
        setSites(data);
        setError(null);
      } catch (e) {
        setSites(DEMO_SITES);
        setError("Using demo data (API unreachable).");
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <p>Nov deploy</p>

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

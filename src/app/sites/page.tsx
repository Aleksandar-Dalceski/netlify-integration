"use client";

import { useEffect, useMemo, useState } from "react";

type NetlifySite = {
  id: string;
  name: string;
  ssl_url?: string;
  url?: string;
};

function generateDemoSites(n = 100): NetlifySite[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `demo-${i + 1}`,
    name: `Demo Site ${i + 1}`,
    ssl_url: `https://demo-site-${i + 1}.netlify.app`,
  }));
}

export default function SitesPage() {
  const [sites, setSites] = useState<NetlifySite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [debug, setDebug] = useState<any>(null);

  const demoMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("demo") === "1";
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Demo mode: always show lots of data
        if (demoMode) {
          setSites(generateDemoSites(100));
          setError("Demo mode ON (generated 100 sites).");
          setLoading(false);
          setDebug({ demoMode: true });
          return;
        }

        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 8000);

        // Use ABSOLUTE URL to avoid Netlify routing quirks
        const apiUrl =
          "https://genuine-tulumba-65945d.netlify.app/api/netlify/sites";

        const res = await fetch(apiUrl, {
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(t);

        const contentType = res.headers.get("content-type");

        setDebug({
          demoMode: false,
          requestUrl: apiUrl,
          status: res.status,
          ok: res.ok,
          contentType,
        });

        if (!res.ok) {
          // If API fails -> fallback to lots of demo data
          setSites(generateDemoSites(100));
          setError(`API failed (${res.status}) → showing demo data.`);
          setLoading(false);
          return;
        }

        // If response isn't JSON -> fallback to demo data
        if (!contentType?.includes("application/json")) {
          setSites(generateDemoSites(100));
          setError(
            `API returned non-JSON (${contentType}) → showing demo data.`,
          );
          setLoading(false);
          return;
        }

        const data = (await res.json()) as NetlifySite[];

        // If real API returns too few sites, append demo items (for presentation)
        const finalSites =
          Array.isArray(data) && data.length < 20
            ? [...data, ...generateDemoSites(100 - data.length)]
            : data;

        setSites(finalSites);
        setError(null);
        setLoading(false);

        setDebug((prev: any) => ({
          ...prev,
          receivedCount: Array.isArray(data) ? data.length : "not-array",
          shownCount: finalSites.length,
          firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
        }));
      } catch (e) {
        // Network error / timeout -> fallback to demo data
        setSites(generateDemoSites(100));
        setError("Network error/timeout → showing demo data.");
        setLoading(false);
        setDebug({ exception: String(e?.message ?? e) });
      }
    })();
  }, [demoMode]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Netlify Sites</h1>
      <p>Build: sites-page-v3</p>

      <p>
        Tip: open <code>/sites?demo=1</code> to force 100 demo rows.
      </p>

      {loading && <p>Loading…</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && sites.length === 0 && <p>No sites to show.</p>}

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

      <hr style={{ margin: "24px 0" }} />
      <h3>Debug</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(
          { loading, error, count: sites.length, debug },
          null,
          2,
        )}
      </pre>
    </main>
  );
}

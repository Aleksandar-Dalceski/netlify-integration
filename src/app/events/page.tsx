"use client";

import { useEffect, useState } from "react";

type DeployEvent = {
  receivedAt: string;
  payload: any;
};

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function EventsPage() {
  const [events, setEvents] = useState<DeployEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/netlify/events", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as DeployEvent[];
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h1 style={{ margin: 0 }}>Netlify Deploy Events</h1>
        <button onClick={load}>Refresh</button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "Received",
                  "State",
                  "Site",
                  "Branch",
                  "Title",
                  "Deploy link",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 12, opacity: 0.7 }}>
                    Нема events уште. Тригерирај deploy и кликни Refresh.
                  </td>
                </tr>
              ) : (
                events.map((ev, i) => {
                  const p = ev.payload ?? {};
                  const deployUrl =
                    p?.deploy_ssl_url ??
                    p?.deploy_url ??
                    p?.links?.permalink ??
                    null;

                  return (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "10px 8px",
                          borderBottom: "1px solid #f0f0f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmt(ev.receivedAt)}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {p?.state ?? "—"}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {p?.name ?? "—"}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {p?.branch ?? "—"}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {p?.title ?? "—"}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {deployUrl ? (
                          <a href={deployUrl} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

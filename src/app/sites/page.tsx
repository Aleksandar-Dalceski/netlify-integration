export const dynamic = "force-dynamic";

type NetlifySite = {
  id: string;
  name: string;
  url?: string;
  ssl_url?: string;
  admin_url?: string;
};

async function getSites(): Promise<NetlifySite[]> {
  const res = await fetch("/api/netlify/sites", { cache: "no-store" });

  if (!res.ok) return [];
  return res.json();
}

export default async function SitesPage() {
  const sites = await getSites();

  return (
    <main style={{ padding: 24 }}>
      <h1>Netlify Sites</h1>

      {sites.length === 0 ? (
        <p>No sites found (or NETLIFY_TOKEN not set).</p>
      ) : (
        <ul>
          {sites.map((s) => (
            <li key={s.id} style={{ marginBottom: 10 }}>
              <strong>{s.name}</strong>
              {" — "}
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

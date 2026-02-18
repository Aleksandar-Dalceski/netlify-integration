export const dynamic = "force-dynamic";

type NetlifySite = {
  id: string;
  name: string;
  ssl_url?: string;
  url?: string;
};

const DEMO_SITES: NetlifySite[] = [
  { id: "1", name: "Demo Site A", ssl_url: "https://demo-a.netlify.app" },
  { id: "2", name: "Demo Site B", ssl_url: "https://demo-b.netlify.app" },
  { id: "3", name: "Demo Site C", ssl_url: "https://demo-c.netlify.app" },
];

async function getSites(): Promise<NetlifySite[]> {
  try {
    const token = process.env.NETLIFY_TOKEN;
    if (!token) return DEMO_SITES;

    const res = await fetch("https://api.netlify.com/api/v1/sites", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return DEMO_SITES;

    const data = (await res.json()) as any[];
    // map to what we need
    return data.map((s) => ({
      id: s.id,
      name: s.name,
      ssl_url: s.ssl_url,
      url: s.url,
      site_id: s.site_id,
    }));
  } catch {
    return DEMO_SITES;
  }
}

export default async function SitesPage() {
  const sites = await getSites();

  return (
    <main style={{ padding: 24 }}>
      <h1>Netlify Sites</h1>
      <p>Build: sites-server-v1</p>

      <ul>
        {sites.map((s) => (
          <li key={s.id}>
            <strong>{s.name}</strong> <p>{s.site_id}</p>
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
    </main>
  );
}

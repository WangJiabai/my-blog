import { useEffect, useState } from "react";
import client from "../../api/client";
import type { Stats } from "../../types";

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    client.get("/api/admin/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: "Published", value: stats.published_articles },
    { label: "Drafts", value: stats.draft_articles },
    { label: "Total Articles", value: stats.total_articles },
    { label: "Comments", value: stats.total_comments },
    { label: "Users", value: stats.total_users },
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              flex: "1 1 160px",
              padding: "20px",
              border: "1px solid #eee",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700 }}>{c.value}</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

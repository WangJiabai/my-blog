import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as articlesApi from "../../api/articles";
import type { ArticleListItem } from "../../types";

export default function ArticleList() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = () => {
    articlesApi
      .getArticles(1, 100)
      .then((data) => setArticles(data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;
    await articlesApi.deleteArticle(id);
    fetchArticles();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Articles</h2>
        <Link
          to="/admin/articles/new"
          style={{
            padding: "8px 16px",
            background: "#333",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          + New Article
        </Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
            <th style={{ padding: "8px 12px" }}>Title</th>
            <th style={{ padding: "8px 12px" }}>Status</th>
            <th style={{ padding: "8px 12px" }}>Date</th>
            <th style={{ padding: "8px 12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "8px 12px" }}>{a.title}</td>
              <td style={{ padding: "8px 12px" }}>
                <span
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 10,
                    background: a.status === "published" ? "#e6f7e6" : a.status === "draft" ? "#fff3cd" : "#f0f0f0",
                    color: a.status === "published" ? "#2d7d46" : a.status === "draft" ? "#8a6d14" : "#888",
                  }}
                >
                  {a.status}
                </span>
              </td>
              <td style={{ padding: "8px 12px", fontSize: 13, color: "#888" }}>
                {new Date(a.published_at || a.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: "8px 12px", fontSize: 13 }}>
                <Link to={`/admin/articles/${a.id}/edit`} style={{ marginRight: 12, color: "#333" }}>
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#c00",
                    cursor: "pointer",
                    fontSize: 13,
                    padding: 0,
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

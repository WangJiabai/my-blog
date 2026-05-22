import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as articlesApi from "../api/articles";
import Pagination from "../components/Pagination";
import type { ArticleListItem } from "../types";

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    articlesApi
      .getArticles(page)
      .then((data) => {
        setArticles(data.items);
        setTotalPages(data.total_pages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Blog</h1>
      {articles.length === 0 && <p>No articles yet.</p>}
      {articles.map((a) => (
        <article
          key={a.id}
          style={{
            padding: "20px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <h2 style={{ margin: 0 }}>
            <Link
              to={`/article/${a.slug}`}
              style={{ color: "#333", textDecoration: "none" }}
            >
              {a.title}
            </Link>
          </h2>
          {a.summary && (
            <p style={{ color: "#666", fontSize: 15, marginTop: 8 }}>{a.summary}</p>
          )}
          <div style={{ fontSize: 13, color: "#999", marginTop: 8 }}>
            {a.author_name && <span>{a.author_name} · </span>}
            {new Date(a.published_at || a.created_at).toLocaleDateString()}
          </div>
        </article>
      ))}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

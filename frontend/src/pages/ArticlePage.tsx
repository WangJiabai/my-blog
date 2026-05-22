import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as articlesApi from "../api/articles";
import MarkdownRenderer from "../components/MarkdownRenderer";
import CommentSection from "../components/CommentSection";
import type { Article } from "../types";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    articlesApi
      .getArticle(slug)
      .then(setArticle)
      .catch(() => setError("Article not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (error || !article) return <p>{error || "Article not found"}</p>;

  return (
    <article>
      <Link to="/" style={{ fontSize: 14, color: "#888", textDecoration: "none" }}>
        ← Back to home
      </Link>
      <h1 style={{ marginTop: 16, marginBottom: 8 }}>{article.title}</h1>
      <div style={{ fontSize: 13, color: "#999", marginBottom: 32 }}>
        {article.author_name && <span>{article.author_name} · </span>}
        {new Date(article.published_at || article.created_at).toLocaleDateString()}
      </div>
      <MarkdownRenderer html={article.content_html} />
      <CommentSection articleId={article.id} />
    </article>
  );
}

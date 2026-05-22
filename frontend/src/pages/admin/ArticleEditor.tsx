import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../api/client";
import * as articlesApi from "../../api/articles";
import MarkdownEditor from "../../components/MarkdownEditor";
import type { Article } from "../../types";

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    client
      .get(`/api/admin/articles/${id}`)
      .then((res) => {
        const a: Article = res.data;
        setTitle(a.title);
        setSummary(a.summary || "");
        setContentMd(a.content_md);
        setStatus(a.status);
      })
      .catch(() => alert("Failed to load article"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !contentMd.trim()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await articlesApi.updateArticle(parseInt(id!), { title, summary, content_md: contentMd, status });
      } else {
        await articlesApi.createArticle({ title, summary, content_md: contentMd, status });
      }
      navigate("/admin/articles");
    } catch {
      alert("Failed to save article");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{isEdit ? "Edit Article" : "New Article"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "8px 12px", fontSize: 16, border: "1px solid #ddd", borderRadius: 4 }}
        />
        <input
          placeholder="Summary (optional)"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          style={{ padding: "8px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 4 }}
        />
        <MarkdownEditor value={contentMd} onChange={setContentMd} />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "6px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14 }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "8px 24px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: saving ? "default" : "pointer",
              fontSize: 14,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

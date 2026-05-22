import { useEffect, useState, type FormEvent } from "react";
import * as commentsApi from "../api/comments";
import { useAuth } from "../hooks/useAuth";
import type { Comment } from "../types";
import Pagination from "./Pagination";

interface Props {
  articleId: number;
}

export default function CommentSection({ articleId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async (p: number) => {
    try {
      const data = await commentsApi.getComments(articleId, p);
      setComments(data.items);
      setTotalPages(data.total_pages);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchComments(page);
  }, [articleId, page]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      await commentsApi.createComment(articleId, body.trim());
      setBody("");
      fetchComments(1);
      setPage(1);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: 14,
              border: "1px solid #ddd",
              borderRadius: 4,
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            style={{
              marginTop: 8,
              padding: "6px 16px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            Submit
          </button>
        </form>
      ) : (
        <p style={{ fontSize: 14, color: "#888" }}>
          Please <a href="/login">login</a> to leave a comment.
        </p>
      )}

      {comments.length === 0 && (
        <p style={{ color: "#999", fontSize: 14 }}>No comments yet.</p>
      )}

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
            {c.author_name || "Anonymous"} ·{" "}
            {new Date(c.created_at).toLocaleDateString()}
          </div>
          <p style={{ margin: 0, fontSize: 15 }}>{c.body}</p>
        </div>
      ))}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

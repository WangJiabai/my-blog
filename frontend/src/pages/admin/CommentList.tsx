import { useEffect, useState } from "react";
import * as articlesApi from "../../api/articles";
import * as commentsApi from "../../api/comments";
import type { Comment, ArticleListItem } from "../../types";

export default function CommentList() {
  const [comments, setComments] = useState<(Comment & { articleTitle?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Get all articles first
      const articlesData = await articlesApi.getArticles(1, 100);
      const articleMap = new Map<number, string>();
      articlesData.items.forEach((a: ArticleListItem) => articleMap.set(a.id, a.title));

      // Get comments for each article
      const allComments: (Comment & { articleTitle?: string })[] = [];
      for (const articleId of articleMap.keys()) {
        const commentData = await commentsApi.getComments(articleId, 1, 100);
        for (const c of commentData.items) {
          allComments.push({ ...c, articleTitle: articleMap.get(c.article_id) });
        }
      }
      allComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setComments(allComments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this comment?")) return;
    await commentsApi.deleteComment(id);
    fetchData();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Comments</h2>
      {comments.length === 0 && <p>No comments yet.</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
            <th style={{ padding: "8px 12px" }}>Article</th>
            <th style={{ padding: "8px 12px" }}>Author</th>
            <th style={{ padding: "8px 12px" }}>Comment</th>
            <th style={{ padding: "8px 12px" }}>Date</th>
            <th style={{ padding: "8px 12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "8px 12px", fontSize: 13 }}>{c.articleTitle || `#${c.article_id}`}</td>
              <td style={{ padding: "8px 12px", fontSize: 13 }}>{c.author_name}</td>
              <td style={{ padding: "8px 12px", fontSize: 14 }}>{c.body.slice(0, 100)}{c.body.length > 100 && "..."}</td>
              <td style={{ padding: "8px 12px", fontSize: 13, color: "#888" }}>
                {new Date(c.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: "8px 12px" }}>
                <button
                  onClick={() => handleDelete(c.id)}
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

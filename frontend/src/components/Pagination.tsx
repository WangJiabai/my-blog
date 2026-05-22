interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        style={{
          padding: "6px 12px",
          border: "1px solid #ddd",
          borderRadius: 4,
          background: page <= 1 ? "#f5f5f5" : "#fff",
          cursor: page <= 1 ? "default" : "pointer",
          color: page <= 1 ? "#ccc" : "#333",
        }}
      >
        Prev
      </button>
      <span style={{ padding: "6px 0", fontSize: 14, color: "#666" }}>
        {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        style={{
          padding: "6px 12px",
          border: "1px solid #ddd",
          borderRadius: 4,
          background: page >= totalPages ? "#f5f5f5" : "#fff",
          cursor: page >= totalPages ? "default" : "pointer",
          color: page >= totalPages ? "#ccc" : "#333",
        }}
      >
        Next
      </button>
    </div>
  );
}

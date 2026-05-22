import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => setPreview(false)}
          style={{
            padding: "4px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px 0 0 4px",
            background: !preview ? "#333" : "#fff",
            color: !preview ? "#fff" : "#333",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          style={{
            padding: "4px 12px",
            border: "1px solid #ddd",
            borderLeft: "none",
            borderRadius: "0 4px 4px 0",
            background: preview ? "#333" : "#fff",
            color: preview ? "#fff" : "#333",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Preview
        </button>
      </div>
      {preview ? (
        <div
          className="markdown-body"
          style={{
            minHeight: 300,
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: 4,
            lineHeight: 1.8,
            fontSize: 15,
            overflow: "auto",
          }}
          dangerouslySetInnerHTML={{
            __html: value
              .replace(/^### (.+)$/gm, "<h3>$1</h3>")
              .replace(/^## (.+)$/gm, "<h2>$1</h2>")
              .replace(/^# (.+)$/gm, "<h1>$1</h1>")
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.+?)\*/g, "<em>$1</em>")
              .replace(/`(.+?)`/g, "<code>$1</code>")
              .replace(/\n/g, "<br/>"),
          }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            minHeight: 300,
            padding: "12px",
            fontSize: 14,
            fontFamily: "monospace",
            border: "1px solid #ddd",
            borderRadius: 4,
            resize: "vertical",
            lineHeight: 1.6,
          }}
          placeholder="Write your article in Markdown..."
        />
      )}
    </div>
  );
}

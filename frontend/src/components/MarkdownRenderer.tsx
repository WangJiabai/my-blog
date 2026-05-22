interface Props {
  html: string;
}

export default function MarkdownRenderer({ html }: Props) {
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        lineHeight: 1.8,
        fontSize: 16,
        color: "#333",
        wordBreak: "break-word",
      }}
    />
  );
}

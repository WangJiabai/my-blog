import { Link, Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const linkStyle = (path: string) => ({
    display: "block",
    padding: "8px 12px",
    color: pathname === path ? "#fff" : "#ccc",
    background: pathname === path ? "#555" : "transparent",
    textDecoration: "none",
    borderRadius: 4,
  });

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <nav style={{ width: 180, flexShrink: 0 }}>
        <h3 style={{ marginBottom: 12 }}>Admin</h3>
        <Link to="/admin" style={linkStyle("/admin")}>Dashboard</Link>
        <Link to="/admin/articles" style={linkStyle("/admin/articles")}>Articles</Link>
        <Link to="/admin/comments" style={linkStyle("/admin/comments")}>Comments</Link>
        <Link to="/" style={{ ...linkStyle(""), marginTop: 16 }}>← Back to site</Link>
      </nav>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}

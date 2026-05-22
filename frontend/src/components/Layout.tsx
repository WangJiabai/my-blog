import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0",
          borderBottom: "1px solid #eee",
          marginBottom: 24,
        }}
      >
        <Link to="/" style={{ fontSize: 20, fontWeight: 700, textDecoration: "none", color: "#333" }}>
          My Blog
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" style={{ color: "#555", textDecoration: "none" }}>
                  Dashboard
                </Link>
              )}
              <span style={{ color: "#888" }}>{user.display_name}</span>
              <button
                onClick={logout}
                style={{
                  padding: "4px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "#555", textDecoration: "none" }}>
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "4px 12px",
                  background: "#333",
                  color: "#fff",
                  borderRadius: 4,
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

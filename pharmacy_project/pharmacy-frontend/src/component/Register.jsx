import { useState } from "react";

function Register({ setUser, setView }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("pharmacist");
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

    const API_BASE =
        process.env.REACT_APP_API_URL ||
        (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
            ? "https://pharmacy-backend-jhju.onrender.com"
            : "http://127.0.0.1:8000");

    const handleRegister = (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        fetch(`${API_BASE}/api/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, role }),
        })
            .then(async (res) => {
                const raw = await res.text();
                let data = null;
                try {
                    data = raw ? JSON.parse(raw) : null;
                } catch {
                    data = null;
                }
                if (!res.ok) {
                    throw { status: res.status, data, text: raw };
                }
                return data || {};
            })
            .then((data) => {
                setUser({ name: data.username, role: data.role });
            })
            .catch((err) => {
                let msg = "Registration failed";
                if (err && typeof err === "object") {
                    if (err.data && typeof err.data === "object") {
                        const msgs = Object.values(err.data).flat().join(" ");
                        if (msgs) msg = msgs;
                    } else if (err.text) {
                        msg = err.text;
                    }
                    if (err.status) msg = `${msg} (status ${err.status})`;
                }
                setError(msg);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#e8f5e9,#ffffff)" }}>
            <div className="login-container" style={{ width: "360px", backgroundColor: "white", padding: "28px", borderRadius: "10px", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                    <div style={{ width: "56px", height: "56px", margin: "0 auto", backgroundColor: "#4CAF50", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "20px" }}>SAS</div>
                    <h2 style={{ color: "#2e7d32", margin: "12px 0 0" }}>Register</h2>
                </div>

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ display: "block", margin: "12px 0", width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #e0e0e0", outline: "none", boxSizing: "border-box" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ display: "block", margin: "12px 0", width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #e0e0e0" }}
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ display: "block", margin: "12px 0", width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #e0e0e0", backgroundColor: "white" }}
                    >
                        <option value="pharmacist">Pharmacist</option>
                        <option value="admin">Admin</option>
                    </select>

                    

                    {error && <div style={{ color: "#d32f2f", marginBottom: "8px" }}>{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: "100%", backgroundColor: "#4CAF50", color: "white", padding: "12px", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "14px", color: "#888", fontSize: "13px" }}>
                    <p>Already have an account? <button onClick={() => setView('login')} style={{ background: "transparent", border: "none", color: "#2e7d32", cursor: "pointer", fontWeight: 600 }}>Login</button></p>
                </div>
            </div>
        </div>
    );
}

export default Register;

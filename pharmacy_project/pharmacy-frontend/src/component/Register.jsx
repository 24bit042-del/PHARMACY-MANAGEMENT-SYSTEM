import { useState } from "react";

function Register({ setUser, setView }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("pharmacist");
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, role }),
        })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                console.log('register response', res.status, data);
                if (!res.ok) {
                    const registerError = new Error('Registration failed');
                    registerError.status = res.status;
                    registerError.body = data;
                    throw registerError;
                }
                return data;
            })
            .then((data) => {
                setUser({ name: data.username, role: data.role });
            })
            .catch((err) => {
                console.error('register error', err);
                if (err && typeof err === 'object') {
                    const msgs = Object.values(err.body || {}).flat().join(' ');
                    setError(msgs || 'Registration failed');
                } else {
                    setError('Registration failed');
                }
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

import { useState, useEffect } from "react";
import { API_BASE } from "../config";
import Medicine from "./Medicine";
import Sale from "./Sale";
import Supplier from "./Supplier";

function Dashboard({ user, setUser }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [medicines, setMedicines] = useState([]);
    const [sales, setSales] = useState([]);

    useEffect(() => {
        fetchTotals();
        // Refresh totals every 5 seconds
        const interval = setInterval(fetchTotals, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchTotals = () => {
        fetch(`${API_BASE}/api/medicines/`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch medicines");
                return res.json();
            })
            .then(data => {
                console.log("Medicines:", data);
                setMedicines(data);
            })
            .catch(err => console.log("Error fetching medicines:", err));

        fetch(`${API_BASE}/api/sales/`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch sales");
                return res.json();
            })
            .then(data => {
                console.log("Sales:", data);
                setSales(data);
            })
            .catch(err => console.log("Error fetching sales:", err));
    };
    const totalStock = medicines.reduce((total, med) => total + med.quantity, 0);

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f6f9f6" }}>
            <aside style={{ width: sidebarOpen ? 280 : 64, background: "#2e7d32", color: "white", transition: "width 0.25s", boxShadow: "2px 0 8px rgba(0,0,0,0.06)", overflowY: "auto" }}>
                <div style={{ padding: "18px", display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", position: "sticky", top: 0, background: "#2e7d32", zIndex: 10 }}>
                    {sidebarOpen && <div style={{ fontWeight: "700", fontSize: "18px" }}>Pharmacy</div>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}>{sidebarOpen ? "«" : "»"}</button>
                </div>
                <nav style={{ padding: "12px 8px" }}>
                    {sidebarOpen && (
                        <>
                            {user?.role === 'admin' && (
                                <div style={{ padding: "12px", marginBottom: "12px" }}>
                                    <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", opacity: "0.9" }}>Suppliers</h3>
                                    <Supplier user={user} />
                                </div>
                            )}

                            <div style={{ padding: "12px", marginBottom: "12px" }}>
                                <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", opacity: "0.9" }}>Medicines</h3>
                                <Medicine user={user} />
                            </div>

                            <div style={{ padding: "12px" }}>
                                <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", opacity: "0.9" }}>Sales</h3>
                                <Sale user={user} />
                            </div>
                        </>
                    )}
                </nav>
                <div style={{ padding: "12px 8px", marginTop: "12px" }}>
                    <button onClick={handleLogout} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "none", background: "white", color: "#2e7d32", fontWeight: "600", cursor: "pointer" }}>Logout</button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: "24px", transition: "margin 0.25s", marginLeft: 0 }}>
                <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <h1 style={{ color: "#2e7d32", margin: 0 }}>
                        {user?.role === "admin" ? "Admin Dashboard" : "Pharmacy Dashboard"}
                    </h1>
                    <div style={{ color: "#666" }}>Welcome, {user?.name || 'User'} {user?.role ? `(${user.role})` : ''}</div>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px", marginBottom: "24px" }}>
                    <div style={{ background: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 6px 18px rgba(0,0,0,0.04)", border: "2px solid #ff6b6b" }}>
                        <div style={{ color: "#ff6b6b", fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>{medicines.length}</div>
                        <div style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>Total Medicines</div>
                    </div>
                    <div style={{ background: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 6px 18px rgba(0,0,0,0.04)", border: "2px solid #4ecdc4" }}>
                        <div style={{ color: "#4ecdc4", fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>{sales.length}</div>
                        <div style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>Total Sales</div>
                    </div>
                    <div style={{ background: "white", padding: "24px", borderRadius: "10px", boxShadow: "0 6px 18px rgba(0,0,0,0.04)", border: "2px solid #4e9acd" }}>
                        <div style={{ color: "#4e90cd", fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>{totalStock}</div>
                        <div style={{ color: "#666", fontSize: "14px", fontWeight: "500" }}>Total Stock</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;

import { useEffect, useState } from "react";

function Sales({ user }) {
    const [sales, setSales] = useState([]);
    const [medicine_name, setMedicine_name] = useState("");
    const [quantity_sold, setQuantity_sold] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = () => {
        fetch("http://127.0.0.1:8000/api/sales/")
            .then(res => res.json())
            .then(data => setSales(data));
    };



    const addSale = (e) => {
        e.preventDefault();
        setError(null);
        fetch("http://127.0.0.1:8000/api/sales/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                medicine_name: medicine_name,
                quantity_sold: parseInt(quantity_sold),
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw data;
                return data;
            })
            .then(() => {
                fetchSales();
                setMedicine_name("");
                setQuantity_sold("");
            })
            .catch((err) => {
                if (err && typeof err === 'object') {
                    const msgs = Object.values(err).flat().join(' ');
                    setError(msgs || 'Failed to add sale');
                } else {
                    setError('Failed to add sale');
                }
            });
    };

    const deleteSale = (id) => {
        fetch(`http://127.0.0.1:8000/api/sales/${id}/`, { method: 'DELETE' }).then(() => fetchSales());
    };

    const editSale = (id) => {
        const qty = prompt('New quantity sold');
        if (qty === null) return;
        fetch(`http://127.0.0.1:8000/api/sales/${id}/`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity_sold: parseInt(qty) }) }).then(() => fetchSales());
    };

    return (
        <div>
            <h2>Sales</h2>

            <form onSubmit={addSale}>
                <input
                    type="text"
                    placeholder="Medicine Name"
                    value={medicine_name}
                    onChange={(e) => setMedicine_name(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Quantity Sold"
                    value={quantity_sold}
                    onChange={(e) => setQuantity_sold(e.target.value)}
                    required
                />

                <button type="submit">Add Sale</button>
            </form>

            {error && <div style={{ color: '#d32f2f', marginTop: 8 }}>{error}</div>}

            <div>
                {sales.map((sale) => (
                    <div key={sale.id} style={{ padding: "10px", margin: "5px 0", border: "1px solid #ddd", borderRadius: "4px" }}>
                        <strong>{sale.medicine?.name}</strong> - Quantity Sold: {sale.quantity_sold} - Date: {new Date(sale.sale_date).toLocaleDateString()}
                        {user?.role === 'admin' && (
                            <div style={{ marginTop: 6 }}>
                                <button onClick={() => editSale(sale.id)} style={{ marginRight: 8 }}>Edit</button>
                                <button onClick={() => { if (window.confirm('Delete this sale?')) deleteSale(sale.id) }} style={{ background: '#d32f2f', color: 'white' }}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sales;
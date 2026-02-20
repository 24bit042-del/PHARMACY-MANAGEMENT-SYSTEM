import { useEffect, useState } from "react";

function Medicines({ user }) {
    const [medicines, setMedicines] = useState([]);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [supplier_name, setSupplier_name] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    useEffect(() => {
        fetchMedicines();
    }, []);


    const fetchMedicines = () => {
        fetch("http://127.0.0.1:8000/api/medicines/")
            .then(res => res.json())
            .then(data => setMedicines(data));
    };

    const addMedicine = (e) => {
        e.preventDefault();
        setError(null);
        fetch("http://127.0.0.1:8000/api/medicines/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                price,
                supplier_name: supplier_name,
                batch_number: batchNumber,
                category,
                quantity: parseInt(quantity),
                expiry_date: expiryDate,
            }),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw data;
                return data;
            })
            .then(() => {
                fetchMedicines();
                setName("");
                setPrice("");
                setSupplier_name("");
                setBatchNumber("");
                setCategory("");
                setQuantity("");
                setExpiryDate("");
            })
            .catch((err) => {
                // err is likely an object with validation errors
                if (err && typeof err === 'object') {
                    const msgs = Object.values(err).flat().join(' ');
                    setError(msgs || 'Failed to add medicine');
                } else {
                    setError('Failed to add medicine');
                }
            });
    };
    const deleteMedicine = (id) => {
        fetch(`http://127.0.0.1:8000/api/medicines/${id}/`, {
            method: 'DELETE',
        }).then(() => fetchMedicines());
    };

    const editMedicine = (id, updates) => {
        fetch(`http://127.0.0.1:8000/api/medicines/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        }).then(() => fetchMedicines());
    };

    return (
        <div>
            <h2>Medicines</h2>

            {error && <div style={{ color: '#d32f2f', marginBottom: 8 }}>{error}</div>}

            <form onSubmit={addMedicine}>
                <input
                    type="text"
                    placeholder="Medicine Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Supplier Name"
                    value={supplier_name}
                    onChange={(e) => setSupplier_name(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Batch Number"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />

                <input
                    type="date"
                    placeholder="Expiry Date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                />

                <button type="submit">Add Medicine</button>
            </form>

            {medicines.map((med) => (
                <div key={med.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                    <strong>{med.name}</strong> - {med.price}
                    {user?.role === 'admin' && (
                        <div style={{ marginTop: 6 }}>
                            <button onClick={() => { const qty = prompt('New quantity', med.quantity); if (qty !== null) editMedicine(med.id, { quantity: parseInt(qty) }) }} style={{ marginRight: 8 }}>Edit</button>
                            <button onClick={() => { if (window.confirm('Delete this medicine?')) deleteMedicine(med.id) }} style={{ background: '#d32f2f', color: 'white' }}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Medicines;
import { useEffect, useState } from "react";

function Suppliers({ user }) {
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = () => {
        fetch("http://127.0.0.1:8000/api/suppliers/")
            .then(res => res.json())
            .then(data => setSuppliers(data));
    };

    const addSupplier = (e) => {
        e.preventDefault();

        fetch("http://127.0.0.1:8000/api/suppliers/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, phone, address }),
        })
            .then(res => res.json())
            .then(() => {
                fetchSuppliers();
                setName("");
                setPhone("");
                setAddress("");
            })
            .catch(err => console.log("Error adding supplier:", err));
    };

    const deleteSupplier = (id) => {
        fetch(`http://127.0.0.1:8000/api/suppliers/${id}/`, { method: 'DELETE' }).then(() => fetchSuppliers());
    };

    const editSupplier = (id) => {
        const newName = prompt('New name');
        if (!newName) return;
        fetch(`http://127.0.0.1:8000/api/suppliers/${id}/`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName }) }).then(() => fetchSuppliers());
    };

    return (
        <div>
            <h2>Suppliers</h2>

            <form onSubmit={addSupplier}>
                <input
                    type="text"
                    placeholder="Supplier Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <button type="submit">Add Supplier</button>
            </form>

            <div>
                {suppliers.map((supp) => (
                    <div key={supp.id} style={{ padding: "10px", margin: "5px 0", border: "1px solid #ddd", borderRadius: "4px" }}>
                        <strong>{supp.name}</strong> - {supp.phone} - {supp.address}
                        {user?.role === 'admin' && (
                            <div style={{ marginTop: 6 }}>
                                <button onClick={() => editSupplier(supp.id)} style={{ marginRight: 8 }}>Edit</button>
                                <button onClick={() => { if (window.confirm('Delete this supplier?')) deleteSupplier(supp.id) }} style={{ background: '#d32f2f', color: 'white' }}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Suppliers;
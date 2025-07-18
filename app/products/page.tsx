'use client';
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: '', price: '' });
  const [editId, setEditId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();

      // Gunakan data.products
      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveProduct = async () => {
    if (!form.name || !form.price) {
      alert('Nama dan harga harus diisi.');
      return;
    }

    const method = editId ? 'PUT' : 'POST';
    const endpoint = editId ? `/api/products/${editId}` : '/api/products';

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
    };

    try {
      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setForm({ name: '', price: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1 text-gray-800">Product List</h1>
      <p className="text-gray-600 mb-6">Total: {total} produk</p>

      <div className="flex flex-wrap gap-2 items-center bg-white p-4 rounded shadow mb-6">
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button
          onClick={saveProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editId ? 'Update' : 'Add'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Price</th>
              <th className="px-4 py-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p: Product) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border">{p.name}</td>
                  <td className="px-4 py-2 border">{p.price}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => {
                        setForm({ name: p.name, price: p.price.toString() });
                        setEditId(p.id);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  Tidak ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

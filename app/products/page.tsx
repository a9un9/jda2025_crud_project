'use client';
import { useEffect, useState, Suspense } from 'react';
import ProductSkeleton from '@/components/ProductSkeleton';

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
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  const saveProduct = async () => {
    if (!form.name || !form.price) return alert('Nama dan harga harus diisi.');
    const method = editId ? 'PUT' : 'POST';
    const endpoint = editId ? `/api/products/${editId}` : '/api/products';

    try {
      setActionLoading(true);
      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, price: parseFloat(form.price) }),
      });
      setForm({ name: '', price: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    const confirm = window.confirm(`Yakin ingin menghapus produk "${name}"?`);
    if (!confirm) return;

    try {
      setLoadingId(id);
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setLoadingId(null);
    }
  };


  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1 text-gray-800">Daftar Produk</h1>
      <p className="text-gray-600 mb-6">Total: {total} produk</p>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
      </div>

      {/* Form Input */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-4 rounded shadow mb-6">
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Nama Produk"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full sm:w-auto"
          placeholder="Harga"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button
          onClick={saveProduct}
          disabled={actionLoading}
          className={`px-4 py-2 rounded text-white ${
            editId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'
          } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {actionLoading ? 'Menyimpan...' : editId ? 'Ubah' : 'Tambah'}
        </button>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ name: '', price: '' });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            disabled={actionLoading}
          >
            Batal
          </button>
        )}
      </div>

      {/* Skeleton Loading */}
      {loading ? (
        <ProductSkeleton />
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white shadow rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left">Nama</th>
                  <th className="px-4 py-2 border text-left">Harga</th>
                  <th className="px-4 py-2 border text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((p) => (
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
                          disabled={loadingId === p.id}
                        >
                          {loadingId === p.id && editId === p.id ? 'Ubah...' : 'Ubah'}
                        </button>

                        <button
                          onClick={() => deleteProduct(p.id, p.name)}
                          className={`text-red-600 hover:underline ${loadingId === p.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={loadingId === p.id}
                        >
                          {loadingId === p.id ? 'Hapus...' : 'Hapus'}
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

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </>
      )}
    </div>
  );
}

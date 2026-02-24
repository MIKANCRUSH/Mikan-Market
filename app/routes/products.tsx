import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
  });

  /* ========================= */
  /* Load Products Once        */
  /* ========================= */

  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  /* ========================= */
  /* Save Products Safely      */
  /* ========================= */

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products, isLoaded]);

  /* ========================= */
  /* Add Product               */
  /* ========================= */

  const handleAdd = () => {
    if (!form.name.trim() || !form.category.trim() || !form.price) return;

    const newProduct: Product = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
    };

    setProducts((prev) => [...prev, newProduct]);
    setForm({ name: "", category: "", price: "" });
  };

  /* ========================= */
  /* Delete Product            */
  /* ========================= */

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* ========================= */
  /* Export CSV                */
  /* ========================= */

  const handleExportCSV = () => {
    if (products.length === 0) return;

    const headers = ["ID", "Name", "Category", "Price"];

    const rows = products.map((p) =>
      [p.id, p.name, p.category, p.price].join(",")
    );

    const csvContent =
      headers.join(",") + "\n" + rows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="-m-6 md:-m-10 min-h-screen relative overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/previews/020/663/674/non_2x/empty-wood-table-and-blurred-light-table-in-shopping-mall-with-bokeh-background-product-display-template-free-photo.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 space-y-8">

        {/* Header + Export */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Product Management
            </h2>
            <p className="text-slate-300 mt-2">
              Add and manage your retail products.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-white text-black hover:bg-gray-200 transition px-5 py-2 rounded-lg font-medium"
          >
            Export CSV
          </button>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="bg-slate-900/70 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="bg-slate-900/70 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="bg-slate-900/70 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg font-medium"
          >
            Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl overflow-x-auto">

          {products.length === 0 ? (
            <p className="text-slate-300">
              No products added yet.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead className="text-slate-300 border-b border-white/20">
                <tr>
                  <th className="py-3">Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3">{p.name}</td>
                    <td>{p.category}</td>
                    <td>Rp {p.price.toLocaleString()}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

      </div>
    </div>
  );
}
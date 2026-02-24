import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Sale {
  id: number;
  productName: string;
  quantity: number;
  total: number;
}

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState("");

  /* ========================= */
  /* Load Data Once            */
  /* ========================= */

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    const storedSales = localStorage.getItem("sales");

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }

    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }

    setIsLoaded(true);
  }, []);

  /* ========================= */
  /* Save Sales Safely         */
  /* ========================= */

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sales", JSON.stringify(sales));
    }
  }, [sales, isLoaded]);

  /* ========================= */
  /* Add Sale                  */
  /* ========================= */

  const handleAdd = () => {
    const product = products.find((p) => p.name === selected);
    if (!product || !qty) return;

    const newSale: Sale = {
      id: Date.now(),
      productName: product.name,
      quantity: Number(qty),
      total: product.price * Number(qty),
    };

    setSales((prev) => [...prev, newSale]);
    setQty("");
  };

  /* ========================= */
  /* Delete Sale               */
  /* ========================= */

  const handleDelete = (id: number) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  /* ========================= */
  /* Export CSV                */
  /* ========================= */

  const handleExportCSV = () => {
    if (sales.length === 0) return;

    const headers = ["ID", "Product", "Quantity", "Total"];

    const rows = sales.map((s) =>
      [s.id, s.productName, s.quantity, s.total].join(",")
    );

    const csvContent =
      headers.join(",") + "\n" + rows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sales.csv";
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
              Sales Management
            </h2>
            <p className="text-slate-300 mt-2">
              Record and monitor product transactions.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="bg-slate-900/70 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="bg-slate-900/70 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-lg font-medium"
          >
            Add Sale
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl overflow-x-auto">

          {sales.length === 0 ? (
            <p className="text-slate-300">
              No sales recorded yet.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead className="text-slate-300 border-b border-white/20">
                <tr>
                  <th className="py-3">Product</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3">{s.productName}</td>
                    <td>{s.quantity}</td>
                    <td>Rp {s.total.toLocaleString()}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
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
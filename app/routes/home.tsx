import { useEffect, useState } from "react";
import { useLocation } from "react-router";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface Sale {
  id: number;
  productName: string;
  quantity: number;
  total: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const location = useLocation();

  /* ========================= */
  /* Reload Data When Route Changes */
  /* ========================= */

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    const storedSales = localStorage.getItem("sales");

    setProducts(storedProducts ? JSON.parse(storedProducts) : []);
    setSales(storedSales ? JSON.parse(storedSales) : []);
  }, [location]);

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);

  /* ========================= */
  /* Export All Data to CSV    */
  /* ========================= */

  const handleExportAll = () => {
    const productHeaders = ["ProductID", "Name", "Category", "Price"];
    const saleHeaders = ["SaleID", "Product", "Quantity", "Total"];

    const productRows = products.map((p) =>
      [p.id, p.name, p.category, p.price].join(",")
    );

    const saleRows = sales.map((s) =>
      [s.id, s.productName, s.quantity, s.total].join(",")
    );

    const csvContent =
      "=== PRODUCTS ===\n" +
      productHeaders.join(",") +
      "\n" +
      productRows.join("\n") +
      "\n\n=== SALES ===\n" +
      saleHeaders.join(",") +
      "\n" +
      saleRows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mikan-market-data.csv";
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
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Data Collection Dashboard
            </h2>
            <p className="text-slate-300 mt-2">
              Monitor retail performance in real-time.
            </p>
          </div>

          <button
            onClick={handleExportAll}
            className="bg-white text-black hover:bg-gray-200 transition px-5 py-2 rounded-lg font-medium"
          >
            Export All CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <StatCard
            title="Total Products"
            value={products.length}
          />

          <StatCard
            title="Total Sales"
            value={sales.length}
          />

          <StatCard
            title="Revenue"
            value={`Rp ${totalRevenue.toLocaleString()}`}
          />

        </div>

      </div>
    </div>
  );
}

/* ========================= */
/* Statistic Card Component  */
/* ========================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl transition hover:bg-white/15">
      <p className="text-sm text-slate-00">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}
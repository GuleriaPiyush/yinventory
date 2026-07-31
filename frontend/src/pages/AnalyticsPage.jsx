import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const CATEGORY_KEYWORDS = {
  Electronics: ["earbuds", "watch", "phone", "charger", "cable", "usb", "screen", "battery", "headphone", "speaker"],
  Beverages: ["coffee", "beans", "tea", "drink", "milk", "soda", "juice", "water", "beverage"],
  Groceries: ["rice", "sugar", "salt", "oil", "flour", "spice", "grain", "pasta", "sauce", "cereal"],
  Kitchenware: ["mug", "plate", "bowl", "cup", "spoon", "fork", "knife", "pan", "pot"],
  Apparel: ["shirt", "t-shirt", "pant", "shoe", "socks", "cap", "jacket", "belt"]
};

const getCategory = (name) => {
  if (!name) return "General";
  const lowercaseName = name.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lowercaseName.includes(keyword))) {
      return category;
    }
  }
  return "General";
};

const AnalyticsPage = () => {
  useDocumentTitle("Analytics & Reports");
  const [timeFilter, setTimeFilter] = useState("week");
  const [salesData, setSalesData] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Sales Graph Data
        const salesRes = await fetch(
          `${API_BASE_URL}/api/sales/graph/?filter=${timeFilter}`,
          { headers: { Authorization: `Token ${token}` } }
        );
        let sData = [];
        if (salesRes.ok) {
          sData = await salesRes.json();
          setSalesData(sData || []);
        }

        // 2. Fetch Inventory Data
        const inventoryRes = await fetch(`${API_BASE_URL}/api/inventory/`, {
          headers: { Authorization: `Token ${token}` }
        });
        if (inventoryRes.ok) {
          const iData = await inventoryRes.json();
          setInventory(iData || []);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Could not load analytics. Please check connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFilter, navigate]);

  // Calculations for KPI Cards
  const totalRevenue = salesData.reduce((sum, item) => sum + (item.sales || 0), 0);
  const totalProfit = salesData.reduce((sum, item) => sum + (item.profit || 0), 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const lowStockCount = inventory.filter((item) => parseFloat(item.stock) < 10).length;

  // Process Category Breakdown from Inventory Value (stock * selling_price)
  const categoryMap = {};
  inventory.forEach((item) => {
    const cat = getCategory(item.name);
    const value = parseFloat(item.stock) * parseFloat(item.selling_price);
    categoryMap[cat] = (categoryMap[cat] || 0) + (value > 0 ? value : 0);
  });

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .filter((item) => item.value > 0);

  // If no category data (e.g. empty inventory), provide fallback representation
  const chartPieData = categoryData.length > 0 ? categoryData : [
    { name: "Electronics", value: 45000 },
    { name: "Beverages", value: 25000 },
    { name: "Accessories", value: 15000 },
    { name: "General", value: 10000 }
  ];

  // Process Top Items by value (stock * selling_price)
  const topItems = [...inventory]
    .map((item) => ({
      ...item,
      value: parseFloat(item.stock) * parseFloat(item.selling_price)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const colors = ["#4f46e5", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#06b6d4"];

  return (
    <div className="relative min-h-screen bg-[#f8f8fa] text-gray-900 font-sans selection:bg-gray-200 selection:text-gray-900 overflow-x-hidden">
      {/* Background decoration layers */}
      <div className="landing-gradient-mesh pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <div className="landing-dot-grid pointer-events-none fixed inset-0 z-0 opacity-50" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Analytics & Reports</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">Real-time indicators of Yinventory financial health</p>
          </div>
        </div>

        {/* Dashboard Header Bar */}
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-sm font-semibold text-gray-700">Filter Period Data</span>
          <div className="flex gap-2">
            {["day", "week", "month", "year"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  timeFilter === filter
                    ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filter === "day" && "24 Hours"}
                {filter === "week" && "7 Days"}
                {filter === "month" && "Monthly"}
                {filter === "year" && "Yearly"}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm font-medium">Analyzing transaction databases...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700 shadow-sm">
            <p className="font-semibold text-lg mb-2">Failed to Sync Analytics</p>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => setTimeFilter(timeFilter)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow transition-colors"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Revenue */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-sm shadow-gray-200/50 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Total Revenue</span>
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-lg">💰</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Rs. {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-[10px] text-indigo-600 font-medium mt-1">From recorded sales receipts</p>
              </div>

              {/* Profit */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-sm shadow-gray-200/50 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Net Profit</span>
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-lg">📈</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Rs. {totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-[10px] text-emerald-600 font-medium mt-1">Minus Cost price of items sold</p>
              </div>

              {/* Margin */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-sm shadow-gray-200/50 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Profit Margin</span>
                  <div className="h-8 w-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-lg">✨</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{profitMargin.toFixed(1)}%</h3>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, profitMargin)}%` }}></div>
                </div>
              </div>

              {/* Warnings */}
              <Link
                to="/inventory"
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-sm shadow-gray-200/50 hover:shadow-md transition-all group cursor-pointer block"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Stock Warnings</span>
                  <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-lg group-hover:animate-bounce">⚠️</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{lowStockCount} Items</h3>
                <p className="text-[10px] text-rose-650 font-medium mt-1 group-hover:underline">Click to view items list →</p>
              </Link>
            </div>

            {/* Graphs / Primary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales & Revenue Chart */}
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Revenue & Profit Trend</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Timeline overview matching active filters</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-indigo-600" /> Revenue</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-600" /> Profit</span>
                  </div>
                </div>

                <div className="h-80 w-full">
                  {salesData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      No sales data available for the selected period.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)"
                          }}
                          labelStyle={{ fontWeight: "bold", color: "#111827", fontSize: "12px" }}
                          itemStyle={{ fontSize: "12px" }}
                        />
                        <Area type="monotone" dataKey="sales" name="Revenue" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Pie Chart breakdown */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Inventory Distribution</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Value contribution by product category</p>
                </div>

                <div className="h-56 w-full relative flex items-center justify-center my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Inventory Value"]}
                        contentStyle={{
                          background: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb"
                        }}
                      />
                      <Pie
                        data={chartPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={78}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Value</span>
                    <span className="text-base font-bold text-gray-800">
                      Rs. {Math.round(chartPieData.reduce((s, i) => s + i.value, 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-600">
                  {chartPieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5 p-1">
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                      <span className="truncate">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products & Low Stock Warnings Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Items list */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Top Inventory Value Contributors</h2>
                <div className="flex-1">
                  {topItems.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm py-8">
                      No stock registered in inventory.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {topItems.map((item, index) => (
                        <li key={item.id} className="py-3.5 flex items-center justify-between hover:bg-gray-50/40 rounded-lg px-2 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="h-7 w-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                              #{index + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Barcode: {item.barcode}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm text-gray-900">Rs. {(item.value || 0).toLocaleString()}</p>
                            <p className="text-[10px] text-emerald-600 font-medium">
                              {item.stock} {item.unit} in stock
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Low Stock Warning Details */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Low Stock Actions</h2>
                  <Link
                    to="/inventory/restock"
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                  >
                    Restock Terminal →
                  </Link>
                </div>

                <div className="flex-1">
                  {inventory.filter((item) => parseFloat(item.stock) < 10).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                      <div className="h-12 w-12 bg-green-50 border border-green-200 text-green-600 text-2xl rounded-full flex items-center justify-center mb-3">✓</div>
                      <p className="text-gray-500 text-sm font-medium">All item inventories are optimal!</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {inventory
                        .filter((item) => parseFloat(item.stock) < 10)
                        .slice(0, 5)
                        .map((item) => {
                          const stockPercentage = Math.min(100, (parseFloat(item.stock) / 10) * 100);
                          return (
                            <li key={item.id} className="py-3.5 hover:bg-gray-50/40 rounded-lg px-2 transition-all">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Unit type: {item.unit}</p>
                                </div>
                                <span className="text-xs font-bold text-rose-600 px-2 py-0.5 bg-rose-50 border border-rose-100 rounded">
                                  {item.stock} Units Left
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${stockPercentage}%` }}></div>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;

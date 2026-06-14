import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';
import useDocumentTitle from '../hooks/useDocumentTitle';


const HomePage = () => {
  useDocumentTitle("Dashboard");
  const [lowStockItems, setLowStockItems] = useState([]);
  const [timeFilter, setTimeFilter] = useState("week");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // 1. Fetch Inventory for Low Stock Warning
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/inventory/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Flag items as low stock if they have less than 10 units left
          const lowStock = data.filter((item) => parseFloat(item.stock) < 10);
          setLowStockItems(lowStock);
        }
      } catch (err) {
        console.error("Failed to fetch inventory", err);
      }
    };

    // 2. Fetch Sales Graph Data
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/api/sales/graph/?filter=${timeFilter}`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSalesData(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch sales graph data:", err);
      }
    };

    fetchInventory();
    fetchSalesData();
  }, [timeFilter]);

  // Calculate total sales for the currently selected period
  const totalPeriodSales = salesData.reduce(
    (sum, item) => sum + (item.sales || 0),
    0,
  );

  // Calculate total profit for the currently selected period
  const totalPeriodProfit = salesData.reduce(
    (sum, item) => sum + (item.profit || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <img src="/logo.png" alt="Yinventory Logo" className="h-10 w-auto object-contain" /> */}
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700  p-1">Hello {localStorage.getItem('username') || "Empty!"}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2  hover:bg-red-600 text-black font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <span></span> Logout
            </button>
          </div>
        </div>

        {/* Quick Action Redirect Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            to="/sales"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl shadow-sm transition-colors text-center font-semibold flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">🛒</span>
            New Sale
          </Link>
          <Link
            to="/inventory"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-xl shadow-sm transition-colors text-center font-semibold flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">📦</span>
            View Inventory
          </Link>
          <Link
            to="/inventory/restock"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-sm transition-colors text-center font-semibold flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">🔄</span>
            Restock Items
          </Link>
          <Link
            to="/inventory/add-new"
            className="bg-amber-500 hover:bg-amber-600 text-white p-6 rounded-xl shadow-sm transition-colors text-center font-semibold flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">➕</span>
            Add Product
          </Link>
          <Link
            to="/analytics"
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl shadow-sm transition-colors text-center font-semibold flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">📊</span>
            Analytics & Reports
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Graphs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sales Graph */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Sales Overview
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Total Sales:{" "}
                    <span className="font-bold text-indigo-600">
                      Rs. {totalPeriodSales.toFixed(2)}
                    </span>
                  </p>
                </div>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                >
                  <option value="day">Hourly (Last 24h)</option>
                  <option value="week">Daily (Last 7d)</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <div className="h-72 w-full flex items-end justify-between pt-10 pb-4 border-b border-gray-200 gap-2 relative">
                {/* Simple CSS Bar Chart */}
                {salesData.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No sales recorded for this period.
                  </div>
                ) : (
                  salesData.map((data, index) => {
                    // Find max to calculate heights
                    const maxSales = Math.max(
                      ...salesData.map((d) => d.sales),
                      1,
                    );
                    const heightPercentage = `${(data.sales / maxSales) * 100}%`;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-end flex-1 h-full group"
                      >
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 bg-gray-800 text-white text-xs py-1 px-2 rounded -translate-y-4 pointer-events-none">
                          Rs.{data.sales}
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full max-w-[40px] bg-indigo-600 rounded-t-md transition-all duration-500 ease-out hover:bg-indigo-500"
                          style={{ height: heightPercentage }}
                        ></div>
                        {/* Label */}
                        <span className="text-xs text-gray-500 mt-2">
                          {data.name}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Profit Graph */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Profit Overview
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Total Profit:{" "}
                    <span className="font-bold text-emerald-600">
                      Rs. {totalPeriodProfit.toFixed(2)}
                    </span>
                  </p>
                </div>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                >
                  <option value="day">Hourly (Last 24h)</option>
                  <option value="week">Daily (Last 7d)</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <div className="h-72 w-full flex items-end justify-between pt-10 pb-4 border-b border-gray-200 gap-2 relative">
                {/* Simple CSS Bar Chart */}
                {salesData.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No sales recorded for this period.
                  </div>
                ) : (
                  salesData.map((data, index) => {
                    // Find max to calculate heights
                    const maxProfit = Math.max(
                      ...salesData.map((d) => d.profit),
                      1,
                    );
                    const heightPercentage = `${Math.max(0, (data.profit / maxProfit) * 100)}%`;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-end flex-1 h-full group"
                      >
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 bg-gray-800 text-white text-xs py-1 px-2 rounded -translate-y-4 pointer-events-none">
                          Rs.{data.profit.toFixed(2)}
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full max-w-[40px] bg-emerald-600 rounded-t-md transition-all duration-500 ease-out hover:bg-emerald-500"
                          style={{ height: heightPercentage }}
                        ></div>
                        {/* Label */}
                        <span className="text-xs text-gray-500 mt-2">
                          {data.name}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Low Stock Alerts
              </h2>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                {lowStockItems.length} Items
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {lowStockItems.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-10">
                  Inventory looks good! No low stock items.
                </p>
              ) : (
                <ul className="space-y-3">
                  {lowStockItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center p-3 border border-red-100 bg-red-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Barcode: {item.barcode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600 text-sm">
                          {item.stock} {item.unit}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
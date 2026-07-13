import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';
import useDocumentTitle from '../hooks/useDocumentTitle';

const HomePage = () => {
  useDocumentTitle("Dashboard");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [timeFilter, setTimeFilter] = useState("week");
  const [salesData, setSalesData] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Inventory for Low Stock Warning and metrics
        const invRes = await fetch(`${API_BASE_URL}/api/inventory/`, {
          headers: { Authorization: `Token ${token}` },
        });
        let invData = [];
        if (invRes.ok) {
          invData = await invRes.json();
          setInventoryItems(invData);
          const lowStock = invData.filter((item) => parseFloat(item.stock) < 10);
          setLowStockItems(lowStock);
        }

        // 2. Fetch Recent Sales
        const salesListRes = await fetch(`${API_BASE_URL}/api/sales/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (salesListRes.ok) {
          const salesList = await salesListRes.json();
          setRecentSales(salesList.slice(0, 5)); // Keep last 5 sales
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch sales graph data based on timeFilter
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchSalesData = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/sales/graph/?filter=${timeFilter}`,
          { headers: { Authorization: `Token ${token}` } }
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

    fetchSalesData();
  }, [timeFilter]);

  // Calculate totals
  const totalPeriodSales = salesData.reduce((sum, item) => sum + (item.sales || 0), 0);
  const totalPeriodProfit = salesData.reduce((sum, item) => sum + (item.profit || 0), 0);

  // Total inventory value: sum of stock * selling_price
  const totalInventoryValue = inventoryItems.reduce((sum, item) => {
    const stock = parseFloat(item.stock) || 0;
    const price = parseFloat(item.selling_price) || 0;
    return sum + (stock * price);
  }, 0);

  const username = localStorage.getItem('username') || "User";

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-[1400px] mx-auto pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {username}!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here is a quick overview of your business analytics and transactions.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Filter:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-sm font-bold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
          >
            <option value="day">Hourly (24 Hours)</option>
            <option value="week">Daily (7 Days)</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Period Revenue</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl text-lg">💰</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900">Rs. {totalPeriodSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-slate-500 mt-1">Based on filter: <span className="font-bold capitalize">{timeFilter}</span></p>
          </div>
        </div>

        {/* Total Profit Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Period Profit</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl text-lg">📈</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-emerald-600">Rs. {totalPeriodProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-slate-500 mt-1">Based on filter: <span className="font-bold capitalize">{timeFilter}</span></p>
          </div>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</span>
            <span className={`p-2 rounded-xl text-lg ${lowStockItems.length > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>⚠️</span>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-extrabold ${lowStockItems.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>{lowStockItems.length} Items</h3>
            <p className="text-xs text-slate-500 mt-1">Under 10 units in stock</p>
          </div>
        </div>

        {/* Total Products Value Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Inventory Value</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl text-lg">📦</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900">Rs. {totalInventoryValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-slate-500 mt-1">Total {inventoryItems.length} unique products</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (2 cols): Sales & Profit overview graphs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Revenue Overview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Total Revenue in filter: Rs. {totalPeriodSales.toFixed(2)}</p>
              </div>
            </div>
            <div className="h-72 w-full flex items-end justify-between pt-10 pb-4 border-b border-slate-100 gap-2 relative">
              {salesData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  No sales recorded for this period.
                </div>
              ) : (
                salesData.map((data, index) => {
                  const maxSales = Math.max(...salesData.map((d) => d.sales), 1);
                  const heightPercentage = `${(data.sales / maxSales) * 100}%`;
                  return (
                    <div key={index} className="flex flex-col items-center justify-end flex-1 h-full group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none shadow z-10 whitespace-nowrap">
                        Rs.{data.sales.toFixed(1)}
                      </div>
                      <div
                        className="w-full max-w-[32px] bg-indigo-600 rounded-t-lg transition-all duration-300 hover:bg-indigo-500 cursor-pointer shadow-sm hover:shadow"
                        style={{ height: heightPercentage }}
                      ></div>
                      <span className="text-[10px] font-bold text-slate-400 mt-2 rotate-45 sm:rotate-0 sm:mt-2">
                        {data.name}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Profit Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Profit Margin Overview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Total Profit in filter: Rs. {totalPeriodProfit.toFixed(2)}</p>
              </div>
            </div>
            <div className="h-72 w-full flex items-end justify-between pt-10 pb-4 border-b border-slate-100 gap-2 relative">
              {salesData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  No sales recorded for this period.
                </div>
              ) : (
                salesData.map((data, index) => {
                  const maxProfit = Math.max(...salesData.map((d) => d.profit), 1);
                  const heightPercentage = `${Math.max(0, (data.profit / maxProfit) * 100)}%`;
                  return (
                    <div key={index} className="flex flex-col items-center justify-end flex-1 h-full group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none shadow z-10 whitespace-nowrap">
                        Rs.{data.profit.toFixed(1)}
                      </div>
                      <div
                        className="w-full max-w-[32px] bg-emerald-600 rounded-t-lg transition-all duration-300 hover:bg-emerald-500 cursor-pointer shadow-sm hover:shadow"
                        style={{ height: heightPercentage }}
                      ></div>
                      <span className="text-[10px] font-bold text-slate-400 mt-2 rotate-45 sm:rotate-0 sm:mt-2">
                        {data.name}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Recent Sales & Low Stock List */}
        <div className="space-y-8">
          
          {/* Recent Sales List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Recent Sales</h2>
              <Link to="/sales" className="text-xs font-bold text-indigo-600 hover:underline">POS +</Link>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {recentSales.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  No sales recorded yet.
                </div>
              ) : (
                recentSales.map((sale) => {
                  const dateObj = new Date(sale.created_at);
                  const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  
                  return (
                    <div key={sale.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-xl hover:bg-slate-100/60 transition-colors border border-slate-100">
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-950 truncate">
                          ID: {sale.transaction_id}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {sale.customer_name || "Walk-in Customer"}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">
                          {formattedDate} at {formattedTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xs text-indigo-600">
                          Rs. {parseFloat(sale.total_amount || sale.amount).toFixed(2)}
                        </span>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                          {sale.items?.length || 0} item(s)
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Low Stock Warning List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Low Stock Warnings</h2>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${lowStockItems.length > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                {lowStockItems.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {lowStockItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Inventory levels are looking healthy!
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 border border-red-100 bg-red-50/50 rounded-xl"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-xs">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-bold">
                        Barcode: {item.barcode}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-red-600">
                        {item.stock} {item.unit}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
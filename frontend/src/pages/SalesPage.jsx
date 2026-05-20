import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';
import useDocumentTitle from '../hooks/useDocumentTitle';

const SalesPage = () => {
  useDocumentTitle("New Sale");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const searchInputRef = useRef(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }


  // Handle typing in the search box (live search)
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/api/inventory/search/?q=${value}`,
        { headers: { 'Authorization': `Token ${token}` } }
      );
      const data = await res.json();

      // Auto-add if the typed value exactly matches a barcode
      const exactMatch = data.find((p) => p.barcode === value);
      if (exactMatch) {
        addToBill(exactMatch);
        return;
      }

      setSearchResults(data);
    } catch (err) {
      console.error("Live search failed:", err);
    }
  };

  // Handle searching for products (triggered by Enter key or button)
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/api/inventory/search/?q=${searchQuery}`,
        { headers: { 'Authorization': `Token ${token}` } }
      );
      const data = await res.json();

      if (data.length === 1) {
        // Exact match found (usually means it was a Barcode scan) - Add directly!
        addToBill(data[0]);
      } else if (data.length > 1) {
        // Multiple matches found (e.g. searching by a common name)
        setSearchResults(data);
      } else {
        setMessage({ type: "error", text: "Product not found!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Search failed. Make sure backend is running.",
      });
    }
  };

  // Add product to the bill
  const addToBill = (product) => {
    setBillItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        // If already in list, just increase quantity
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Add new to list
        return [...prevItems, { product, quantity: 1 }];
      }
    });
    // Reset search
    setSearchQuery("");
    setSearchResults([]);
    setMessage({ type: "", text: "" });

    // Automatically focus back on the search bar
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  // Update item quantity
  const updateQuantity = (productId, change) => {
    setBillItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      }),
    );
  };

  // Remove item from bill
  const removeItem = (productId) => {
    setBillItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  // Calculate Total
  const totalAmount = billItems.reduce((total, item) => {
    return total + item.product.selling_price * item.quantity;
  }, 0);

  // Submit the Bill to Backend
  const handleCreateBill = async () => {
    if (billItems.length === 0) {
      setMessage({ type: "error", text: "No items in the bill!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      items: billItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/sales/create/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Success! Transaction ID: ${data.transaction_id}`,
        });
        // Clear everything after successful sale
        setBillItems([]);
        setCustomerName("");
        setCustomerPhone("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create bill",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Search & Results */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Search Products
          </h2>

          <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-6">
            <input
              type="text"
              ref={searchInputRef}
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Scan Barcode or Search Name..."
              className="flex-1 rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
            >
              Search
            </button>
          </form>

          {/* Search Results List */}
          {searchResults.length > 0 && (
            <div className="mt-4 border border-gray-100 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Barcode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => addToBill(p)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {p.barcode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ${p.selling_price}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {p.stock} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-indigo-600 group-hover:text-indigo-900 font-medium text-sm transition-colors">
                          Add to Bill +
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Current Bill */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-3">

              <button 
                onClick={handleLogout}
                className="px-4 py-2  hover:bg-red-600 text-black font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <span></span> Logout
              </button>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Bill</h2>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-md text-sm font-medium ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
          )}

          <div className="flex-1 overflow-y-auto mb-4">
            {billItems.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">
                No items added yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {billItems.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex justify-between items-center border-b border-gray-100 pb-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${item.product.selling_price} x {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✖
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Customer Details & Checkout */}
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <input
              type="text"
              placeholder="Customer Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Customer Phone (Optional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-between items-center py-2">
              <span className="text-lg font-bold text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                Rs. {totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCreateBill}
              disabled={loading || billItems.length === 0}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Processing..." : "Create Bill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;

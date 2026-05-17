import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RestockPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state holding all fields from the Django model
  const [formData, setFormData] = useState({
    name: "",
    cost_price: "",
    selling_price: "",
    stock: "",
    unit: "kg", // Default choice from model
    barcode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      // Assuming your backend routes are prefixed with /api/ in the main urls.py
      const response = await fetch(
        "http://127.0.0.1:8000/api/inventory/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Extract validation errors if any
        throw new Error(
          errorData.message || `Network error: ${response.status}`,
        );
      }

      setSuccessMessage("Product successfully added to inventory!");
      // Reset form
      setFormData({
        name: "",
        cost_price: "",
        selling_price: "",
        stock: "",
        unit: "kg",
        barcode: "",
      });

      //aafa
      // Optional: Redirect back to inventory list after a delay
      // setTimeout(() => navigate('/inventory'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">
              Restock Items
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter the details below to restock items in your inventory.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {/* Note: This assumes you use react-router-dom for navigation */}
            <button
              onClick={() => navigate("/inventory")}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Back to Inventory
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 sm:p-8">
          {successMessage && (
            <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
              Error adding product: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="barcode"
                className="block text-sm font-medium text-gray-700"
              >
                Barcode
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="barcode"
                  id="barcode"
                  required
                  value={formData.barcode}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  placeholder="Scan or enter barcode"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  placeholder="e.g. Organic Apples"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cost_price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cost Price ($)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    step="0.01"
                    name="cost_price"
                    id="cost_price"
                    required
                    value={formData.cost_price}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="selling_price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Selling Price ($)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    step="0.01"
                    name="selling_price"
                    id="selling_price"
                    required
                    value={formData.selling_price}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Initial Stock
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    step="0.01"
                    name="stock"
                    id="stock"
                    required
                    value={formData.stock}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Unit Type
                </label>
                <div className="mt-1">
                  <select
                    name="unit"
                    id="unit"
                    required
                    value={formData.unit}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="grams">Grams</option>
                    <option value="pieces">Pieces</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Restocking..." : "Restock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RestockPage;

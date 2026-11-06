import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from '../hooks/useDocumentTitle';
import BarcodeScannerInline from "../components/BarcodeScannerInline";
import api from '../api';


function RestockPage() {
  useDocumentTitle("Restock");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Barcode input (for lookup)
  const [barcode, setBarcode] = useState("");

  // Fetched product (null until barcode is looked up)
  const [fetchedProduct, setFetchedProduct] = useState(null);

  // Editable form state (pre-filled after lookup)
  const [formData, setFormData] = useState({
    name: "",
    cost_price: "",
    selling_price: "",
    add_stock: "",
    unit: "kg",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Look up product by barcode
  const handleLookup = async (barcodeValue) => {
    const lookupBarcode = barcodeValue || barcode;
    if (!lookupBarcode.trim()) return;

    setLookupLoading(true);
    setError(null);
    setFetchedProduct(null);
    setSuccessMessage("");

    try {
      const res = await api.get(`/api/inventory/search/?q=${encodeURIComponent(lookupBarcode)}`);
      const match = res.data.find((p) => p.barcode === lookupBarcode);

      if (match) {
        setFetchedProduct(match);
        setFormData({
          name: match.name,
          cost_price: match.cost_price,
          selling_price: match.selling_price,
          add_stock: "",
          unit: match.unit,
        });
      } else {
        setError("No product found with this barcode. Use 'Add New Product' to create one.");
      }
    } catch (err) {
      setError("Lookup failed. Please check your connection.");
    } finally {
      setLookupLoading(false);
    }
  };

  // Handle barcode scanned from camera
  const handleBarcodeScanned = (scannedBarcode) => {
    setBarcode(scannedBarcode);
    setIsScannerOpen(false);
    handleLookup(scannedBarcode);
  };

  // Submit update/restock
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fetchedProduct) return;

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const payload = {
        name: formData.name,
        cost_price: formData.cost_price,
        selling_price: formData.selling_price,
        unit: formData.unit,
        add_stock: formData.add_stock || 0,
      };

      await api.patch(`/api/inventory/${fetchedProduct.id}/update/`, payload);

      const addedStock = parseFloat(formData.add_stock) || 0;
      setSuccessMessage(
        addedStock > 0
          ? `Product updated and ${addedStock} ${formData.unit} added to stock!`
          : "Product details updated successfully!"
      );

      // Reset form
      setBarcode("");
      setFetchedProduct(null);
      setFormData({ name: "", cost_price: "", selling_price: "", add_stock: "", unit: "kg" });

    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.error || errorData?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Restock / Edit Product</h1>
            <p className="mt-2 text-sm text-gray-600">
              Scan or enter a barcode to load a product — then update its details or add new stock.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => navigate("/inventory")}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Back to Inventory
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 sm:p-8 space-y-6">

          {/* Success / Error messages */}
          {successMessage && (
            <div className="p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Step 1: Barcode Lookup */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barcode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Scan or type barcode and press Enter..."
              />
              {/* Camera scanner toggle */}
              <button
                type="button"
                onClick={() => setIsScannerOpen((prev) => !prev)}
                title={isScannerOpen ? "Close Scanner" : "Scan Barcode"}
                className={`px-3 py-2 rounded-md border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                  isScannerOpen
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </button>
              {/* Look up button */}
              <button
                type="button"
                onClick={() => handleLookup()}
                disabled={lookupLoading || !barcode.trim()}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shrink-0"
              >
                {lookupLoading ? "Looking up..." : "Look Up"}
              </button>
            </div>

            {/* Camera Scanner */}
            <div className="mt-3">
              <BarcodeScannerInline
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleBarcodeScanned}
              />
            </div>
          </div>

          {/* Step 2: Product form — only shown after a successful lookup */}
          {fetchedProduct && (
            <form onSubmit={handleSubmit} className="space-y-6 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                  Product Found
                </span>
                <span className="text-xs text-gray-500">
                  Current stock: <strong>{fetchedProduct.stock} {fetchedProduct.unit}</strong>
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost_price"
                    required
                    value={formData.cost_price}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="selling_price"
                    required
                    value={formData.selling_price}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Add Stock + Unit */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Stock <span className="text-gray-400 font-normal">(leave blank to only edit details)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="add_stock"
                    min="0"
                    value={formData.add_stock}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="grams">Grams</option>
                    <option value="pieces">Pieces</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestockPage;

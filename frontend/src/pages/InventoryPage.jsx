import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';


function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the Django backend
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/inventory/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setInventory(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Product Inventory</h1>
            <p className="mt-2 text-sm text-gray-600">
              A complete list of all products currently in stock, including pricing and barcodes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading inventory...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">Error: {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {inventory.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.barcode}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.stock > 10 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.unit}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${parseFloat(product.cost_price).toFixed(2)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${parseFloat(product.selling_price).toFixed(2)}</td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-sm text-gray-500">
                        No products found in inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;





import InventoryPage from './pages/InventoryPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RestockPage from './pages/RestockPage';
import AddInventoryPage from './pages/AddInventoryPage';
import SalesPage from './pages/SalesPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/restock" element={<RestockPage />} />
        <Route path="/inventory/add-new" element={<AddInventoryPage />} />
        <Route path='/sales' element={<SalesPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RestockPage from './pages/RestockPage';
import AddInventoryPage from './pages/AddInventoryPage';
import SalesPage from './pages/SalesPage';
import LoginPage from './pages/LoginPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/restock" element={<RestockPage />} />
        <Route path="/inventory/add-new" element={<AddInventoryPage />} />
        <Route path='/sales' element={<SalesPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path='login' element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

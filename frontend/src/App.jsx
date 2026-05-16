import InventoryPage from './pages/InventoryPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddInventoryPage from './pages/AddInventoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/add" element={<AddInventoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import RestockPage from './pages/RestockPage';
import AddInventoryPage from './pages/AddInventoryPage';
import SalesPage from './pages/SalesPage';
import LoginPage from './pages/LoginPage.jsx';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
        <Route path="/inventory/restock" element={<PrivateRoute><RestockPage /></PrivateRoute>} />
        <Route path="/inventory/add-new" element={<PrivateRoute><AddInventoryPage /></PrivateRoute>} />
        <Route path='/sales' element={<PrivateRoute><SalesPage /></PrivateRoute>} />

        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />


        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

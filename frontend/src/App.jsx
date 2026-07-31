import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RestockPage from './pages/RestockPage';
import AddInventoryPage from './pages/AddInventoryPage';
import SalesPage from './pages/SalesPage';
import LoginPage from './pages/LoginPage.jsx';
import LandingPage from './pages/landingpage';
import AnalyticsPage from './pages/AnalyticsPage';
import SidebarLayout from './components/SidebarLayout';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />

        {/* Protected Layout Routes */}
        <Route element={<PrivateRoute><SidebarLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/restock" element={<RestockPage />} />
          <Route path="/inventory/add-new" element={<AddInventoryPage />} />
          <Route path='/sales' element={<SalesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

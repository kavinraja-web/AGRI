import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import ProductDetails from './pages/ProductDetails';
import FarmerProfile from './pages/FarmerProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import AddProduce from './pages/AddProduce';
import SmartSearch from './pages/SmartSearch';
import BucketList from './pages/BucketList';
import TrendAnalysis from './pages/TrendAnalysis';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-earth-100 font-sans text-gray-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/smart-search" element={<SmartSearch />} />
              <Route path="/bucket-list" element={<BucketList />} />
              <Route path="/trends" element={<TrendAnalysis />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/farmer/:id" element={<FarmerProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/add-produce" element={<AddProduce />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

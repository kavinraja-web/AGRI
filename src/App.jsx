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
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-earth-100 font-sans text-gray-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/explore" element={<Explore />} />
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
  );
}

export default App;

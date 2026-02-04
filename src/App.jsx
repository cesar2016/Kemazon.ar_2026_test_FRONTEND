import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyAccount from './pages/VerifyAccount'; // New Import
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';
import EditProduct from './pages/EditProduct';
import MyProducts from './pages/MyProducts';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import AdminPanel from './pages/AdminPanel'; // New Import
import ProtectedAdminRoute from './components/ProtectedAdminRoute'; // New Import
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:idSlug" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify/:token" element={<VerifyAccount />} /> {/* New Route */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/profile" element={<EditProfile />} />

            {/* Admin Routes */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts and Routes
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import AdminOrderListScreen from './screens/AdminOrderListScreen';
import Footer from './components/Footer'; 
import ProductsScreen from './screens/ProductsScreen'; 

// Screens
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ServiceScreen from './screens/ServiceScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import LoginScreen from './screens/LoginScreen'; 
import LoginSuccessScreen from './screens/LoginSuccessScreen';
import MyPetsScreen from './screens/MyPetsScreen';
import AdoptionScreen from './screens/AdoptionScreen';
import AdoptionDetailScreen from './screens/AdoptionDetailScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';

// Admin Screens
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminUserListScreen from './screens/AdminUserListScreen';
import AdminProductListScreen from './screens/AdminProductListScreen';
import AdminProductEditScreen from './screens/AdminProductEditScreen';
import AdminPetListScreen from './screens/AdminPetListScreen';
import AdminPetEditScreen from './screens/AdminPetEditScreen';
import ProductScreen from './screens/ProductScreen';
import AdminAdoptionRequests from './screens/AdminAdoptionRequests'; 
import MyAdoptionRequestsScreen from './screens/MyAdoptionRequestsScreen';
import CartScreen from './screens/CartScreen';
import AdminOrderDetailsScreen from './screens/AdminOrderDetailsScreen';
import AdminServiceListScreen from './screens/AdminServiceListScreen';
import AdminServiceEditScreen from './screens/AdminServiceEditScreen';



import './App.css';

const UserLayout = () => (
  <div className="app-layout flex flex-col min-h-screen"> 
    <Navbar />
    <main className="main-content flex-grow"> 
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/*Public/User Routes*/}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/products" element={<ProductsScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          
          {/* Adoption Routes */}
          <Route path="/adoption" element={<AdoptionScreen />} />
          <Route path="/my-adoption-requests" element={<MyAdoptionRequestsScreen />} />
          <Route path="/adoption/:id" element={<AdoptionDetailScreen />} />
          
          

          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/services" element={<ServiceScreen />} />
          <Route path="/services/:id" element={<ServiceDetailScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/login-success" element={<LoginSuccessScreen />} />
          <Route path="/mypets" element={<MyPetsScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
        </Route>

        {/*Admin Routes*/}
        <Route path="/admin/login" element={<AdminLoginScreen />} />
        <Route path="/admin/servicelist" element={<AdminServiceListScreen />} />
<Route path="/admin/service/:id/edit" element={<AdminServiceEditScreen />} />
        
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="dashboard" element={<AdminDashboardScreen />} />
          <Route path="userlist" element={<AdminUserListScreen />} />
          <Route path="productlist" element={<AdminProductListScreen />} />
          <Route path="product/:id/edit" element={<AdminProductEditScreen />} />

          
          {/* Pet Management */}
          <Route path="petlist" element={<AdminPetListScreen />} />
          <Route path="pet/create" element={<AdminPetEditScreen />} />
          <Route path="pet/:id/edit" element={<AdminPetEditScreen />} />

          {/* Adoption Requests */}
          <Route path="adoption-requests" element={<AdminAdoptionRequests />} />
          <Route path="orderlist" element={<AdminOrderListScreen />} />
          <Route path="order/:id" element={<AdminOrderDetailsScreen />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
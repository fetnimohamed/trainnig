import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Course from './pages/Course';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLessons from './pages/admin/AdminLessons';
import AdminPacks from './pages/admin/AdminPacks';
import AdminPromos from './pages/admin/AdminPromos';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="packs" element={<AdminPacks />} />
            <Route path="promos" element={<AdminPromos />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

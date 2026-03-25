import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './pages/public/HomePage'
import AlbumsPage from './pages/public/AlbumsPage'
import AlbumDetailPage from './pages/public/AlbumDetailPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import Navbar from './Components/layout/Navbar'
import Footer from './Components/layout/Footer'
import AdminRoute from './Components/layout/AdminRoute'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicLayout><HomePage /></PublicLayout>
        } />
        <Route path="/albums" element={
          <PublicLayout><AlbumsPage /></PublicLayout>
        } />
        <Route path="/albums/:slug" element={
          <PublicLayout><AlbumDetailPage /></PublicLayout>
        } />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute><AdminDashboardPage /></AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
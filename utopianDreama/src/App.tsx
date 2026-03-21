import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import HomePage from './pages/public/HomePage'
import AlbumDetailPage from './pages/public/AlbumDetailPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import Navbar from './Components/layout/Navbar'
import Footer from './Components/layout/Footer'
import AdminRoute from './Components/layout/AdminRoute'

function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX + 'px'
        ringRef.current.style.top = e.clientY + 'px'
      }
    }
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, .hoverable')) {
        ringRef.current?.classList.add('hovered')
      } else {
        ringRef.current?.classList.remove('hovered')
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}

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
      <CursorEffect />
      <Routes>
        <Route path="/" element={
          <PublicLayout><HomePage /></PublicLayout>
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
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminRoute({
  children
}: {
  children: React.ReactNode
}) {
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session)
      setChecked(true)
    })
  }, [])

  if (!checked) return (
    <div style={{ color: 'white', padding: '40px' }}>
      Checking auth...
    </div>
  )
  if (!authed) return <Navigate to="/admin" replace />
  return <>{children}</>
}
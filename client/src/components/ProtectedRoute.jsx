import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe } from '../store/slices/authSlice'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchMe())
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user && user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}

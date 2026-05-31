import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../store/slices/authSlice'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          SubsManager
        </Link>

        <div className={styles.links}>
          {isAuthenticated && (
            <>
              <Link to="/plans" className={`${styles.link} ${isActive('/plans') ? styles.active : ''}`}>Plans</Link>
              <Link to="/dashboard" className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}>Dashboard</Link>
              {user?.role === 'admin' && (
                <Link to="/admin/subscriptions" className={`${styles.link} ${isActive('/admin/subscriptions') ? styles.active : ''}`}>
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
                <span className={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</span>
                <span className={styles.userName}>{user?.name}</span>
                {user?.role === 'admin' && <span className="badge badge-admin">Admin</span>}
                <span className={styles.chevron}>▾</span>
              </button>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownInfo}>
                    <span className={styles.dropdownName}>{user?.name}</span>
                    <span className={styles.dropdownEmail}>{user?.email}</span>
                  </div>
                  <hr className={styles.dropdownDivider} />
                  <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/plans" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>Browse Plans</Link>
                  <hr className={styles.dropdownDivider} />
                  <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: '14px' }}>Sign in</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '14px' }}>Get started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

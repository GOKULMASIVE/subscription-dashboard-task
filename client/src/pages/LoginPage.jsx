import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { loginUser, clearError } from "../store/slices/authSlice";
import styles from "./AuthPage.module.css";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
    return () => dispatch(clearError());
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});
      await dispatch(loginUser(form)).unwrap();
    } catch (err) {
      if (err.inner) {
        const map = {};
        err.inner.forEach((e) => (map[e.path] = e.message));
        setErrors(map);
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoMark}>◈</div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your SubsManager account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠ {error.message || "Something went wrong"}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className="form-error">⚠ {errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.pwWrap}>
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.pwToggle}
                onClick={() => setShowPw((s) => !s)}
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && (
              <span className="form-error">⚠ {errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className={styles.switchLink}>
          Don't have an account? <Link to="/register">Create one →</Link>
        </p>

        <div className={styles.demoHint}>
          <span>Demo admin:</span>
          <code>admin@demo.com</code>
          <span>/</span>
          <code>Admin@123</code>
        </div>
      </div>
    </div>
  );
}

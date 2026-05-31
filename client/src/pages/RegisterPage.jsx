import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { registerUser, clearError } from "../store/slices/authSlice";
import styles from "./AuthPage.module.css";

const schema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  // useEffect(() => {
  //   if (isAuthenticated) navigate('/dashboard')
  //   return () => dispatch(clearError())
  // }, [isAuthenticated])

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
      const { confirmPassword, ...payload } = form;
      await dispatch(registerUser(payload)).unwrap();
      navigate("/login");
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
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>
            Join SubsManager today — it's free to start
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            ⚠ {error.message || "Something went wrong"}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Jane Smith"
              autoComplete="name"
            />
            {errors.name && <span className="form-error">⚠ {errors.name}</span>}
          </div>

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
                placeholder="Min 6 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
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

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input
              type={showPw ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? "error" : ""}`}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="form-error">⚠ {errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" /> Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

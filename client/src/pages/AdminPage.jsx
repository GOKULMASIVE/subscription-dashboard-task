import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSubscriptions } from "../store/slices/subscriptionSlice";
import styles from "./AdminPage.module.css";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminPage() {
  const dispatch = useDispatch();
  const { allSubscriptions, loading, pagination } = useSelector(
    (s) => s.subscription,
  );
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchAllSubscriptions({ page, limit: 10, ...(status && { status }) }),
    );
  }, [page, status]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const stats = {
    total: pagination?.total || 0,
    active: allSubscriptions.filter((s) => s.status === "active").length,
    expired: allSubscriptions.filter((s) => s.status === "expired").length,
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage all subscriptions across users</p>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            {
              label: "Total",
              value: pagination?.total ?? "—",
              color: "var(--text-primary)",
            },
            { label: "Active", value: stats.active, color: "var(--green)" },
            { label: "Expired", value: stats.expired, color: "var(--red)" },
            {
              label: "Pages",
              value: pagination?.pages ?? "—",
              color: "var(--accent-light)",
            },
          ].map((s) => (
            <div key={s.label} className={`${styles.statCard} animate-in`}>
              <span className={styles.statValue} style={{ color: s.color }}>
                {s.value}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={styles.toolbar}>
          <select
            className={`form-input ${styles.select}`}
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className={styles.resultCount}>
            {pagination
              ? `${pagination.total} subscription${
                  pagination.total !== 1 ? "s" : ""
                }`
              : ""}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className={styles.loading}>
            <span
              className="spinner"
              style={{ width: 32, height: 32, borderWidth: 3 }}
            />
          </div>
        ) : allSubscriptions.length === 0 ? (
          <div className={styles.empty}>No subscriptions found.</div>
        ) : (
          <div className="table-wrap animate-in">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allSubscriptions.map((sub, i) => (
                  <tr key={sub._id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>
                      <strong>{sub.user_id?.name || "N/A"}</strong>
                    </td>
                    <td>{sub.user_id?.email || "N/A"}</td>
                    <td>
                      <strong>{sub.plan_id?.name || "N/A"}</strong>
                    </td>
                    <td>
                      {sub.plan_id?.price === 0
                        ? "Free"
                        : sub.plan_id?.price
                        ? `₹${sub.plan_id.price}`
                        : "—"}
                    </td>
                    <td>{formatDate(sub.start_date)}</td>
                    <td>{formatDate(sub.end_date)}</td>
                    <td>
                      <span className={`badge badge-${sub.status}`}>
                        {sub.status === "active"
                          ? "●"
                          : sub.status === "expired"
                          ? "○"
                          : "✕"}{" "}
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className={styles.pagination}>
            <button
              className="btn btn-ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {pagination.pages}
            </span>
            <button
              className="btn btn-ghost"
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

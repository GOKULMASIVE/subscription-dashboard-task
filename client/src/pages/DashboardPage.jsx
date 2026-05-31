import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubscription } from "../store/slices/subscriptionSlice";
import styles from "./DashboardPage.module.css";

function daysLeft(endDate) {
  const diff = new Date(endDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function progressPercent(start, end) {
  const total = new Date(end) - new Date(start);
  const elapsed = Date.now() - new Date(start);
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { mySubscription, loading } = useSelector((s) => s.subscription);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchMySubscription());
  }, []);

  const plan = mySubscription?.plan_id;

  return (
    <div className="page">
      <div className="container">
        <div className={`page-header ${styles.header}`}>
          <div>
            <h1 className="page-title">
              Good to see you, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="page-subtitle">
              Here's an overview of your subscription
            </p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <span
              className="spinner"
              style={{ width: 32, height: 32, borderWidth: 3 }}
            />
          </div>
        ) : mySubscription &&
          (mySubscription.status === "completed" ||
            mySubscription?.plan_id?.price === 0) ? (
          <div className={styles.grid}>
            {/* Active plan card */}
            <div className={`${styles.mainCard} animate-in`}>
              <div className={styles.planTop}>
                <div>
                  <p className={styles.planLabel}>Active plan</p>
                  <h2 className={styles.planName}>{plan?.name}</h2>
                </div>
                <span className="badge badge-active">● Active</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>
                  {plan?.price === 0 ? "Free" : `₹${plan?.price}/mo`}
                </span>
              </div>

              {/* Progress bar */}
              <div className={styles.progressSection}>
                <div className={styles.progressLabels}>
                  <span>Time elapsed</span>
                  <span>
                    {progressPercent(
                      mySubscription.start_date,
                      mySubscription.end_date,
                    )}
                    %
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${progressPercent(
                        mySubscription.start_date,
                        mySubscription.end_date,
                      )}%`,
                    }}
                  />
                </div>
                <div className={styles.progressDates}>
                  <span>{formatDate(mySubscription.start_date)}</span>
                  <span>{formatDate(mySubscription.end_date)}</span>
                </div>
              </div>

              <div className={styles.daysLeft}>
                <span className={styles.daysCount}>
                  {daysLeft(mySubscription.end_date)}
                </span>
                <span className={styles.daysLabel}>days remaining</span>
              </div>
            </div>

            {/* Features card */}
            <div
              className={`${styles.featuresCard} animate-in`}
              style={{ animationDelay: "80ms" }}
            >
              <h3 className={styles.featuresTitle}>Plan features</h3>
              <ul className={styles.featureList}>
                {plan?.features?.map((f, i) => (
                  <li key={i} className={styles.featureItem}>
                    <span className={styles.featureCheck}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/plans"
                className={`btn btn-ghost ${styles.upgradeBtn}`}
              >
                View all plans →
              </Link>
            </div>

            {/* Stats row */}
            <div
              className={`${styles.statCard} animate-in`}
              style={{ animationDelay: "120ms" }}
            >
              <p className={styles.statLabel}>Renewal date</p>
              <p className={styles.statValue}>
                {formatDate(mySubscription.end_date)}
              </p>
            </div>
            <div
              className={`${styles.statCard} animate-in`}
              style={{ animationDelay: "160ms" }}
            >
              <p className={styles.statLabel}>Plan duration</p>
              <p className={styles.statValue}>{plan?.duration} days</p>
            </div>
            <div
              className={`${styles.statCard} animate-in`}
              style={{ animationDelay: "200ms" }}
            >
              <p className={styles.statLabel}>Started on</p>
              <p className={styles.statValue}>
                {formatDate(mySubscription.start_date)}
              </p>
            </div>
          </div>
        ) : (
          <div className={`${styles.empty} animate-in`}>
            <div className={styles.emptyIcon}>◎</div>
            <h2 className={styles.emptyTitle}>No active subscription</h2>
            <p className={styles.emptyText}>
              {mySubscription?.status === "expired"
                ? "Your subscription has expired. Renew to keep access."
                : "You haven't subscribed to any plan yet."}
            </p>
            <Link to="/plans" className="btn btn-primary">
              Browse plans →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

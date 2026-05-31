import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPlans,
  subscribeToPlan,
  clearSubscriptionMessages,
} from "../store/slices/subscriptionSlice";
import styles from "./PlansPage.module.css";

const CHECK = "✓";
const CURRENCY = "₹";

export default function PlansPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    plans,
    loading,
    subscribeLoading,
    successMessage,
    error,
    mySubscription,
  } = useSelector((s) => s.subscription);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [currentId, setCurrentId] = useState(null);
  useEffect(() => {
    dispatch(fetchPlans());
    return () => dispatch(clearSubscriptionMessages());
  }, []);

  const handleSubscribe = async (planId) => {
    setCurrentId(planId);
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const resp = await dispatch(subscribeToPlan(planId)).unwrap();
    // console.log(resp, "---");
    if (resp.short_url) {
      window.open(resp?.short_url, "_blank");
    }
    // navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <span
          className="spinner"
          style={{ width: 36, height: 36, borderWidth: 3 }}
        />
        <p>Loading plans…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className={`page-header ${styles.header}`}>
          <h1 className="page-title">Choose your plan</h1>
          <p className="page-subtitle">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: 32 }}>
            🎉 {successMessage}
          </div>
        )}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 32 }}>
            ⚠ {error.message || "Something went wrong"}
          </div>
        )}

        <div className={styles.grid}>
          {plans.map((plan, i) => {
            const activePlan =
              (mySubscription?.plan_id?.price === 0 &&
                mySubscription?.plan_id?._id === plan?._id) ||
              (mySubscription?.status === "completed" &&
                mySubscription?.razor_plan_id === plan?.plan_id);
            const isPopular = plan.badge === "Most Popular";
            return (
              <div
                key={plan._id}
                className={`${styles.planCard} ${
                  isPopular ? styles.featured : ""
                } animate-in`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {plan.badge && <div className={styles.badge}>{plan.badge}</div>}
                <div className={styles.planHeader}>
                  <h2 className={styles.planName}>{plan.name}</h2>
                  <div className={styles.planPrice}>
                    <span className={styles.currency}>
                      {plan.price > 0 ? CURRENCY : ""}
                    </span>
                    <span className={styles.amount}>
                      {plan.price > 0 ? plan.price : "Free"}
                    </span>
                    {plan.price > 0 && <span className={styles.per}>/mo</span>}
                  </div>
                  <p className={styles.planDuration}>
                    {plan.duration} day{plan.duration !== 1 ? "s" : ""} access
                  </p>
                </div>

                <ul className={styles.features}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} className={styles.feature}>
                      <span className={styles.checkIcon}>{CHECK}</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn ${
                    activePlan
                      ? "btn-ghost"
                      : isPopular
                      ? "btn-primary"
                      : "btn-ghost"
                  } ${styles.planBtn}`}
                  onClick={() => !activePlan && handleSubscribe(plan._id)}
                  disabled={activePlan || subscribeLoading}
                >
                  {subscribeLoading && plan?._id === currentId ? (
                    <>
                      <span className="spinner" /> Processing…
                    </>
                  ) : activePlan ? (
                    "✓ Current plan"
                  ) : plan.price === 0 ? (
                    "Get started free"
                  ) : (
                    `Subscribe — ${CURRENCY}${plan.price}/mo`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

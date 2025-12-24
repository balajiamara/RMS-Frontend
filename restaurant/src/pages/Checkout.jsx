// src/pages/Checkout.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "https://rms-i0wj.onrender.com" 
  // "http://127.0.0.1:8000";

function StripeForm({ orderId, onSuccess, markPaidLocally }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!stripe || !elements) {
      setMsg("Payment system not ready.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setMsg("Card element missing.");
      return;
    }

    setProcessing(true);

    try {
      // 1) ask server for clientSecret + intent status
      const resp = await fetch(`${API_BASE}/create-payment-intent/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });

      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      console.log("create-payment-intent ->", resp.status, data);

      if (!resp.ok) {
        if (resp.status === 401 || resp.status === 403) {
          setMsg("You are not authenticated. Please log in and try again.");
        } else {
          setMsg(data.error || data.msg || `Failed to create payment intent (${resp.status})`);
        }
        setProcessing(false);
        return;
      }

      const clientSecret = data.clientSecret;
      const intentStatus = data.status;
      console.log("intent status:", intentStatus);

      // If the PaymentIntent already succeeded, skip confirm (it's already paid)
      if (intentStatus === "succeeded") {
        setMsg("Payment already completed.");
        markPaidLocally();    // tell parent to show success UI
        onSuccess && onSuccess(orderId); // optional callback
        setProcessing(false);
        return;
      }

      // 2) confirm card payment on the client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      console.log("stripe.confirmCardPayment result:", result);

      if (result.error) {
        setMsg(result.error.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setMsg("Payment succeeded!");
        markPaidLocally();
        onSuccess && onSuccess(orderId);
      } else {
        setMsg("Payment processing. Check your orders page shortly.");
      }
    } catch (err) {
      console.error("StripeForm error:", err);
      setMsg(err.message || "Unexpected error");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ maxWidth: 400, marginBottom: 12 }}>
        <CardElement />
      </div>
      <button disabled={processing}>
        {processing ? "Processing…" : "Pay Now"}
      </button>
      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </form>
  );
}

export default function Checkout() {
  const location = useLocation();
  const nav = useNavigate();
  const state = location.state || {};

  const initialOrderId = state.order_id || null;
  const initialTotal = state.total_price || null;

  const [publishableKey, setPublishableKey] = useState(null);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState("");
  const [paymentDone, setPaymentDone] = useState(false); // inline success flag

  // Fetch Stripe key once
  useEffect(() => {
    fetch(`${API_BASE}/config/stripe-publishable-key/`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setPublishableKey(d.publishableKey))
      .catch(() => setError("Failed to load payment gateway"));
  }, []);

  const stripePromise = useMemo(() => {
    return publishableKey ? loadStripe(publishableKey) : null;
  }, [publishableKey]);

  async function placeOrder() {
    try {
      const resp = await fetch(`${API_BASE}/place_order/`, {
        method: "POST",
        credentials: "include",
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || data.msg || `Status ${resp.status}`);

      setOrderId(data.order_id);
      setTotal(data.total_price);
    } catch (e) {
      setError(e.message || "Failed to create order");
    }
  }

  // Called by StripeForm to mark local UI as paid (no redirect)
  function markPaidLocally() {
    setPaymentDone(true);
    // Optional: you can also clear local cart UI, e.g. call an API to clear cart or refresh cart page
  }

  // no automatic navigation — show inline success
  function onSuccessInline(id) {
    // You may still want to fetch fresh order details here
    console.log("Paid order:", id);
    setPaymentDone(true);
  }

  // UI for success state
  function SuccessPanel() {
    return (
      <div style={{ border: "1px solid #e6e6e6", padding: 16, borderRadius: 8, background: "#f7fff7" }}>
        <h3 style={{ marginTop: 0 }}>Payment successful 🎉</h3>
        <p>Order ID: <strong>{orderId}</strong></p>
        {total && <p>Total paid: <strong>₹{Number(total).toFixed(2)}</strong></p>}
        <div style={{ marginTop: 12 }}>
          <button onClick={() => nav("/menu")} style={{ marginRight: 8 }}>Back to Menu</button>
          <button onClick={() => nav("/orders")} >View Orders</button>
        </div>
        <p style={{ marginTop: 12, color: "#555" }}>
          If you want to see order details, click <em>View Orders</em> (you may need to log in).
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>Checkout</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* If payment already done, show success panel */}
      {paymentDone ? (
        <SuccessPanel />
      ) : (
        <>
          {!orderId ? (
            <>
              <p>No order created yet.</p>
              <button onClick={placeOrder}>Place Order & Pay</button>
            </>
          ) : (
            <>
              <p>
                Order: <b>{orderId}</b> • Total: ₹{total ?? "—"}
              </p>

              {!stripePromise ? (
                <p>Loading Stripe…</p>
              ) : (
                <Elements stripe={stripePromise}>
                  <StripeForm orderId={orderId} onSuccess={onSuccessInline} markPaidLocally={markPaidLocally} />
                </Elements>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

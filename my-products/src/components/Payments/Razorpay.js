import React from "react";

const RazorpayButton = ({ amount }) => {
  const handlePayment = async () => {
    // Create order on backend
    const res = await fetch("/create_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }), // amount in paise
    });
    const data = await res.json();

    const options = {
      key: "your_key_id", // Replace with your Razorpay key_id
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      name: "Your Company Name",
      description: "Test Transaction",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // You can verify payment on the backend here
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handlePayment}>
      Pay with Razorpay
    </button>
  );
};

export default RazorpayButton;